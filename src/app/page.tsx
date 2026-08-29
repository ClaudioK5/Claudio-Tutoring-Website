import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustStats } from "@/components/TrustStats";
import { ValueProposition } from "@/components/ValueProposition";
import { Subjects } from "@/components/Subjects";
import { ExperienceValue } from "@/components/ExperienceValue";
import { HowItWorks } from "@/components/HowItWorks";
import { Results } from "@/components/Results";
import { Testimonials } from "@/components/Testimonials";
import { About } from "@/components/About";
import { IntroVideo } from "@/components/IntroVideo";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustStats />
        <ValueProposition />
        <Subjects />
        <ExperienceValue />
        <HowItWorks />
        <Results />
        <Testimonials />
        <About />
        <IntroVideo />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
