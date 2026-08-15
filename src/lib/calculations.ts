/**
 * HEFARMA Body Analysis System
 * Cálculos Automáticos de Bioimpedância e Composição Corporal
 * Todos os cálculos seguem padrões OMS/WHO e literatura científica
 */

// ==================== BMI & CLASSIFICATION ====================
export function calculateBMI(weight: number, heightCm: number): number {
  if (!weight || !heightCm) return 0;
  const heightM = heightCm / 100;
  return weight / (heightM * heightM);
}

export function classifyBMI(bmi: number): { label: string; color: string; risk: string } {
  if (bmi < 18.5) return { label: "Abaixo do Peso", color: "#F59E0B", risk: "Atenção" };
  if (bmi < 25) return { label: "Peso Normal", color: "#10B981", risk: "Excelente" };
  if (bmi < 30) return { label: "Sobrepeso", color: "#F59E0B", risk: "Atenção" };
  if (bmi < 35) return { label: "Obesidade Grau I", color: "#F97316", risk: "Moderado" };
  if (bmi < 40) return { label: "Obesidade Grau II", color: "#EF4444", risk: "Alto" };
  return { label: "Obesidade Grau III", color: "#991B1B", risk: "Crítico" };
}

// ==================== IDEAL WEIGHT ====================
export function calculateIdealWeight(heightCm: number, gender: string): { min: number; max: number } {
  if (!heightCm) return { min: 0, max: 0 };
  const heightM = heightCm / 100;
  return {
    min: 18.5 * heightM * heightM,
    max: 24.9 * heightM * heightM,
  };
}

// ==================== LEAN BODY MASS & FAT MASS ====================
export function calculateLeanBodyMass(weight: number, bodyFatPct: number): number {
  if (!weight || !bodyFatPct) return 0;
  return weight * (1 - bodyFatPct / 100);
}

export function calculateFatMass(weight: number, bodyFatPct: number): number {
  if (!weight || !bodyFatPct) return 0;
  return weight * (bodyFatPct / 100);
}

// ==================== WAIST-HIP RATIO ====================
export function calculateWaistHipRatio(waist: number, hip: number): number {
  if (!waist || !hip) return 0;
  return waist / hip;
}

export function classifyWaistHipRatio(ratio: number, gender: string): { label: string; color: string } {
  if (gender === "Feminino") {
    if (ratio < 0.80) return { label: "Baixo Risco", color: "#10B981" };
    if (ratio < 0.85) return { label: "Risco Moderado", color: "#F59E0B" };
    return { label: "Alto Risco", color: "#EF4444" };
  }
  if (ratio < 0.95) return { label: "Baixo Risco", color: "#10B981" };
  if (ratio < 1.0) return { label: "Risco Moderado", color: "#F59E0B" };
  return { label: "Alto Risco", color: "#EF4444" };
}

// ==================== BODY DENSITY (Siri Equation) ====================
export function calculateBodyDensity(bodyFatPct: number): number {
  if (!bodyFatPct) return 0;
  return (4.95 / (bodyFatPct / 100 + 4.95)) * 1;
}

// ==================== BODY ADIPOOSITY INDEX (BAI) ====================
export function calculateBAI(hip: number, heightCm: number): number {
  if (!hip || !heightCm) return 0;
  const hipM = hip / 100;
  const heightM = heightCm / 100;
  return (hipM / (heightM * Math.sqrt(heightM))) - 18;
}

// ==================== BASAL METABOLIC RATE (Harris-Benedict) ====================
export function calculateBMR(weight: number, heightCm: number, age: number, gender: string): number {
  if (!weight || !heightCm || !age) return 0;
  if (gender === "Feminino") {
    return 655.1 + (9.563 * weight) + (1.850 * heightCm) - (4.676 * age);
  }
  return 66.5 + (13.75 * weight) + (5.003 * heightCm) - (6.755 * age);
}

// ==================== DAILY CALORIE NEED & TEE ====================
export function calculateTEE(bmr: number, activityLevel: string): number {
  const multipliers: Record<string, number> = {
    "Sedentário": 1.2,
    "Levemente Ativo": 1.375,
    "Moderadamente Ativo": 1.55,
    "Muito Ativo": 1.725,
    "Extremamente Ativo": 1.9,
  };
  return bmr * (multipliers[activityLevel] || 1.375);
}

