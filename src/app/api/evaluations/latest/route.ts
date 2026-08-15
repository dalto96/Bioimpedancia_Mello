import { NextResponse } from "next/server";
import { demoEvaluations } from "@/lib/demo-data";

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) return NextResponse.json({ evaluation: demoEvaluations[0] || null });
    const { getDb } = await import("@/db");
    const db = await getDb();
    if (!db) return NextResponse.json({ evaluation: demoEvaluations[0] || null });
    const { evaluations, bodyMeasurements, bioimpedance, calculatedResults, patients } = await import("@/db/schema");
    const { eq, desc } = await import("drizzle-orm");
    const evalRows = await db.select().from(evaluations).orderBy(desc(evaluations.evaluationDate)).limit(1);
    if (!evalRows.length) return NextResponse.json({ evaluation: null });
    const ev = evalRows[0];
    const patient = await db.select().from(patients).where(eq(patients.id, ev.patientId)).limit(1);
    const bio = await db.select().from(bioimpedance).where(eq(bioimpedance.evaluationId, ev.id)).limit(1);
    const meas = await db.select().from(bodyMeasurements).where(eq(bodyMeasurements.evaluationId, ev.id)).limit(1);
    const calc = await db.select().from(calculatedResults).where(eq(calculatedResults.evaluationId, ev.id)).limit(1);
    return NextResponse.json({ evaluation: {
      id: ev.id, evaluationDate: ev.evaluationDate,
      patientName: patient[0]?.fullName || "", patientCpf: patient[0]?.cpf || "",
      patientGender: patient[0]?.gender || "", patientBirthDate: patient[0]?.birthDate || "",
      patientPhone: patient[0]?.phone || "",
      weight: meas[0]?.weight || 0, height: meas[0]?.height || 0,
      bmi: bio[0]?.bmi || calc[0]?.bmi || 0, bodyFatPct: bio[0]?.bodyFatPct || 0,
      musclePct: bio[0]?.musclePct || 0, waterPct: bio[0]?.waterPct || 0,
      visceralFat: bio[0]?.visceralFat || 0, metabolicAge: bio[0]?.metabolicAge || 0,
      basalMetabolism: bio[0]?.basalMetabolism || 0,
      interpretation: calc[0]?.interpretation || "", bmiClassification: calc[0]?.bmiClassification || "",
    }});
  } catch { return NextResponse.json({ evaluation: null }); }
}
