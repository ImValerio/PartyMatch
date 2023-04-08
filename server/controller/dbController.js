const {redisClient:client} = require("../db/connection");

const updateParty = async (partyId, users)=> {
 await client.set(partyId, JSON.stringify(users));
}

const getUsers = async (partyId)=>{
    const users = await client.get(partyId) ? JSON.parse(await client.get(partyId)) : [];
    return users;
}

const setUsers = async (partyId,users)=>{
    await client.set(partyId, JSON.stringify(users));
}

const createChat = async (chatId) => {

    await client.set(chatId, JSON.stringify([]))
}

const updateChat = async (chatId,msg) => {
    const messages = await client.get(chatId) ? JSON.parse(await client.get(chatId)) : null;

    if(!messages)
        return;
    
    messages.push(msg);

    const updatedMessages = JSON.stringify(messages);

    await client.set(chatId, JSON.stringify(updatedMessages))

    return messages;
}

module.exports = {updateParty, getUsers, setUsers, createChat, updateChat};