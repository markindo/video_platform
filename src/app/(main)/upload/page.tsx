"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Film, Upload, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function UploadPage() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
      setPreviewUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) return alert("Pilih file video terlebih dahulu");
    if (!title) return alert("Judul wajib diisi");

    const formData = new FormData();
    formData.append("file", videoFile);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/videos/upload");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percentComplete);
      }
    };

    xhr.onloadstart = () => setIsUploading(true);
    xhr.onloadend = () => setIsUploading(false);

    xhr.onload = () => {
      if (xhr.status === 200) {
        toast.success("Video uploaded successfully");
        setVideoFile(null);
        setPreviewUrl(null);
        setTitle("");
        setDescription("");
        setCategory("");
        setUploadProgress(0);
      } else {
        toast.error("Failed to upload video");
      }
    };

    xhr.onerror = () => toast.error("Network error");
    xhr.send(formData);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-lg font-semibold">Upload Video</h1>
          <Button
            variant="ghost"
            onClick={() => {
              setVideoFile(null);
              setUploadProgress(0);
              setPreviewUrl(null);
              setTitle("");
              setDescription("");
              setCategory("");
            }}
          >
            <X className="size-5 mr-2" />
            Cancel
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-6">
          {/* Main Upload Form */}
          <div className="space-y-6">
            {/* Video Upload Area */}
            <Card className="p-6">
              <h2 className="mb-4">Video File</h2>

              {!videoFile ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="size-12 text-gray-400 mb-4" />
                    <p className="mb-2 text-gray-700">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-gray-500">
                      MP4, MOV, AVI (MAX. 2GB)
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="video/*"
                    onChange={handleFileChange}
                  />
                </label>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <Film className="size-10 text-blue-600" />
                    <div className="flex-1">
                      <p className="mb-1 font-medium">{videoFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    {!isUploading && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setVideoFile(null);
                          setUploadProgress(0);
                        }}
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>

                  {isUploading && (
                    <div>
                      <div className="flex justify-between mb-2 text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} />
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Video Details Form */}
            {videoFile && (
              <Card className="p-6">
                <h2 className="mb-6">Video Details</h2>

                <form className="space-y-6" onSubmit={handleUpload}>
                  <div>
                    <Label htmlFor="title">Title (required)</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Add a title that describes your video"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell viewers about your video"
                      className="mt-2 resize-none"
                      rows={6}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={(val) => setCategory(val)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Music">Music</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      disabled={isUploading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isUploading ? "Uploading..." : "Publish"}
                    </Button>
                  </div>
                </form>
              </Card>
            )}
          </div>

          {/* Preview Panel (sementara abaikan FFmpeg thumbnail) */}
          <div>
            <Card className="p-6 sticky top-20">
              <h3 className="mb-4">Preview</h3>
              <div className="w-full aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                {previewUrl ? (
                  <video
                    src={previewUrl}
                    controls
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Film className="size-12 text-gray-400" />
                )}
              </div>
              <h4 className="mb-2 line-clamp-2">{title || "Video title"}</h4>
              <p className="text-sm text-gray-600 line-clamp-3">
                {description || "Video description will appear here."}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span>{category || "-"}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
