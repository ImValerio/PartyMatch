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

    const chatId = [myUser.id, user.id].sort().join("-")

    useEffect(()=>{
        socket.emit("joinChat",chatId);
    },[])

    const sendMessage = ()=>{
        const msg = {
            text: message.trim(), 
            user: myUser.displayName, 
            timestamp: new Date().getTime()
        }
        
        socket.emit("messageTo",{chatId, partyId, msg});
    }
        return (
        <div>
            <h1>Chat with {user.displayName}</h1>
            <input type="text" placeholder='Message...' value={message} onChange={(e)=> setMessage(e.target.value)}/>
            <button onClick={sendMessage}>SEND</button>
            <button onClick={()=>setIsChatting(false)}>BACK</button>
        </div>
    )
}

export default Chat