const express = require("express");
const cors = require("cors")
const http = require('http');
const { Server } = require("socket.io");
const helmet = require("helmet");
const morgan = require("morgan");

const {connectToDb} = require("./db/database")
const {joinParty} = require("./controller/socketController");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {cors:"http://localhost:3000"});

connectToDb();

app.use(morgan("tiny"));
app.use(helmet());
app.use(express.json());

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on("join-party", (partyId)=> joinParty(partyId,socket))
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`[express] listening on port ${PORT}`));


const SOCKET_PORT = process.env.SOCKET_PORT || 5050;
server.listen(SOCKET_PORT, () => {
  console.log(`[websocket] listening on port ${SOCKET_PORT}`);
});