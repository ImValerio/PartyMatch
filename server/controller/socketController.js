const {redisClient:client} = require("../db/connection");
const { v4: uuidv4 } = require('uuid');

const joinParty = async (partyId, socket, userId)=>{
   try{
      let users = await client.get(partyId) ? JSON.parse(await client.get(partyId)) : [];
      
      //TODO: use uuid for identify the user and collect all sockets in sockedIds propriety

      const defaultUser = {
         id: userId,
         socketIds: [socket.id],
         displayName: `Tavolo ${users.length}`,
         score: 0
      }

      let user = users.find(user => user.id == userId);

      if (!user){
         user = defaultUser;
         users = [...users, user];
      }
      else{
         users.map((user)=>{
            if(user.id == userId){
               user.scokedIds = [...user.sockedIds,socket.id]
            }
            return user;
         }) 
      }

      await client.set(partyId, JSON.stringify(users));
      return users;
   }catch(error){
      console.log(error)
   }
}

const removeSocketFromUser = async (partyId, userId, socketId) => {

   let users = await client.get(partyId) ? JSON.parse(await client.get(partyId)) : null;

   if(!users){
      console.log("[error] party not found..");
      return;
   }
   
   users = users.map((user) =>{
      if(user.id == userId){
         user.socketIds = user.sockedIds.filter(id => id != socketId);
      }

      return user;
   } )

   await client.set(partyId, JSON.stringify(users));
}
module.exports = {joinParty, removeSocketFromUser}