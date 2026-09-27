import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/schemas/auth.schema";
import { AuthService } from "@/server/services/auth.service";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "VALIDATION_ERROR", message: parsed.error.issues[0].message } },
      { status: 400 }
    );
  }

  try {
    const { user } = await AuthService.registerUser(parsed.data);
    // Password hash and raw token never leave the server.
    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (err) {
    if (err instanceof Error && err.message === "ACCOUNT_EXISTS") {
      return NextResponse.json(
        { error: { code: "ACCOUNT_EXISTS", message: "An account with this email already exists." } },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Something went wrong. Try again." } },
      { status: 500 }
    );
  }
}
