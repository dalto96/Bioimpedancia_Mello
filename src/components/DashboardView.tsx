"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingDown, TrendingUp, Activity, Users } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from "recharts";
import type { AppContext } from "@/app/page";

interface EvalRow {
  id: number; patientName: string; evaluationDate: string;
  weight: number; bodyFatPct: number; musclePct: number; waterPct: number;
  bmi: number; visceralFat: number;
}

const COLORS = ["#2357A6", "#EF385A", "#10B981", "#F59E0B", "#8B5CF6", "#06B6D4"];

export default function DashboardView({ ctx }: { ctx: AppContext }) {
  const [evaluations, setEvaluations] = useState<EvalRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/evaluations/dashboard").then(r => r.json()).then(d => {
      setEvaluations(d.evaluations || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [ctx.refreshKey]);

  const weightData = evaluations.slice(-10).map((e, i) => ({ name: e.evaluationDate ? new Date(e.evaluationDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) : `#${i+1}`, value: e.weight || 0 }));
  const fatData = evaluations.slice(-10).map((e, i) => ({ name: e.evaluationDate ? new Date(e.evaluationDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) : `#${i+1}`, value: e.bodyFatPct || 0 }));
  const muscleData = evaluations.slice(-10).map((e, i) => ({ name: e.evaluationDate ? new Date(e.evaluationDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) : `#${i+1}`, value: e.musclePct || 0 }));
  const bmiData = evaluations.slice(-10).map((e, i) => ({ name: e.evaluationDate ? new Date(e.evaluationDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }) : `#${i+1}`, value: e.bmi || 0 }));

  const avgFat = evaluations.length ? (evaluations.reduce((s, e) => s + (e.bodyFatPct || 0), 0) / evaluations.length).toFixed(1) : "0";
  const avgMuscle = evaluations.length ? (evaluations.reduce((s, e) => s + (e.musclePct || 0), 0) / evaluations.length).toFixed(1) : "0";
  const avgBMI = evaluations.length ? (evaluations.reduce((s, e) => s + (e.bmi || 0), 0) / evaluations.length).toFixed(1) : "0";
  const avgWater = evaluations.length ? (evaluations.reduce((s, e) => s + (e.waterPct || 0), 0) / evaluations.length).toFixed(1) : "0";

  const compositionData = [
    { name: "Gordura", value: parseFloat(avgFat) || 20, fill: "#EF385A" },
    { name: "Músculo", value: parseFloat(avgMuscle) || 40, fill: "#2357A6" },
    { name: "Água", value: parseFloat(avgWater) || 30, fill: "#06B6D4" },
    { name: "Outro", value: Math.max(0, 100 - (parseFloat(avgFat) || 20) - (parseFloat(avgMuscle) || 40) - (parseFloat(avgWater) || 30)), fill: "#94A3B8" },
  ];

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}>
        <div style={{ width: 40, height: 40, border: "4px solid #2357A6", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
        <BarChart3 size={22} style={{ color: "#2357A6" }} /> Dashboard - Análise de Dados
      </h2>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Média IMC", value: avgBMI, unit: "kg/m²", icon: Activity, color: "#2357A6" },
          { label: "Média Gordura", value: avgFat, unit: "%", icon: TrendingUp, color: "#EF385A" },
          { label: "Média Músculo", value: avgMuscle, unit: "%", icon: TrendingDown, color: "#10B981" },
          { label: "Média Água", value: avgWater, unit: "%", icon: Users, color: "#06B6D4" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="hefarma-card" style={{ padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={20} style={{ color: s.color }} />
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "var(--hefarma-text)" }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "var(--hefarma-text-light)", textTransform: "uppercase" }}>{s.label} ({s.unit})</div>
              </div>
            </div>
          );
        })}
      </div>

      {evaluations.length === 0 ? (
        <div className="hefarma-card" style={{ padding: 60, textAlign: "center" }}>
          <BarChart3 size={48} style={{ color: "var(--hefarma-text-light)", marginBottom: 12, opacity: 0.3 }} />
          <p style={{ color: "var(--hefarma-text-light)", fontSize: 15, fontWeight: 600 }}>Nenhuma avaliação registrada</p>
          <p style={{ color: "var(--hefarma-text-light)", fontSize: 13, marginTop: 4 }}>Realize avaliações para visualizar dados no dashboard</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Weight Evolution */}
          <div className="hefarma-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 12 }}>Evolução do Peso (kg)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--hefarma-border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--hefarma-text-light)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--hefarma-text-light)" }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#2357A6" strokeWidth={2} dot={{ r: 4, fill: "#2357A6" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Body Fat Evolution */}
          <div className="hefarma-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 12 }}>Evolução da Gordura Corporal (%)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={fatData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--hefarma-border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--hefarma-text-light)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--hefarma-text-light)" }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#EF385A" strokeWidth={2} dot={{ r: 4, fill: "#EF385A" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Muscle Evolution */}
          <div className="hefarma-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 12 }}>Evolução Muscular (%)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={muscleData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--hefarma-border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--hefarma-text-light)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--hefarma-text-light)" }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} dot={{ r: 4, fill: "#10B981" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* BMI Evolution */}
          <div className="hefarma-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 12 }}>Evolução do IMC (kg/m²)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={bmiData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--hefarma-border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--hefarma-text-light)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--hefarma-text-light)" }} />
                <Tooltip />
                <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Body Composition Pie */}
          <div className="hefarma-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 12 }}>Composição Corporal Média</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={compositionData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value.toFixed(0)}%`}>
                  {compositionData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Recent Evaluations */}
          <div className="hefarma-card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 12 }}>Avaliações Recentes</h3>
            <div style={{ maxHeight: 220, overflow: "auto" }}>
              {evaluations.slice(-6).reverse().map((e, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 5 ? "1px solid var(--hefarma-border)" : "none" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--hefarma-text)" }}>{e.patientName}</div>
                    <div style={{ fontSize: 11, color: "var(--hefarma-text-light)" }}>{e.evaluationDate ? new Date(e.evaluationDate).toLocaleDateString("pt-BR") : "-"}</div>
                  </div>
                  <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--hefarma-text-light)" }}>
                    <span>{e.weight?.toFixed(1) || 0} kg</span>
                    <span>{e.bmi?.toFixed(1) || 0} IMC</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
