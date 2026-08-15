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
    const { sql } = await import("drizzle-orm");
    const body = await request.json();
    // Use raw SQL for the insert to avoid date type issues with Neon
    const todayStr = new Date().toISOString().split("T")[0];
    
    const insertResult = await db.execute(sql`
      INSERT INTO evaluations (patient_id, user_id, evaluation_date, notes, created_at)
      VALUES (${body.patientId}, ${body.userId || 1}, ${todayStr}::date, ${body.notes || null}, NOW())
      RETURNING id
    `);
    
    const evalId = Number((insertResult.rows[0] as any).id);
    if (body.measurements) {
      const m = body.measurements;
      await db.execute(sql`
        INSERT INTO body_measurements (evaluation_id, height, weight, waist, hip, chest, neck,
          left_arm, right_arm, left_forearm, right_forearm, left_thigh, right_thigh,
          left_calf, right_calf, shoulders, abdomen)
        VALUES (${evalId}, ${m.height || null}, ${m.weight || null}, ${m.waist || null}, ${m.hip || null},
          ${m.chest || null}, ${m.neck || null}, ${m.leftArm || null}, ${m.rightArm || null},
          ${m.leftForearm || null}, ${m.rightForearm || null}, ${m.leftThigh || null}, ${m.rightThigh || null},
          ${m.leftCalf || null}, ${m.rightCalf || null}, ${m.shoulders || null}, ${m.abdomen || null})
      `);
    }
    if (body.bioimpedance) {
      const b = body.bioimpedance;
      await db.execute(sql`
        INSERT INTO bioimpedance (evaluation_id, body_fat_pct, body_fat_kg, lean_mass, muscle_mass, muscle_pct,
          water_pct, water_kg, bone_mass, protein_pct, subcutaneous_fat, visceral_fat,
          metabolic_age, basal_metabolism, bmi, body_score)
        VALUES (${evalId}, ${b.bodyFatPct || null}, ${b.bodyFatKg || null}, ${b.leanMass || null},
          ${b.muscleMass || null}, ${b.musclePct || null}, ${b.waterPct || null}, ${b.waterKg || null},
          ${b.boneMass || null}, ${b.proteinPct || null}, ${b.subcutaneousFat || null}, ${b.visceralFat || null},
          ${b.metabolicAge || null}, ${b.basalMetabolism || null}, ${b.bmi || null}, ${b.bodyScore || null})
      `);
    }
    if (body.calculatedResults) {
      const c = body.calculatedResults;
      await db.execute(sql`
        INSERT INTO calculated_results (evaluation_id, bmi, bmi_classification, ideal_weight,
          lean_body_mass, fat_mass, body_fat_pct_calc, waist_hip_ratio, body_density,
          body_adiposity_index, bmr, daily_calorie_need, tee, healthy_weight_min, healthy_weight_max,
          metabolic_age_class, visceral_fat_class, muscle_class, water_class, protein_class, interpretation)
        VALUES (${evalId}, ${c.bmi || null}, ${c.bmiClassification?.label || null}, ${c.idealWeight?.min || null},
          ${c.leanBodyMass || null}, ${c.fatMass || null}, ${c.bodyFatPctCalc || null},
          ${c.waistHipRatio || null}, ${c.bodyDensity || null}, ${c.bodyAdiposityIndex || null},
          ${c.bmr || null}, ${c.dailyCalorieNeed || null}, ${c.tee || null},
          ${c.idealWeight?.min || null}, ${c.idealWeight?.max || null},
          ${c.metabolicAgeClass?.label || null}, ${c.visceralFatClass?.label || null},
          ${c.muscleClass?.label || null}, ${c.waterClass?.label || null},
          ${c.proteinClass?.label || null}, ${c.interpretation || null})
      `);
    }
    return NextResponse.json({ success: true, evaluationId: evalId });
  } catch (error) {
    console.error("Save evaluation error:", error);
    return NextResponse.json({ success: false, error: "Erro ao salvar avaliação" }, { status: 500 });
  }
}