import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {socket} from "../../socket"

const Index = () => {
    const router = useRouter()
    const [users, setUsers] = useState([])

    useEffect(()=>{
        const connectToSocketServer = ()=>{
            socket.connect();
            socket.emit("join-party",router.query.partyId)
        }
        const socketOn = ()=>{
            socket.on("updateUsers", (users) => setUsers(users));
        }  
        socketOn();
        connectToSocketServer();
    },[])

    return (
        <div>
            <h1>{router.query.partyId}</h1>

            <ul>
                {users.map((user:Map<string,any>,i)=> <li>Tavolo{i+1} [{user.get("score")}]</li>)}
            </ul>
        </div>
    )
}

export default Index; 