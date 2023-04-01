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

io.on('connection', (socket) => {
  socket.on("disconnect", async (userId)=>{
    await removeSocketFromUser(userId, socket.id);
    console.log(`[info] ${socket.id} disconnected`)
  })
  console.log(`[info] ${socket.id} connected`);
  
  socket.on("join-party", async ({partyId, userId})=> {
    if(partyId){
      socket.join(partyId)
      const users = await joinParty(partyId, socket, userId);

      io.to(socket.id).emit("initUser", users[users.length -1]);
      io.to(partyId).emit("updateUsers", users);

    }
 })
 socket.on("hiTo", async ({partyId, userId, user})=>{
  const socketIds = await getSocketIds(partyId,userId);
  for (const socketId in socketIds) {
    io.to(socketId).emit("recivedHi", user);
  }
 })
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`[express] listening on port ${PORT}`));


const SOCKET_PORT = process.env.SOCKET_PORT || 5050;
server.listen(SOCKET_PORT, () => {
  console.log(`[websocket] listening on port ${SOCKET_PORT}`);
});