const {redisClient:client} = require("../db/database");

const joinParty = async (partyId)=>{
   console.log("PARTY-ID: ",partyId) 
}
module.exports = {joinParty}