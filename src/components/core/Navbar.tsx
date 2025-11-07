"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut, Search, Upload } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Navbar() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/result?query=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between bg-white px-4">
      {/* Sidebar + Logo */}
      <div className="flex items-center gap-3">
        <SidebarTrigger />
      </div>

      {/* Search bar */}
      <form
        onSubmit={handleSearch}
        className="hidden md:flex w-1/2 items-center gap-2"
      >
        <Input
          placeholder="Search videos..."
          className="w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          size="icon"
          variant="secondary"
          type="submit"
          className="cursor-pointer hover:bg-gray-200"
        >
          <Search className="h-4 w-4" />
        </Button>
      </form>

      {/* Buttons */}
      <div className="flex items-center gap-3">
        <Link href="/upload">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" /> Upload
          </Button>
        </Link>

        <Button
          variant="destructive"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
