import { MongoClient } from "mongodb";

const uri = 
    process.env.MONGO_DB || 
    "mongodb://127.0.0.1/weather";

if (!uri) throw new Error("Missing MONGO_DB connection string from .env vars");

export const client = new MongoClient(uri);

export const db = client.db();
