"use client";

import { UserPlus, ClipboardList, Search, FileText, BarChart3, Settings, Activity, Users, TrendingUp, Calendar, Download, FileSpreadsheet } from "lucide-react";
import { useState, useEffect } from "react";
import type { AppContext } from "@/app/page";

export default function HomeScreen({ ctx }: { ctx: AppContext }) {
  const [stats, setStats] = useState({ patients: 0, evaluations: 0, today: 0 });
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bom dia");
    else if (hour < 18) setGreeting("Boa tarde");
    else setGreeting("Boa noite");

    fetch("/api/stats").then(r => r.json()).then(d => {
      if (d.patients !== undefined) setStats(d);
    }).catch(() => {});
  }, [ctx.refreshKey]);

  const today = new Date().toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const menuItems = [
    { view: "new-patient" as const, label: "Novo Paciente", desc: "Cadastrar novo paciente no sistema", icon: UserPlus, gradient: "linear-gradient(135deg, #2357A6, #3B82F6)" },
    { view: "new-evaluation" as const, label: "Nova Avaliação", desc: "Realizar avaliação de bioimpedância", icon: ClipboardList, gradient: "linear-gradient(135deg, #EF385A, #F97316)" },
    { view: "history" as const, label: "Histórico", desc: "Consultar avaliações anteriores", icon: Search, gradient: "linear-gradient(135deg, #10B981, #34D399)" },
    { view: "report" as const, label: "Relatório", desc: "Gerar relatório profissional", icon: FileText, gradient: "linear-gradient(135deg, #8B5CF6, #A78BFA)" },
    { view: "dashboard" as const, label: "Dashboard", desc: "Análise e evolução dos pacientes", icon: BarChart3, gradient: "linear-gradient(135deg, #F59E0B, #FBBF24)" },
    { view: "settings" as const, label: "Configurações", desc: "Ajustes do sistema", icon: Settings, gradient: "linear-gradient(135deg, #6B7280, #9CA3AF)" },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Welcome Banner */}
      <div style={{
        background: "linear-gradient(135deg, #2357A6 0%, #3B82F6 50%, #6366F1 100%)",
        borderRadius: 16, padding: "32px 40px", marginBottom: 24, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
        <div style={{ position: "absolute", bottom: -60, right: 60, width: 150, height: 150, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <Activity size={28} style={{ color: "rgba(255,255,255,0.8)" }} />
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, letterSpacing: 2, textTransform: "uppercase" }}>
              HEFARMA Body Analysis System
            </span>
          </div>
          <h1 style={{ color: "white", fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
            {greeting}, {ctx.user?.name || "Usuário"}!
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15 }}>
            {today}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Pacientes Cadastrados", value: stats.patients, icon: Users, color: "#2357A6" },
          { label: "Avaliações Realizadas", value: stats.evaluations, icon: ClipboardList, color: "#10B981" },
          { label: "Avaliações Hoje", value: stats.today, icon: Calendar, color: "#EF385A" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="hefarma-card" style={{ padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={22} style={{ color: s.color }} />
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "var(--hefarma-text)" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "var(--hefarma-text-light)", textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Menu Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={i}
              onClick={() => ctx.setCurrentView(item.view)}
              className="hefarma-card"
              style={{
                padding: 28, cursor: "pointer", border: "none", textAlign: "left",
                background: "var(--hefarma-card)", position: "relative", overflow: "hidden",
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 14, display: "flex",
                alignItems: "center", justifyContent: "center", marginBottom: 16,
                background: item.gradient,
              }}>
                <Icon size={24} style={{ color: "white" }} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 4 }}>
                {item.label}
              </h3>
              <p style={{ fontSize: 13, color: "var(--hefarma-text-light)" }}>
                {item.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: 24 }}>
        <div className="hefarma-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <TrendingUp size={16} style={{ color: "#2357A6" }} />
            Atalhos Rápidos
          </h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button onClick={() => ctx.setCurrentView("new-patient")} className="btn-primary" style={{ fontSize: 13, padding: "8px 16px" }}>
              + Novo Paciente
            </button>
            <button onClick={() => ctx.setCurrentView("new-evaluation")} className="btn-primary" style={{ fontSize: 13, padding: "8px 16px", background: "linear-gradient(135deg, #10B981, #34D399)" }}>
              + Nova Avaliação
            </button>
            <button onClick={() => ctx.setCurrentView("patient-list")} className="btn-outline" style={{ fontSize: 13, padding: "6px 14px" }}>
              Ver Pacientes
            </button>
            <button onClick={() => ctx.setCurrentView("dashboard")} className="btn-outline" style={{ fontSize: 13, padding: "6px 14px" }}>
              Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Export XLSX Section */}
      <div style={{ marginTop: 16 }}>
        <div style={{
          background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
          borderRadius: 16, padding: 24, display: "flex", alignItems: "center",
          justifyContent: "space-between", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(35,87,166,0.15)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
              <FileSpreadsheet size={28} style={{ color: "#10B981" }} />
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#F1F5F9", margin: 0 }}>
                  Exportar Planilha Excel (.xlsx)
                </h3>
                <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>
                  Baixe todos os dados em formato Excel com 9 abas profissionais formatadas
                </p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
              {["Dashboard", "Pacientes", "Avaliações", "Medidas Corporais", "Bioimpedância", "Resultados Calculados", "Relatório", "Configurações", "Legenda"].map(tab => (
                <span key={tab} style={{
                  background: "rgba(35,87,166,0.2)", color: "#93C5FD",
                  padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                }}>
                  {tab}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={async () => {
              try {
                const res = await fetch("/api/export/xlsx");
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `HEFARMA_Body_Analysis_${new Date().toISOString().split("T")[0]}.xlsx`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              } catch (e) {
                alert("Erro ao exportar arquivo XLSX");
              }
            }}
            style={{
              background: "linear-gradient(135deg, #10B981, #34D399)",
              color: "white", border: "none", borderRadius: 12,
              padding: "14px 28px", fontWeight: 700, fontSize: 15,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
              boxShadow: "0 4px 12px rgba(16,185,129,0.4)", transition: "all 0.2s",
              position: "relative", zIndex: 1, whiteSpace: "nowrap",
            }}
          >
            <Download size={20} />
            Baixar .XLSX
          </button>
        </div>
      </div>
    </div>
  );
}
