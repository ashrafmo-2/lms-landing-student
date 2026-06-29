import { ContactSection } from "@/components/landing/contact-section";
import { CoursesSection } from "@/components/landing/courses-section";
import { CTASection } from "@/components/landing/cta-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { WorkshopSection } from "@/components/landing/workshop-section";

import { Footer } from "@/widgets/landing-footer";
import { Navbar } from "@/widgets/landing-navbar";

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <WorkshopSection />
      <CoursesSection />
      <ContactSection />
      <CTASection />
      <Footer />
    </main>
  );
}
