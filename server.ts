// --- imports & config ---
const dotenv = require('dotenv');
dotenv.config();
import type { Request, Response } from 'express';

const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// --- mongodb client ---
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
const database = client.db(process.env.MONGODB_DB);
const places = database.collection('places');

// --- middleware ---
app.use(cors());
app.use(express.json());

// --- connect to db ---
async function connect() {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB");
}
connect().catch(console.dir);

// --- routes ---
app.get('/', async (req: Request, res: Response) => {

    res.json({ status: "success", message: 'Hello World' });
});

// --- start server (skipped on Vercel) ---
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

// --- export for Vercel serverless ---
module.exports = app;
