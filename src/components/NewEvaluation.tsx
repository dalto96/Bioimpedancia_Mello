"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, ArrowLeft, Activity, Ruler, Droplets, Flame, Heart, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";
import { calculateAll, type EvaluationInput, type CalculatedOutput } from "@/lib/calculations";
import type { AppContext } from "@/app/page";

interface Patient {
  id: number; fullName: string; birthDate: string; gender: string; cpf: string;
}

export default function NewEvaluation({ ctx }: { ctx: AppContext }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<number>(ctx.selectedPatientId || 0);
  const [activityLevel, setActivityLevel] = useState("Levemente Ativo");

  // Body measurements
  const [measurements, setMeasurements] = useState({
    height: "", weight: "", waist: "", hip: "", chest: "", neck: "",
    leftArm: "", rightArm: "", leftForearm: "", rightForearm: "",
    leftThigh: "", rightThigh: "", leftCalf: "", rightCalf: "",
    shoulders: "", abdomen: "",
  });

  // Bioimpedance
  const [bio, setBio] = useState({
    bodyFatPct: "", bodyFatKg: "", leanMass: "", muscleMass: "", musclePct: "",
    waterPct: "", waterKg: "", boneMass: "", proteinPct: "",
    subcutaneousFat: "", visceralFat: "", metabolicAge: "",
    basalMetabolism: "", bmi: "", bodyScore: "",
  });

  const [results, setResults] = useState<CalculatedOutput | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: string; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/patients").then(r => r.json()).then(d => setPatients(d.patients || [])).catch(() => {});
  }, []);

  const updateM = (k: string, v: string) => setMeasurements(p => ({ ...p, [k]: v }));
  const updateB = (k: string, v: string) => setBio(p => ({ ...p, [k]: v }));

  const getPatient = () => patients.find(p => p.id === selectedPatient);
  const getAge = () => {
    const p = getPatient();
    if (!p?.birthDate) return 0;
    const d = new Date(p.birthDate);
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) age--;
    return age;
  };

  // Auto-calculate
  const recalculate = useCallback(() => {
    const w = parseFloat(measurements.weight) || 0;
    const h = parseFloat(measurements.height) || 0;
    if (!w || !h) { setResults(null); return; }

    const input: EvaluationInput = {
      weight: w,
      heightCm: h,
      age: getAge(),
      gender: getPatient()?.gender || "Masculino",
      waist: parseFloat(measurements.waist) || 0,
      hip: parseFloat(measurements.hip) || 0,
      bodyFatPct: parseFloat(bio.bodyFatPct) || 0,
      musclePct: parseFloat(bio.musclePct) || 0,
      waterPct: parseFloat(bio.waterPct) || 0,
      proteinPct: parseFloat(bio.proteinPct) || 0,
      visceralFat: parseFloat(bio.visceralFat) || 0,
      metabolicAge: parseFloat(bio.metabolicAge) || 0,
      basalMetabolism: parseFloat(bio.basalMetabolism) || 0,
      activityLevel,
    };

    setResults(calculateAll(input));
  }, [measurements, bio, activityLevel, selectedPatient, patients]);

  useEffect(() => { recalculate(); }, [recalculate]);

  const handleSave = async () => {
    if (!selectedPatient) { setMsg({ type: "error", text: "Selecione um paciente" }); return; }
    if (!measurements.weight || !measurements.height) { setMsg({ type: "error", text: "Peso e altura são obrigatórios" }); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: selectedPatient, userId: ctx.user?.id || 1,
          measurements: { height: parseFloat(measurements.height), weight: parseFloat(measurements.weight), waist: parseFloat(measurements.waist) || null, hip: parseFloat(measurements.hip) || null, chest: parseFloat(measurements.chest) || null, neck: parseFloat(measurements.neck) || null, leftArm: parseFloat(measurements.leftArm) || null, rightArm: parseFloat(measurements.rightArm) || null, leftForearm: parseFloat(measurements.leftForearm) || null, rightForearm: parseFloat(measurements.rightForearm) || null, leftThigh: parseFloat(measurements.leftThigh) || null, rightThigh: parseFloat(measurements.rightThigh) || null, leftCalf: parseFloat(measurements.leftCalf) || null, rightCalf: parseFloat(measurements.rightCalf) || null, shoulders: parseFloat(measurements.shoulders) || null, abdomen: parseFloat(measurements.abdomen) || null },
          bioimpedance: { bodyFatPct: parseFloat(bio.bodyFatPct) || null, bodyFatKg: parseFloat(bio.bodyFatKg) || null, leanMass: parseFloat(bio.leanMass) || null, muscleMass: parseFloat(bio.muscleMass) || null, musclePct: parseFloat(bio.musclePct) || null, waterPct: parseFloat(bio.waterPct) || null, waterKg: parseFloat(bio.waterKg) || null, boneMass: parseFloat(bio.boneMass) || null, proteinPct: parseFloat(bio.proteinPct) || null, subcutaneousFat: parseFloat(bio.subcutaneousFat) || null, visceralFat: parseFloat(bio.visceralFat) || null, metabolicAge: parseFloat(bio.metabolicAge) || null, basalMetabolism: parseFloat(bio.basalMetabolism) || null, bmi: results?.bmi || null, bodyScore: parseFloat(bio.bodyScore) || null },
          calculatedResults: results,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: "success", text: "Avaliação salva com sucesso!" });
        ctx.triggerRefresh();
      } else {
        setMsg({ type: "error", text: data.error || "Erro ao salvar" });
      }
    } catch { setMsg({ type: "error", text: "Erro de conexão" }); }
    setSaving(false);
  };

  const mField = (label: string, key: string, unit: string) => (
    <div style={{ marginBottom: 8 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--hefarma-text-light)", marginBottom: 2, textTransform: "uppercase" }}>{label} ({unit})</label>
      <input className="hefarma-input" type="number" step="0.1" value={measurements[key as keyof typeof measurements]} onChange={e => updateM(key, e.target.value)} placeholder="0" style={{ padding: "8px 10px", fontSize: 13 }} />
    </div>
  );

  const bField = (label: string, key: string, unit: string) => (
    <div style={{ marginBottom: 8 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "var(--hefarma-text-light)", marginBottom: 2, textTransform: "uppercase" }}>{label} ({unit})</label>
      <input className="hefarma-input" type="number" step="0.1" value={bio[key as keyof typeof bio]} onChange={e => updateB(key, e.target.value)} placeholder="0" style={{ padding: "8px 10px", fontSize: 13 }} />
    </div>
  );

  const metricCard = (label: string, value: string, unit: string, color: string, subtitle?: string) => (
    <div style={{ background: "var(--hefarma-card)", border: "1px solid var(--hefarma-border)", borderRadius: 10, padding: 14, textAlign: "center" }}>
      <div style={{ fontSize: 10, color: "var(--hefarma-text-light)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontSize: 11, color: "var(--hefarma-text-light)" }}>{unit}</div>
      {subtitle && <div style={{ fontSize: 10, color, marginTop: 2, fontWeight: 600 }}>{subtitle}</div>}
    </div>
  );

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => ctx.setCurrentView("home")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--hefarma-text-light)" }}><ArrowLeft size={20} /></button>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--hefarma-text)" }}>Nova Avaliação</h2>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Save size={16} /> {saving ? "Salvando..." : "Salvar Avaliação"}
        </button>
      </div>

      {msg && (
        <div style={{ padding: 12, borderRadius: 10, marginBottom: 12, display: "flex", alignItems: "center", gap: 8, background: msg.type === "success" ? "rgba(16,185,129,0.1)" : "rgba(239,56,90,0.1)", border: `1px solid ${msg.type === "success" ? "rgba(16,185,129,0.3)" : "rgba(239,56,90,0.3)"}`, color: msg.type === "success" ? "#10B981" : "#EF385A", fontSize: 13 }}>
          {msg.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />} {msg.text}
        </div>
      )}

      {/* Patient Selection */}
      <div className="hefarma-card" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, alignItems: "end" }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--hefarma-text-light)", marginBottom: 4, textTransform: "uppercase" }}>Paciente *</label>
            <select className="hefarma-select" value={selectedPatient} onChange={e => setSelectedPatient(Number(e.target.value))}>
              <option value={0}>Selecione um paciente</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.fullName} - {p.cpf || "Sem CPF"}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--hefarma-text-light)", marginBottom: 4, textTransform: "uppercase" }}>Idade</label>
            <input className="hefarma-input" value={getPatient() ? `${getAge()} anos` : "-"} readOnly style={{ background: "var(--hefarma-border)" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--hefarma-text-light)", marginBottom: 4, textTransform: "uppercase" }}>Nível de Atividade</label>
            <select className="hefarma-select" value={activityLevel} onChange={e => setActivityLevel(e.target.value)}>
              <option>Sedentário</option>
              <option>Levemente Ativo</option>
              <option>Moderadamente Ativo</option>
              <option>Muito Ativo</option>
              <option>Extremamente Ativo</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Left Column - Measurements & Bio */}
        <div>
          {/* Body Measurements */}
          <div className="hefarma-card" style={{ padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <Ruler size={16} style={{ color: "#2357A6" }} /> Medidas Corporais
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {mField("Altura", "height", "cm")}
              {mField("Peso", "weight", "kg")}
              {mField("Cintura", "waist", "cm")}
              {mField("Quadril", "hip", "cm")}
              {mField("Peito", "chest", "cm")}
              {mField("Pescoço", "neck", "cm")}
              {mField("Braço Esq.", "leftArm", "cm")}
              {mField("Braço Dir.", "rightArm", "cm")}
              {mField("Antebr. Esq.", "leftForearm", "cm")}
              {mField("Antebr. Dir.", "rightForearm", "cm")}
              {mField("Coxa Esq.", "leftThigh", "cm")}
              {mField("Coxa Dir.", "rightThigh", "cm")}
              {mField("Panturr. Esq.", "leftCalf", "cm")}
              {mField("Panturr. Dir.", "rightCalf", "cm")}
              {mField("Ombros", "shoulders", "cm")}
              {mField("Abdômen", "abdomen", "cm")}
            </div>
          </div>

          {/* Bioimpedance */}
          <div className="hefarma-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <Activity size={16} style={{ color: "#EF385A" }} /> Bioimpedância
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {bField("Gordura Corporal", "bodyFatPct", "%")}
              {bField("Gordura Corporal", "bodyFatKg", "kg")}
              {bField("Massa Magra", "leanMass", "kg")}
              {bField("Massa Muscular", "muscleMass", "kg")}
              {bField("Músculo", "musclePct", "%")}
              {bField("Água Corporal", "waterPct", "%")}
              {bField("Água Corporal", "waterKg", "kg")}
              {bField("Massa Óssea", "boneMass", "kg")}
              {bField("Proteína", "proteinPct", "%")}
              {bField("Gord. Subcutânea", "subcutaneousFat", "")}
              {bField("Gord. Visceral", "visceralFat", "")}
              {bField("Idade Metabólica", "metabolicAge", "anos")}
              {bField("Metabolismo Basal", "basalMetabolism", "kcal")}
              {bField("Pontuação Corporal", "bodyScore", "")}
            </div>
          </div>
        </div>

        {/* Right Column - Results */}
        <div>
          {results ? (
            <>
              {/* Main Metrics */}
              <div className="hefarma-card" style={{ padding: 20, marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <TrendingUp size={16} style={{ color: "#10B981" }} /> Resultados Calculados
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {metricCard("IMC", results.bmi.toFixed(1), "kg/m²", results.bmiClassification.color, results.bmiClassification.label)}
                  {metricCard("Classificação IMC", results.bmiClassification.label, results.bmiClassification.risk, results.bmiClassification.color)}
                  {metricCard("Peso Ideal", `${results.idealWeight.min.toFixed(0)}-${results.idealWeight.max.toFixed(0)}`, "kg", "#2357A6")}
                  {metricCard("Massa Magra", results.leanBodyMass.toFixed(1), "kg", "#3B82F6")}
                  {metricCard("Massa Gorda", results.fatMass.toFixed(1), "kg", "#EF385A")}
                  {metricCard("R. Cintura-Quadril", results.waistHipRatio.toFixed(2), results.waistHipClass.label, results.waistHipClass.color)}
                  {metricCard("Taxa Metabólica Basal", results.bmr.toFixed(0), "kcal/dia", "#8B5CF6")}
                  {metricCard("Gasto Energético Total", results.tee.toFixed(0), "kcal/dia", "#F59E0B")}
                </div>
              </div>

              {/* Classifications */}
              <div className="hefarma-card" style={{ padding: 20, marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <Heart size={16} style={{ color: "#EF385A" }} /> Classificações
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { title: "Gordura Corporal", status: results.bodyFatClass.label, color: results.bodyFatClass.color },
                    { title: "Idade Metabólica", status: results.metabolicAgeClass.label, color: results.metabolicAgeClass.color },
                    { title: "Gordura Visceral", status: results.visceralFatClass.label, color: results.visceralFatClass.color },
                    { title: "Massa Muscular", status: results.muscleClass.label, color: results.muscleClass.color },
                    { title: "Hidratação", status: results.waterClass.label, color: results.waterClass.color },
                    { title: "Proteína", status: results.proteinClass.label, color: results.proteinClass.color },
                  ].map((c, i) => (
                    <div key={i} style={{ background: "var(--hefarma-card)", border: "1px solid var(--hefarma-border)", borderRadius: 8, padding: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: "var(--hefarma-text-light)", fontWeight: 600, textTransform: "uppercase" }}>{c.title}</span>
                      <span className="hefarma-badge" style={{ background: `${c.color}20`, color: c.color }}>{c.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Automatic Interpretation */}
              <div className="hefarma-card" style={{ padding: 20, borderLeft: "4px solid #2357A6" }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                  <Flame size={16} style={{ color: "#2357A6" }} /> Interpretação Automática
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.7, color: "var(--hefarma-text)" }}>{results.interpretation}</p>
              </div>
            </>
          ) : (
            <div className="hefarma-card" style={{ padding: 60, textAlign: "center" }}>
              <Activity size={48} style={{ color: "var(--hefarma-text-light)", marginBottom: 12, opacity: 0.3 }} />
              <p style={{ color: "var(--hefarma-text-light)", fontSize: 14, fontWeight: 600 }}>Insira peso e altura para ver os resultados</p>
              <p style={{ color: "var(--hefarma-text-light)", fontSize: 12, marginTop: 4 }}>Os cálculos serão atualizados automaticamente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
