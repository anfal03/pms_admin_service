import { REDIS_CONNECTION} from '../constants';
import { createClient } from 'redis';
import 'dotenv/config'

export const redisProviders = [ 
    //redis connection...
    {
    name : REDIS_CONNECTION, 
    provide: REDIS_CONNECTION, 
    useFactory: async () => { 
    
        const REDIS_URL = `redis://${process.env.REDIS_HOST}:${parseInt(process.env.REDIS_PORT)}`
        //Check connection establish or not......
        let client = createClient({ url : REDIS_URL });
     
        console.log(`Redis url : `, REDIS_URL) 
    
        client.on('error', (err) => {console.error('Redis Client Error', err); client.quit() })
    
        client.on('connect', (message) => console.info("Redis Client Connect successfully"))
    
        client.on("idle", (err) => console.error("Redis queue is idle. Shutting down...") )
     
        client.on("end", (err) => console.error("Redis is shutting down. This might be ok if you chose not to run it in your dev environment") )
     
        client.on("ready", (err) => console.info("Redis up! Now connecting the worker queue client...") )
    
        await client.connect();
    
        return client
     }
}]
