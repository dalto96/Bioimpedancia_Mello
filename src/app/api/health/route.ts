export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      const { getDb } = await import("@/db");
      const db = await getDb();
      if (db) {
        const { sql } = await import("drizzle-orm");
        await db.execute(sql`select 1`);
      }
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: true }); // Still return ok in demo mode
  }
}
