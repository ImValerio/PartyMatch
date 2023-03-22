const {redisClient:client} = require("../db/database");

const joinParty = async (partyId)=>{
   try{
      let users = await client.get(partyId) ? JSON.parse(await client.get(partyId)) : [];

      users = [...users,{score: 0}];
      await client.set(partyId, JSON.stringify(users));
      console.log("Users:",users) 

      return users;
   }catch(error){
      console.log(error)
   }
}
module.exports = {joinParty}