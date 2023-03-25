import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {socket} from "../../socket"
import User from "../../interfaces/User";
import Table from '@/components/Table';
import Chat from '@/components/Chat';

const Index = () => {
    const router = useRouter()
    const {partyId} = router.query
    const [users, setUsers] = useState([]);
    const [myUser, setMyUser] = useState();
    const [message, setMessage] = useState("");
    const [isChatting, setIsChatting] = useState<User>();


    const sayHi = (socketId:string)=>{
        console.log(myUser)
        socket.emit("hiTo",{socketId, user:myUser});
    }

    const recivedHi = (user:User)=>{
        console.log(user)
        if(user){
            alert(`${user.displayName}: Hello!`)
        }

    }

    const sendMessage = (socketId:string)=>{
        socket.emit("messageTo",{socketId,message})
    }

    const openChat = (user:User)=>{
        setIsChatting(user);
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

        return ()=>{
            socket.disconnect();
        }
   },[])

   if(!myUser){
    return <h1>Loading...</h1>
   }

   if(isChatting){
    return <Chat user={isChatting} myUser={myUser}/>
   }

    return (
        <div>
            <h1>{partyId} - {myUser.displayName}</h1>
            <ul>
                {users && users.map((user:User,i:number)=>{
                 if(user.id !== myUser.id)
                    return <Table user={user} sayHi={sayHi} openChat={openChat} />
                })}
            </ul>

            <div>
                <input type="text" placeholder='Message...' value={message} onChange={(e)=> setMessage(e.target.value)}/>
                <select>
                    {users.map(user => <option value={user.socketId}>{user.displayName}</option>)}
                </select>
                <button onClick={sendMessage}>SEND</button>
            </div>
        </div>
    )
}

export default Index; 