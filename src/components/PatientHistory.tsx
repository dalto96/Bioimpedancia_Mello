"use client";

import { useState, useEffect } from "react";
import { Search, FileText, Eye, ChevronRight, ClipboardList, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { AppContext } from "@/app/page";

interface EvalSummary {
  id: number; evaluationDate: string; patientName: string;
  weight: number; bodyFatPct: number; musclePct: number; bmi: number;
  visceralFat: number; waterPct: number;
}

export default function PatientHistory({ ctx }: { ctx: AppContext }) {
  const [evaluations, setEvaluations] = useState<EvalSummary[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedEval, setSelectedEval] = useState<EvalSummary | null>(null);

  useEffect(() => {
    const url = ctx.selectedPatientId ? `/api/evaluations?patientId=${ctx.selectedPatientId}` : "/api/evaluations";
    fetch(url).then(r => r.json()).then(d => {
      setEvaluations(d.evaluations || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [ctx.selectedPatientId, ctx.refreshKey]);

  const filtered = evaluations.filter(e =>
    e.patientName.toLowerCase().includes(search.toLowerCase()) ||
    e.evaluationDate.includes(search)
  );

  const chartData = filtered.slice(-10).map(e => ({
    date: new Date(e.evaluationDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    peso: e.weight || 0,
    gordura: e.bodyFatPct || 0,
    musculo: e.musclePct || 0,
    imc: e.bmi || 0,
  }));

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--hefarma-text)", display: "flex", alignItems: "center", gap: 8 }}>
          <ClipboardList size={22} style={{ color: "#2357A6" }} /> Histórico de Avaliações
        </h2>
        <div style={{ position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: 11, color: "var(--hefarma-text-light)" }} />
          <input className="hefarma-input" style={{ paddingLeft: 36, width: 280 }} value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome ou data..." />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ width: 32, height: 32, border: "3px solid #2357A6", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="hefarma-card" style={{ padding: 60, textAlign: "center" }}>
          <ClipboardList size={48} style={{ color: "var(--hefarma-text-light)", marginBottom: 12, opacity: 0.3 }} />
          <p style={{ color: "var(--hefarma-text-light)", fontWeight: 600 }}>Nenhuma avaliação encontrada</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: selectedEval ? "1fr 1fr" : "1fr", gap: 16 }}>
          {/* Evaluations List */}
          <div className="hefarma-card" style={{ overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--hefarma-card)" }}>
                  {["Data", "Paciente", "Peso", "IMC", "Gordura %", "Músculo %", ""].map(h => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--hefarma-text-light)", textTransform: "uppercase", borderBottom: "1px solid var(--hefarma-border)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.id} onClick={() => setSelectedEval(e)} style={{ cursor: "pointer", transition: "background 0.15s" }} onMouseEnter={ev => ev.currentTarget.style.background = "rgba(35,87,166,0.03)"} onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid var(--hefarma-border)", fontSize: 13, color: "var(--hefarma-text)" }}>
                      {e.evaluationDate ? new Date(e.evaluationDate).toLocaleDateString("pt-BR") : "-"}
                    </td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid var(--hefarma-border)", fontWeight: 600, fontSize: 13, color: "var(--hefarma-text)" }}>{e.patientName}</td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid var(--hefarma-border)", fontSize: 13, color: "var(--hefarma-text-light)" }}>{e.weight?.toFixed(1) || "-"} kg</td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid var(--hefarma-border)", fontSize: 13, color: "var(--hefarma-text-light)" }}>{e.bmi?.toFixed(1) || "-"}</td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid var(--hefarma-border)", fontSize: 13, color: "#EF385A" }}>{e.bodyFatPct?.toFixed(1) || "-"}%</td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid var(--hefarma-border)", fontSize: 13, color: "#10B981" }}>{e.musclePct?.toFixed(1) || "-"}%</td>
                    <td style={{ padding: "10px 14px", borderBottom: "1px solid var(--hefarma-border)" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={ev => { ev.stopPropagation(); ctx.setSelectedEvaluationId(e.id); ctx.setCurrentView("report"); }} style={{ background: "rgba(35,87,166,0.1)", border: "none", borderRadius: 6, padding: "4px 6px", cursor: "pointer", color: "#2357A6" }} title="Relatório">
                          <FileText size={13} />
                        </button>
                        <button style={{ background: "rgba(16,185,129,0.1)", border: "none", borderRadius: 6, padding: "4px 6px", cursor: "pointer", color: "#10B981" }} title="Detalhes">
                          <Eye size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Comparison Chart */}
          {selectedEval && (
            <div className="hefarma-card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <BarChart3 size={16} style={{ color: "#2357A6" }} /> Evolução - {selectedEval.patientName}
              </h3>
              <div style={{ marginBottom: 16 }}>
                <h4 style={{ fontSize: 12, fontWeight: 600, color: "var(--hefarma-text-light)", marginBottom: 8 }}>Peso (kg)</h4>
                <ResponsiveContainer width="100%" height={140}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--hefarma-border)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="peso" stroke="#2357A6" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div style={{ marginBottom: 16 }}>
                <h4 style={{ fontSize: 12, fontWeight: 600, color: "var(--hefarma-text-light)", marginBottom: 8 }}>Gordura e Músculo (%)</h4>
                <ResponsiveContainer width="100%" height={140}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--hefarma-border)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="gordura" stroke="#EF385A" strokeWidth={2} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="musculo" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <button onClick={() => { ctx.setSelectedEvaluationId(selectedEval.id); ctx.setCurrentView("report"); }} className="btn-primary" style={{ width: "100%", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <FileText size={14} /> Gerar Relatório
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
