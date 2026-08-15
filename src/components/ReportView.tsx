"use client";

import { useState, useEffect } from "react";
import { FileText, Download, Printer, ArrowLeft, CheckCircle } from "lucide-react";
import type { AppContext } from "@/app/page";

interface EvalDetail {
  id: number; evaluationDate: string; patientName: string; patientCpf: string;
  patientGender: string; patientBirthDate: string; patientPhone: string;
  weight: number; height: number; bmi: number; bodyFatPct: number;
  musclePct: number; waterPct: number; visceralFat: number;
  metabolicAge: number; basalMetabolism: number; muscleMass: number;
  boneMass: number; leanMass: number; bodyFatKg: number; waterKg: number;
  proteinPct: number; subcutaneousFat: number; bodyScore: number;
  waist: number; hip: number; neck: number; chest: number;
  interpretation: string;
  bmiClassification: string;
}

export default function ReportView({ ctx }: { ctx: AppContext }) {
  const [evalData, setEvalData] = useState<EvalDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const id = ctx.selectedEvaluationId;
    if (id) {
      fetch(`/api/evaluations/${id}`).then(r => r.json()).then(d => {
        setEvalData(d.evaluation || null);
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      fetch("/api/evaluations/latest").then(r => r.json()).then(d => {
        setEvalData(d.evaluation || null);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [ctx.selectedEvaluationId]);

  const handlePrint = () => window.print();

  const handleExportPDF = async () => {
    setGenerating(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF("p", "mm", "a4");
      const w = doc.internal.pageSize.getWidth();

      // Header
      doc.setFillColor(35, 87, 166);
      doc.rect(0, 0, w, 35, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("HEFARMA", 15, 18);
      doc.setFontSize(8);
      doc.text("BODY ANALYSIS SYSTEM", 15, 24);
      doc.setFontSize(10);
      doc.text("Relatório de Avaliação Corporal", w - 15, 18, { align: "right" });

      if (evalData) {
        doc.setTextColor(30, 41, 59);
        let y = 45;

        // Patient info
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Dados do Paciente", 15, y); y += 8;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Nome: ${evalData.patientName}`, 15, y); y += 6;
        doc.text(`CPF: ${evalData.patientCpf || "-"}`, 15, y);
        doc.text(`Gênero: ${evalData.patientGender || "-"}`, w / 2, y); y += 6;
        doc.text(`Data de Nascimento: ${evalData.patientBirthDate ? new Date(evalData.patientBirthDate).toLocaleDateString("pt-BR") : "-"}`, 15, y);
        doc.text(`Telefone: ${evalData.patientPhone || "-"}`, w / 2, y); y += 6;
        doc.text(`Data da Avaliação: ${evalData.evaluationDate ? new Date(evalData.evaluationDate).toLocaleDateString("pt-BR") : "-"}`, 15, y); y += 12;

        // Body Composition
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Composição Corporal", 15, y); y += 8;
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const metrics = [
          ["Peso", `${evalData.weight?.toFixed(1) || "-"} kg`], ["Altura", `${evalData.height?.toFixed(1) || "-"} cm`],
          ["IMC", `${evalData.bmi?.toFixed(1) || "-"}`], ["Classificação IMC", evalData.bmiClassification || "-"],
          ["Gordura Corporal", `${evalData.bodyFatPct?.toFixed(1) || "-"}%`], ["Massa Muscular", `${evalData.muscleMass?.toFixed(1) || "-"} kg`],
          ["Músculo", `${evalData.musclePct?.toFixed(1) || "-"}%`], ["Água Corporal", `${evalData.waterPct?.toFixed(1) || "-"}%`],
          ["Gordura Visceral", `${evalData.visceralFat?.toFixed(0) || "-"}`], ["Idade Metabólica", `${evalData.metabolicAge?.toFixed(0) || "-"} anos`],
          ["Metabolismo Basal", `${evalData.basalMetabolism?.toFixed(0) || "-"} kcal`], ["Massa Óssea", `${evalData.boneMass?.toFixed(1) || "-"} kg`],
        ];
        metrics.forEach(([label, value], i) => {
          if (i % 2 === 0 && i > 0) y += 6;
          const x = i % 2 === 0 ? 15 : w / 2;
          doc.setFont("helvetica", "bold");
          doc.text(`${label}:`, x, y);
          doc.setFont("helvetica", "normal");
          doc.text(value, x + doc.getTextWidth(`${label}: `), y);
        });
        y += 12;

        // Interpretation
        if (evalData.interpretation) {
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.text("Interpretação", 15, y); y += 8;
          doc.setFontSize(10);
          doc.setFont("helvetica", "normal");
          const lines = doc.splitTextToSize(evalData.interpretation, w - 30);
          doc.text(lines, 15, y); y += lines.length * 5 + 12;
        }

        // Footer
        doc.setFillColor(35, 87, 166);
        doc.rect(0, 280, w, 17, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.text("HEFARMA Body Analysis System - Relatório gerado automaticamente", 15, 289);
        doc.text(new Date().toLocaleDateString("pt-BR") + " - v1.0.0", w - 15, 289, { align: "right" });
      }

      doc.save(`HEFARMA_Relatorio_${evalData?.patientName || "avaliacao"}.pdf`);
    } catch { alert("Erro ao gerar PDF"); }
    setGenerating(false);
  };

  if (loading) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400 }}><div style={{ width: 40, height: 40, border: "4px solid #2357A6", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} /></div>;
  }

  if (!evalData) {
    return (
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", padding: 60 }}>
        <FileText size={48} style={{ color: "var(--hefarma-text-light)", marginBottom: 12, opacity: 0.3 }} />
        <p style={{ color: "var(--hefarma-text-light)", fontWeight: 600 }}>Nenhuma avaliação selecionada</p>
        <button onClick={() => ctx.setCurrentView("history")} className="btn-primary" style={{ marginTop: 16 }}>Ver Histórico</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => ctx.setCurrentView("history")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--hefarma-text-light)" }}><ArrowLeft size={20} /></button>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--hefarma-text)" }}>Relatório Profissional</h2>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={handlePrint} className="btn-outline" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, padding: "8px 16px" }}>
            <Printer size={14} /> Imprimir
          </button>
          <button onClick={handleExportPDF} disabled={generating} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, padding: "8px 16px" }}>
            <Download size={14} /> {generating ? "Gerando..." : "Exportar PDF"}
          </button>
        </div>
      </div>

      {/* Report Content - A4 Style */}
      <div style={{
        background: "white", borderRadius: 8, boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        overflow: "hidden", maxWidth: 900,
      }}>
        {/* Header Banner */}
        <div style={{ background: "linear-gradient(135deg, #2357A6, #3B82F6)", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ color: "white", fontSize: 24, fontWeight: 800, letterSpacing: 2 }}>HEFARMA</div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>Body Analysis System</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "white", fontSize: 14, fontWeight: 600 }}>Relatório de Avaliação Corporal</div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11 }}>{new Date(evalData.evaluationDate).toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" })}</div>
          </div>
        </div>

        <div style={{ padding: "24px 32px" }}>
          {/* Patient Info */}
          <div style={{ marginBottom: 24, padding: 16, background: "var(--hefarma-card)", borderRadius: 10, border: "1px solid var(--hefarma-border)" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>Dados do Paciente</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                ["Nome", evalData.patientName],
                ["CPF", evalData.patientCpf || "-"],
                ["Gênero", evalData.patientGender || "-"],
                ["Data Nasc.", evalData.patientBirthDate ? new Date(evalData.patientBirthDate).toLocaleDateString("pt-BR") : "-"],
                ["Telefone", evalData.patientPhone || "-"],
              ].map(([l, v], i) => (
                <div key={i}><span style={{ fontSize: 11, color: "var(--hefarma-text-light)", fontWeight: 600 }}>{l}: </span><span style={{ fontSize: 13, color: "var(--hefarma-text)" }}>{v}</span></div>
              ))}
            </div>
          </div>

          {/* Body Composition */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>Composição Corporal</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {[
                { l: "Peso", v: `${evalData.weight?.toFixed(1) || "-"} kg`, c: "#2357A6" },
                { l: "Altura", v: `${evalData.height?.toFixed(1) || "-"} cm`, c: "#3B82F6" },
                { l: "IMC", v: evalData.bmi?.toFixed(1) || "-", c: "#8B5CF6" },
                { l: "Classificação", v: evalData.bmiClassification || "-", c: "#F59E0B" },
                { l: "Gordura %", v: `${evalData.bodyFatPct?.toFixed(1) || "-"}%`, c: "#EF385A" },
                { l: "Gordura Kg", v: `${evalData.bodyFatKg?.toFixed(1) || "-"} kg`, c: "#EF385A" },
                { l: "Massa Magra", v: `${evalData.leanMass?.toFixed(1) || "-"} kg`, c: "#06B6D4" },
                { l: "Massa Muscular", v: `${evalData.muscleMass?.toFixed(1) || "-"} kg`, c: "#10B981" },
                { l: "Músculo %", v: `${evalData.musclePct?.toFixed(1) || "-"}%`, c: "#10B981" },
                { l: "Água %", v: `${evalData.waterPct?.toFixed(1) || "-"}%`, c: "#06B6D4" },
                { l: "Água Kg", v: `${evalData.waterKg?.toFixed(1) || "-"} kg`, c: "#06B6D4" },
                { l: "Massa Óssea", v: `${evalData.boneMass?.toFixed(1) || "-"} kg`, c: "#64748B" },
                { l: "Proteína", v: `${evalData.proteinPct?.toFixed(1) || "-"}%`, c: "#8B5CF6" },
                { l: "Gord. Visceral", v: `${evalData.visceralFat?.toFixed(0) || "-"}`, c: "#EF4444" },
                { l: "Idade Metab.", v: `${evalData.metabolicAge?.toFixed(0) || "-"} anos`, c: "#F59E0B" },
                { l: "Metab. Basal", v: `${evalData.basalMetabolism?.toFixed(0) || "-"} kcal`, c: "#2357A6" },
              ].map((m, i) => (
                <div key={i} style={{ background: "var(--hefarma-card)", border: "1px solid var(--hefarma-border)", borderRadius: 8, padding: 10, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "var(--hefarma-text-light)", textTransform: "uppercase" }}>{m.l}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: m.c, marginTop: 2 }}>{m.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Interpretation */}
          {evalData.interpretation && (
            <div style={{ marginBottom: 24, padding: 16, background: "rgba(35,87,166,0.05)", borderRadius: 10, borderLeft: "4px solid #2357A6" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 8 }}>Interpretação Automática</h3>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: "var(--hefarma-text)" }}>{evalData.interpretation}</p>
            </div>
          )}

          {/* Signature */}
          <div style={{ marginTop: 40, textAlign: "center" }}>
            <div style={{ width: 200, borderTop: "1px solid var(--hefarma-border)", margin: "0 auto", paddingTop: 8 }}>
              <div style={{ fontSize: 12, color: "var(--hefarma-text-light)" }}>Profissional Responsável</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--hefarma-text)", marginTop: 2 }}>HEFARMA Farmácia</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: "#1E293B", padding: "12px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "#94A3B8", fontSize: 10 }}>HEFARMA Body Analysis System v1.0.0</span>
          <span style={{ color: "#94A3B8", fontSize: 10 }}>Relatório gerado em {new Date().toLocaleDateString("pt-BR")} - Documento confidencial</span>
        </div>
      </div>
    </div>
  );
}
