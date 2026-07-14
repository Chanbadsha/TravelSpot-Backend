import dotenv from 'dotenv';
dotenv.config();
import type { Request, Response } from 'express';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import express from 'express';
import cors from 'cors';

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

const app = express();
const port = process.env.PORT || 5000;

// --- mongodb client ---
const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
const database = client.db(process.env.MONGODB_DB);
const places = database.collection<Place>("places");
const users = database.collection("user");

// --- middleware ---
app.use(cors());
app.use(express.json());

// --- connect to db ---
async function connect(): Promise<void> {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB");
}
connect().catch(console.dir);

// --- routes ---
app.get('/', async (_req: Request, res: Response) => {
    res.json({ status: "success", message: 'HI' });
});
// get all places
app.get('/api/places', async (_req: Request, res: Response) => {
    const data = await places.find().toArray();
    res.json({ status: "success", data });
});
// get single place
app.get('/api/places/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const data = await places.findOne({ _id: new ObjectId(id) })
        res.json({ status: "success", data });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.json({ status: "error", message });
    }

});

// Get all users
app.get('/api/users', async (_req: Request, res: Response) => {
    const data = await users.find().toArray();
    res.json({ status: "success", data });
});

// Get single user
app.get('/api/users/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const data = await users.findOne({ _id: new ObjectId(id) })
        res.json({ status: "success", data });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        res.json({ status: "error", message });
    }
});
// --- start server (skipped on Vercel) ---
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

// --- export for Vercel serverless ---
module.exports = app;
