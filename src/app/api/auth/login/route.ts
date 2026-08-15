import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    // Default demo credentials (always work)
    if (username === "admin" && password === "admin") {
      return NextResponse.json({ success: true, user: { id: 1, name: "Administrador", role: "admin", username: "admin" } });
    }
    if (username === "func" && password === "func") {
      return NextResponse.json({ success: true, user: { id: 2, name: "Funcionário", role: "employee", username: "func" } });
    }

    // Try database if available
    if (process.env.DATABASE_URL) {
      try {
        const { getDb } = await import("@/db");
        const db = await getDb();
        if (db) {
          const { users } = await import("@/db/schema");
          const { eq } = await import("drizzle-orm");
          const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
          if (result.length > 0) {
            const user = result[0];
            if (user.passwordHash === password) {
              return NextResponse.json({ success: true, user: { id: user.id, name: user.name, role: user.role, username: user.username } });
            }
          }
        }
      } catch { /* fall through */ }
    }

    return NextResponse.json({ success: false, error: "Usuário ou senha inválidos" }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}
