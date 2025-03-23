import HeroSection from "../components/home/HeroSection";
import FeaturedProducts from "../components/home/FeaturedProducts";
import Heritage from "../components/home/Heritage";
import Testimonials from "../components/home/Testimonials";
import CTASection from "../components/home/CTASection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <FeaturedProducts />
        <Heritage />
        <Testimonials />
        <CTASection />
      </main>
    </div>
  );
}
