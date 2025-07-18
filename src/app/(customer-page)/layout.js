import { Inter, Playfair_Display } from "next/font/google";
import "../globals.css"
import 'leaflet/dist/leaflet.css'
import NavigationWrapper from "../../components/layouts/NavigationWrapper";
import { Toaster } from "@/components/ui/sonner"

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
            <NavigationWrapper>
              <main>{children}</main>
              <Toaster richColors/>
            </NavigationWrapper>
      </body>
    </html>
  );
}
