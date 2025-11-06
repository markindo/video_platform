import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("123456", 10);

  const viewer = await prisma.user.create({
    data: {
      name: "User 1",
      email: "user@a.com",
      password,
      role: UserRole.USER,
      approved: true,
      canUpload: true,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Admin Viewer",
      email: "admin@a.com",
      password,
      role: UserRole.ADMIN,
      approved: true,
      canUpload: true,
    },
  });

  console.log("Seeder done:", { viewer, admin });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
