import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dns from "dns";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

async function main() {
    const connectionString = process.env.DB_CONNECTION_STRING;

    if (!connectionString) {
        throw new Error("DB_CONNECTION_STRING is undefined — check that .env is loaded correctly");
    }

    try {
        await mongoose.connect(connectionString);
    } catch (err) {
        console.log("Some error occured in database connection", err.message);
        throw err;
    }
}

export default main;