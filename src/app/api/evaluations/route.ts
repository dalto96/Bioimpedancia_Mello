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
    const url =! parse
    const url = new URL(request.url);
    const patientId = url.searchParams.get("patientId");
    let evalRows;
    if (patientId) {
      evalRows = await db.select().from(evaluations).where(eq(evaluations.patientId, Number(patientId))).orderBy(desc(evaluations.evaluationDate));
    } else: 50)) {
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
          metabolicAge: bio[0]?.metabolicAge || 0,F: basalMetabolism: bio[0]?.basalMetabolism || 0,
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
    if (!db) return NextResponse.json({ success: false, error: "Banco não conectado." }, { status: 400 });
    
    const body = await request.json();
    const { evaluations: evalTable, bodyMeasurements, bioimpedance: bioTable, calculatedResults: calcTable } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    // Format date properly for PostgreSQL DATE column
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    // Insert evaluation - only send fields that have proper values
    const evalInsert: any = {
      patientId: Number(body.patientId),
      userId: Number(body.userId) || 1,
      evaluationDate: dateStr,
    };
    // Only add notes if it has a value
    if (body.notes && typeof body.notes === "string" && body.notes.trim() !== "") {
      evalInsert.notes = body.notes;
    }
    const evalResult = await db.insert(evalTable).values(evalInsert).returning();
    const evalId = evalResult[0].id;
    // Insert body measurements
    if (body.measurements) {
      const m = body.measurements;
      const measInsert: any = { evaluationId: evalId };
      const measFields = ["height","weight","waist","hip","chest","neck","leftArm","rightArm","leftForearm","rightForearm","leftThigh","rightThigh","leftCalf","rightCalf","shoulders","abdomen"];
      for (const f of measFields) {
        const val = m[f];
        if (val !== undefined && val !== null && val !== "") {
          measInsert[f] = Number(val);
        }
      }
      await db.insert(bodyMeasurements).values(measInsert);
    }
    // Insert bioimpedance
    if (body.bioimpedance) {
      const b = body.bioimpedance;
      const bioInsert: any = { evaluationId: evalId };
      const bioFields = ["bodyFatPct","bodyFatKg","leanMass","muscleMass","musclePct","waterPct","waterKg","boneMass","proteinPct","subcutaneousFat","visceralFat","metabolicAge","basalMetabolism","bmi","bodyScore"];
      for (const f of bioFields) {
        const val = b[f];
        if (val !== undefined && val !== null && val !== "") {
          bioInsert[f] = Number(val);
        }
      }
      await db.insert(bioTable).values(bioInsert);
    }
    // Insert calculated results
    if (body.calculatedResults) {
      const c = body.calculatedResults;
      const calcInsert: any = { evaluationId: evalId };
      
      if (c.bmi !== undefined && c.bmi !== null) calcInsert.bmi = Number(c.bmi);
      if (c.bmiClassification?.label) calcInsert.bmiClassification = c.bmiClassification.label;
      if (c.idealWeight?.min !== undefined) calcInsert.idealWeight = Number(c.idealWeight.min);
      if (c.idealWeight?.max !== undefined) calcInsert.healthyWeightMax = Number(c.idealWeight.max);
      if (c.idealWeight?.min !== undefined) calcInsert.healthyWeightMin = Number(c.idealWeight.min);
      if (c.leanBodyMass !== undefined && c.leanBodyMass !== null) calcInsert.leanBodyMass = Number(c.leanBodyMass);
      if (c.fatMass !== undefined && c.fatMass !== null) calcInsert.fatMass = Number(c.fatMass);
      if (c.waistHipRatio !== undefined && c.waistHipRatio !== null) calcInsert.waistHipRatio = Number(c.waistHipRatio);
      if (c.bodyDensity !== undefined && c.bodyDensity !== null) calcInsert.bodyDensity = Number(c.bodyDensity);
      if (c.bodyAdiposityIndex !== undefined && c.bodyAdiposityIndex !== null) calcInsert.bodyAdiposityIndex = Number(c.bodyAdiposityIndex);
      if (c.bmr !== undefined && c.bmr !== null) calcInsert.bmr = Number(c.bmr);
      if (c.dailyCalorieNeed !== undefined && c.dailyCalorieNeed !== null) calcInsert.dailyCalorieNeed = Number(c.dailyCalorieNeed);
      if (c.tee !== undefined && c.tee !== null) calcInsert.tee = Number(c.tee);
      if (c.metabolicAgeClass?.label) calcInsert.metabolicAgeClass = c.metabolicAgeClass.label;
      if (c.visceralFatClass?.label) calcInsert.visceralFatClass = c.visceralFatClass.label;
      if (c.muscleClass?.label) calcInsert.muscleClass = c.muscleClass.label;
      if (c.waterClass?.label) calcInsert.waterClass = c.waterClass.label;
      if (c.proteinClass?.label) calcInsert.proteinClass = c.proteinClass.label;
      if (c.interpretation) calcInsert.interpretation = c.interpretation;
      
      await db.insert(calcTable).values(calcInsert);
    }
    return NextResponse.json({ success: true, evaluationId: evalId });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Erro ao salvar avaliação:", msg);
    return NextResponse.json({ success: false, error: "Erro ao salvar avaliação", detail: msg }, { status: 500 });
  }
}