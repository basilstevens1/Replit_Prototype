import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  const isProduction = process.env.REPLIT_DEPLOYMENT === "1" || process.env.NODE_ENV === "production";
  const errorMsg = isProduction 
    ? "DATABASE_URL environment variable is required for production deployment. Please ensure database connection variables are set as production secrets."
    : "DATABASE_URL must be set. Did you forget to provision a database?";
  throw new Error(errorMsg);
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 10000,
});

// Test database connection on startup
pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
});

export const db = drizzle({ client: pool, schema });
