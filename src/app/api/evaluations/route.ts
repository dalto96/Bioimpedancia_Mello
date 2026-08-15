import { NextRequest, NextResponse } from "next/server";
import { demoEvaluations } from "@/lib/demo-data";
export async function GET(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      const url = new URL(request.url);
      const patientId = url.searchParams.get("patientId");
      const filtered = patientId ? demoEvaluations.filter(e => e.patientId === Number(patientId)) : demoEvaluations;
      return NextResponse.json({ evaluations: filtered });
    }
    
    const { getDb } = await import("@/db");
    const db = await getDb();
    if (!db) return NextResponse.json({ evaluations: demoEvaluations });
    
    const { evaluations, bodyMeasurements, bioimpedance, calculatedResults, patients } = await import("@/db/schema");
    const { eq, desc } = await import("drizzle-orm");
    const url = new URL(request.url);
    const patientId = url.searchParams.get("patientId");
    let evalRows;
    if (patientId) {
      evalRows = await db.select().from(evaluations).where(eq(evaluations.patientId, Number(patientId))).orderBy(desc(evaluations.evaluationDate));
    } else {
      evalRows = await db.select().from(evaluations).orderBy(desc(evaluations.evaluationDate)).limit(50);
    }
    const result = [];
    for (const ev of evalRows) {
      try {
        const patient = await db.select().from(patients).where(eq(patients.id, ev.patientId)).limit(1);
        const bio = await db.select().from(bioimpedance).where(eq(bioimpedance.evaluationId, ev.id)).limit(1);
        const meas = await db.select().from(bodyMeasurements).where(eq(bodyMeasurements.evaluationId, ev.id)).limit(1);
        const calc = await db.select().from(calculatedResults).where(eq(calculatedResults.evaluationId, ev.id)).limit(1);
        result.push({
          id: ev.id, evaluationDate: ev.evaluationDate,
          patientName: patient[0]?.fullName || "", patientCpf: patient[0]?.cpf || "",
          patientGender: patient[0]?.gender || "", patientBirthDate: patient[0]?.birthDate || "",
          patientPhone: patient[0]?.phone || "",
          weight: meas[0]?.weight || 0, height: meas[0]?.height || 0,
          bmi: bio[0]?.bmi || calc[0]?.bmi || 0, bodyFatPct: bio[0]?.bodyFatPct || 0,
          bodyFatKg: bio[0]?.bodyFatKg || 0, leanMass: bio[0]?.leanMass || 0,
          musclePct: bio[0]?.musclePct || 0, muscleMass: bio[0]?.muscleMass || 0,
          waterPct: bio[0]?.waterPct || 0, waterKg: bio[0]?.waterKg || 0,
          boneMass: bio[0]?.boneMass || 0, proteinPct: bio[0]?.proteinPct || 0,
          visceralFat: bio[0]?.visceralFat || 0, subcutaneousFat: bio[0]?.subcutaneousFat || 0,
          metabolicAge: bio[0]?.metabolicAge || 0, basalMetabolism: bio[0]?.basalMetabolism || 0,
          bodyScore: bio[0]?.bodyScore || 0,
          waist: meas[0]?.waist || 0, hip: meas[0]?.hip || 0,
          neck: meas[0]?.neck || 0, chest: meas[0]?.chest || 0,
          bmiClassification: calc[0]?.bmiClassification || "",
          interpretation: calc[0]?.interpretation || "",
        });
      } catch { continue; }
    }
    return NextResponse.json({ evaluations: result });
  } catch {
    return NextResponse.json({ evaluations: demoEvaluations });
  }
}
export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ success: false, error: "Banco de dados não conectado." }, { status: 400 });
    }
    
    const { getDb } = await import("@/db");
    const db = await getDb();
    if (!db) return NextResponse.json({ success: false, error: "Banco de dados não conectado." }, { status: 400 });
    
    const { evaluations, bodyMeasurements, bioimpedance, calculatedResults } = await import("@/db/schema");
    const body = await request.json();
    // Format date properly for PostgreSQL
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const dateStr = year + "-" + month + "-" + day;
    const evalResult = await db.insert(evaluations).values({
      patientId: Number(body.patientId) || 1,
      userId: Number(body.userId) || 1,
      evaluationDate: dateStr,
      notes: null,
    }).returning();
    const evalId = evalResult[0].id;
    // Insert body measurements
    if (body.measurements) {
      const m = body.measurements;
      const measValues: Record<string, any> = { evaluationId: evalId };
      if (m.height) measValues.height = Number(m.height);
      if (m.weight) measValues.weight = Number(m.weight);
      if (m.waist) measValues.waist = Number(m.waist);
      if (m.hip) measValues.hip = Number(m.hip);
      if (m.chest) measValues.chest = Number(m.chest);
      if (m.neck) measValues.neck = Number(m.neck);
      if (m.leftArm) measValues.leftArm = Number(m.leftArm);
      if (m.rightArm) measValues.rightArm = Number(m.rightArm);
      if (m.leftForearm) measValues.leftForearm = Number(m.leftForearm);
      if (m.rightForearm) measValues.rightForearm = Number(m.rightForearm);
      if (m.leftThigh) measValues.leftThigh = Number(m.leftThigh);
      if (m.rightThigh) measValues.rightThigh = Number(m.rightThigh);
      if (m.leftCalf) measValues.leftCalf = Number(m.leftCalf);
      if (m.rightCalf) measValues.rightCalf = Number(m.rightCalf);
      if (m.shoulders) measValues.shoulders = Number(m.shoulders);
      if (m.abdomen) measValues.abdomen = Number(m.abdomen);
      await db.insert(bodyMeasurements).values(measValues);
    }
    // Insert bioimpedance
    if (body.bioimpedance) {
      const b = body.bioimpedance;
      const bioValues: Record<string, any> = { evaluationId: evalId };
      if (b.bodyFatPct) bioValues.bodyFatPct = Number(b.bodyFatPct);
      if (b.bodyFatKg) bioValues.bodyFatKg = Number(b.bodyFatKg);
      if (b.leanMass) bioValues.leanMass = Number(b.leanMass);
      if (b.muscleMass) bioValues.muscleMass = Number(b.muscleMass);
      if (b.musclePct) bioValues.musclePct = Number(b.musclePct);
      if (b.waterPct) bioValues.waterPct = Number(b.waterPct);
      if (b.waterKg) bioValues.waterKg = Number(b.waterKg);
      if (b.boneMass) bioValues.boneMass = Number(b.boneMass);
      if (b.proteinPct) bioValues.proteinPct = Number(b.proteinPct);
      if (b.subcutaneousFat) bioValues.subcutaneousFat = Number(b.subcutaneousFat);
      if (b.visceralFat) bioValues.visceralFat = Number(b.visceralFat);
      if (b.metabolicAge) bioValues.metabolicAge = Number(b.metabolicAge);
      if (b.basalMetabolism) bioValues.basalMetabolism = Number(b.basalMetabolism);
      if (b.bmi) bioValues.bmi = Number(b.bmi);
      if (b.bodyScore) bioValues.bodyScore = Number(b.bodyScore);
      await db.insert(bioimpedance).values(bioValues);
    }
    // Insert calculated results
    if (body.calculatedResults) {
      const c = body.calculatedResults;
      const calcValues: Record<string, any> = { evaluationId: evalId };
      if (c.bmi) calcValues.bmi = Number(c.bmi);
      if (c.bmiClassification?.label) calcValues.bmiClassification = String(c.bmiClassification.label);
      if (c.idealWeight?.min) calcValues.idealWeight = Number(c.idealWeight.min);
      if (c.leanBodyMass) calcValues.leanBodyMass = Number(c.leanBodyMass);
      if (c.fatMass) calcValues.fatMass = Number(c.fatMass);
      if (c.waistHipRatio) calcValues.waistHipRatio = Number(c.waistHipRatio);
      if (c.bodyDensity) calcValues.bodyDensity = Number(c.bodyDensity);
      if (c.bodyAdiposityIndex) calcValues.bodyAdiposityIndex = Number(c.bodyAdiposityIndex);
      if (c.bmr) calcValues.bmr = Number(c.bmr);
      if (c.dailyCalorieNeed) calcValues.dailyCalorieNeed = Number(c.dailyCalorieNeed);
      if (c.tee) calcValues.tee = Number(c.tee);
      if (c.idealWeight?.min) calcValues.healthyWeightMin = Number(c.idealWeight.min);
      if (c.idealWeight?.max) calcValues.healthyWeightMax = Number(c.idealWeight.max);
      if (c.metabolicAgeClass?.label) calcValues.metabolicAgeClass = String(c.metabolicAgeClass.label);
      if (c.visceralFatClass?.label) calcValues.visceralFatClass = String(c.visceralFatClass.label);
      if (c.muscleClass?.label) calcValues.muscleClass = String(c.muscleClass.label);
      if (c.waterClass?.label) calcValues.waterClass = String(c.waterClass.label);
      if (c.proteinClass?.label) calcValues.proteinClass = String(c.proteinClass.label);
      if (c.interpretation) calcValues.interpretation = String(c.interpretation);
      await db.insert(calculatedResults).values(calcValues);
    }
    return NextResponse.json({ success: true, evaluationId: evalId });
  } catch (error) {
    console.error("Error saving evaluation:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: "Erro ao salvar avaliação", detail: msg }, { status: 500 });
  }
}