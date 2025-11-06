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
import { House, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { data: session } = useSession();

  // ambil role user login
  const role = session?.user?.role;

  // menu utama (hide "Users" kalau bukan ADMIN)
  const items = [
    {
      title: "Home",
      url: "/",
      icon: House,
    },
    ...(role === "ADMIN"
      ? [
          {
            title: "Users",
            url: "/users",
            icon: User,
          },
        ]
      : []),
  ];

  return (
    <Sidebar
      collapsible="icon"
      className={clsx("bg-white", state === "collapsed" ? "w-16" : "w-48")}
    >
      <SidebarContent
        className={clsx(
          "bg-white border-none shadow-none",
          state === "collapsed" ? "w-16" : "w-48"
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
                      <a href={item.url}>
                        <item.icon className="mr-1 h-4 w-4" />
                        <span>{item.title}</span>
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
