import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();
export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const videos = await prisma.video.findMany({
      where: { uploaderId: session.user.id },
      include: { category: true, views: { include: { user: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(videos, { status: 200 });
  } catch (err) {
    console.error("Error fetching user videos:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
