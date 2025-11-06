export type UserRole = "ADMIN" | "USER";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  approved: boolean;
  canUpload: boolean;
};

export type VideoData = {
  id: string;
  title: string;
  description: string;
  uploader: { name: string };
  duration: number;
  createdAt: string;
  viewCount: number;
  thumbnail: string;
  views: VideoView[];
};

export type VideoView = {
  id: string;
  videoId: string;
  userId: string;
  user: User;
};
