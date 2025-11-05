"use Client";

import { ReactNode } from "react";
import { Navbar } from "../core/Navbar";

export default function LayoutContent({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Navbar />

      <div className="flex flex-1">
        <aside className="z-10 min-w-16 max-w-48 bg-white">{sidebar}</aside>

        <main className="flex-1 overflow-auto p-4 border">{children}</main>
      </div>
    </div>
  );
}
