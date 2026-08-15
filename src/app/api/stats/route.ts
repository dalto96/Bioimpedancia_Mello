import { NextRequest, NextResponse } from "next/server";
import { demoStats } from "@/lib/demo-data";

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(demoStats);
    }
    
    const { getDb } = await import("@/db");
    const db = await getDb();
    if (!db) return NextResponse.json(demoStats);
    
    const { patients, evaluations } = await import("@/db/schema");
    const { sql, eq } = await import("drizzle-orm");

    const patientCount = await db.select({ count: sql`count(*)` }).from(patients);
    const evalCount = await db.select({ count: sql`count(*)` }).from(evaluations);
    const today = new Date().toISOString().split("T")[0];
    const todayCount = await db.select({ count: sql`count(*)` }).from(evaluations).where(eq(evaluations.evaluationDate, today));

    return NextResponse.json({
      patients: Number(patientCount[0]?.count || 0),
      evaluations: Number(evalCount[0]?.count || 0),
      today: Number(todayCount[0]?.count || 0),
    });
  } catch {
    return NextResponse.json(demoStats);
  }
}
