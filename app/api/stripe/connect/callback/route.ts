import { NextRequest, NextResponse } from "next/server"

// This route is no longer used — Account Links return directly to /dashboard/settings
export async function GET(req: NextRequest) {
  return NextResponse.redirect(new URL("/dashboard/settings?stripe=connected", req.url))
}
