import AnimatedLogo from "./components/animated-logo";
import Features from "./components/features";
import Hero from "./components/hero";
import Footer from "./components/footer";
import FullScreenLayout from "@/app/components/full-screen-layout";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      {/* <AudioPlayer /> */}
      <main className="container mx-auto px-6 md:px-3 sm:px-2">
        <FullScreenLayout>
          <div className="flex items-center justify-center w-full h-screen">
            <AnimatedLogo />
          </div>
        </FullScreenLayout>
        <Hero />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
