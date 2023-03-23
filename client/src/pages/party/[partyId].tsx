import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {socket} from "../../socket"
import User from "../../interfaces/User";
const Index = () => {
    const router = useRouter()
    const {partyId} = router.query
    const [users, setUsers] = useState([]);
    const [myUser, setMyUser] = useState();

    useEffect(()=>{
        if(partyId){
            socket.connect();
            socket.emit("join-party",partyId);
            socket.on("initUser", (user) => setMyUser(user));
            socket.on("updateUsers", (users) => {console.log(users);setUsers(users);});
        }
   },[partyId])

   if(!myUser){
    return <h1>Loading...</h1>
   }

    return (
        <div>
            <h1>{partyId} - {myUser.displayName}</h1>
            <ul>
                {users && users.map((user:User,i:number)=>{
                 if(user.id !== myUser.id)
                    return <li>{user.displayName}[{user.score} - {user.id}]</li>
                })}
            </ul>
        </div>
    )
}

export default Index; 