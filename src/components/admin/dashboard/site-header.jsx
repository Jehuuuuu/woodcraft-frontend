"use client"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  const isProductPage =  pathname === '/admin/products';
  const isOrdersPage =  pathname === '/admin/orders';
  const isCustomersPage =  pathname === '/admin/customers';      
  const isCustomerDesignsPage = pathname === '/admin/customer-designs';
  const pathName = () => {
    switch (true) {
      case isProductPage:
        return 'Product Management'
      case isOrdersPage:
        return 'Order Management'
      case isCustomersPage:
        return 'Customer Management'
      case isCustomerDesignsPage:
        return 'Customer Designs'
      default:
        return 'Dashboard'
    }
  }
  const headerTitle = pathName();
  return (
    (<header
      className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <h1 className="text-xl font-semibold">{headerTitle}</h1>
      </div>
    </header>)
  );
}
