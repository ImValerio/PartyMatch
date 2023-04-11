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
    }
        return (
        <div>
            <h1>Chat with {user.displayName}</h1>
            <div className='chat'>
                {chatMessages.map((chatMessage:any) => {

                    return(<h1>{chatMessage.text} - {chatMessage.user}</h1>)
                })}
            </div>
            <input type="text" placeholder='Message...' value={message} onChange={(e)=> setMessage(e.target.value)}/>
            <button onClick={sendMessage}>SEND</button>
            <button onClick={()=>setIsChatting(false)}>BACK</button>
        </div>
    )
}

export default Chat