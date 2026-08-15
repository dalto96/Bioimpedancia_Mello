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
      return NextResponse.json({ success: false, error: "Banco de dados não conectado. Configure DATABASE_URL para salvar." }, { status: 400 });
    }
    
    const { getDb } = await import("@/db");
    const db = await getDb();
    if (!db) return NextResponse.json({ success: false, error: "Banco de dados não conectado." }, { status: 400 });
    
    const { evaluations, bodyMeasurements, bioimpedance, calculatedResults } = await import("@/db/schema");
    const body = await request.json();

    const evalResult = await db.insert(evaluations).values({
      patientId: body.patientId, userId: body.userId || 1,
      evaluationDate: new Date().toISOString().split("T")[0], notes: body.notes || null,
    }).returning();
    const evalId = evalResult[0].id;

    if (body.measurements) {
      const m = body.measurements;
      await db.insert(bodyMeasurements).values({
        evaluationId: evalId, height: m.height || null, weight: m.weight || null,
        waist: m.waist || null, hip: m.hip || null, chest: m.chest || null,
        neck: m.neck || null, leftArm: m.leftArm || null, rightArm: m.rightArm || null,
        leftForearm: m.leftForearm || null, rightForearm: m.rightForearm || null,
        leftThigh: m.leftThigh || null, rightThigh: m.rightThigh || null,
        leftCalf: m.leftCalf || null, rightCalf: m.rightCalf || null,
        shoulders: m.shoulders || null, abdomen: m.abdomen || null,
      });
    }

    if (body.bioimpedance) {
      const b = body.bioimpedance;
      await db.insert(bioimpedance).values({
        evaluationId: evalId, bodyFatPct: b.bodyFatPct || null,
        bodyFatKg: b.bodyFatKg || null, leanMass: b.leanMass || null,
        muscleMass: b.muscleMass || null, musclePct: b.musclePct || null,
        waterPct: b.waterPct || null, waterKg: b.waterKg || null,
        boneMass: b.boneMass || null, proteinPct: b.proteinPct || null,
        subcutaneousFat: b.subcutaneousFat || null, visceralFat: b.visceralFat || null,
        metabolicAge: b.metabolicAge || null, basalMetabolism: b.basalMetabolism || null,
        bmi: b.bmi || null, bodyScore: b.bodyScore || null,
      });
    }

    if (body.calculatedResults) {
      const c = body.calculatedResults;
      await db.insert(calculatedResults).values({
        evaluationId: evalId, bmi: c.bmi || null,
        bmiClassification: c.bmiClassification?.label || null,
        idealWeight: c.idealWeight?.min || null,
        leanBodyMass: c.leanBodyMass || null, fatMass: c.fatMass || null,
        bodyFatPctCalc: c.bodyFatPctCalc || null,
        waistHipRatio: c.waistHipRatio || null, bodyDensity: c.bodyDensity || null,
        bodyAdiposityIndex: c.bodyAdiposityIndex || null,
        bmr: c.bmr || null, dailyCalorieNeed: c.dailyCalorieNeed || null,
        tee: c.tee || null, healthyWeightMin: c.idealWeight?.min || null,
        healthyWeightMax: c.idealWeight?.max || null,
        metabolicAgeClass: c.metabolicAgeClass?.label || null,
        visceralFatClass: c.visceralFatClass?.label || null,
        muscleClass: c.muscleClass?.label || null,
        waterClass: c.waterClass?.label || null,
        proteinClass: c.proteinClass?.label || null,
        interpretation: c.interpretation || null,
      });
    }

    return NextResponse.json({ success: true, evaluationId: evalId });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro ao salvar avaliação" }, { status: 500 });
  }
}
