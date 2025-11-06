import { User } from "@/types";
import { create } from "zustand";

interface UserState {
  user: User[];
  loading: boolean;
  error: string | null;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: [],
  loading: false,
  error: null,

  fetchUser: async () => {
    try {
      set({ loading: true, error: null });

      const res = await fetch("/api/user", {
        method: "GET",
        cache: "no-store",
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch user");

      set({ user: data, loading: false, error: null });
    } catch (error: unknown) {
      if (error instanceof Error) {
        set({ error: error.message, loading: false });
      }
    }
  },
}));
