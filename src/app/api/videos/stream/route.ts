import { PrismaClient } from "@prisma/client";
import fs from "fs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "Missing video ID" },
        { status: 400 }
      );
    }

    const video = await prisma.video.findUnique({ where: { id } });
    if (!video) {
      return NextResponse.json({ message: "Video not found" }, { status: 404 });
    }

    // ✅ Build the absolute path correctly
    const baseUploadDir = path.resolve("../video-storage");
    const filePath = path.join(baseUploadDir, video.filePath);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { message: "Video file not found on server", path: filePath },
        { status: 404 }
      );
    }

    // ✅ Add view tracking logic
    const existingView = await prisma.videoView.findUnique({
      where: {
        videoId_userId: {
          videoId: id,
          userId: session.user.id,
        },
      },
    });

    if (!existingView) {
      await prisma.$transaction([
        prisma.videoView.create({
          data: {
            videoId: id,
            userId: session.user.id,
          },
        }),
        prisma.video.update({
          where: { id },
          data: { viewCount: { increment: 1 } },
        }),
      ]);
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.get("range");

    // Helper to convert Node ReadableStream to Web ReadableStream
    const toWebReadable = (nodeStream: fs.ReadStream): ReadableStream => {
      const reader = nodeStream as unknown as AsyncIterable<Uint8Array>;
      return new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of reader) {
              controller.enqueue(chunk);
            }
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
        cancel() {
          nodeStream.destroy();
        },
      });
    };

    // 🔹 Full file streaming (no range)
    if (!range) {
      const headers = new Headers({
        "Content-Length": fileSize.toString(),
        "Content-Type": "video/mp4",
        "Accept-Ranges": "bytes",
      });

      const stream = fs.createReadStream(filePath);
      const webStream = toWebReadable(stream);
      return new NextResponse(webStream, { status: 200, headers });
    }

    // 🔹 Partial file streaming (range request)
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize) {
      return NextResponse.json(
        { message: "Range Not Satisfiable" },
        { status: 416, headers: { "Content-Range": `bytes */${fileSize}` } }
      );
    }

    const chunkSize = end - start + 1;
    const stream = fs.createReadStream(filePath, { start, end });
    const webStream = toWebReadable(stream);

    const headers = new Headers({
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize.toString(),
      "Content-Type": "video/mp4",
    });

    return new NextResponse(webStream, { status: 206, headers });
  } catch (error) {
    console.error("Error streaming video:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
