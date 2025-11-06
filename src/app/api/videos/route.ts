import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();
export const runtime = "nodejs";

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      include: {
        uploader: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = videos.map((video) => ({
      id: video.id,
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail,
      filePath: video.filePath,
      duration: video.duration,
      viewCount: video.viewCount,
      uploader: video.uploader?.name ?? "Unknown",
      category: video.category?.name ?? null,
      createdAt: video.createdAt,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("❌ Error fetching videos:", error);
    return NextResponse.json(
      { message: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
