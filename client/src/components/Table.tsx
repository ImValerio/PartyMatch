import User from "../interfaces/User";
import {socket} from "../socket";

interface Props{
    user: User,
    sayHi:void,
    openChat: void,
}

const Table = (props:Props) => {
  const {user, sayHi, openChat} = props;


  return (
    <div className='user-table'>
      {user.displayName}
      <button onClick={()=> sayHi(user.socketId)} title={user.socketId}>Say hi!</button>
      <button onClick={()=> openChat(user)}>CHAT</button>
    </div>
  )
}

export default Table