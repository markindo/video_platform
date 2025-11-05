"use Client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { AppSidebar } from "../core/Sidebar";
import LayoutContent from "./LayoutContent";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <LayoutContent sidebar={<AppSidebar />}>{children}</LayoutContent>
    </SidebarProvider>
  );
}
