import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

// Track MongoDB Memory Server instance
let mongoMemoryServer: MongoMemoryServer | null = null;

// Initialize MongoDB Memory Server in development
export async function initializeMongoDBMemoryServer() {
  if (process.env.NODE_ENV === 'production' || mongoMemoryServer) {
    return;
  }

  try {
    mongoMemoryServer = await MongoMemoryServer.create();
    const mongoUri = mongoMemoryServer.getUri();
    process.env.MONGODB_URI = mongoUri;
    console.log('[v0] MongoDB Memory Server initialized:', mongoUri);
  } catch (error) {
    console.error('[v0] Failed to start MongoDB Memory Server:', error);
  }
}

// Call initialization immediately
if (typeof window === 'undefined') {
  initializeMongoDBMemoryServer().catch(console.error);
}

// [INTEGRATED] Get MONGODB_URI at runtime instead of build time to support env vars
function getMongoDBURI(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined. MongoDB Memory Server may not be initialized yet.');
  }
  return uri;
}
 
// Cache the connection across hot reloads in development
// This prevents creating a new connection on every API call
declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB(): Promise<mongoose.Connection> {
  // Ensure MongoDB Memory Server is initialized
  await initializeMongoDBMemoryServer();

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    try {
      // [INTEGRATED] Use getMongoDBURI() to get URI at runtime
      cached.promise = mongoose
        .connect(getMongoDBURI(), {
          bufferCommands: false,
          serverSelectionTimeoutMS: 5000,
        })
        .then((m) => m.connection);
    } catch (error) {
      console.error('[v0] MongoDB connection failed:', error);
      // Return a dummy connection for development
      cached.promise = Promise.resolve(null as any);
    }
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
