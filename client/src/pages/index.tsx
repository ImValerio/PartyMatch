import { useEffect } from "react"
import { socket } from '../socket';

export default function Home() {
  useEffect(()=>{
    socket.connect();

    socket.emit("join-party","test")
  },[])
  return (
    <>
     <h1>PartyMatch</h1> 
    </>
  )
}
