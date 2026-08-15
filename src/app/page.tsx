"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";

// Dynamic imports for code splitting
const HomeScreen = dynamic(() => import("@/components/HomeScreen"), { ssr: false });
const LoginScreen = dynamic(() => import("@/components/LoginScreen"), { ssr: false });
const PatientRegistration = dynamic(() => import("@/components/PatientRegistration"), { ssr: false });
const PatientList = dynamic(() => import("@/components/PatientList"), { ssr: false });
const NewEvaluation = dynamic(() => import("@/components/NewEvaluation"), { ssr: false });
const DashboardView = dynamic(() => import("@/components/DashboardView"), { ssr: false });
const PatientHistory = dynamic(() => import("@/components/PatientHistory"), { ssr: false });
const ReportView = dynamic(() => import("@/components/ReportView"), { ssr: false });
const SettingsView = dynamic(() => import("@/components/SettingsView"), { ssr: false });
const DeployGuide = dynamic(() => import("@/components/DeployGuide"), { ssr: false });

export type AppView = 
  | "login" 
  | "home" 
  | "new-patient" 
  | "patient-list" 
  | "new-evaluation" 
  | "dashboard" 
  | "history" 
  | "report" 
  | "settings"
  | "deploy";

export interface UserInfo {
  id: number;
  name: string;
  role: string;
  username: string;
}

export interface AppContext {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  user: UserInfo | null;
  setUser: (user: UserInfo | null) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  selectedPatientId: number | null;
  setSelectedPatientId: (id: number | null) => void;
  selectedEvaluationId: number | null;
  setSelectedEvaluationId: (id: number | null) => void;
  refreshKey: number;
  triggerRefresh: () => void;
}

export default function MainApp() {
  const [currentView, setCurrentView] = useState<AppView>("login");
  const [user, setUser] = useState<UserInfo | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [selectedEvaluationId, setSelectedEvaluationId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("hefarma-theme");
      if (saved === "dark") setDarkMode(true);
      const savedUser = localStorage.getItem("hefarma-user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setCurrentView("home");
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("hefarma-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("hefarma-theme", "light");
    }
  }, [darkMode]);

  const toggleDarkMode = useCallback(() => setDarkMode(d => !d), []);
  const triggerRefresh = useCallback(() => setRefreshKey(k => k + 1), []);

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("hefarma-user");
    setCurrentView("login");
  }, []);

  const handleLogin = useCallback((u: UserInfo) => {
    setUser(u);
    localStorage.setItem("hefarma-user", JSON.stringify(u));
    setCurrentView("home");
  }, []);

  const ctx: AppContext = {
    currentView, setCurrentView,
    user, setUser,
    darkMode, toggleDarkMode,
    selectedPatientId, setSelectedPatientId,
    selectedEvaluationId, setSelectedEvaluationId,
    refreshKey, triggerRefresh,
  };

  if (loading) {
    return (
      <div style={{ 
        display: "flex", alignItems: "center", justifyContent: "center", 
        height: "100vh", background: "#0F172A" 
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 48, height: 48, border: "4px solid #2357A6", 
            borderTopColor: "transparent", borderRadius: "50%", 
            animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
          <div style={{ color: "#94A3B8", fontSize: 14 }}>Carregando HEFARMA...</div>
        </div>
      </div>
    );
  }

  if (currentView === "login" || !user) {
    return <LoginScreen onLogin={handleLogin} ctx={ctx} />;
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--hefarma-bg)", overflow: "hidden" }}>
      {/* Sidebar */}
      <Sidebar ctx={ctx} onLogout={handleLogout} />
      
      {/* Main Content */}
      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Top Bar */}
        <TopBar ctx={ctx} onLogout={handleLogout} />
        
        {/* Content Area */}
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
          <div className="animate-fade-in" key={currentView + refreshKey}>
            {currentView === "home" && <HomeScreen ctx={ctx} />}
            {currentView === "new-patient" && <PatientRegistration ctx={ctx} />}
            {currentView === "patient-list" && <PatientList ctx={ctx} />}
            {currentView === "new-evaluation" && <NewEvaluation ctx={ctx} />}
            {currentView === "dashboard" && <DashboardView ctx={ctx} />}
            {currentView === "history" && <PatientHistory ctx={ctx} />}
            {currentView === "report" && <ReportView ctx={ctx} />}
            {currentView === "settings" && <SettingsView ctx={ctx} />}
            {currentView === "deploy" && <DeployGuide ctx={ctx} />}
          </div>
        </div>

        {/* Status Bar */}
        <StatusBar ctx={ctx} />
      </main>
    </div>
  );
}

// ==================== SIDEBAR ====================
import { 
  Home, UserPlus, ClipboardList, BarChart3, FileText, 
  Settings, LogOut, Activity, Users, Search, Moon, Sun, Rocket
} from "lucide-react";

const navItems: { view: AppView; label: string; icon: any }[] = [
  { view: "home", label: "Início", icon: Home },
  { view: "new-patient", label: "Novo Paciente", icon: UserPlus },
  { view: "patient-list", label: "Pacientes", icon: Users },
  { view: "new-evaluation", label: "Nova Avaliação", icon: ClipboardList },
  { view: "history", label: "Histórico", icon: Search },
  { view: "dashboard", label: "Dashboard", icon: BarChart3 },
  { view: "report", label: "Relatório", icon: FileText },
  { view: "settings", label: "Configurações", icon: Settings },
  { view: "deploy", label: "Publicar App", icon: Rocket },
];

