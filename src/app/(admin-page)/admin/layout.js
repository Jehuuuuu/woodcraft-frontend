import { Inter, Playfair_Display } from "next/font/google";
import "../../globals.css";
import "../../admin.css";
import { Toaster } from "@/components/ui/sonner"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/admin/dashboard/app-sidebar"
import { SiteHeader } from "@/components/admin/dashboard/site-header"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
});

export const metadata = {
  title: "Hufano Handicraft | Timeless Woodcraft Artistry",
  description: "Discover our collection of bespoke wooden furniture and decor, each piece telling a unique story of craftsmanship and heritage.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className}}`}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 64)",
            "--header-height": "calc(var(--spacing) * 12)"
        }
        }>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
              <main>{children}</main>
              <Toaster richColors/>
        </SidebarInset>
      </SidebarProvider>
      </body>
    </html>
  );
}
