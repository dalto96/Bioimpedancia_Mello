"use client";

import { useState, useEffect } from "react";
import { Search, UserPlus, Eye, ClipboardList, ChevronRight, Users, Phone, Mail } from "lucide-react";
import type { AppContext } from "@/app/page";

interface Patient {
  id: number;
  fullName: string;
  cpf: string;
  phone: string;
  email: string;
  gender: string;
  birthDate: string;
  objective: string;
  createdAt: string;
}

export default function PatientList({ ctx }: { ctx: AppContext }) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/patients").then(r => r.json()).then(d => {
      setPatients(d.patients || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [ctx.refreshKey]);

  const filtered = patients.filter(p =>
    p.fullName.toLowerCase().includes(search.toLowerCase()) ||
    p.cpf.includes(search) ||
    p.phone.includes(search)
  );

  const calcAge = (bd: string) => {
    if (!bd) return "-";
    const d = new Date(bd);
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) age--;
    return age >= 0 ? age : "-";
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Users size={24} style={{ color: "#2357A6" }} />
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--hefarma-text)" }}>Pacientes</h2>
            <p style={{ fontSize: 13, color: "var(--hefarma-text-light)" }}>{filtered.length} paciente(s) encontrado(s)</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: 11, color: "var(--hefarma-text-light)" }} />
            <input
              className="hefarma-input"
              style={{ paddingLeft: 36, width: 280 }}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nome, CPF ou telefone..."
            />
          </div>
          <button onClick={() => ctx.setCurrentView("new-patient")} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <UserPlus size={16} /> Novo
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="hefarma-card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--hefarma-text-light)" }}>
            <div style={{ width: 32, height: 32, border: "3px solid #2357A6", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
            Carregando pacientes...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <Users size={48} style={{ color: "var(--hefarma-text-light)", marginBottom: 12, opacity: 0.5 }} />
            <p style={{ color: "var(--hefarma-text-light)", fontSize: 15, fontWeight: 600 }}>Nenhum paciente encontrado</p>
            <p style={{ color: "var(--hefarma-text-light)", fontSize: 13, marginTop: 4 }}>Cadastre um novo paciente para começar</p>
            <button onClick={() => ctx.setCurrentView("new-patient")} className="btn-primary" style={{ marginTop: 16 }}>
              Cadastrar Paciente
            </button>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--hefarma-card)" }}>
                {["Nome", "CPF", "Idade", "Gênero", "Telefone", "Objetivo", "Ações"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--hefarma-text-light)", textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid var(--hefarma-border)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ transition: "background 0.15s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(35,87,166,0.03)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--hefarma-border)" }}>
                    <span style={{ fontWeight: 600, color: "var(--hefarma-text)" }}>{p.fullName}</span>
                  </td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--hefarma-border)", color: "var(--hefarma-text-light)", fontSize: 13 }}>
                    {p.cpf || "-"}
                  </td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--hefarma-border)", color: "var(--hefarma-text-light)", fontSize: 13 }}>
                    {calcAge(p.birthDate)} anos
                  </td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--hefarma-border)" }}>
                    <span className="hefarma-badge" style={{ background: p.gender === "Masculino" ? "rgba(35,87,166,0.1)" : "rgba(239,56,90,0.1)", color: p.gender === "Masculino" ? "#2357A6" : "#EF385A" }}>
                      {p.gender === "Masculino" ? "♂" : "♀"} {p.gender}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--hefarma-border)", color: "var(--hefarma-text-light)", fontSize: 13 }}>
                    {p.phone || "-"}
                  </td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--hefarma-border)", color: "var(--hefarma-text-light)", fontSize: 13 }}>
                    {p.objective || "-"}
                  </td>
                  <td style={{ padding: "12px 16px", borderBottom: "1px solid var(--hefarma-border)" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => { ctx.setSelectedPatientId(p.id); ctx.setCurrentView("new-evaluation"); }} style={{ background: "rgba(35,87,166,0.1)", border: "none", borderRadius: 6, padding: "6px 8px", cursor: "pointer", color: "#2357A6" }} title="Nova Avaliação">
                        <ClipboardList size={14} />
                      </button>
                      <button onClick={() => { ctx.setSelectedPatientId(p.id); ctx.setCurrentView("history"); }} style={{ background: "rgba(16,185,129,0.1)", border: "none", borderRadius: 6, padding: "6px 8px", cursor: "pointer", color: "#10B981" }} title="Histórico">
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
