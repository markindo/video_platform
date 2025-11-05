import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("123456", 10);

  const uploader = await prisma.user.create({
    data: {
      name: "Admin Uploader",
      email: "uploader@a.com",
      password,
      role: UserRole.UPLOADER,
    },
  });

  const viewer = await prisma.user.create({
    data: {
      name: "User Viewer",
      email: "viewer@a.com",
      password,
      role: UserRole.VIEWER,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Admin Viewer",
      email: "admin@a.com",
      password,
      role: UserRole.ADMIN,
    },
  });

  console.log("Seeder done:", { uploader, viewer, admin });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
