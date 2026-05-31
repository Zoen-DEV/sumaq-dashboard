import mongoose from "mongoose";
import dns from "dns";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const DNS_SERVERS = ["8.8.8.8", "1.1.1.1"];
const MAX_ATTEMPTS = 4;

const globalWithMongoose = global as typeof globalThis & { _mongoose?: MongooseCache };
const cached: MongooseCache = globalWithMongoose._mongoose ?? { conn: null, promise: null };
globalWithMongoose._mongoose = cached;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function connectWithRetry(uri: string): Promise<typeof mongoose> {
  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    // Re-aplicar los DNS en cada intento replica lo que hace el HMR al re-evaluar el
    // módulo: en arranque en frío el setServers no queda aplicado al canal de c-ares
    // antes de la primera consulta SRV, lo que provoca `querySrv ECONNREFUSED`.
    dns.setServers(DNS_SERVERS);

    try {
      return await mongoose.connect(uri, { bufferCommands: false });
    } catch (e) {
      lastError = e;
      if (attempt < MAX_ATTEMPTS - 1) await sleep(250 * 2 ** attempt);
    }
  }

  throw lastError;
}

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not defined");

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = connectWithRetry(uri);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
