import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {socket} from "../../../socket"
import User from "../../../interfaces/User";
import Table from '@/components/Table';
import Chat from '@/components/Chat';

const Index = () => {
    const router = useRouter()
    const {partyId,userId} = router.query
    const [users, setUsers] = useState([]);
    const [myUser, setMyUser] = useState<User>();
    const [isChatting, setIsChatting] = useState<User>();


    const sayHi = (userId:string)=>{
        console.log(myUser)
        socket.emit("hiTo",{partyId, userId, user:myUser});
    }

    const recivedHi = (user:User)=>{
        console.log(user)
        if(user){
            alert(`${user.displayName}: Hello!`)
        }

    }

    const sendMessage = (socketId:string,message:string)=>{
        socket.emit("messageTo",{socketId,message})
    }
    
    useEffect(()=>{
        socket.on("recivedHi",recivedHi)

        return()=>{
            socket.off('recivedHi',recivedHi)
        }
    },[users])

    useEffect(()=>{
        if(partyId)
            socket.emit("join-party",{partyId, userId});
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
    return <Chat user={isChatting}  sendMessage={sendMessage} setIsChatting={setIsChatting}/>
   }

    return (
        <div>
            <h1>{partyId} - {myUser.displayName}</h1>
            <ul>
                {users && users.map((user:User,i:number)=>{
                 if(user.id !== myUser.id)
                    return <Table user={user} sayHi={sayHi} setIsChatting={setIsChatting}/>
                })}
            </ul>

        </div>
    )
}

export default Index; 