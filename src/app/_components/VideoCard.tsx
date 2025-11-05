"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { useEffect, useState } from "react";

type VideoType = {
  id: number;
  title: string;
  thumbnail: string;
  uploader: string;
  views: number;
};

export default function VideoCard() {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // simulasi fetch data (3 detik)
    setTimeout(() => {
      setVideos([
        {
          id: 1,
          title: "Belajar Next.js dari Nol",
          thumbnail: "https://picsum.photos/400/225?random=1",
          uploader: "John Doe",
          views: 12500,
        },
        {
          id: 2,
          title: "Cara Upload Video Seperti YouTube",
          thumbnail: "https://picsum.photos/400/225?random=2",
          uploader: "Jane Smith",
          views: 8700,
        },
        {
          id: 3,
          title: "Optimasi Video Streaming dengan Nginx RTMP",
          thumbnail: "https://picsum.photos/400/225?random=3",
          uploader: "Dev Guru",
          views: 4321,
        },
      ]);
      setLoading(false);
    }, 2500);
  }, []);

  if (loading) {
    // tampilkan skeleton
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {videos.map((video) => (
        <div
          key={video.id}
          className="overflow-hidden rounded-lg bg-transparent hover:bg-gray-50 transition"
        >
          <div className="p-2">
            <div className="relative w-full h-[250px]">
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover rounded-lg aspect-[4/3]"
              />
            </div>

            <div className="mt-3 px-2">
              <h3 className="font-semibold line-clamp-2 text-lg ">
                {video.title}
              </h3>
              <p className="text-sm text-gray-500">{video.uploader}</p>
              <p className="text-sm text-gray-400">
                {video.views.toLocaleString()} views
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
