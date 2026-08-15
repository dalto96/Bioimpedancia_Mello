/**
 * HEFARMA Body Analysis System
 * Database connection module with SSL support for Neon/Supabase
 */

const databaseUrl = process.env.DATABASE_URL;

let _pool: any = null;
let _db: any = null;
let _connectionError: string | null = null;

export async function getDb() {
  if (!databaseUrl) return null;
  if (_db) return _db;
  
  try {
    const { drizzle } = await import("drizzle-orm/node-postgres");
    const { Pool } = await import("pg");
    
    // Parse SSL from connection string and add explicit SSL config
    // Neon, Supabase, and other cloud providers require SSL
    const poolConfig: any = {
      connectionString: databaseUrl,
      ssl: false,
    };

    // Detect if SSL is needed (Neon, Supabase, etc.)
    if (
      databaseUrl.includes("neon.tech") ||
      databaseUrl.includes("supabase") ||
      databaseUrl.includes("sslmode=require") ||
      databaseUrl.includes("railway") ||
      databaseUrl.includes("render.com") ||
      databaseUrl.includes("aws-") ||
      databaseUrl.includes("pooler")
    ) {
      poolConfig.ssl = { rejectUnauthorized: false };
    }

    // Remove sslmode from connection string to avoid conflict
    const cleanUrl = databaseUrl.replace(/[?&]sslmode=[^&]+/, "");
    poolConfig.connectionString = cleanUrl;

    const globalForDb = globalThis as typeof globalThis & {
      __hefarmaPool?: any;
    };
    
    _pool = globalForDb.__hefarmaPool ?? new Pool(poolConfig);
    
    if (process.env.NODE_ENV !== "production") {
      globalForDb.__hefarmaPool = _pool;
    }
    
    _db = drizzle(_pool);
    _connectionError = null;

    // Test connection
    try {
      await _pool.query("SELECT 1");
      console.log("✅ Database connected successfully");
    } catch (testErr) {
      console.error("❌ Database connection test failed:", testErr);
      _db = null;
      _pool = null;
      _connectionError = String(testErr);
      return null;
    }

    return _db;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    _connectionError = String(error);
    return null;
  }
}

export async function getPool() {
  if (!databaseUrl) return null;
  if (_pool) return _pool;
  await getDb();
  return _pool;
}

export function isDatabaseAvailable(): boolean {
  return !!databaseUrl;
}

export function getConnectionError(): string | null {
  return _connectionError;
}

// For backward compatibility
export const db = null as any;
export const pool = null as any;
