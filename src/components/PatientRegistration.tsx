"use client";

import { useState } from "react";
import { Save, ArrowLeft, User, Phone, MapPin, AlertCircle, CheckCircle } from "lucide-react";
import type { AppContext } from "@/app/page";

const initialForm = {
  fullName: "", cpf: "", rg: "", birthDate: "", gender: "Masculino", phone: "", whatsapp: "",
  email: "", address: "", neighborhood: "", city: "", state: "", postalCode: "",
  emergencyContact: "", emergencyPhone: "", objective: "", observations: "",
};

export default function PatientRegistration({ ctx }: { ctx: AppContext }) {
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: string; text: string } | null>(null);

  const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const calcAge = () => {
    if (!form.birthDate) return "";
    const d = new Date(form.birthDate);
    const now = new Date();
    let age = now.getFullYear() - d.getFullYear();
    if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) age--;
    return age >= 0 ? String(age) : "";
  };

  const formatCPF = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0,3)}.${d.slice(3)}`;
    if (d.length <= 9) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6)}`;
    return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9)}`;
  };

  const formatPhone = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : "";
    if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`;
    return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
  };

  const handleSave = async () => {
    if (!form.fullName.trim()) { setMsg({ type: "error", text: "Nome completo é obrigatório" }); return; }
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, age: calcAge() }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg({ type: "success", text: "Paciente cadastrado com sucesso!" });
        setForm(initialForm);
        ctx.triggerRefresh();
      } else {
        setMsg({ type: "error", text: data.error || "Erro ao cadastrar paciente" });
      }
    } catch {
      setMsg({ type: "error", text: "Erro de conexão com o servidor" });
    }
    setSaving(false);
  };

  const fields = (label: string, key: string, opts?: { type?: string; placeholder?: string; format?: (v: string) => string }) => (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--hefarma-text-light)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </label>
      <input
        className="hefarma-input"
        type={opts?.type || "text"}
        value={form[key as keyof typeof form]}
        onChange={e => {
          const val = opts?.format ? opts.format(e.target.value) : e.target.value;
          update(key, val);
        }}
        placeholder={opts?.placeholder || label}
      />
    </div>
  );

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => ctx.setCurrentView("home")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--hefarma-text-light)" }}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--hefarma-text)" }}>Novo Paciente</h2>
            <p style={{ fontSize: 13, color: "var(--hefarma-text-light)" }}>Cadastro de paciente no sistema</p>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Save size={16} />
          {saving ? "Salvando..." : "Salvar Paciente"}
        </button>
      </div>

      {/* Message */}
      {msg && (
        <div style={{
          padding: 14, borderRadius: 10, marginBottom: 16, display: "flex", alignItems: "center", gap: 10,
          background: msg.type === "success" ? "rgba(16,185,129,0.1)" : "rgba(239,56,90,0.1)",
          border: `1px solid ${msg.type === "success" ? "rgba(16,185,129,0.3)" : "rgba(239,56,90,0.3)"}`,
          color: msg.type === "success" ? "#10B981" : "#EF385A", fontSize: 14,
        }}>
          {msg.type === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {msg.text}
        </div>
      )}

      {/* Personal Data */}
      <div className="hefarma-card" style={{ padding: 24, marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <User size={18} style={{ color: "#2357A6" }} /> Dados Pessoais
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {fields("Nome Completo *", "fullName", { placeholder: "Nome completo do paciente" })}
          {fields("CPF", "cpf", { placeholder: "000.000.000-00", format: formatCPF })}
          {fields("RG", "rg", { placeholder: "00.000.000-0" })}
          {fields("Data de Nascimento", "birthDate", { type: "date" })}
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--hefarma-text-light)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Idade (automático)</label>
            <input className="hefarma-input" value={calcAge() ? `${calcAge()} anos` : ""} readOnly style={{ background: "var(--hefarma-border)", opacity: 0.8 }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--hefarma-text-light)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Gênero</label>
            <select className="hefarma-select" value={form.gender} onChange={e => update("gender", e.target.value)}>
              <option>Masculino</option>
              <option>Feminino</option>
              <option>Outro</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="hefarma-card" style={{ padding: 24, marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <Phone size={18} style={{ color: "#10B981" }} /> Contato
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {fields("Telefone", "phone", { placeholder: "(00) 00000-0000", format: formatPhone })}
          {fields("WhatsApp", "whatsapp", { placeholder: "(00) 00000-0000", format: formatPhone })}
          {fields("E-mail", "email", { type: "email", placeholder: "email@exemplo.com" })}
          {fields("Contato de Emergência", "emergencyContact", { placeholder: "Nome do contato" })}
          {fields("Telefone de Emergência", "emergencyPhone", { placeholder: "(00) 00000-0000", format: formatPhone })}
        </div>
      </div>

      {/* Address */}
      <div className="hefarma-card" style={{ padding: 24, marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <MapPin size={18} style={{ color: "#F59E0B" }} /> Endereço
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 12 }}>
          {fields("Endereço", "address", { placeholder: "Rua, número, complemento" })}
          {fields("Bairro", "neighborhood")}
          {fields("Cidade", "city")}
          {fields("Estado", "state", { placeholder: "UF" })}
          {fields("CEP", "postalCode", { placeholder: "00000-000" })}
        </div>
      </div>

      {/* Additional */}
      <div className="hefarma-card" style={{ padding: 24, marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <AlertCircle size={18} style={{ color: "#8B5CF6" }} /> Informações Adicionais
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--hefarma-text-light)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Objetivo</label>
            <select className="hefarma-select" value={form.objective} onChange={e => update("objective", e.target.value)}>
              <option value="">Selecione</option>
              <option>Emagrecimento</option>
              <option>Ganho de Massa</option>
              <option>Recomposição Corporal</option>
              <option>Saúde e Bem-estar</option>
              <option>Acompanhamento</option>
              <option>Outro</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--hefarma-text-light)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>Observações</label>
            <textarea
              className="hefarma-input"
              value={form.observations}
              onChange={e => update("observations", e.target.value)}
              placeholder="Observações sobre o paciente"
              rows={3}
              style={{ resize: "vertical", minHeight: 80 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
