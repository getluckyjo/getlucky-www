import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IndweBannerStrip from "@/components/IndweBannerStrip";
import HomeHero from "@/components/home/HomeHero";
import Products from "@/components/home/Products";
import HowItWorks from "@/components/home/HowItWorks";
import PrizeLadder from "@/components/home/PrizeLadder";
import Courses from "@/components/home/Courses";
import Membership from "@/components/home/Membership";
import Trust from "@/components/home/Trust";
import GolfDays from "@/components/home/GolfDays";
import ForClubs from "@/components/home/ForClubs";
import FinalCta from "@/components/home/FinalCta";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HomeHero />
        <IndweBannerStrip src="/indwe-banner/index.html" />
        <Products />
        <HowItWorks />
        <PrizeLadder />
        <Courses />
        <Membership />
        <Trust />
        <GolfDays />
        <ForClubs />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
