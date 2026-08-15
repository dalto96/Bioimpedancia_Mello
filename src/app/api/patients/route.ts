import { NextRequest, NextResponse } from "next/server";
import { demoPatients } from "@/lib/demo-data";

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ patients: demoPatients });
    }
    
    const { getDb } = await import("@/db");
    const db = await getDb();
    if (!db) return NextResponse.json({ patients: demoPatients });
    
    const { patients } = await import("@/db/schema");
    const result = await db.select().from(patients).orderBy(patients.createdAt);
    return NextResponse.json({ patients: result });
  } catch {
    return NextResponse.json({ patients: demoPatients });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ success: false, error: "Banco de dados não conectado. Configure DATABASE_URL para salvar dados." }, { status: 400 });
    }
    
    const { getDb } = await import("@/db");
    const db = await getDb();
    if (!db) return NextResponse.json({ success: false, error: "Banco de dados não conectado." }, { status: 400 });
    
    const { patients } = await import("@/db/schema");
    const body = await request.json();
    
    const result = await db.insert(patients).values({
      fullName: body.fullName,
      cpf: body.cpf || null, rg: body.rg || null, birthDate: body.birthDate || null,
      gender: body.gender || null, phone: body.phone || null, whatsapp: body.whatsapp || null,
      email: body.email || null, address: body.address || null, neighborhood: body.neighborhood || null,
      city: body.city || null, state: body.state || null, postalCode: body.postalCode || null,
      emergencyContact: body.emergencyContact || null, emergencyPhone: body.emergencyPhone || null,
      objective: body.objective || null, observations: body.observations || null,
    }).returning();

    return NextResponse.json({ success: true, patient: result[0] });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro ao cadastrar paciente" }, { status: 500 });
  }
}
