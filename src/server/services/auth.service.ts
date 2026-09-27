import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import type { RegisterInput } from "@/lib/schemas/auth.schema";

const VERIFY_TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24h
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1h

export class AuthService {
  static async registerUser(input: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new Error("ACCOUNT_EXISTS");
    }

    const passwordHash = await bcrypt.hash(input.password, 12);

    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        institution: input.institution,
        academicLevel: input.academicLevel,
      },
    });

    const token = crypto.randomBytes(32).toString("hex");
    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token,
        purpose: "email-verify",
        expires: new Date(Date.now() + VERIFY_TOKEN_TTL_MS),
      },
    });

    // TODO Phase 9: send via the real email provider instead of returning it.
    return { user, verifyToken: token };
  }

  static async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    // Always resolve without revealing whether the account exists.
    if (!user) return;

    const token = crypto.randomBytes(32).toString("hex");
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        purpose: "password-reset",
        expires: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });
    return token;
  }

  static async resetPassword(token: string, newPassword: string) {
    const record = await prisma.verificationToken.findFirst({
      where: { token, purpose: "password-reset", expires: { gt: new Date() } },
    });
    if (!record) throw new Error("INVALID_OR_EXPIRED_TOKEN");

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { email: record.identifier },
      data: { passwordHash },
    });
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: record.identifier, token } },
    });
  }

  static async verifyEmail(token: string) {
    const record = await prisma.verificationToken.findFirst({
      where: { token, purpose: "email-verify", expires: { gt: new Date() } },
    });
    if (!record) throw new Error("INVALID_OR_EXPIRED_TOKEN");

    await prisma.user.update({
      where: { email: record.identifier },
      data: { emailVerified: new Date() },
    });
    await prisma.verificationToken.delete({
      where: { identifier_token: { identifier: record.identifier, token } },
    });
  }
}