// ==================== METABOLIC AGE CLASSIFICATION ====================
export function classifyMetabolicAge(metabolicAge: number, realAge: number): { label: string; color: string } {
  const diff = metabolicAge - realAge;
  if (diff <= -10) return { label: "Excelente", color: "#10B981" };
  if (diff <= 0) return { label: "Bom", color: "#10B981" };
  if (diff <= 5) return { label: "Atenção", color: "#F59E0B" };
  if (diff <= 10) return { label: "Moderado", color: "#F97316" };
  return { label: "Crítico", color: "#EF4444" };
}

// ==================== VISCERAL FAT CLASSIFICATION ====================
export function classifyVisceralFat(visceralFat: number): { label: string; color: string } {
  if (visceralFat <= 9) return { label: "Normal", color: "#10B981" };
  if (visceralFat <= 14) return { label: "Atenção", color: "#F59E0B" };
  return { label: "Alto Risco", color: "#EF4444" };
}

// ==================== MUSCLE CLASSIFICATION ====================
export function classifyMuscle(musclePct: number, gender: string): { label: string; color: string } {
  if (gender === "Feminino") {
    if (musclePct >= 40) return { label: "Excelente", color: "#10B981" };
    if (musclePct >= 35) return { label: "Bom", color: "#10B981" };
    if (musclePct >= 30) return { label: "Normal", color: "#F59E0B" };
    return { label: "Baixo", color: "#EF4444" };
  }
  if (musclePct >= 50) return { label: "Excelente", color: "#10B981" };
  if (musclePct >= 45) return { label: "Bom", color: "#10B981" };
  if (musclePct >= 40) return { label: "Normal", color: "#F59E0B" };
  return { label: "Baixo", color: "#EF4444" };
}

// ==================== WATER CLASSIFICATION ====================
export function classifyWater(waterPct: number, gender: string): { label: string; color: string } {
  if (gender === "Feminino") {
    if (waterPct >= 50) return { label: "Excelente", color: "#10B981" };
    if (waterPct >= 45) return { label: "Normal", color: "#10B981" };
    if (waterPct >= 40) return { label: "Atenção", color: "#F59E0B" };
    return { label: "Baixo", color: "#EF4444" };
  }
  if (waterPct >= 60) return { label: "Excelente", color: "#10B981" };
  if (waterPct >= 55) return { label: "Normal", color: "#10B981" };
  if (waterPct >= 50) return { label: "Atenção", color: "#F59E0B" };
  return { label: "Baixo", color: "#EF4444" };
}

// ==================== PROTEIN CLASSIFICATION ====================
export function classifyProtein(proteinPct: number): { label: string; color: string } {
  if (proteinPct >= 20) return { label: "Excelente", color: "#10B981" };
  if (proteinPct >= 16) return { label: "Normal", color: "#10B981" };
  if (proteinPct >= 14) return { label: "Atenção", color: "#F59E0B" };
  return { label: "Baixo", color: "#EF4444" };
}

// ==================== BODY FAT CLASSIFICATION ====================
export function classifyBodyFat(bodyFatPct: number, gender: string, age: number): { label: string; color: string } {
  if (gender === "Feminino") {
    if (age <= 39) {
      if (bodyFatPct <= 21) return { label: "Essencial/Atleta", color: "#10B981" };
      if (bodyFatPct <= 33) return { label: "Saudável", color: "#10B981" };
      if (bodyFatPct <= 39) return { label: "Sobrepeso", color: "#F59E0B" };
      return { label: "Obesidade", color: "#EF4444" };
    }
    if (bodyFatPct <= 23) return { label: "Essencial/Atleta", color: "#10B981" };
    if (bodyFatPct <= 35) return { label: "Saudável", color: "#10B981" };
    if (bodyFatPct <= 40) return { label: "Sobrepeso", color: "#F59E0B" };
    return { label: "Obesidade", color: "#EF4444" };
  }
  if (age <= 39) {
    if (bodyFatPct <= 8) return { label: "Essencial/Atleta", color: "#10B981" };
    if (bodyFatPct <= 20) return { label: "Saudável", color: "#10B981" };
    if (bodyFatPct <= 25) return { label: "Sobrepeso", color: "#F59E0B" };
    return { label: "Obesidade", color: "#EF4444" };
  }
  if (bodyFatPct <= 11) return { label: "Essencial/Atleta", color: "#10B981" };
  if (bodyFatPct <= 22) return { label: "Saudável", color: "#10B981" };
  if (bodyFatPct <= 27) return { label: "Sobrepeso", color: "#F59E0B" };
  return { label: "Obesidade", color: "#EF4444" };
}

