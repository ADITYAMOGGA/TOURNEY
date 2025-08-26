import { useState } from "react";
import Nav from "@/components/nav";
import Hero from "@/components/hero";
import Features from "@/components/features";
import PublicSection from "@/components/public-section";
import CTA from "@/components/cta";
import Footer from "@/components/footer";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-background">
      <Nav searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Hero />
      <Features />
      <PublicSection searchQuery={searchQuery} />
      <CTA />
      <Footer />
    </div>
  );
}
