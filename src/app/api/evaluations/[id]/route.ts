import { NextRequest, NextResponse } from "next/server";
import { demoEvaluations } from "@/lib/demo-data";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!process.env.DATABASE_URL) {
      const ev = demoEvaluations.find(e => e.id === Number(id));
      return NextResponse.json({ evaluation: ev || null });
    }
    const { getDb } = await import("@/db");
    const db = await getDb();
    if (!db) { const ev = demoEvaluations.find(e => e.id === Number(id)); return NextResponse.json({ evaluation: ev || null }); }
    const { evaluations, bodyMeasurements, bioimpedance, calculatedResults, patients } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    const evalId = Number(id);
    const evalRow = await db.select().from(evaluations).where(eq(evaluations.id, evalId)).limit(1);
    if (!evalRow.length) return NextResponse.json({ evaluation: null });
    const ev = evalRow[0];
    const patient = await db.select().from(patients).where(eq(patients.id, ev.patientId)).limit(1);
    const bio = await db.select().from(bioimpedance).where(eq(bioimpedance.evaluationId, evalId)).limit(1);
    const meas = await db.select().from(bodyMeasurements).where(eq(bodyMeasurements.evaluationId, evalId)).limit(1);
    const calc = await db.select().from(calculatedResults).where(eq(calculatedResults.evaluationId, evalId)).limit(1);
    return NextResponse.json({ evaluation: {
      id: ev.id, evaluationDate: ev.evaluationDate,
      patientName: patient[0]?.fullName || "", patientCpf: patient[0]?.cpf || "",
      patientGender: patient[0]?.gender || "", patientBirthDate: patient[0]?.birthDate || "",
      patientPhone: patient[0]?.phone || "",
      weight: meas[0]?.weight || 0, height: meas[0]?.height || 0,
      waist: meas[0]?.waist || 0, hip: meas[0]?.hip || 0, neck: meas[0]?.neck || 0, chest: meas[0]?.chest || 0,
      bmi: bio[0]?.bmi || calc[0]?.bmi || 0, bodyFatPct: bio[0]?.bodyFatPct || 0,
      bodyFatKg: bio[0]?.bodyFatKg || 0, leanMass: bio[0]?.leanMass || 0,
      muscleMass: bio[0]?.muscleMass || 0, musclePct: bio[0]?.musclePct || 0,
      waterPct: bio[0]?.waterPct || 0, waterKg: bio[0]?.waterKg || 0,
      boneMass: bio[0]?.boneMass || 0, proteinPct: bio[0]?.proteinPct || 0,
      subcutaneousFat: bio[0]?.subcutaneousFat || 0, visceralFat: bio[0]?.visceralFat || 0,
      metabolicAge: bio[0]?.metabolicAge || 0, basalMetabolism: bio[0]?.basalMetabolism || 0,
      bodyScore: bio[0]?.bodyScore || 0, bmiClassification: calc[0]?.bmiClassification || "",
      interpretation: calc[0]?.interpretation || "",
    }});
  } catch { return NextResponse.json({ evaluation: null }); }
}