// ==================== COMPREHENSIVE CALCULATION ====================
export interface EvaluationInput {
  weight: number;
  heightCm: number;
  age: number;
  gender: string;
  waist?: number;
  hip?: number;
  bodyFatPct?: number;
  musclePct?: number;
  waterPct?: number;
  proteinPct?: number;
  visceralFat?: number;
  metabolicAge?: number;
  basalMetabolism?: number;
  activityLevel?: string;
}

export interface CalculatedOutput {
  bmi: number;
  bmiClassification: { label: string; color: string; risk: string };
  idealWeight: { min: number; max: number };
  leanBodyMass: number;
  fatMass: number;
  bodyFatClass: { label: string; color: string };
  waistHipRatio: number;
  waistHipClass: { label: string; color: string };
  bodyDensity: number;
  bodyAdiposityIndex: number;
  bmr: number;
  tee: number;
  dailyCalorieNeed: number;
  metabolicAgeClass: { label: string; color: string };
  visceralFatClass: { label: string; color: string };
  muscleClass: { label: string; color: string };
  waterClass: { label: string; color: string };
  proteinClass: { label: string; color: string };
  interpretation: string;
}

export function calculateAll(input: EvaluationInput): CalculatedOutput {
  const bmi = calculateBMI(input.weight, input.heightCm);
  const bmiClassification = classifyBMI(bmi);
  const idealWeight = calculateIdealWeight(input.heightCm, input.gender);
  const leanBodyMass = calculateLeanBodyMass(input.weight, input.bodyFatPct || 0);
  const fatMass = calculateFatMass(input.weight, input.bodyFatPct || 0);
  const bodyFatClass = classifyBodyFat(input.bodyFatPct || 0, input.gender, input.age);
  const waistHipRatio = calculateWaistHipRatio(input.waist || 0, input.hip || 0);
  const waistHipClass = classifyWaistHipRatio(waistHipRatio, input.gender);
  const bodyDensity = calculateBodyDensity(input.bodyFatPct || 0);
  const bodyAdiposityIndex = calculateBAI(input.hip || 0, input.heightCm);
  const bmr = calculateBMR(input.weight, input.heightCm, input.age, input.gender);
  const tee = calculateTEE(bmr, input.activityLevel || "Levemente Ativo");

  const metabolicAgeClass = classifyMetabolicAge(input.metabolicAge || input.age, input.age);
  const visceralFatClass = classifyVisceralFat(input.visceralFat || 0);
  const muscleClass = classifyMuscle(input.musclePct || 0, input.gender);
  const waterClass = classifyWater(input.waterPct || 0, input.gender);
  const proteinClass = classifyProtein(input.proteinPct || 0);

  const interpretation = generateInterpretation({
    bmi,
    bmiClassification,
    bodyFatPct: input.bodyFatPct || 0,
    bodyFatClass,
    visceralFat: input.visceralFat || 0,
    visceralFatClass,
    musclePct: input.musclePct || 0,
    muscleClass,
    waterPct: input.waterPct || 0,
    waterClass,
    waistHipRatio,
    waistHipClass,
    metabolicAge: input.metabolicAge || input.age,
    metabolicAgeClass,
    gender: input.gender,
    age: input.age,
  });

  return {
    bmi,
    bmiClassification,
    idealWeight,
    leanBodyMass,
    fatMass,
    bodyFatClass,
    waistHipRatio,
    waistHipClass,
    bodyDensity,
    bodyAdiposityIndex,
    bmr,
    tee,
    dailyCalorieNeed: tee,
    metabolicAgeClass,
    visceralFatClass,
    muscleClass,
    waterClass,
    proteinClass,
    interpretation,
  };
}

