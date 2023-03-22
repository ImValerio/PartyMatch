const {redisClient:client} = require("../db/database");
const { v4: uuidv4 } = require('uuid');

const joinParty = async (partyId, socket)=>{
   try{
      let users = await client.get(partyId) ? JSON.parse(await client.get(partyId)) : [];

      const user = {
         id:uuidv4(),
         score: 0
      }
      users = [...users, user];
      await client.set(partyId, JSON.stringify(users));
      console.log("Users:",users) 
      console.log(socket.id)
      return users;
   }catch(error){
      console.log(error)
   }
}
module.exports = {joinParty}