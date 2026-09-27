import { NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/schemas/auth.schema";
import { AuthService } from "@/server/services/auth.service";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: "Enter a valid email" } },
      { status: 400 }
    );
  }

  await AuthService.requestPasswordReset(parsed.data.email);
  // Same response whether or not the account exists — don't leak enumeration.
  return NextResponse.json({ message: "If that email exists, a reset link is on its way." });
}
