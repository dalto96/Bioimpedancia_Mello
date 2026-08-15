import { NextResponse } from "next/server";

/**
 * Check if database is available.
 * If not, return demo data response.
 */
export function isDbAvailable(): boolean {
  return !!process.env.DATABASE_URL;
}

/**
 * Return a demo mode response when database is not connected
 */
export function demoResponse(data: Record<string, any>) {
  return NextResponse.json({ ...data, _demo: true });
}
