import User from "../interfaces/User";
import {socket} from "../socket";

interface Props{
    user: User,
    sayHi:(socketId:string)=> void,
    setIsChatting: (user:User)=> void,
}

const Table = (props:Props) => {
  const {user, sayHi, setIsChatting} = props;


  return (
    <div className='user-table'>
      {user.displayName}
      <button onClick={()=> sayHi(user.socketId)} title={user.socketId}>Say hi!</button>
      <button onClick={()=> setIsChatting(user)}>CHAT</button>
    </div>
  )
}

export default Table