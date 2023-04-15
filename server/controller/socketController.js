const {updateParty, getUsers, setUsers} = require("./dbController");
const joinParty = async (partyId, socket, userId)=>{
   try{
      let users =  await getUsers(partyId);     

      const defaultUser = {
         id: userId,
         socketIds: [socket.id],
         displayName: `Tavolo ${users.length}`,
         score: 0
      }
      console.log("USERS:",users)
      let user = users.find(user => user.id == userId);

      if (!user){
         user = defaultUser;
         users = [...users, user];
         await updateParty(partyId, users);
      }

      return users;
   }catch(error){
      console.log(error)
   }
}

const removeSocketFromUser = async (partyId, userId, socketId) => {
   
   let users = await getUsers(partyId);
   if(!users){
      console.log("[error] party not found..");
      return;
   }
   
   users = users.map((user) =>{
      if(user.id == userId){
         user.socketIds = user.socketIds.filter(id => id != socketId);
      }

      return user;
   } )

   await setUsers(partyId, users)
}

const getSocketIds = async (userId,io)=>{
   const clients = io.sockets.adapter.rooms.get(userId);

   return clients ? Array.from(clients) : [];
}

module.exports = {joinParty, removeSocketFromUser, getSocketIds}