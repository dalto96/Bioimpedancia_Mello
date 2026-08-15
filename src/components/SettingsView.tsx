"use client";

import { useState, useEffect } from "react";
import { Settings, Save, Building2, User, Palette, Shield, Database, CheckCircle } from "lucide-react";
import type { AppContext } from "@/app/page";

export default function SettingsView({ ctx }: { ctx: AppContext }) {
  const [tab, setTab] = useState("clinic");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [clinic, setClinic] = useState({ name: "HEFARMA Farmácia", phone: "", email: "", address: "", professional: "", crn: "" });
  const [newUser, setNewUser] = useState({ username: "", name: "", password: "", role: "employee" });
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => {
      if (d.clinic) setClinic(d.clinic);
      if (d.users) setUsers(d.users);
    }).catch(() => {});
  }, []);

  const handleSaveClinic = async () => {
    setSaving(true);
    try {
      await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "clinic", data: clinic }) });
      setMsg("Configurações salvas com sucesso!");
    } catch { setMsg("Erro ao salvar"); }
    setSaving(false);
    setTimeout(() => setMsg(null), 3000);
  };

  const handleAddUser = async () => {
    if (!newUser.username || !newUser.password) return;
    setSaving(true);
    try {
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newUser) });
      const data = await res.json();
      if (data.success) {
        setUsers([...users, { id: data.id, ...newUser }]);
        setNewUser({ username: "", name: "", password: "", role: "employee" });
        setMsg("Usuário criado com sucesso!");
      }
    } catch { setMsg("Erro ao criar usuário"); }
    setSaving(false);
    setTimeout(() => setMsg(null), 3000);
  };

  const tabs = [
    { id: "clinic", label: "Clínica", icon: Building2 },
    { id: "users", label: "Usuários", icon: User },
    { id: "system", label: "Sistema", icon: Database },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
        <Settings size={22} style={{ color: "#2357A6" }} /> Configurações
      </h2>

      {/* Message */}
      {msg && (
        <div style={{ padding: 12, borderRadius: 10, marginBottom: 12, display: "flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#10B981", fontSize: 13 }}>
          <CheckCircle size={16} /> {msg}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "10px 20px", borderRadius: 10, cursor: "pointer",
              background: tab === t.id ? "linear-gradient(135deg, #2357A6, #3B82F6)" : "var(--hefarma-card)",
              color: tab === t.id ? "white" : "var(--hefarma-text-light)",
              fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 8,
              border: tab === t.id ? "none" : "1px solid var(--hefarma-border)",
              transition: "all 0.2s",
            }}>
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Clinic Tab */}
      {tab === "clinic" && (
        <div className="hefarma-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Building2 size={18} style={{ color: "#2357A6" }} /> Dados da Clínica
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--hefarma-text-light)", marginBottom: 4, textTransform: "uppercase" }}>Nome da Clínica</label>
              <input className="hefarma-input" value={clinic.name} onChange={e => setClinic({...clinic, name: e.target.value})} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--hefarma-text-light)", marginBottom: 4, textTransform: "uppercase" }}>Telefone</label>
              <input className="hefarma-input" value={clinic.phone} onChange={e => setClinic({...clinic, phone: e.target.value})} placeholder="(00) 0000-0000" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--hefarma-text-light)", marginBottom: 4, textTransform: "uppercase" }}>E-mail</label>
              <input className="hefarma-input" value={clinic.email} onChange={e => setClinic({...clinic, email: e.target.value})} placeholder="email@hefarma.com" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--hefarma-text-light)", marginBottom: 4, textTransform: "uppercase" }}>Endereço</label>
              <input className="hefarma-input" value={clinic.address} onChange={e => setClinic({...clinic, address: e.target.value})} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--hefarma-text-light)", marginBottom: 4, textTransform: "uppercase" }}>Profissional Responsável</label>
              <input className="hefarma-input" value={clinic.professional} onChange={e => setClinic({...clinic, professional: e.target.value})} placeholder="Nome do nutricionista" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--hefarma-text-light)", marginBottom: 4, textTransform: "uppercase" }}>CRN</label>
              <input className="hefarma-input" value={clinic.crn} onChange={e => setClinic({...clinic, crn: e.target.value})} placeholder="CRN-X 00000" />
            </div>
          </div>
          <button onClick={handleSaveClinic} disabled={saving} className="btn-primary" style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Save size={16} /> {saving ? "Salvando..." : "Salvar Configurações"}
          </button>
        </div>
      )}

      {/* Users Tab */}
      {tab === "users" && (
        <div>
          <div className="hefarma-card" style={{ padding: 24, marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <Shield size={18} style={{ color: "#EF385A" }} /> Novo Usuário
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, alignItems: "end" }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--hefarma-text-light)", marginBottom: 4, textTransform: "uppercase" }}>Usuário</label>
                <input className="hefarma-input" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--hefarma-text-light)", marginBottom: 4, textTransform: "uppercase" }}>Nome</label>
                <input className="hefarma-input" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--hefarma-text-light)", marginBottom: 4, textTransform: "uppercase" }}>Senha</label>
                <input className="hefarma-input" type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} />
              </div>
              <button onClick={handleAddUser} disabled={saving} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <User size={16} /> Adicionar
              </button>
            </div>
          </div>

          <div className="hefarma-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 16 }}>Usuários Cadastrados</h3>
            {users.length === 0 ? (
              <p style={{ color: "var(--hefarma-text-light)", fontSize: 13 }}>Nenhum usuário cadastrado no banco de dados.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Usuário", "Nome", "Perfil"].map(h => <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "var(--hefarma-text-light)", textTransform: "uppercase", borderBottom: "1px solid var(--hefarma-border)" }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u: any, i: number) => (
                    <tr key={i}>
                      <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--hefarma-border)", fontSize: 13 }}>{u.username}</td>
                      <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--hefarma-border)", fontSize: 13 }}>{u.name}</td>
                      <td style={{ padding: "8px 12px", borderBottom: "1px solid var(--hefarma-border)" }}>
                        <span className="hefarma-badge" style={{ background: u.role === "admin" ? "rgba(35,87,166,0.1)" : "rgba(16,185,129,0.1)", color: u.role === "admin" ? "#2357A6" : "#10B981" }}>
                          {u.role === "admin" ? "Administrador" : "Funcionário"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* System Tab */}
      {tab === "system" && (
        <div className="hefarma-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Database size={18} style={{ color: "#10B981" }} /> Informações do Sistema
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              ["Versão", "1.0.0"],
              ["Banco de Dados", "PostgreSQL"],
              ["ORM", "Drizzle"],
              ["Framework", "Next.js 16"],
              ["Tema", ctx.darkMode ? "Escuro" : "Claro"],
              ["Idioma", "Português (BR)"],
            ].map(([l, v], i) => (
              <div key={i} style={{ padding: 12, background: "var(--hefarma-card)", borderRadius: 8, border: "1px solid var(--hefarma-border)" }}>
                <div style={{ fontSize: 11, color: "var(--hefarma-text-light)", textTransform: "uppercase", fontWeight: 600 }}>{l}</div>
                <div style={{ fontSize: 15, color: "var(--hefarma-text)", fontWeight: 600, marginTop: 2 }}>{v}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 12 }}>Aparência</h4>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => { ctx.toggleDarkMode(); }} style={{
                padding: "16px 24px", borderRadius: 12, border: !ctx.darkMode ? "2px solid #2357A6" : "2px solid var(--hefarma-border)",
                background: !ctx.darkMode ? "rgba(35,87,166,0.05)" : "var(--hefarma-card)", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s",
              }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#F8FAFC", border: "2px solid #E2E8F0" }} />
                <span style={{ fontWeight: 600, color: !ctx.darkMode ? "#2357A6" : "var(--hefarma-text-light)" }}>Modo Claro</span>
              </button>
              <button onClick={() => { ctx.toggleDarkMode(); }} style={{
                padding: "16px 24px", borderRadius: 12, border: ctx.darkMode ? "2px solid #2357A6" : "2px solid var(--hefarma-border)",
                background: ctx.darkMode ? "rgba(35,87,166,0.05)" : "var(--hefarma-card)", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s",
              }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#1E293B", border: "2px solid #334155" }} />
                <span style={{ fontWeight: 600, color: ctx.darkMode ? "#2357A6" : "var(--hefarma-text-light)" }}>Modo Escuro</span>
              </button>
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 12 }}>Identidade Visual HEFARMA</h4>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div style={{ width: 60, height: 60, borderRadius: 12, background: "#2357A6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "white", fontWeight: 800, fontSize: 14 }}>AZUL</span>
              </div>
              <div style={{ width: 60, height: 60, borderRadius: 12, background: "#EF385A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "white", fontWeight: 800, fontSize: 14 }}>VERM</span>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--hefarma-text)" }}>Cores Primárias</div>
                <div style={{ fontSize: 12, color: "var(--hefarma-text-light)" }}>Azul #2357A6 · Vermelho #EF385A</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
