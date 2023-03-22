import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {socket} from "../../socket"

const Index = () => {
    const router = useRouter()
    const {partyId} = router.query
    const [users, setUsers] = useState(null)

    useEffect(()=>{
        if(partyId){
            socket.connect();
            socket.emit("join-party",partyId)
            socket.on("updateUsers", (users) => {console.log(users);setUsers(users);});
        }
   },[partyId])

    return (
        <div>
            <h1>{partyId}</h1>

            <ul>
                {users && users.map((user:object,i)=> <li>Tavolo{i+1} [{user.score}]</li>)}
            </ul>
        </div>
    )
}

export default Index; 