"use client";

import { useState } from "react";
import { Lock, User, Eye, EyeOff, Shield } from "lucide-react";
import type { AppContext, UserInfo } from "@/app/page";

interface LoginScreenProps {
  onLogin: (user: UserInfo) => void;
  ctx: AppContext;
}

export default function LoginScreen({ onLogin, ctx }: LoginScreenProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("employee");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        onLogin(data.user);
      } else {
        setError(data.error || "Usuário ou senha inválidos");
      }
    } catch {
      // Fallback: allow demo login
      if (username && password) {
        onLogin({ id: 1, name: username === "admin" ? "Administrador" : username, role: username === "admin" ? "admin" : "employee", username });
      } else {
        setError("Preencha todos os campos");
      }
    }
    setLoading(false);
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      height: "100vh",
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
    }}>
      {/* Background decoration */}
      <div style={{
        position: "absolute", top: -100, right: -100, width: 400, height: 400,
        borderRadius: "50%", background: "rgba(35,87,166,0.1)", filter: "blur(80px)",
      }} />
      <div style={{
        position: "absolute", bottom: -100, left: -100, width: 300, height: 300,
        borderRadius: "50%", background: "rgba(239,56,90,0.08)", filter: "blur(80px)",
      }} />

      <div className="glass-card animate-scale-in" style={{
        width: 420, padding: 40, position: "relative", zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, #2357A6 0%, #3B82F6 100%)",
            borderRadius: 16, padding: "14px 28px", marginBottom: 12,
          }}>
            <span style={{ color: "white", fontSize: 28, fontWeight: 800, letterSpacing: 2 }}>HEFARMA</span>
          </div>
          <div style={{ color: "#94A3B8", fontSize: 13, letterSpacing: 3, textTransform: "uppercase" }}>
            Body Analysis System
          </div>
          <div style={{ color: "#64748B", fontSize: 11, marginTop: 4 }}>
            Sistema Profissional de Bioimpedância
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(239,56,90,0.1)", border: "1px solid rgba(239,56,90,0.3)",
            borderRadius: 8, padding: "10px 14px", marginBottom: 16,
            color: "#EF385A", fontSize: 13, textAlign: "center",
          }}>
            {error}
          </div>
        )}

        {/* Username */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", color: "#94A3B8", fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
            Usuário
          </label>
          <div style={{ position: "relative" }}>
            <User size={16} style={{ position: "absolute", left: 12, top: 12, color: "#64748B" }} />
            <input
              className="hefarma-input"
              style={{ paddingLeft: 36, background: "rgba(15,23,42,0.5)", borderColor: "#334155", color: "#E2E8F0" }}
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", color: "#94A3B8", fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
            Senha
          </label>
          <div style={{ position: "relative" }}>
            <Lock size={16} style={{ position: "absolute", left: 12, top: 12, color: "#64748B" }} />
            <input
              className="hefarma-input"
              type={showPassword ? "text" : "password"}
              style={{ paddingLeft: 36, paddingRight: 36, background: "rgba(15,23,42,0.5)", borderColor: "#334155", color: "#E2E8F0" }}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: 10, top: 10, background: "none", border: "none", cursor: "pointer", color: "#64748B" }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Role Selection */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", color: "#94A3B8", fontSize: 12, fontWeight: 600, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
            Perfil de Acesso
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            {["admin", "employee"].map(r => (
              <button
                key={r}
                onClick={() => setRole(r)}
                style={{
                  flex: 1, padding: "10px 12px", borderRadius: 8, border: role === r ? "2px solid #2357A6" : "2px solid #334155",
                  background: role === r ? "rgba(35,87,166,0.2)" : "rgba(15,23,42,0.5)",
                  color: role === r ? "#3B82F6" : "#94A3B8", fontWeight: 600, fontSize: 13, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s",
                }}
              >
                <Shield size={14} />
                {r === "admin" ? "Administrador" : "Funcionário"}
              </button>
            ))}
          </div>
        </div>

        {/* Remember */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
            style={{ accentColor: "#2357A6" }} />
          <span style={{ color: "#94A3B8", fontSize: 13 }}>Lembrar login</span>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="btn-primary"
          style={{ width: "100%", padding: 14, fontSize: 15, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 16, height: 16, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite", display: "inline-block" }} />
              Entrando...
            </span>
          ) : "Entrar no Sistema"}
        </button>

        {/* Demo credentials */}
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <div style={{ color: "#475569", fontSize: 11, marginBottom: 4 }}>Credenciais de demonstração:</div>
          <div style={{ color: "#64748B", fontSize: 12 }}>
            <span style={{ fontWeight: 600 }}>admin</span> / <span style={{ fontWeight: 600 }}>admin</span>
            &nbsp;&nbsp;ou&nbsp;&nbsp;
            <span style={{ fontWeight: 600 }}>func</span> / <span style={{ fontWeight: 600 }}>func</span>
          </div>
        </div>

        {/* Version */}
        <div style={{ marginTop: 24, textAlign: "center", color: "#475569", fontSize: 10 }}>
          HEFARMA Body Analysis System v1.0.0
        </div>
      </div>
    </div>
  );
}
