/**
 * HEFARMA Body Analysis System
 * Database connection module
 * 
 * Works in TWO modes:
 * 1. WITH database: Set DATABASE_URL env var → real PostgreSQL
 * 2. WITHOUT database: No DATABASE_URL → demo mode with sample data
 */

const databaseUrl = process.env.DATABASE_URL;

// Lazy-loaded database instances
let _pool: any = null;
let _db: any = null;

/**
 * Get the database instance (lazy initialization)
 * Returns null if DATABASE_URL is not set
 */
export async function getDb() {
  if (!databaseUrl) return null;
  
  if (_db) return _db;
  
  try {
    const { drizzle } = await import("drizzle-orm/node-postgres");
    const { Pool } = await import("pg");
    
    const globalForDb = globalThis as typeof globalThis & {
      __hefarmaPool?: any;
    };
    
    _pool = globalForDb.__hefarmaPool ?? new Pool({ connectionString: databaseUrl });
    
    if (process.env.NODE_ENV !== "production") {
      globalForDb.__hefarmaPool = _pool;
    }
    
    _db = drizzle(_pool);
    return _db;
  } catch (error) {
    console.error("Failed to connect to database:", error);
    return null;
  }
}

/**
 * Get the pool (for direct SQL queries)
 */
export async function getPool() {
  if (!databaseUrl) return null;
  if (_pool) return _pool;
  
  // Initialize pool via getDb
  await getDb();
  return _pool;
}

/**
 * Check if database is available
 */
export function isDatabaseAvailable(): boolean {
  return !!databaseUrl;
}

// For backward compatibility - synchronous access
// These will be null if database is not connected
export const db = null as any;
export const pool = null as any;
