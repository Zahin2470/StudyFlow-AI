import { NextResponse } from "next/server";
import { resetPasswordSchema } from "@/lib/schemas/auth.schema";
import { AuthService } from "@/server/services/auth.service";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0].message } },
      { status: 400 }
    );
  }

  try {
    await AuthService.resetPassword(parsed.data.token, parsed.data.password);
    return NextResponse.json({ message: "Password updated. You can log in now." });
  } catch {
    return NextResponse.json(
      { error: { code: "INVALID_TOKEN", message: "This link has expired. Request a new one." } },
      { status: 400 }
    );
  }
}
