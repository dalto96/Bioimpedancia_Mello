import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const hasUrl = !!process.env.DATABASE_URL;
    
    if (!hasUrl) {
      return NextResponse.json({ 
        ok: true, 
        database: false, 
        mode: "demo",
        message: "Modo demonstração - sem banco de dados conectado"
      });
    }

    const { getDb, getConnectionError } = await import("@/db");
    const db = await getDb();
    
    if (!db) {
      const err = getConnectionError();
      return NextResponse.json({ 
        ok: true, 
        database: false, 
        mode: "demo",
        message: "Falha na conexão com o banco",
        error: err
      });
    }

    const { sql } = await import("drizzle-orm");
    await db.execute(sql`select 1`);
    
    return NextResponse.json({ 
      ok: true, 
      database: true, 
      mode: "production",
      message: "Banco de dados conectado"
    });
  } catch (error) {
    return NextResponse.json({ 
      ok: true, 
      database: false, 
      mode: "demo",
      message: "Erro ao verificar banco",
      error: String(error)
    });
  }
}
