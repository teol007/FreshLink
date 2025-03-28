import { MongoClient, Db, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

let client: MongoClient;
let mongoServer: MongoMemoryServer;
let db: Db;

async function createInMemoryMongoUri() {
    if (!mongoServer) {
        mongoServer = await MongoMemoryServer.create();
    }
    return mongoServer.getUri();
}

async function getClient() {
    const uri = process.env.NODE_ENV === 'test'
        ? await createInMemoryMongoUri()
        : process.env.UMS_MONGODB_URL;

    if (!uri) {
        throw new Error('UMS_MONGODB_URL not set as environment variable');
    }

    client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });
}

export async function connectToDatabase(): Promise<Db> {
    if (!db) {
        try {
            await getClient();
            await client.connect();
            db = client.db("user-management-service");
            console.log("Successfully connected to MongoDB");
        } catch (error) {
            console.error("Failed to connect to MongoDB: ", error);
            process.exit(1);
        }
    }
    return db;
}

export function getDb(): Db {
    if (!db) {
        throw new Error("Database not initialized. Call connectToDatabase first.");
    }
    return db;
}

export async function closeDatabaseConnection(): Promise<void> {
    try {
        if (mongoServer) {
            await mongoServer.stop();
            console.log("MongoMemoryServer stopped.");
        }
        if (client) {
            await client.close();
            console.log("MongoDB connection closed.");
        }
    } catch (error) {
        console.error("Error closing MongoDB connection", error);
    }
}
