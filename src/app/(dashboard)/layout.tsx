"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PropsWithChildren } from "react";
import AppSidebar from "@/components/app-sidebar";
import MobileHeader from "@/components/mobile-header";
import { useIsMobile } from "@/hooks/use-mobile";

const layout = ({ children }: PropsWithChildren) => {
  const isMobile = useIsMobile();
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-accent/20">
        {isMobile && <MobileHeader />}
        <div className="flex flex-1 flex-col">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default layout;
