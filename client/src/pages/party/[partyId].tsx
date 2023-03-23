import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {socket} from "../../socket"
import User from "../../interfaces/User";
import Table from '@/components/Table';
const Index = () => {
    const router = useRouter()
    const {partyId} = router.query
    const [users, setUsers] = useState([]);
    const [myUser, setMyUser] = useState();


    const sayHi = (socketId:string)=>{
        socket.emit("hiTo",socketId);
    }

    const recivedHi = (socketId:string)=>{
        console.log(`SocketId mittente: ${socketId}`)
        const user:User = users.find((user:User)=> user.socketId === socketId)
        console.log("User found",user,users)
        if(user){
            alert(`${user.displayName}: Hello!`)
        }

    }
    
    useEffect(()=>{

        socket.on("recivedHi",recivedHi)

        return()=>{
            socket.off('recivedHi',recivedHi)
        }
    },[users])

    useEffect(()=>{
        if(partyId)
            socket.emit("join-party",partyId);
    },[partyId])
    useEffect(()=>{
        socket.connect();
        socket.on("initUser", (user) => setMyUser(user));
        socket.on("updateUsers", (newUsers) => setUsers(newUsers));

 
   },[])

   if(!myUser){
    return <h1>Loading...</h1>
   }

    return (
        <div>
            <h1>{partyId} - {myUser.displayName}</h1>
            <ul>
                {users && users.map((user:User,i:number)=>{
                 if(user.id !== myUser.id)
                    return <Table user={user} sayHi={sayHi} />
                })}
            </ul>
        </div>
    )
}

export default Index; 