const {redisClient:client} = require("../db/connection");

const updateParty = async (partyId, users)=> {
 await client.set(partyId, JSON.stringify(users));
}

const getUsers = async (partyId)=>{
    await client.get(partyId) ? JSON.parse(await client.get(partyId)) : null;
}

const setUsers = async (partyId,users)=>{
    await client.set(partyId, JSON.stringify(users));
}



module.exports = {updateParty, getUsers, setUsers};