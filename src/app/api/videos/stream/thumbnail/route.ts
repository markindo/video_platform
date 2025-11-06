import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawPath = searchParams.get("path");

  if (!rawPath) {
    return NextResponse.json({ message: "Missing path" }, { status: 400 });
  }

  // Decode and get the base directory
  const decodedPath = decodeURIComponent(rawPath);
  const baseUploadDir = path.resolve("../video-storage");

  // Join base directory with the relative path from DB
  const absolutePath = path.join(baseUploadDir, decodedPath);
  const normalizedPath = path.normalize(absolutePath);

  console.log("=== THUMBNAIL DEBUG ===");
  console.log("Raw path from query:", rawPath);
  console.log("Decoded path:", decodedPath);
  console.log("Base directory:", baseUploadDir);
  console.log("Final absolute path:", normalizedPath);
  console.log("File exists:", fs.existsSync(normalizedPath));

  // Security check: ensure path is within baseUploadDir
  if (!normalizedPath.startsWith(baseUploadDir)) {
    return NextResponse.json({ message: "Invalid path" }, { status: 403 });
  }

  if (!fs.existsSync(normalizedPath)) {
    console.error("Thumbnail not found:", normalizedPath);
    return NextResponse.json(
      { message: "Thumbnail not found" },
      { status: 404 }
    );
  }

  const fileBuffer = fs.readFileSync(normalizedPath);
  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
