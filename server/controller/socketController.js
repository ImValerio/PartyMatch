const {redisClient:client} = require("../db/database");

const joinParty = async (partyId, socket)=>{
   console.log("PARTY-ID:", partyId);
   const users = client.get(partyId) ? client.get(partyId) : new Set();
   
   const user = new Map();
   user.set("score", 0);

   users.add(user);
   client.set(partyId, users);
   
   socket.emit("updateUsers", users)
}
module.exports = {joinParty}