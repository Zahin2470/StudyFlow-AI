import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Phase 1 seed: just a demo user, so the login flow can be tested without
// registering by hand. Course/assignment/exam seed data is added once
// those models exist in Phase 2 (see ARCHITECTURE.md §12).
async function main() {
  const passwordHash = await bcrypt.hash("Password123", 12);

  await prisma.user.upsert({
    where: { email: "demo@studyflow.ai" },
    update: {},
    create: {
      name: "Demo Student",
      email: "demo@studyflow.ai",
      passwordHash,
      institution: "East West University",
      academicLevel: "UNDERGRADUATE",
      emailVerified: new Date(),
    },
  });

  console.log("Seeded demo@studyflow.ai / Password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
