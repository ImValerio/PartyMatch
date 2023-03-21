import { useEffect } from 'react';
import { useRouter } from 'next/router';
import {socket} from "../../socket"

const Index = () => {
    const router = useRouter()

    useEffect(()=>{
        const connectToSocketServer = ()=>{
            socket.connect();
            socket.emit("join-party",router.query.partyId)
        } 
        connectToSocketServer();
    },[])

    return (
        <div>{router.query.partyId}</div>
    )
}

export default Index; 