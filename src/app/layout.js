import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import NavigationWrapper from "../components/layouts/NavigationWrapper";
import Header from "../components/home/Header";
import Footer from "../components/home/Footer";

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
        </NavigationWrapper>
      </body>
    </html>
  );
}
