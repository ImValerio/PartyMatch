import {useState, useEffect} from 'react';
import {socket} from "../socket";

const Chat = ({myUser,user}) => {
    const [message,setMessage] = useState("")

    useEffect(()=>{
        socket.emit("joinChat",user);
    },[])
    return (
        <div>
            <h1>Chat with {user.displayName}</h1>
            <input type="text" placeholder='Message...' value={message} onChange={(e)=> setMessage(e.target.value)}/>
        </div>
    )
}

export default Chat