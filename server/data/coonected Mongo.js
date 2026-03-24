import { MongoClient } from 'mongodb';
import 'dotenv/config'
const MONGO_URL = process.env.MONGO_URI
const CONTROLER_NAME = 'Albums'



async function connectedToMongo() {
    try {
        // בדיקה בוליאנית: רק אם כתוב 'false' במפורש, ה-TLS יכבה
        const useTLS = process.env.MONGO_TLS !== 'false';

        const client = new MongoClient(MONGO_URL, {
            tls: useTLS,
            tlsAllowInvalidCertificates: true
        });

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