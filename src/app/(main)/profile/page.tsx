"use client";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import DeleteModal from "../_components/DeleteModal";
import EditModal from "../_components/EditModal";

type VideoType = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  category?: { name: string };
  viewCount: number;
  views?: { user: { name: string } }[];
  createdAt: string;
};

export default function Profile() {
  const { data: session } = useSession();
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/videos/mine");
        if (!res.ok) throw new Error("Failed to fetch videos");
        const data: VideoType[] = await res.json();
        setVideos(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/videos/mine");
      if (!res.ok) throw new Error("Failed to fetch videos");
      const data: VideoType[] = await res.json();
      setVideos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex flex-col">
        <span>Name : {session?.user?.name}</span>
        <span>Email : {session?.user?.email}</span>
      </div>
      <Separator className="my-4" />

      <h2 className="text-lg font-semibold mb-3">My Videos</h2>

      {!videos.length ? (
        <p className="text-gray-500">No videos yet.</p>
      ) : (
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className=" border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">
                    Video
                  </th>
                  <th className="px-6 py-4 text-center text-sm text-gray-600">
                    Views
                  </th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">
                    Uploaded
                  </th>
                  <th className="px-6 py-4 text-left text-sm text-gray-600">
                    Category
                  </th>
                  <th className="px-6 py-4 text-center text-sm text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {videos.map((video) => (
                  <tr
                    key={video.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-40 flex-shrink-0">
                          <div className="relative w-full h-[100px]">
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
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link href={`/watch/${video.id}`}>
                            <h3 className="line-clamp-2 mb-1 hover:underline hover:text-blue-600">
                              {video.title}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {video.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div>{video.viewCount}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {video.createdAt.split("T")[0]}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{video.category?.name}</div>
                    </td>
                    <td className="px-6 py-10 flex justify-center gap-2">
                      <EditModal
                        video={video}
                        onUpdated={() => fetchVideos()}
                      />
                      <DeleteModal
                        videoId={video.id}
                        onUpdate={() => fetchVideos()}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {videos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No videos uploaded yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
