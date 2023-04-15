import {useState, useEffect} from 'react';
import {socket} from "../socket";
import User from '@/interfaces/User';

interface Props{
    user: User,
    myUser: User,
    partyId: string,
    setIsChatting: (state:boolean) => void,
}

const Chat = (props:Props) => {
    const {myUser, user, partyId, setIsChatting} = props
    const [message,setMessage] = useState("")
    const [chatMessages, setChatMessages] = useState([]);

    const chatId = [myUser.id, user.id].sort().join("-")

    useEffect(()=>{
            socket.on("updateChat",(messages)=> setChatMessages(messages))

            return()=>{
                socket.off('recivedHi',()=>{})
            }
    },[chatMessages])
        useEffect(()=>{
        socket.emit("joinChat",chatId);

    },[])

    const sendMessage = ()=>{
        const msg = {
            text: message.trim(), 
            user: myUser.displayName, 
            timestamp: new Date().getTime()
        }
        
        socket.emit("messageTo",{chatId, msg});
        setMessage("")
    }
        return (
        <div className='container'>
            <h1 className='title-chat'>Chat with {user.displayName}</h1>
            <div className='chat'>
                {chatMessages.map((chatMessage:any) => {

                    return(
                        <div className={chatMessage.user == myUser.displayName? 'messageContainer myMessage' : 'messageContainer'}>
                            <div className={chatMessage.user == myUser.displayName? 'message bg-green': 'message'}>
                                <h3 className='userMessage'>{chatMessage.user}</h3>
                                <h2 className='textMessage'>{chatMessage.text}</h2>   
                            </div>
                       </div>
                        )
                })}
            </div>
            <div className='chatControllers'>
                <input type="text" placeholder='Message...' value={message} onChange={(e)=> setMessage(e.target.value)}/>
                <button onClick={sendMessage}>SEND</button>
                <button onClick={()=>setIsChatting(false)}>BACK</button>
            </div>
       </div>
    )
}

export default Chat