// XLSX Export function
async function exportXLSX() {
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
  } catch {}
}

function Sidebar({ ctx, onLogout }: { ctx: AppContext; onLogout: () => void }) {
  return (
    <aside style={{
      width: 240, background: "linear-gradient(180deg, #1E293B 0%, #0F172A 100%)",
      display: "flex", flexDirection: "column", borderRight: "1px solid #334155",
      overflow: "hidden",
    }}>
      {/* Logo Area */}
      <div style={{ padding: "20px 16px", borderBottom: "1px solid #334155", textAlign: "center" }}>
        <div style={{
          background: "linear-gradient(135deg, #2357A6 0%, #3B82F6 100%)",
          borderRadius: 12, padding: "12px 16px", display: "inline-block",
        }}>
          <span style={{ color: "white", fontSize: 22, fontWeight: 800, letterSpacing: 1 }}>HEFARMA</span>
        </div>
        <div style={{ color: "#94A3B8", fontSize: 10, marginTop: 4, letterSpacing: 2, textTransform: "uppercase" }}>
          Body Analysis
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
        {navItems.map(item => {
          const isActive = ctx.currentView === item.view;
          const Icon = item.icon;
          return (
            <button
              key={item.view}
              onClick={() => ctx.setCurrentView(item.view)}
              style={{
                display: "flex", alignItems: "center", gap: 12, width: "100%",
                padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer",
                background: isActive ? "rgba(35,87,166,0.2)" : "transparent",
                color: isActive ? "#3B82F6" : "#94A3B8",
                fontWeight: isActive ? 600 : 400, fontSize: 13,
                transition: "all 0.2s", marginBottom: 2, textAlign: "left",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "rgba(148,163,184,0.1)"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Theme Toggle */}
      <div style={{ padding: "8px 16px", borderTop: "1px solid #334155" }}>
        <button
          onClick={ctx.toggleDarkMode}
          style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%",
            padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer",
            background: "transparent", color: "#94A3B8", fontSize: 13,
          }}
        >
          {ctx.darkMode ? <Sun size={16} /> : <Moon size={16} />}
          <span>{ctx.darkMode ? "Modo Claro" : "Modo Escuro"}</span>
        </button>
        <button
          onClick={exportXLSX}
          style={{
            display: "flex", alignItems: "center", gap: 10, width: "100%",
            padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer",
            background: "transparent", color: "#10B981", fontSize: 13, marginTop: 4,
          }}
        >
          <FileText size={16} />
          <span>Exportar .XLSX</span>
        </button>
      </div>

      {/* User Info */}
      {ctx.user && (
        <div style={{ padding: "12px 16px", borderTop: "1px solid #334155" }}>
          <div style={{ color: "#E2E8F0", fontSize: 12, fontWeight: 600 }}>{ctx.user.name}</div>
          <div style={{ color: "#64748B", fontSize: 10, textTransform: "uppercase" }}>{ctx.user.role}</div>
        </div>
      )}
    </aside>
  );
}

// ==================== TOP BAR ====================
function TopBar({ ctx, onLogout }: { ctx: AppContext; onLogout: () => void }) {
  const viewTitles: Record<AppView, string> = {
    login: "Login", home: "Painel Principal", "new-patient": "Novo Paciente",
    "patient-list": "Lista de Pacientes", "new-evaluation": "Nova Avaliação",
    dashboard: "Dashboard", history: "Histórico do Paciente",
    report: "Relatório", settings: "Configurações", deploy: "Publicação e Deploy",
  };

  const today = new Date().toLocaleDateString("pt-BR", { 
    weekday: "long", year: "numeric", month: "long", day: "numeric" 
  });

  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", height: 56, borderBottom: "1px solid var(--hefarma-border)",
      background: "var(--hefarma-card)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Activity size={20} style={{ color: "#2357A6" }} />
        <span style={{ fontWeight: 700, fontSize: 16, color: "var(--hefarma-text)" }}>
          {viewTitles[ctx.currentView]}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <span style={{ color: "var(--hefarma-text-light)", fontSize: 12 }}>{today}</span>
        <span style={{ color: "var(--hefarma-text-light)", fontSize: 12 }}>v1.0.0</span>
        <button onClick={onLogout} style={{
          display: "flex", alignItems: "center", gap: 6, background: "transparent",
          border: "none", cursor: "pointer", color: "#EF385A", fontSize: 13, fontWeight: 600,
        }}>
          <LogOut size={16} /> Sair
        </button>
      </div>
    </header>
  );
}

// ==================== STATUS BAR ====================
function StatusBar({ ctx }: { ctx: AppContext }) {
  return (
    <footer style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", height: 28, borderTop: "1px solid var(--hefarma-border)",
      background: "var(--hefarma-card)", fontSize: 11, color: "var(--hefarma-text-light)",
    }}>
      <span>HEFARMA Body Analysis System © 2024</span>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ color: "#10B981" }}>● Conectado</span>
        <span>PostgreSQL</span>
      </div>
    </footer>
  );
}
