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
import { usePathname } from "next/navigation";

// Menu utama
const items = [
  {
    title: "Home",
    url: "/",
    icon: House,
  },
  {
    title: "User",
    url: "/user",
    icon: User,
  },
];

// Submenu Master
// const masterItems = [
//   {
//     title: "Device",
//     url: "/master-device",
//     icon: RadioReceiver,
//   },
//   {
//     title: "Line",
//     url: "/master-line",
//     icon: Settings2,
//   },
//   // {
//   //   title: "Role",
//   //   url: "/master-role",
//   //   icon: KeyRound,
//   // },
// ];

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

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
          {/* Menu utama */}
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

          {/* Collapsible Master */}
          {/* <Collapsible className="group/collapsible ">
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <CollapsibleTrigger className="flex w-full items-center">
                      <Blocks className="mr-1 h-4 w-4" />
                      <span>Master</span>
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>

              <CollapsibleContent>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {masterItems.map((sub) => (
                      <SidebarMenuItem key={sub.title}>
                        <SidebarMenuButton
                          asChild
                          className={clsx(
                            "pl-10",
                            pathname === sub.url &&
                              "!bg-[#002040] !text-white pl-10"
                          )}
                        >
                          <a href={sub.url}>
                            <sub.icon className="h-4 w-4" />
                            <span>{sub.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible> */}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
