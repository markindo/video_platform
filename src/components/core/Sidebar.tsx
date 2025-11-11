"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import clsx from "clsx";
import { House, User, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { data: session } = useSession();

  // ✅ deteksi mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768); // <768px = mobile
    handleResize(); // jalankan di awal
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ambil role user login
  const role = session?.user?.role;

  // menu utama
  const items = [
    { title: "Home", url: "/", icon: House },
    { title: "Profile", url: "/profile", icon: User },
    ...(role === "ADMIN"
      ? [{ title: "Users", url: "/users", icon: Users }]
      : []),
  ];

  return (
    <Sidebar
      // 💡 hanya collapsible di desktop
      collapsible={isMobile ? undefined : "icon"}
      className={clsx(
        "bg-white transition-all duration-300 border-r",
        !isMobile && state === "collapsed" ? "w-16" : "w-48"
      )}
    >
      <SidebarContent
        className={clsx(
          "bg-white border-none shadow-none transition-all duration-300",
          !isMobile && state === "collapsed" ? "w-16" : "w-48"
        )}
      >
        <div className="ml-1.5">
          <SidebarGroup className="mt-16">
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={clsx(pathname === item.url && "!bg-gray-100")}
                    >
                      <a href={item.url} className="flex items-center w-full">
                        <item.icon className="h-4 w-4 shrink-0" />
                        {!isMobile && state === "collapsed" ? null : (
                          <span className="text-sm ">{item.title}</span>
                        )}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
