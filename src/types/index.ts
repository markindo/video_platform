export type UserRole = "ADMIN" | "VIEWER" | "UPLOADER";

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
};
