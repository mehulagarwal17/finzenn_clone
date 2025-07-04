import Navbar from "../components/common/Navbar";
import HeroSection from "../components/common/HeroSection";
import FeatureSection from "../components/common/FeatureSection";
import TestimonialSection from "../components/common/TestimonialSection";
import FAQSection from "../components/common/FAQSection";
import Footer from "../components/common/Footer";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import BubbleBackground from "./BubbleBackground";

const Landing = () => (
  <div className="min-h-screen bg-white dark:bg-[#0a0f1c] text-gray-900 dark:text-white transition-colors">
    {/* 🌟 Bubbles across entire page */}
    <Navbar />
    <BubbleBackground />

    {/* Page Sections */}
    <HeroSection />
    <FeatureSection />
    <TestimonialSection />
    <FAQSection />
    <Footer />
  </div>
);

export default Landing;
