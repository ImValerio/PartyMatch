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
    let messages = await client.get(chatId);
    if(!messages)
        messages = [];
    else
        messages = JSON.parse(messages);

    console.log("GET",messages);
    
    messages.push(msg);
    console.log("SET",messages)
    const updatedMessages = JSON.stringify(messages);

    await client.set(chatId, updatedMessages)

    return messages;
}

const getChat = async (chatId) => {
    let messages = await client.get(chatId);
    if(!messages)
        messages = [];
    else
        messages = JSON.parse(messages);

    return messages;
}



module.exports = {updateParty, getUsers, setUsers, createChat, updateChat, getChat};