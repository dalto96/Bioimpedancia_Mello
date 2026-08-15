"use client";

import { Globe, Server, Database, Shield, Key, Copy, CheckCircle, AlertCircle, HelpCircle, Monitor, Download, User, FolderOpen } from "lucide-react";
import { useState } from "react";
import type { AppContext } from "@/app/page";

export default function DeployGuide({ ctx }: { ctx: AppContext }) {
  const [copied, setCopied] = useState("");
  const [step, setStep] = useState(0);

  const copyCmd = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  };

  const Cmd = ({ children, id }: { children: string; id: string }) => (
    <div style={{ position: "relative", margin: "8px 0 16px" }}>
      <pre style={{ background: "#0F172A", color: "#E2E8F0", padding: "12px 48px 12px 16px", borderRadius: 8, fontSize: 12, fontFamily: "'Consolas', monospace", overflow: "auto", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
        {children}
      </pre>
      <button onClick={() => copyCmd(children, id)} style={{ position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 4, padding: "4px 10px", cursor: "pointer", color: copied === id ? "#10B981" : "#94A3B8", fontSize: 11, fontWeight: 600 }}>
        {copied === id ? "✓ Copiado!" : "Copiar"}
      </button>
    </div>
  );

  const StepBox = ({ num, title, children }: { num: number; title: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #2357A6, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
          {num}
        </div>
        <h4 style={{ fontSize: 15, fontWeight: 700, color: "var(--hefarma-text)", margin: 0 }}>{title}</h4>
      </div>
      <div style={{ marginLeft: 44 }}>{children}</div>
    </div>
  );

  const Tip = ({ children }: { children: React.ReactNode }) => (
    <div style={{ background: "rgba(35,87,166,0.05)", border: "1px solid rgba(35,87,166,0.15)", borderRadius: 8, padding: "10px 14px", margin: "8px 0", fontSize: 12, color: "var(--hefarma-text-light)", display: "flex", gap: 8, alignItems: "flex-start" }}>
      <HelpCircle size={16} style={{ color: "#2357A6", flexShrink: 0, marginTop: 1 }} />
      <span>{children}</span>
    </div>
  );

  const Warn = ({ children }: { children: React.ReactNode }) => (
    <div style={{ background: "rgba(239,56,90,0.05)", border: "1px solid rgba(239,56,90,0.15)", borderRadius: 8, padding: "10px 14px", margin: "8px 0", fontSize: 12, color: "#991B1B", display: "flex", gap: 8, alignItems: "flex-start" }}>
      <AlertCircle size={16} style={{ color: "#EF385A", flexShrink: 0, marginTop: 1 }} />
      <span>{children}</span>
    </div>
  );

  const P = ({ children }: { children: React.ReactNode }) => (
    <p style={{ fontSize: 13, color: "var(--hefarma-text-light)", lineHeight: 1.7, margin: "4px 0" }}>{children}</p>
  );

  const Link = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "#2357A6", fontWeight: 600, textDecoration: "underline" }}>{children}</a>
  );

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 4, display: "flex", alignItems: "center", gap: 10 }}>
        <Globe size={24} style={{ color: "#2357A6" }} />
        Como Publicar o HEFARMA na Internet
      </h2>
      <p style={{ fontSize: 14, color: "var(--hefarma-text-light)", marginBottom: 24 }}>
        Guia passo a passo para leigos — do zero até o sistema funcionando
      </p>

      {/* INTRO */}
      <div style={{ background: "linear-gradient(135deg, #2357A6, #3B82F6)", borderRadius: 16, padding: 24, marginBottom: 24, color: "white" }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>🎯 Objetivo Final</h3>
        <p style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.6 }}>
          Ao final deste guia, você terá o <strong>HEFARMA Body Analysis System</strong> funcionando na internet com um endereço tipo:
        </p>
        <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "10px 16px", marginTop: 8, fontFamily: "monospace", fontSize: 14, textAlign: "center" }}>
          https://hefarma-body-analysis.vercel.app
        </div>
        <p style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
          Qualquer pessoa com esse link poderá acessar (você pode proteger com senha depois).
        </p>
      </div>

      {/* OVERVIEW */}
      <div className="hefarma-card" style={{ padding: 20, marginBottom: 24 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 12 }}>📋 Visão Geral — São 6 Passos</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {[
            { n: 1, text: "Instalar o Git no computador" },
            { n: 2, text: "Criar conta no GitHub" },
            { n: 3, text: "Subir o código para o GitHub" },
            { n: 4, text: "Criar banco de dados (Supabase)" },
            { n: 5, text: "Fazer deploy no Vercel" },
            { n: 6, text: "Configurar e testar!" },
          ].map(s => (
            <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 8, padding: 10, background: "var(--hefarma-card)", borderRadius: 8, border: "1px solid var(--hefarma-border)" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#2357A6", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{s.n}</div>
              <span style={{ fontSize: 12, color: "var(--hefarma-text-light)" }}>{s.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================ */}
      {/* STEP 1: INSTALAR GIT */}
      {/* ============================================ */}
      <div className="hefarma-card" style={{ padding: 24, marginBottom: 16 }}>
        <StepBox num={1} title="Instalar o Git no seu computador (Windows)">
          <P>O Git é um programa que envia seu código para a internet. <strong>Seu erro aconteceu porque o Git não está instalado.</strong></P>

          <P><strong>1a)</strong> Abra o navegador e acesse:</P>
          <div style={{ background: "var(--hefarma-card)", border: "1px solid var(--hefarma-border)", borderRadius: 8, padding: "10px 16px", margin: "8px 0", textAlign: "center" }}>
            <Link href="https://git-scm.com/download/win">https://git-scm.com/download/win</Link>
          </div>
          <Tip>Clique no link acima. Vai começar um download automaticamente.</Tip>

          <P><strong>1b)</strong> O download vai baixar um arquivo <code style={{ background: "var(--hefarma-border)", padding: "2px 6px", borderRadius: 4 }}>Git-2.xx.x-64-bit.exe</code>. Dê dois cliques para instalar.</P>

          <P><strong>1c)</strong> Na instalação, clique <strong>"Next"</strong> em todas as telas. <strong>Não mude nada</strong>, apenas clique Next até aparecer <strong>"Install"</strong>. Clique Install. Depois clique <strong>"Finish"</strong>.</P>

          <Warn>Não altere nenhuma opção durante a instalação. Mantenha tudo como está e só clique Next.</Warn>

          <P><strong>1d)</strong> Após instalar, <strong>feche e reabra</strong> o terminal (Prompt de Comando ou PowerShell). Teste digitando:</P>
          <Cmd id="g1">{`git --version`}</Cmd>
          <P>Deve aparecer algo como <code style={{ background: "var(--hefarma-border)", padding: "2px 6px", borderRadius: 4 }}>git version 2.47.1</code>. Se aparecer, o Git está instalado! ✅</P>

          <Warn>Se ainda der erro "git não é reconhecido", feche TODOS os terminais, abra um novo e tente novamente. Se persistir, reinicie o computador.</Warn>
        </StepBox>
      </div>

      {/* ============================================ */}
      {/* STEP 2: CONTA GITHUB */}
      {/* ============================================ */}
      <div className="hefarma-card" style={{ padding: 24, marginBottom: 16 }}>
        <StepBox num={2} title="Criar conta no GitHub">
          <P>O GitHub é como um "Google Drive para código" — é onde o seu código fica guardado na nuvem.</P>

          <P><strong>2a)</strong> Acesse:</P>
          <div style={{ background: "var(--hefarma-card)", border: "1px solid var(--hefarma-border)", borderRadius: 8, padding: "10px 16px", margin: "8px 0", textAlign: "center" }}>
            <Link href="https://github.com/signup">https://github.com/signup</Link>
          </div>

          <P><strong>2b)</strong> Preencha:</P>
          <ul style={{ fontSize: 13, color: "var(--hefarma-text-light)", marginLeft: 20, lineHeight: 2 }}>
            <li><strong>Email</strong> — seu email pessoal</li>
            <li><strong>Senha</strong> — crie uma senha forte</li>
            <li><strong>Username</strong> — ex: <code style={{ background: "var(--hefarma-border)", padding: "2px 6px", borderRadius: 4 }}>hefarma-farmacia</code></li>
          </ul>

          <P><strong>2c)</strong> Confirme o email (vai chegar um email do GitHub, clique no link).</P>

          <P><strong>2d)</strong> Configure seu nome no Git (abra o terminal e digite):</P>
          <Cmd id="g2">{`git config --global user.name "Seu Nome"
git config --global user.email "seu-email@exemplo.com"`}</Cmd>
          <Tip>Substitua "Seu Nome" e o email pelos dados que usou no GitHub.</Tip>
        </StepBox>
      </div>

      {/* ============================================ */}
      {/* STEP 3: SUBIR CÓDIGO */}
      {/* ============================================ */}
      <div className="hefarma-card" style={{ padding: 24, marginBottom: 16 }}>
        <StepBox num={3} title="Criar repositório e subir o código">
          <P>Agora vamos colocar o código do HEFARMA no GitHub.</P>

          <P><strong>3a)</strong> No GitHub, clique no botão <strong>"+"</strong> (canto superior direito) → <strong>"New repository"</strong></P>

          <P><strong>3b)</strong> Preencha:</P>
          <ul style={{ fontSize: 13, color: "var(--hefarma-text-light)", marginLeft: 20, lineHeight: 2 }}>
            <li><strong>Repository name</strong>: <code style={{ background: "var(--hefarma-border)", padding: "2px 6px", borderRadius: 4 }}>hefarma-body-analysis</code></li>
            <li>Marque <strong>"Private"</strong> (para ninguém ver seu código)</li>
            <li>Não marque "Add a README"</li>
            <li>Clique em <strong>"Create repository"</strong></li>
          </ul>

          <P><strong>3c)</strong> Agora, no seu computador, abra o terminal (Prompt de Comando) e digite os comandos abaixo, <strong>UM POR UM</strong>, pressionando Enter após cada um:</P>

          <Warn>Substitua <code>SEU-USUARIO</code> pelo seu username do GitHub (que você criou no passo 2).</Warn>

          <Cmd id="g3">{`cd C:\\Users\\Usuário\\caminho\\para\\pasta\\do-projeto

git init

git add .

git commit -m "Versão inicial HEFARMA Body Analysis System"

git branch -M main

git remote add origin https://github.com/SEU-USUARIO/hefarma-body-analysis.git

git push -u origin main`}</Cmd>

          <Tip><strong>Explicação de cada comando:</strong><br/>
          • <code>cd</code> = entra na pasta do projeto (mude o caminho para onde está o código)<br/>
          • <code>git init</code> = inicializa o Git na pasta<br/>
          • <code>git add .</code> = prepara todos os arquivos<br/>
          • <code>git commit</code> = salva essa versão<br/>
          • <code>git branch -M main</code> = nomeia a branch como main<br/>
          • <code>git remote add origin</code> = conecta ao GitHub<br/>
          • <code>git push</code> = envia o código para o GitHub
          </Tip>

          <Warn>Se o <code>git push</code> pedir login, o GitHub vai abrir uma janela do navegador para você autorizar. Clique em "Authorize git". Se pedir senha, use um <strong>Personal Access Token</strong> (vá em GitHub.com → Settings → Developer settings → Personal access tokens → Generate new token → marque "repo" → copie o token e use como senha).</Warn>

          <P><strong>3d)</strong> Volte no GitHub e recarregue a página. Você deve ver seus arquivos lá! ✅</P>
        </StepBox>
      </div>

      {/* ============================================ */}
      {/* STEP 4: BANCO DE DADOS */}
      {/* ============================================ */}
      <div className="hefarma-card" style={{ padding: 24, marginBottom: 16 }}>
        <StepBox num={4} title="Criar o banco de dados (Supabase — Grátis)">
          <P>O banco de dados é onde ficam guardados os pacientes, avaliações, etc. Vamos usar o Supabase que é gratuito.</P>

          <P><strong>4a)</strong> Acesse:</P>
          <div style={{ background: "var(--hefarma-card)", border: "1px solid var(--hefarma-border)", borderRadius: 8, padding: "10px 16px", margin: "8px 0", textAlign: "center" }}>
            <Link href="https://supabase.com">https://supabase.com</Link>
          </div>

          <P><strong>4b)</strong> Clique em <strong>"Start your project"</strong> → <strong>"Sign up"</strong> (pode usar conta do GitHub)</P>

          <P><strong>4c)</strong> Clique em <strong>"New project"</strong></P>
          <ul style={{ fontSize: 13, color: "var(--hefarma-text-light)", marginLeft: 20, lineHeight: 2 }}>
            <li><strong>Organization</strong>: selecione a que aparecer</li>
            <li><strong>Project name</strong>: <code style={{ background: "var(--hefarma-border)", padding: "2px 6px", borderRadius: 4 }}>hefarma</code></li>
            <li><strong>Database password</strong>: crie uma senha forte e <strong>ANOTE EM ALGUM LUGAR</strong></li>
            <li><strong>Region</strong>: selecione <strong>"South America ( São Paulo )"</strong></li>
            <li>Clique em <strong>"Create new project"</strong></li>
          </ul>

          <P><strong>4d)</strong> Aguarde uns 2 minutos enquanto o projeto é criado.</P>

          <P><strong>4e)</strong> No menu lateral, clique em <strong>"Project Settings"</strong> (ícone de engrenagem) → <strong>"Database"</strong></P>

          <P><strong>4f)</strong> Role a página até <strong>"Connection string"</strong> → selecione a aba <strong>"URI"</strong></P>

          <P><strong>4g)</strong> Copie a URL de conexão. Vai parecer algo assim:</P>
          <Cmd id="g4">{`postgresql://postgres.xxxxx:SUA-SENHA@aws-0-sa-east-1.pooler.supabase.com:6543/postgres`}</Cmd>

          <Warn><strong>IMPORTANTE:</strong> Nessa URL, substitua <code>[YOUR-PASSWORD]</code> pela senha que você criou no passo 4c. Anote essa URL completa — vamos precisar no próximo passo!</Warn>
        </StepBox>
      </div>

      {/* ============================================ */}
      {/* STEP 5: VERCEL DEPLOY */}
      {/* ============================================ */}
      <div className="hefarma-card" style={{ padding: 24, marginBottom: 16 }}>
        <StepBox num={5} title="Fazer o deploy no Vercel (onde o sistema vai rodar)">
          <P>O Vercel é a plataforma que vai hospedar o HEFARMA na internet. É gratuito!</P>

          <P><strong>5a)</strong> Acesse:</P>
          <div style={{ background: "var(--hefarma-card)", border: "1px solid var(--hefarma-border)", borderRadius: 8, padding: "10px 16px", margin: "8px 0", textAlign: "center" }}>
            <Link href="https://vercel.com/signup">https://vercel.com/signup</Link>
          </div>

          <P><strong>5b)</strong> Clique em <strong>"Continue with GitHub"</strong> (use a mesma conta do GitHub)</P>

          <P><strong>5c)</strong> Após criar conta, clique em <strong>"Add New..."</strong> → <strong>"Project"</strong></P>

          <P><strong>5d)</strong> Você verá uma lista dos seus repositórios do GitHub. Clique em <strong>"Import"</strong> ao lado do <code>hefarma-body-analysis</code></P>

          <Tip>Se não aparecer, clique em <strong>"Adjust the GitHub App Permissions"</strong> e autorize o acesso ao repositório.</Tip>

          <P><strong>5e)</strong> Na tela de configuração, NÃO mude nada no Framework Preset (deixe Next.js automático).</P>

          <P><strong>5f)</strong> Na seção <strong>"Environment Variables"</strong>, adicione:</P>
          <ul style={{ fontSize: 13, color: "var(--hefarma-text-light)", marginLeft: 20, lineHeight: 2 }}>
            <li><strong>Name</strong>: <code style={{ background: "var(--hefarma-border)", padding: "2px 6px", borderRadius: 4 }}>DATABASE_URL</code></li>
            <li><strong>Value</strong>: cole a URL do Supabase que copiou no passo 4g (com a senha já substituída)</li>
          </ul>
          <P>Clique em <strong>"Add"</strong> e depois em <strong>"Deploy"</strong></P>

          <P><strong>5g)</strong> Aguarde 2-3 minutos. O Vercel vai construir o projeto.</P>

          <P><strong>5h)</strong> Quando aparecer <strong>"🎉 Congratulations!"</strong>, clique em <strong>"Visit"</strong> para ver seu sistema rodando! ✅</P>

          <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 8, padding: 16, margin: "12px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <CheckCircle size={18} style={{ color: "#10B981" }} />
              <span style={{ fontWeight: 700, color: "#10B981", fontSize: 14 }}>SEU SISTEMA ESTÁ NO AR!</span>
            </div>
            <P>O endereço será algo como: <strong style={{ color: "#2357A6" }}>https://hefarma-body-analysis.vercel.app</strong></P>
          </div>
        </StepBox>
      </div>

      {/* ============================================ */}
      {/* STEP 6: CONFIGURAR */}
      {/* ============================================ */}
      <div className="hefarma-card" style={{ padding: 24, marginBottom: 16 }}>
        <StepBox num={6} title="Criar as tabelas e configurar o sistema">
          <P>Antes de usar, precisamos criar as tabelas no banco de dados e mudar as senhas.</P>

          <P><strong>6a) Criar as tabelas:</strong></P>
          <P>Instale o Vercel CLI no seu computador (abra o terminal como Administrador):</P>
          <Cmd id="g5">{`npm install -g vercel`}</Cmd>

          <P>Conecte ao seu projeto:</P>
          <Cmd id="g6">{`cd C:\\caminho\\para\\hefarma-body-analysis
vercel link`}</Cmd>
          <Tip>Selecione seu projeto quando aparecer a lista.</Tip>

          <P>Baixe as variáveis de ambiente:</P>
          <Cmd id="g7">{`vercel env pull .env.local`}</Cmd>

          <P>Crie as tabelas no banco:</P>
          <Cmd id="g8">{`npx drizzle-kit push`}</Cmd>
          <Tip>Isso vai criar todas as tabelas (pacientes, avaliações, etc.) no banco do Supabase.</Tip>

          <P><strong>6b) Acesse o sistema</strong> no link do Vercel (ex: https://hefarma-body-analysis.vercel.app)</P>

          <P><strong>6c) Faça login</strong> com as credenciais padrão:</P>
          <ul style={{ fontSize: 13, color: "var(--hefarma-text-light)", marginLeft: 20, lineHeight: 2 }}>
            <li>Administrador: <code style={{ background: "var(--hefarma-border)", padding: "2px 6px", borderRadius: 4 }}>admin</code> / <code style={{ background: "var(--hefarma-border)", padding: "2px 6px", borderRadius: 4 }}>admin</code></li>
            <li>Funcionário: <code style={{ background: "var(--hefarma-border)", padding: "2px 6px", borderRadius: 4 }}>func</code> / <code style={{ background: "var(--hefarma-border)", padding: "2px 6px", borderRadius: 4 }}>func</code></li>
          </ul>

          <Warn><strong>IMPORTANTE:</strong> Mude essas senhas padrão o mais rápido possível! Vá em Configurações → Usuários.</Warn>

          <P><strong>6d) Cadastre o primeiro paciente</strong> e faça uma avaliação de teste.</P>
        </StepBox>
      </div>

      {/* ============================================ */}
      {/* EXTRA CONFIG */}
      {/* ============================================ */}
      <div className="hefarma-card" style={{ padding: 24, marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
          <Shield size={18} style={{ color: "#EF385A" }} /> Configurações Extras (Opcional)
        </h3>

        <details style={{ marginBottom: 12 }}>
          <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: 14, color: "#2357A6", marginBottom: 8 }}>
            🌐 Como colocar domínio próprio (ex: hefarma.com.br)
          </summary>
          <div style={{ marginLeft: 16, marginTop: 8 }}>
            <P>1. Compre um domínio em <Link href="https://registro.br">registro.br</Link> (~R$40/ano para .com.br)</P>
            <P>2. No Vercel, vá em Settings → Domains → digite <code style={{ background: "var(--hefarma-border)", padding: "2px 6px", borderRadius: 4 }}>hefarma.com.br</code></P>
            <P>3. O Vercel vai mostrar 2 registros DNS. Copie esses valores.</P>
            <P>4. No registro.br, vá em DNS → adicione os registros que o Vercel mostrou.</P>
            <P>5. Aguarde até 24h para propagar. Depois, acesse <strong>https://hefarma.com.br</strong></P>
          </div>
        </details>

        <details style={{ marginBottom: 12 }}>
          <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: 14, color: "#2357A6", marginBottom: 8 }}>
            🔄 Como atualizar o sistema (quando houver mudanças)
          </summary>
          <div style={{ marginLeft: 16, marginTop: 8 }}>
            <P>Quando você fizer alterações no código, repita este processo:</P>
            <Cmd id="g9">{`git add .
git commit -m "Descrição da mudança"
git push`}</Cmd>
            <P>O Vercel detecta automaticamente e faz novo deploy em ~2 minutos!</P>
          </div>
        </details>

        <details style={{ marginBottom: 12 }}>
          <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: 14, color: "#2357A6", marginBottom: 8 }}>
            🗄️ Como fazer backup do banco de dados
          </summary>
          <div style={{ marginLeft: 16, marginTop: 8 }}>
            <P>No Supabase:</P>
            <P>1. Vá em <strong>Project Settings → Database</strong></P>
            <P>2. Clique em <strong>"Download backup"</strong></P>
            <P>Ou use o pg_dump via terminal:</P>
            <Cmd id="g10">{`pg_dump "SUA_DATABASE_URL" > hefarma_backup.sql`}</Cmd>
            <Tip>Faça backup semanalmente para não perder dados.</Tip>
          </div>
        </details>

        <details style={{ marginBottom: 12 }}>
          <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: 14, color: "#2357A6", marginBottom: 8 }}>
            📱 Como acessar do celular/tablet
          </summary>
          <div style={{ marginLeft: 16, marginTop: 8 }}>
            <P>Basta abrir o navegador do celular e digitar o endereço do sistema (ex: <strong>https://hefarma-body-analysis.vercel.app</strong>). O HEFARMA é responsivo e funciona em qualquer dispositivo!</P>
          </div>
        </details>

        <details>
          <summary style={{ cursor: "pointer", fontWeight: 700, fontSize: 14, color: "#2357A6", marginBottom: 8 }}>
            🏥 E se eu quiser rodar só na farmácia (sem internet)?
          </summary>
          <div style={{ marginLeft: 16, marginTop: 8 }}>
            <P>É possível rodar o HEFARMA em um computador da farmácia. Os outros computadores da rede acessam pelo IP local.</P>
            <P><strong>Requisitos:</strong> Node.js instalado, PostgreSQL instalado, 4GB RAM mínimo.</P>
            <Cmd id="g11">{`# Instalar Node.js: https://nodejs.org (versão LTS)
# Instalar PostgreSQL: https://www.postgresql.org/download/windows/

# No terminal, entrar na pasta do projeto:
cd C:\\hefarma-body-analysis

# Instalar dependências:
npm install

# Criar arquivo .env com:
# DATABASE_URL=postgresql://postgres:sua_senha@localhost:5432/hefarma_db

# Criar banco:
npx drizzle-kit push

# Construir:
npm run build

# Iniciar:
npm run start`}</Cmd>
            <P>Outros computadores acessam: <strong>http://IP-DO-SERVIDOR:3000</strong></P>
            <P>Para descobrir o IP, digite <code style={{ background: "var(--hefarma-border)", padding: "2px 6px", borderRadius: 4 }}>ipconfig</code> no terminal do servidor.</P>
          </div>
        </details>
      </div>

      {/* ============================================ */}
      {/* RESUMO */}
      {/* ============================================ */}
      <div style={{ background: "linear-gradient(135deg, #1E293B, #0F172A)", borderRadius: 16, padding: 24, marginBottom: 16, color: "white" }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 12 }}>✅ Resumo — O que você vai precisar</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { icon: "⬇️", text: "Instalar Git (1 vez)", time: "5 min" },
            { icon: "📝", text: "Criar conta GitHub", time: "5 min" },
            { icon: "📤", text: "Subir código", time: "10 min" },
            { icon: "🗄️", text: "Criar banco Supabase", time: "10 min" },
            { icon: "🚀", text: "Deploy no Vercel", time: "5 min" },
            { icon: "⚙️", text: "Criar tabelas + testar", time: "10 min" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.08)", padding: "10px 14px", borderRadius: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                <span style={{ fontSize: 13 }}>{s.text}</span>
              </div>
              <span style={{ fontSize: 11, opacity: 0.6 }}>{s.time}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 16, textAlign: "center", padding: "12px 0", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <span style={{ fontSize: 14, opacity: 0.8 }}>⏱️ Tempo total estimado: </span>
          <span style={{ fontSize: 20, fontWeight: 700 }}>~45 minutos</span>
          <span style={{ fontSize: 14, opacity: 0.8 }}> (primeira vez)</span>
        </div>
        <div style={{ marginTop: 8, textAlign: "center" }}>
          <span style={{ fontSize: 13, opacity: 0.7 }}>💰 Custo mensal: </span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#10B981" }}>R$ 0,00</span>
          <span style={{ fontSize: 13, opacity: 0.7 }}> (tudo grátis)</span>
        </div>
      </div>

      {/* Help */}
      <div className="hefarma-card" style={{ padding: 20, borderLeft: "4px solid #F59E0B" }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: "var(--hefarma-text)", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
          <HelpCircle size={16} style={{ color: "#F59E0B" }} /> Problemas comuns
        </h4>
        <div style={{ fontSize: 12, color: "var(--hefarma-text-light)", lineHeight: 1.8 }}>
          <p><strong>"git não é reconhecido"</strong> → Git não está instalado. Volte ao Passo 1.</p>
          <p><strong>"fatal: not a git repository"</strong> → Execute <code style={{ background: "var(--hefarma-border)", padding: "1px 4px", borderRadius: 3 }}>git init</code> primeiro.</p>
          <p><strong>"remote: Repository not found"</strong> → O username do GitHub está errado no comando. Verifique.</p>
          <p><strong>"error: failed to push"</strong> → Precisa autorizar o Git no GitHub. Use Personal Access Token.</p>
          <p><strong>Vercel build error</strong> → Verifique se a DATABASE_URL está correta nas Environment Variables.</p>
          <p><strong>Tela branca ao acessar</strong> → Aguarde 1-2 min após deploy. Se persistir, verifique os logs no Vercel.</p>
        </div>
      </div>
    </div>
  );
}