// ==================== AUTOMATIC INTERPRETATION ====================
function generateInterpretation(data: {
  bmi: number;
  bmiClassification: { label: string; risk: string };
  bodyFatPct: number;
  bodyFatClass: { label: string };
  visceralFat: number;
  visceralFatClass: { label: string };
  musclePct: number;
  muscleClass: { label: string };
  waterPct: number;
  waterClass: { label: string };
  waistHipRatio: number;
  waistHipClass: { label: string };
  metabolicAge: number;
  metabolicAgeClass: { label: string };
  gender: string;
  age: number;
}): string {
  const parts: string[] = [];

  // BMI interpretation
  if (data.bmi < 18.5) {
    parts.push(`O paciente apresenta índice de massa corporal (IMC) de ${data.bmi.toFixed(1)} kg/m², classificado como abaixo do peso. É recomendado acompanhamento nutricional para ganho de peso saudável.`);
  } else if (data.bmi < 25) {
    parts.push(`O paciente apresenta IMC de ${data.bmi.toFixed(1)} kg/m², dentro da faixa considerada saudável pela OMS.`);
  } else if (data.bmi < 30) {
    parts.push(`O paciente apresenta sobrepeso com IMC de ${data.bmi.toFixed(1)} kg/m², segundo classificação da OMS. Recomenda-se acompanhamento nutricional e prática regular de atividade física.`);
  } else {
    parts.push(`O paciente apresenta obesidade com IMC de ${data.bmi.toFixed(1)} kg/m², requerendo acompanhamento multidisciplinar urgente incluindo nutricionista, educador físico e médico.`);
  }

  // Body fat
  if (data.bodyFatPct > 0) {
    parts.push(`O percentual de gordura corporal está ${data.bodyFatClass.label.toLowerCase()}, com valor de ${data.bodyFatPct.toFixed(1)}%.`);
  }

  // Visceral fat
  if (data.visceralFat > 0) {
    if (data.visceralFatClass.label === "Alto Risco") {
      parts.push(`A gordura visceral está em nível de alto risco (${data.visceralFat.toFixed(0)}), indicando maior propensão a doenças metabólicas. Intervenção imediata é recomendada.`);
    } else if (data.visceralFatClass.label === "Atenção") {
      parts.push(`A gordura visceral requer atenção (${data.visceralFat.toFixed(0)}), estando acima do ideal.`);
    } else {
      parts.push(`A gordura visceral está dentro dos parâmetros normais (${data.visceralFat.toFixed(0)}).`);
    }
  }

  // Muscle
  if (data.musclePct > 0) {
    parts.push(`A massa muscular está classificada como ${data.muscleClass.label.toLowerCase()} (${data.musclePct.toFixed(1)}%).`);
    if (data.muscleClass.label === "Baixo") {
      parts.push("Recomenda-se treinamento de resistência para aumento de massa muscular.");
    }
  }

  // Water
  if (data.waterPct > 0) {
    parts.push(`A hidratação corporal está ${data.waterClass.label.toLowerCase()} (${data.waterPct.toFixed(1)}%).`);
    if (data.waterClass.label === "Baixo") {
      parts.push("É fundamental aumentar a ingestão de líquidos diariamente.");
    }
  }

  // Waist-hip ratio
  if (data.waistHipRatio > 0) {
    parts.push(`A relação cintura-quadril é ${data.waistHipRatio.toFixed(2)}, classificada como ${data.waistHipClass.label.toLowerCase()}.`);
  }

  // Metabolic age
  if (data.metabolicAge > 0) {
    parts.push(`A idade metabólica está classificada como ${data.metabolicAgeClass.label.toLowerCase()} (${data.metabolicAge.toFixed(0)} anos).`);
  }

  // Final recommendation
  parts.push("Recomenda-se repetir a avaliação em 60 dias para acompanhamento da evolução. O acompanhamento nutricional associado à prática regular de atividade física é fundamental para a melhoria dos indicadores.");

  return parts.join(" ");
}

// ==================== COLOR INDICATOR HELPER ====================
export function getStatusColor(label: string): string {
  const lower = label.toLowerCase();
  if (lower.includes("excelente") || lower.includes("normal") || lower.includes("saudável") || lower.includes("bom") || lower.includes("baixo risco")) return "#10B981";
  if (lower.includes("atenção") || lower.includes("sobrepeso")) return "#F59E0B";
  if (lower.includes("moderado") || lower.includes("risco moderado")) return "#F97316";
  if (lower.includes("alto") || lower.includes("obesidade") || lower.includes("crítico")) return "#EF4444";
  if (lower.includes("crítico")) return "#991B1B";
  return "#6B7280";
}
