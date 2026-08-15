import { NextResponse } from "next/server";
import { demoPatients, demoEvaluations, demoUsers } from "@/lib/demo-data";
import ExcelJS from "exceljs";

export async function GET() {
  try {
    let allPatients = demoPatients;
    let allEvals = demoEvaluations;
    let allUsers = demoUsers;

    if (process.env.DATABASE_URL) {
      try {
        const { getDb } = await import("@/db");
        const db = await getDb();
        if (db) {
          const { patients: patTable, evaluations: evalTable, users: userTable } = await import("@/db/schema");
          const { desc } = await import("drizzle-orm");
          allPatients = await db.select().from(patTable).orderBy(patTable.createdAt);
          allEvals = await db.select().from(evalTable).orderBy(desc(evalTable.evaluationDate));
          allUsers = await db.select().from(userTable);
        }
      } catch { /* use demo */ }
    }

    const B="FF2357A6",R="FFEF385A",D="FF1E293B",L="FFF8FAFC",W="FFFFFFFF",G="FF10B981",Y="FFF59E0B",O="FF97316",P="FF8B5CF6",C="FF06B6D4",GR="FF64748B";
    const wf=(s:number,b=false)=>({size:s,bold:b,color:{argb:W},name:"Segoe UI"});
    const nf=(s=10,b=false)=>({size:s,bold:b,name:"Segoe UI"});
    const cf=(c:string)=>({type:"pattern" as const,pattern:"solid" as const,fgColor:{argb:c}});
    const ca=()=>({horizontal:"center" as const,vertical:"middle" as const});

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "HEFARMA Body Analysis System";
    workbook.created = new Date();

    // ===== DASHBOARD =====
    const ws = workbook.addWorksheet("Dashboard",{properties:{tabColor:{argb:"2357A6"}}});
    ws.columns=[{width:3},{width:24},{width:18},{width:18},{width:18},{width:18},{width:18}];
    ws.mergeCells("B2:G2");ws.getCell("B2").value="HEFARMA BODY ANALYSIS SYSTEM";ws.getCell("B2").font=wf(20,true);ws.getCell("B2").fill=cf(B);ws.getCell("B2").alignment=ca();ws.getRow(2).height=40;
    ws.mergeCells("B3:G3");ws.getCell("B3").value="Sistema Profissional de Bioimpedancia - "+new Date().toLocaleDateString("pt-BR");ws.getCell("B3").font=wf(10);ws.getCell("B3").fill=cf("FF1E3A5F");ws.getCell("B3").alignment=ca();ws.getRow(3).height=22;
    ws.mergeCells("B5:G5");ws.getCell("B5").value="RESUMO ESTATISTICO";ws.getCell("B5").font={size:14,bold:true,color:{argb:B},name:"Segoe UI"};ws.getRow(5).height=30;
    const sd=[{l:"Pacientes",v:allPatients.length,c:B},{l:"Avaliacoes",v:allEvals.length,c:G},{l:"Usuarios",v:allUsers.length,c:O}];
    for(let i=0;i<sd.length;i++){const col=String.fromCharCode(66+i*2),col2=String.fromCharCode(67+i*2);ws.mergeCells(`${col}7:${col2}7`);ws.getCell(`${col}7`).value=sd[i].l;ws.getCell(`${col}7`).font={size:9,bold:true,color:{argb:GR},name:"Segoe UI"};ws.getCell(`${col}7`).fill=cf(L);ws.getCell(`${col}7`).alignment=ca();ws.mergeCells(`${col}8:${col2}8`);ws.getCell(`${col}8`).value=sd[i].v;ws.getCell(`${col}8`).font={size:28,bold:true,color:{argb:sd[i].c},name:"Segoe UI"};ws.getCell(`${col}8`).fill=cf(L);ws.getCell(`${col}8`).alignment=ca();}
    ws.getRow(8).height=50;
    ws.mergeCells("B10:G10");ws.getCell("B10").value="AVALIACOES RECENTES";ws.getCell("B10").font=nf(12,true);
    const hR=["Data","Paciente","Peso (kg)","IMC","Gordura %","Musculo %"];
    for(let i=0;i<hR.length;i++){ws.getCell(11,i+2).value=hR[i];ws.getCell(11,i+2).font=wf(10,true);ws.getCell(11,i+2).fill=cf(B);ws.getCell(11,i+2).alignment=ca();}
    for(let i=0;i<Math.min(allEvals.length,20);i++){const ev=allEvals[i] as any;const r=12+i;const pat=allPatients.find((p:any)=>p.id===ev.patientId)as any;const v=[ev.evaluationDate?new Date(ev.evaluationDate).toLocaleDateString("pt-BR"):"",pat?.fullName||"",ev.weight||"",ev.bmi||"",ev.bodyFatPct||"",ev.musclePct||""];for(let j=0;j<v.length;j++){ws.getCell(r,j+2).value=v[j];ws.getCell(r,j+2).font=nf(10);if(i%2===0)ws.getCell(r,j+2).fill=cf(L);}}

    // ===== PACIENTES =====
    const wsP=workbook.addWorksheet("Pacientes",{properties:{tabColor:{argb:"2357A6"}}});
    const pH=["ID","Nome Completo","CPF","RG","Data Nascimento","Genero","Telefone","WhatsApp","E-mail","Endereco","Bairro","Cidade","Estado","CEP","Contato Emergencia","Fone Emergencia","Objetivo","Observacoes","Data Cadastro"];
    wsP.columns=[6,30,16,14,14,12,16,16,25,30,16,16,8,12,25,16,20,30,14].map(w=>({width:w}));
    wsP.mergeCells("A1:S1");wsP.getCell("A1").value="HEFARMA - CADASTRO DE PACIENTES";wsP.getCell("A1").font=wf(16,true);wsP.getCell("A1").fill=cf(B);wsP.getCell("A1").alignment=ca();wsP.getRow(1).height=35;
    for(let i=0;i<pH.length;i++){wsP.getCell(2,i+1).value=pH[i];wsP.getCell(2,i+1).font=wf(10,true);wsP.getCell(2,i+1).fill=cf(D);wsP.getCell(2,i+1).alignment=ca();}
    for(let i=0;i<allPatients.length;i++){const p=allPatients[i]as any;const v=[p.id,p.fullName,p.cpf||"",p.rg||"",p.birthDate?new Date(p.birthDate).toLocaleDateString("pt-BR"):"",p.gender||"",p.phone||"",p.whatsapp||"",p.email||"",p.address||"",p.neighborhood||"",p.city||"",p.state||"",p.postalCode||"",p.emergencyContact||"",p.emergencyPhone||"",p.objective||"",p.observations||"",p.createdAt?new Date(p.createdAt).toLocaleDateString("pt-BR"):""];for(let j=0;j<v.length;j++){wsP.getCell(i+3,j+1).value=v[j];wsP.getCell(i+3,j+1).font=nf(10);if(i%2===0)wsP.getCell(i+3,j+1).fill=cf(L);}}

    // ===== AVALIACOES =====
    const wsE=workbook.addWorksheet("Avaliacoes",{properties:{tabColor:{argb:"EF385A"}}});
    wsE.columns=[6,14,30,14,14,30,16,16,16,16,16,16,16].map(w=>({width:w}));
    wsE.mergeCells("A1:M1");wsE.getCell("A1").value="HEFARMA - AVALIACOES";wsE.getCell("A1").font=wf(16,true);wsE.getCell("A1").fill=cf(R);wsE.getCell("A1").alignment=ca();wsE.getRow(1).height=35;
    const eH=["ID","Data","Paciente","Peso (kg)","Altura (cm)","IMC","Gordura %","Gordura Kg","Massa Magra","Massa Muscular","Musculo %","Agua %","Gord. Visceral"];
    for(let i=0;i<eH.length;i++){wsE.getCell(2,i+1).value=eH[i];wsE.getCell(2,i+1).font=wf(9,true);wsE.getCell(2,i+1).fill=cf(D);wsE.getCell(2,i+1).alignment=ca();}
    for(let i=0;i<allEvals.length;i++){const ev=allEvals[i]as any;const pat=allPatients.find((p:any)=>p.id===ev.patientId)as any;const v=[ev.id,ev.evaluationDate?new Date(ev.evaluationDate).toLocaleDateString("pt-BR"):"",pat?.fullName||"",ev.weight||"",ev.height||"",ev.bmi||"",ev.bodyFatPct||"",ev.bodyFatKg||"",ev.leanMass||"",ev.muscleMass||"",ev.musclePct||"",ev.waterPct||"",ev.visceralFat||""];for(let j=0;j<v.length;j++){const c=wsE.getCell(i+3,j+1);c.value=v[j];c.font=nf(10);c.alignment=ca();if(i%2===0)c.fill=cf(L);}}

    // ===== BIOIMPEDANCIA =====
    const wsB=workbook.addWorksheet("Bioimpedancia",{properties:{tabColor:{argb:"F97316"}}});
    const bH=["Avaliacao ID","Gordura %","Gordura Kg","Massa Magra","Massa Muscular","Musculo %","Agua %","Agua Kg","Massa Ossea","Proteina %","Gord. Subcutanea","Gord. Visceral","Idade Metab.","Metab. Basal (kcal)","IMC","Pontuacao"];
    wsB.columns=[14,...Array(15).fill(16)].map(w=>({width:w}));
    wsB.mergeCells("A1:P1");wsB.getCell("A1").value="HEFARMA - BIOIMPEDANCIA";wsB.getCell("A1").font=wf(16,true);wsB.getCell("A1").fill=cf(O);wsB.getCell("A1").alignment=ca();wsB.getRow(1).height=35;
    for(let i=0;i<bH.length;i++){wsB.getCell(2,i+1).value=bH[i];wsB.getCell(2,i+1).font=wf(9,true);wsB.getCell(2,i+1).fill=cf(D);wsB.getCell(2,i+1).alignment=ca();}
    for(let i=0;i<allEvals.length;i++){const ev=allEvals[i]as any;const v=[ev.id,ev.bodyFatPct,ev.bodyFatKg,ev.leanMass,ev.muscleMass,ev.musclePct,ev.waterPct,ev.waterKg,ev.boneMass,ev.proteinPct,ev.subcutaneousFat,ev.visceralFat,ev.metabolicAge,ev.basalMetabolism,ev.bmi,ev.bodyScore];for(let j=0;j<v.length;j++){const c=wsB.getCell(i+3,j+1);c.value=v[j]||"";c.font=nf(10);c.alignment=ca();if(j>0)c.numFmt="0.0";if(i%2===0)c.fill=cf(L);}}

    // ===== CONFIGURACOES =====
    const wsS=workbook.addWorksheet("Configuracoes",{properties:{tabColor:{argb:"64748B"}}});
    wsS.columns=[6,30,40,20].map(w=>({width:w}));
    wsS.mergeCells("A1:D1");wsS.getCell("A1").value="HEFARMA - CONFIGURACOES DO SISTEMA";wsS.getCell("A1").font=wf(16,true);wsS.getCell("A1").fill=cf(GR);wsS.getCell("A1").alignment=ca();wsS.getRow(1).height=35;
    wsS.getCell("B3").value="INFORMACOES DO SISTEMA";wsS.getCell("B3").font={size:12,bold:true,color:{argb:B},name:"Segoe UI"};
    const si=[["Versao","1.0.0"],["Framework","Next.js 16"],["Total Pacientes",String(allPatients.length)],["Total Avaliacoes",String(allEvals.length)]];
    for(let i=0;i<si.length;i++){wsS.getCell(i+4,2).value=si[i][0];wsS.getCell(i+4,2).font=nf(10,true);wsS.getCell(i+4,3).value=si[i][1];wsS.getCell(i+4,3).font=nf(10);}

    // ===== LEGENDA =====
    const wsL=workbook.addWorksheet("Legenda",{properties:{tabColor:{argb:"94A3B8"}}});
    wsL.columns=[6,28,30,40].map(w=>({width:w}));
    wsL.mergeCells("A1:D1");wsL.getCell("A1").value="HEFARMA - LEGENDA DE CORES E CLASSIFICACOES";wsL.getCell("A1").font=wf(16,true);wsL.getCell("A1").fill=cf(B);wsL.getCell("A1").alignment=ca();wsL.getRow(1).height=35;
    wsL.getCell("B3").value="COR";wsL.getCell("B3").font=wf(10,true);wsL.getCell("B3").fill=cf(D);wsL.getCell("C3").value="CLASSIFICACAO";wsL.getCell("C3").font=wf(10,true);wsL.getCell("C3").fill=cf(D);wsL.getCell("D3").value="DESCRICAO";wsL.getCell("D3").font=wf(10,true);wsL.getCell("D3").fill=cf(D);
    const lg=[[G,"Verde","Excelente / Normal / Saudavel"],[Y,"Amarelo","Atencao / Sobrepeso"],[O,"Laranja","Moderado / Risco Moderado"],[R,"Vermelho","Alto Risco / Obesidade"]];
    for(let i=0;i<lg.length;i++){wsL.getCell(i+4,2).value=lg[i][1];wsL.getCell(i+4,2).font={size:10,bold:true,color:{argb:lg[i][0]as string},name:"Segoe UI"};wsL.getCell(i+4,3).value=lg[i][2];wsL.getCell(i+4,3).font=nf(10);}
    let lr=10;wsL.getCell(`B${lr}`).value="TABELA DE CLASSIFICACAO DO IMC (OMS)";wsL.getCell(`B${lr}`).font={size:12,bold:true,color:{argb:B},name:"Segoe UI"};lr++;
    wsL.getCell(`B${lr}`).value="FAIXA DE IMC";wsL.getCell(`B${lr}`).font=wf(10,true);wsL.getCell(`B${lr}`).fill=cf(D);wsL.getCell(`C${lr}`).value="CLASSIFICACAO";wsL.getCell(`C${lr}`).font=wf(10,true);wsL.getCell(`C${lr}`).fill=cf(D);lr++;
    for(const[range,label,color]of[["Abaixo de 18,5","Abaixo do Peso",Y],["18,5 - 24,9","Peso Normal",G],["25,0 - 29,9","Sobrepeso",Y],["30,0 - 34,9","Obesidade Grau I",O],["35,0 - 39,9","Obesidade Grau II",R],["Acima de 40","Obesidade Grau III","FF991B1B"]]as const){wsL.getCell(`B${lr}`).value=range;wsL.getCell(`B${lr}`).font=nf(10);wsL.getCell(`C${lr}`).value=label;wsL.getCell(`C${lr}`).font={size:10,bold:true,color:{argb:color},name:"Segoe UI"};lr++;}

    const buffer = await workbook.xlsx.writeBuffer();
    return new NextResponse(buffer,{status:200,headers:{"Content-Type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","Content-Disposition":`attachment; filename="HEFARMA_Body_Analysis_${new Date().toISOString().split("T")[0]}.xlsx"`}});
  } catch(error){console.error("XLSX:",error);return NextResponse.json({error:"Erro ao gerar XLSX"},{status:500});}
}
