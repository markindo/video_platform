"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut, Search, Upload } from "lucide-react";
import { signOut } from "next-auth/react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between bg-white px-4">
      {/* sidebar + logo */}
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        {/* <span className="font-bold text-xl text-gray-800">MyVideo</span> */}
      </div>

      {/* search bar */}
      <div className="hidden md:flex w-1/2 items-center gap-2">
        <Input placeholder="Search videos..." className="w-full" />
        <Button size="icon" variant="secondary">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {/* button */}
      <div className="flex items-center gap-3">
        <Button variant={"outline"}>
          <Upload className="mr-2 h-4 w-4" /> Upload
        </Button>
        <Button
          variant={"destructive"}
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
