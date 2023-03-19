const {createClient} = require("redis")
const client = createClient();

exports.connectToDb  = async()=>{
    try{
        await client.connect();
        console.log("[redis] connected to the database")
    }catch(e){
        console.log("[error] connection to the database failed...");
    }
}

exports.redisClient = client;