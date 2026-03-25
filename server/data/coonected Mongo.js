import { MongoClient } from 'mongodb';
import 'dotenv/config'
const MONGO_URL = process.env.MONGO_URI
const CONTROLER_NAME = 'Albums'


async function connectedToMongo(){
    try{
        const tlsEnabled = process.env.MONGO_TLS === 'true';
        const client = new MongoClient(MONGO_URL,{
            tls: tlsEnabled,
            tlsAllowInvalidCertificates: tlsEnabled
        })

        await client.connect();
        const data = client.db(CONTROLER_NAME)
        console.log('connected to MongoDB')
        return data
        
    }catch(error){
        console.error("connected error:",error)
    }
}
const dbMongo = await connectedToMongo();
export default dbMongo;