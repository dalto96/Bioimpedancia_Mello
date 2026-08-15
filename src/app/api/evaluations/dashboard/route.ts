import { NextResponse } from "next/server";
import { demoEvaluations } from "@/lib/demo-data";

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) return NextResponse.json({ evaluations: demoEvaluations });
    const { getDb } = await import("@/db");
    const db = await getDb();
    if (!db) return NextResponse.json({ evaluations: demoEvaluations });
    const { evaluations, bodyMeasurements, bioimpedance, patients } = await import("@/db/schema");
    const { eq, desc } = await import("drizzle-orm");
    const evalRows = await db.select().from(evaluations).orderBy(desc(evaluations.evaluationDate)).limit(20);
    const result = [];
    for (const ev of evalRows) {
      try {
        const patient = await db.select().from(patients).where(eq(patients.id, ev.patientId)).limit(1);
        const bio = await db.select().from(bioimpedance).where(eq(bioimpedance.evaluationId, ev.id)).limit(1);
        const meas = await db.select().from(bodyMeasurements).where(eq(bodyMeasurements.evaluationId, ev.id)).limit(1);
        result.push({ id: ev.id, evaluationDate: ev.evaluationDate, patientName: patient[0]?.fullName || "",
          weight: meas[0]?.weight || 0, bodyFatPct: bio[0]?.bodyFatPct || 0,
          musclePct: bio[0]?.musclePct || 0, waterPct: bio[0]?.waterPct || 0,
          bmi: bio[0]?.bmi || 0, visceralFat: bio[0]?.visceralFat || 0 });
      } catch { /* skip */ }
    }
    return NextResponse.json({ evaluations: result });
  } catch { return NextResponse.json({ evaluations: demoEvaluations }); }
}
