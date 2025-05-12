"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"
import { useAuthStore } from "@/store/authStore"
import { NavDocuments } from "@/components/admin/dashboard/nav-documents"
import { NavMain } from "@/components/admin/dashboard/nav-main"
import { NavSecondary } from "@/components/admin/dashboard/nav-secondary"
import { NavUser } from "@/components/admin/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { SyncLoader } from "react-spinners"

const override = {
  display: "block",
  margin: "0 auto",
};

export function AppSidebar({
  ...props
}) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true); 

  useEffect( () => {
    if (!user) {
      if (useAuthStore.persist.hasHydrated() && !user) { 
        router.push("/login");
      }
    }
    setLoading(false);
  }, [user, router])


  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999] w-screen h-screen">
        <SyncLoader
          color="#8B4513"
          loading={loading}
          cssOverride={override}
          size={12}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  if (!user) {
    return null;
  }
    const data = {
    user: {
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      email: user.email || "",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: IconDashboard,
      },
      {
        title: "Products",
        url: "/admin/products",
        icon: IconListDetails,
      },
  
      {
        title: "Orders",
        url: "/admin/orders",
        icon: IconChartBar,
      },
      {
        title: "Customers",
        url: "/admin/customers",
        icon: IconUsers,
      },
      {
        title: "Customer Designs",
        url: "/admin/customer-designs",
        icon: IconFolder,
      },
    ],
    navClouds: [
      {
        title: "Capture",
        icon: IconCamera,
        isActive: true,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
      {
        title: "Proposal",
        icon: IconFileDescription,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
      {
        title: "Prompts",
        icon: IconFileAi,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "#",
        icon: IconSettings,
      },
  
      {
        title: "Search",
        url: "#",
        icon: IconSearch,
      },
    ],
    // documents: [
    //   {
    //     name: "Data Library",
    //     url: "#",
    //     icon: IconDatabase,
    //   },
    //   {
    //     name: "Reports",
    //     url: "#",
    //     icon: IconReport,
    //   },
    //   {
    //     name: "Word Assistant",
    //     url: "#",
    //     icon: IconFileWord,
    //   },
    // ],
  }

  return (
    (<Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Hufano Handicraft</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="flex-1 overflow-y-auto py-8">
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>)
  );
}
