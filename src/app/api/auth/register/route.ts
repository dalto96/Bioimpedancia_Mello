import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, name, password, role } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ success: false, error: "Usuário e senha obrigatórios" }, { status: 400 });
    }
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ success: false, error: "Banco de dados não conectado" }, { status: 400 });
    }
    const { getDb } = await import("@/db");
    const db = await getDb();
    if (!db) return NextResponse.json({ success: false, error: "Banco não conectado" }, { status: 400 });
    const { users } = await import("@/db/schema");
    const result = await db.insert(users).values({
      username, name: name || username, passwordHash: password, role: role || "employee",
    }).returning();
    return NextResponse.json({ success: true, id: result[0].id });
  } catch {
    return NextResponse.json({ success: false, error: "Erro ao criar usuário" }, { status: 500 });
  }
}
