import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query || query.trim() === "") {
    return NextResponse.json({ videos: [] });
  }

  const videos = await prisma.video.findMany({
    where: {
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
        {
          category: {
            is: {
              name: { contains: query },
            },
          },
        },
        {
          uploader: {
            is: {
              name: { contains: query },
            },
          },
        },
      ],
    },
    include: {
      uploader: {
        select: { id: true, name: true, email: true },
      },
      category: {
        select: { id: true, name: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(videos);
}
