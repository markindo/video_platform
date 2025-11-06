"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type VideoType = {
  id: number;
  title: string;
  thumbnail: string;
  uploader: string;
  views: number;
  viewCount: number;
};

export default function VideoCard() {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos");
        if (!res.ok) throw new Error("Failed to fetch videos");
        const data: VideoType[] = await res.json();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, []);

  if (loading) {
    // tampilkan skeleton loading
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border-none shadow-none bg-transparent">
            <CardContent className="p-0">
              <Skeleton className="w-full h-[200px] rounded-lg" />
              <div className="mt-2 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Tidak ada video yang tersedia
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {videos.map((video) => (
        <Link key={video.id} href={`/watch/${video.id}`}>
          <Card className="overflow-hidden bg-transparent hover:bg-gray-50 transition cursor-pointer border-none shadow-none">
            <CardContent className="p-2">
              <div className="relative w-full h-[200px]">
                <Image
                  src={`/api/videos/stream/thumbnail?path=${encodeURIComponent(
                    video.thumbnail
                  )}`}
                  alt={video.title}
                  fill
                  className="object-cover rounded-lg"
                  unoptimized
                />
              </div>
              <div className="mt-3 px-2">
                <h3 className="font-semibold line-clamp-2 text-lg">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-500">{video.uploader}</p>
                <p className="text-sm text-gray-400">{video.viewCount} views</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
