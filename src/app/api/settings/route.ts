import { NextRequest, NextResponse } from "next/server";
import { demoUsers } from "@/lib/demo-data";

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ clinic: { name: "HEFARMA Farmácia", phone: "", email: "", address: "", professional: "", crn: "" }, users: demoUsers });
    }
    const { getDb } = await import("@/db");
    const db = await getDb();
    if (!db) return NextResponse.json({ clinic: { name: "HEFARMA Farmácia", phone: "", email: "", address: "", professional: "", crn: "" }, users: demoUsers });
    const { settings, users } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    const settingsRows = await db.select().from(settings);
    const usersList = await db.select({ id: users.id, username: users.username, name: users.name, role: users.role }).from(users);
    const clinicData: Record<string, string> = {};
    settingsRows.forEach((s: any) => { if (s.value) clinicData[s.key] = s.value; });
    return NextResponse.json({ clinic: {
      name: clinicData.clinic_name || "HEFARMA Farmácia", phone: clinicData.clinic_phone || "",
      email: clinicData.clinic_email || "", address: clinicData.clinic_address || "",
      professional: clinicData.professional_name || "", crn: clinicData.crn || "",
    }, users: usersList });
  } catch { return NextResponse.json({ clinic: { name: "HEFARMA Farmácia", phone: "", email: "", address: "", professional: "", crn: "" }, users: demoUsers }); }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.DATABASE_URL) return NextResponse.json({ success: false, error: "Banco não conectado" }, { status: 400 });
    const { getDb } = await import("@/db");
    const db = await getDb();
    if (!db) return NextResponse.json({ success: false, error: "Banco não conectado" }, { status: 400 });
    const { settings } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    const body = await request.json();
    if (body.type === "clinic" && body.data) {
      for (const [key, value] of Object.entries(body.data)) {
        const settingKey = key === "name" ? "clinic_name" : key === "phone" ? "clinic_phone" : key === "email" ? "clinic_email" : key === "address" ? "clinic_address" : key === "professional" ? "professional_name" : key;
        try {
          const existing = await db.select().from(settings).where(eq(settings.key, settingKey)).limit(1);
          if (existing.length > 0) { await db.update(settings).set({ value: String(value), updatedAt: new Date() }).where(eq(settings.key, settingKey)); }
          else { await db.insert(settings).values({ key: settingKey, value: String(value) }); }
        } catch { continue; }
      }
    }
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ success: false, error: "Erro ao salvar" }, { status: 500 }); }
}
