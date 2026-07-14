// --- imports & config ---
import dotenv from 'dotenv';
dotenv.config();
import type { Request, Response } from 'express';
import { MongoClient, ServerApiVersion, ObjectId, type Collection } from 'mongodb';
import express from 'express';
import cors from 'cors';

// --- types ---
interface Place {
    _id: ObjectId;
    name: string;
    country: string;
    city: string;
    location: string;
    category: string;
    bestSeason: string;
    travelTime: string;
    entryFee: string;
    openingHours: string;
    rating: number;
    reviews: number;
    coverImage: string;
    facilities: string[];
    description: string;
    images: string[];
    status: string;
    submittedBy: string;
    creatorId: string;
    nearbyAttractions: string[];
    related: string[];
    verifiedAt: string;
    createdAt: string;
    updatedAt: string;
}

// --- module-level state ---
const app = express();
const port = process.env.PORT || 5000;

let client: MongoClient;
let places: Collection<Place>;
let users: Collection;
let connected = false;

// --- connect to MongoDB ---
async function connect(): Promise<void> {
    if (connected) return;
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not set");
    client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    const database = client.db(process.env.MONGODB_DB);
    places = database.collection<Place>("places");
    users = database.collection("user");
    connected = true;
    console.log("Connected to MongoDB");
}

// --- middleware ---
app.use(cors());
app.use(express.json());

// --- routes ---
// health check
app.get('/', async (_req: Request, res: Response) => {
    res.json({ status: "success", message: 'HI' });
});

// places
app.get('/api/places', async (_req: Request, res: Response) => {
    try {
        await connect();
        const data = await places.find().toArray();
        res.json({ status: "success", data });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ status: "error", message });
    }
});

app.get('/api/places/:id', async (req: Request, res: Response) => {
    try {
        await connect();
        const id = req.params.id as string;
        const data = await places.findOne({ _id: new ObjectId(id) });
        res.json({ status: "success", data });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ status: "error", message });
    }
});

// users
app.get('/api/users', async (_req: Request, res: Response) => {
    try {
        await connect();
        const data = await users.find().toArray();
        res.json({ status: "success", data });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ status: "error", message });
    }
});

app.get('/api/users/:id', async (req: Request, res: Response) => {
    try {
        await connect();
        const id = req.params.id as string;
        const data = await users.findOne({ _id: new ObjectId(id) });
        res.json({ status: "success", data });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.status(500).json({ status: "error", message });
    }
});

// --- start server (skipped on Vercel) ---
if (process.env.NODE_ENV !== 'production') {
    connect().then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }).catch(console.dir);
}

// --- export for Vercel serverless ---
module.exports = app;
