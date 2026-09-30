// Single source of truth for the public demo account, seeded in
// prisma/seed.ts. "Explore Demo" on the landing page signs a visitor in as
// this real account through the normal Credentials flow — not a fake
// read-only mode — so every feature actually works with zero setup.
// Tradeoff, stated plainly: it's one shared account, so concurrent visitors
// can see/edit each other's changes. Fine for a portfolio demo; a
// production deployment would want a nightly reset job or a
// spin-up-a-fresh-copy-per-visitor flow instead.
export const DEMO_EMAIL = "demo@studyflow.ai";
export const DEMO_PASSWORD = "Password123";

export function isDemoUser(email: string | null | undefined) {
  return email === DEMO_EMAIL;
}
