import { NextResponse } from "next/server";
import { AuthService } from "@/server/services/auth.service";

export async function POST(req: Request) {
  const { token } = await req.json();
  if (!token) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Missing token" } },
      { status: 400 }
    );
  }
  try {
    await AuthService.verifyEmail(token);
    return NextResponse.json({ message: "Email verified." });
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_TOKEN", message: "This link has expired." } },
      { status: 400 }
    );
  }
}
