import {useState, useEffect} from 'react';
import {socket} from "../socket";
import User from '@/interfaces/User';

interface Props{
    user: User,
    sendMessage:(user:User)=>void,
    setIsChatting: (state:boolean) => void,
}

const Chat = (props:Props) => {
    const {user, sendMessage, setIsChatting} = props
    const [message,setMessage] = useState("")

    useEffect(()=>{
        socket.emit("joinChat",user);
    },[])
    return (
        <div>
            <h1>Chat with {user.displayName}</h1>
            <input type="text" placeholder='Message...' value={message} onChange={(e)=> setMessage(e.target.value)}/>
            <button onClick={()=>sendMessage(user)}>SEND</button>
            <button onClick={()=>setIsChatting(false)}>BACK</button>
        </div>
    )
}

export default Chat