import Nav from "@/components/nav";
import Hero from "@/components/hero";
import Features from "@/components/features";
import LiveTournaments from "@/components/live-tournaments";
import CTA from "@/components/cta";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <Features />
      <LiveTournaments />
      <CTA />
      <Footer />
    </div>
  );
}
