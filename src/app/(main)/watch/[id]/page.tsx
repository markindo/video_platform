"use client";

import { Separator } from "@/components/ui/separator";
import { VideoData } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function WatchPage() {
  const { id } = useParams<{ id: string }>();
  const [video, setVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchVideo = async () => {
      try {
        const res = await fetch(`/api/videos/${id}`);
        if (!res.ok) throw new Error("Failed to fetch video data");
        const data = await res.json();
        setVideo(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  if (loading) {
    return <p className="text-gray-500">Memuat video...</p>;
  }

  if (!video) {
    return <p className="text-red-500">Video tidak ditemukan.</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 max-w-7xl mx-auto">
      <div className="lg:col-span-4 space-y-4">
        {/* Video Player */}
        <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
          <video
            controls
            className="w-full h-full object-contain"
            src={`/api/videos/stream?id=${video.id}`}
          />
        </div>

        {/* Video Title */}
        <h1 className="text-2xl font-semibold">{video.title}</h1>

        {/* Video Info Bar */}
        <div className="flex items-center justify-between text-gray-500 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span>{video.uploader?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{video.viewCount} views |</span>
            <span>{video.createdAt.split("T")[0]}</span>
          </div>
        </div>

        <Separator />

        {/* Video Description */}
        <div>
          <span className="font-semibold text-lg">Description</span>
          <p className="text-gray-700 mt-1">
            {video.description || "Tidak ada deskripsi."}
          </p>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-3">
        <h2 className="font-semibold text-lg">Viewers</h2>
        <Separator />
        <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-2">
          {video.views?.length ? (
            video.views.map((viewer, index) => (
              <div
                key={viewer.id ?? `viewer-${index}`}
                className="text-gray-600"
              >
                • {viewer.user?.name} - {viewer.user?.email}
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No Views.</p>
          )}
        </div>
      </div>
    </div>
  );
}
