import { PrismaClient } from "@prisma/client";
import fs from "fs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import path from "path";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        uploader: { select: { name: true } },
        category: { select: { name: true } },
        views: {
          select: { user: { select: { id: true, name: true, email: true } } },
        },
      },
    });

    if (!video) {
      return NextResponse.json({ message: "Video not found" }, { status: 404 });
    }

    return NextResponse.json(video, { status: 200 });
  } catch (error) {
    console.error("Error fetching video:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { title, description, category } = await req.json();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // Pastikan video milik user yang login
  const existing = await prisma.video.findUnique({
    where: { id },
  });

  if (!existing) {
    return NextResponse.json({ message: "Video not found" }, { status: 404 });
  }

  if (existing.uploaderId !== session.user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const updatedVideo = await prisma.video.update({
    where: { id },
    data: {
      title,
      description,
      category: {
        connectOrCreate: {
          where: { name: category },
          create: { name: category },
        },
      },
    },
    include: { category: true },
  });

  return NextResponse.json(updatedVideo);
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Pastikan params di-unwrapped
    const { id } = await context.params;

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Ambil data video berdasarkan ID
    const video = await prisma.video.findUnique({
      where: { id },
      include: { uploader: true },
    });

    if (!video) {
      return NextResponse.json({ message: "Video not found" }, { status: 404 });
    }

    // Cek kepemilikan video
    if (session.user.role !== "ADMIN" && session.user.id !== video.uploaderId) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // ✅ Path storage lokal DI LUAR proyek
    const STORAGE_ROOT = "D:\\video-storage"; // sesuaikan jika beda drive

    // Path lengkap untuk file video & thumbnail
    const fullVideoPath = path.join(STORAGE_ROOT, video.filePath);
    const fullThumbnailPath = video.thumbnail
      ? path.join(STORAGE_ROOT, video.thumbnail)
      : null;

    // ===== Hapus file video =====
    if (fs.existsSync(fullVideoPath)) {
      try {
        fs.unlinkSync(fullVideoPath);
        console.log(`🗑 Deleted video file: ${fullVideoPath}`);
      } catch (err) {
        console.error("❌ Error deleting video file:", err);
      }
    } else {
      console.warn(`⚠️ Video file not found: ${fullVideoPath}`);
    }

    // ===== Hapus thumbnail (jika ada) =====
    if (fullThumbnailPath && fs.existsSync(fullThumbnailPath)) {
      try {
        fs.unlinkSync(fullThumbnailPath);
        console.log(`🗑 Deleted thumbnail: ${fullThumbnailPath}`);
      } catch (err) {
        console.error("❌ Error deleting thumbnail:", err);
      }
    }

    // ===== Hapus semua view terkait video =====
    await prisma.videoView.deleteMany({
      where: { videoId: id },
    });

    // ===== Hapus record video =====
    await prisma.video.delete({
      where: { id },
    });

    console.log(`✅ Video ${video.title} deleted successfully`);
    return NextResponse.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    return NextResponse.json(
      { message: "Failed to delete video" },
      { status: 500 }
    );
  }
}
