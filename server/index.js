const express = require("express");
const cors = require("cors")
const http = require('http');
const { Server } = require("socket.io");
const helmet = require("helmet");
const morgan = require("morgan");

const {connectToDb, redisClient} = require("./db/connection")
const {joinParty, removeSocketFromUser, getSocketIds} = require("./controller/socketController");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {cors: process.env.SOCKET_SERVER || "http://localhost:3000"});

connectToDb();

app.use(morgan("tiny"));
app.use(helmet());
app.use(express.json());


const userIdSocket = new Map()

io.on('connection', (socket) => {
  socket.on("disconnect", async ()=>{
    if(userIdSocket.has(socket.id)){
      const {userId, partyId} = userIdSocket.get(socket.id) ;
      if(userId && partyId)
        await removeSocketFromUser(partyId,userId, socket.id);

      userIdSocket.delete(socket.id);
  
    }
 })
  console.log(`[info] ${socket.id} connected`);
  
  socket.on("join-party", async ({partyId, userId})=> {
    if(partyId){
      socket.join(partyId)
      const users = await joinParty(partyId, socket, userId);
      userIdSocket.set(socket.id,{userId: users[users.length -1].id, partyId});
      io.to(socket.id).emit("initUser", users[users.length -1]);
      io.to(partyId).emit("updateUsers", users);

    }
 })
 socket.on("hiTo", async ({partyId, userId, user})=>{
  const socketIds = await getSocketIds(partyId,userId);
  for (const socketId of socketIds) {
    io.to(socketId).emit("recivedHi", user);
  }
 })

 socket.on("joinChat", async (chatId)=> {

  await createChat(chatId);
  
 })
socket.on("messageTo", async ({chatId, partyId, msg})=> {

  const messages = await updateChat(chatId, msg);

  const userIdList = chatId.split("-");

  for (const userId of userIdList){
    await emitUpdatedMessages(userId, partyId, messages);
  }
  
 })
});

const emitUpdatedMessages = async (userId, partyId, messages) => {
  const sockedIds = await getSocketIds(userId, partyId);

  for(const socketId of sockedIds){
    io.to(socketId).emit("updateChat", messages)
  }
}


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`[express] listening on port ${PORT}`));


const SOCKET_PORT = process.env.SOCKET_PORT || 5050;
server.listen(SOCKET_PORT, () => {
  console.log(`[websocket] listening on port ${SOCKET_PORT}`);
});