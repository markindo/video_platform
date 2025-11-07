"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Video = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  createdAt: string;
  uploader: {
    name: string;
  };
};

export default function ResultPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/videos/search?query=${encodeURIComponent(query)}`
        );
        if (!res.ok) throw new Error("Failed to fetch videos");
        const data = await res.json();
        console.log("Search response:", data);

        const videoArray = Array.isArray(data) ? data : data.data ?? [];
        setVideos(videoArray);
      } catch (error) {
        console.error(error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [query]);

  return (
    <div className="max-w-7xl">
      <h1 className="text-xl  mb-6">
        Search results for : <span className="underline ">{query}</span>
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : videos.length === 0 ? (
        <p>No videos found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Link
              key={video.id}
              href={`/watch/${video.id}`}
              className="group block"
            >
              <div className="rounded-lg overflow-hidden hover:bg-gray-50">
                <div className="aspect-video bg-gray-200 relative">
                  {video.thumbnail ? (
                    <Image
                      src={`/api/videos/stream/thumbnail?path=${encodeURIComponent(
                        video.thumbnail
                      )}`}
                      alt={video.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No Thumbnail
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium line-clamp-2">{video.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {video.description || "No description."}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {video.uploader?.name ?? "Unknown"} ·{" "}
                    {new Date(video.createdAt).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
