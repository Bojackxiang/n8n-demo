"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Workflow,
  Home,
  Settings,
  BarChart3,
  Zap,
  KeyIcon,
} from "lucide-react";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useEnsureAuth from "@/hooks/use-ensure-auth";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Overview",
    items: [
      {
        label: "Workflows",
        icon: Home,
        url: "/workflows",
      },
      {
        label: "Credentials",
        icon: KeyIcon,
        url: "/credentials",
      },
      {
        label: "Executions",
        icon: KeyIcon,
        url: "/executions",
      },
    ],
  },
  {
    title: "Workflows",
    items: [
      {
        label: "All Workflows",
        icon: Workflow,
        url: "/dashboard/workflows",
      },
      {
        label: "AI Testing",
        icon: Zap,
        url: "/dashboard",
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        label: "Preferences",
        icon: Settings,
        url: "/dashboard/settings",
      },
    ],
  },
];

const AppSidebar = () => {
  // const { data: session } = useSession();
  const { data } = useEnsureAuth();
  const pathname = usePathname();
  console.log("data: ", data);
  console.log("data: ", data?.user.email, data?.user.name);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border/40">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                  <Workflow className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-heading font-semibold">ShopNode</span>
                  <span className="text-xs text-muted-foreground">
                    Automation Platform
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url;

                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild={!isActive}
                        tooltip={item.label}
                        isActive={isActive}
                        className={
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground pointer-events-none"
                            : ""
                        }
                      >
                        {isActive ? (
                          <div className="flex items-center gap-2">
                            <item.icon className="size-4" />
                            <span>{item.label}</span>
                          </div>
                        ) : (
                          <Link href={item.url}>
                            <item.icon className="size-4" />
                            <span>{item.label}</span>
                          </Link>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
              <Avatar className="size-8">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-xs font-semibold text-white">
                  {data?.user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col leading-none group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium">
                  {data?.user?.name || "User"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {data?.user?.email || "user@example.com"}
                </span>
              </div>
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem className="group-data-[collapsible=icon]:hidden">
            <LogoutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
