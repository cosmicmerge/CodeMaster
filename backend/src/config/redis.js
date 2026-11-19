import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "redis";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const redisPassword = process.env.REDIS_PASSWORD;
const redisHost = process.env.REDIS_HOST;
const PORT=process.env.REDIS_PORT

const redisClient = createClient({
    username: 'default',
    password: redisPassword,
    socket: {
        host: redisHost,
        port: PORT
    }
});

redisClient.on("error", (err) => console.error("Redis Client Error:", err));

export default redisClient;