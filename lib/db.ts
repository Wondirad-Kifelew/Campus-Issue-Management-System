import mongoose from 'mongoose';

// [INTEGRATED] Get MONGODB_URI at runtime instead of build time to support env vars
// Next.js automatically loads environment variables, so dotenv is not required here.
function getMongoDBURI(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined. Please add it to your environment variables.');
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
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    // [INTEGRATED] Use getMongoDBURI() to get URI at runtime
    cached.promise = mongoose
      .connect(getMongoDBURI(), {
        bufferCommands: false,
      })
      .then((m) => m.connection);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
