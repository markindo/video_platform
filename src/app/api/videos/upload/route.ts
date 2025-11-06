import { PrismaClient } from "@prisma/client";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import path from "path";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();
export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const title = (formData.get("title") as string) || "Untitled";
  const description = (formData.get("description") as string) || "";
  const categoryName =
    (formData.get("category") as string | null)?.trim() || null;

  if (!file) {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
  }

  // === 1. Simpan ke folder DI LUAR proyek ===
  const baseUploadDir = path.resolve("../video-storage");
  const userDir = path.join(
    baseUploadDir,
    session.user.email.replace(/[@.]/g, "_")
  );
  const thumbnailDir = path.join(userDir, "thumbnails");

  [baseUploadDir, userDir, thumbnailDir].forEach((dir) => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  // === 2. Simpan file video ===
  const buffer = Buffer.from(await file.arrayBuffer());
  const timestamp = Date.now();
  const fileName = `${timestamp}-${session.user.name}.mp4`;
  const filePath = path.join(userDir, fileName);
  fs.writeFileSync(filePath, buffer);

  // === 3. Generate thumbnail ===
  const thumbnailPath = path.join(thumbnailDir, `${timestamp}.jpg`);
  let duration = 0;

  await new Promise<void>((resolve, reject) => {
    ffmpeg(filePath)
      .on("codecData", (data) => {
        const parts = data.duration.split(":").map(Number);
        duration = parts[0] * 3600 + parts[1] * 60 + parts[2];
      })
      .on("end", () => resolve())
      .on("error", reject)
      .screenshots({
        timestamps: ["00:00:02"],
        filename: path.basename(thumbnailPath),
        folder: thumbnailDir,
        size: "320x240",
      });
  });

  // === 4. Buat kategori jika belum ada ===
  let categoryId: string | null = null;
  if (categoryName) {
    const category = await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    });
    categoryId = category.id;
  }

  // === 5. Simpan ke DB - STORE RELATIVE PATH ONLY ===
  const relativeVideoPath = path.relative(baseUploadDir, filePath);
  const relativeThumbnailPath = path.relative(baseUploadDir, thumbnailPath);

  console.log("=== SAVING TO DB ===");
  console.log("Video path:", relativeVideoPath);
  console.log("Thumbnail path:", relativeThumbnailPath);

  const video = await prisma.video.create({
    data: {
      title,
      description,
      filePath: relativeVideoPath.replace(/\\/g, "/"),
      thumbnail: relativeThumbnailPath.replace(/\\/g, "/"), // Should be: user_a_com/thumbnails/123.jpg
      duration,
      uploaderId: session.user.id,
      categoryId,
    },
  });

  return NextResponse.json({ message: "Upload success", video });
}
