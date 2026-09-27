import type { DefaultSession } from "next-auth";

// Extend the default session/user shape with the fields our jwt/session
// callbacks in src/server/auth.ts actually attach.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}
