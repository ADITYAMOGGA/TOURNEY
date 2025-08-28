import { useState } from "react";
import Nav from "@/components/nav";
import Hero from "@/components/hero";
import Features from "@/components/features";
import PublicSection from "@/components/public-section";
import CTA from "@/components/cta";
import Footer from "@/components/footer";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      <Nav searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Hero />
      <Features />
      {/* Only show tournaments if user is logged in */}
      {user && <PublicSection searchQuery={searchQuery} />}
      <CTA />
      <Footer />
    </div>
  );
}
