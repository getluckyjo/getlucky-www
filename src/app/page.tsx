import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import PartnerCourses from "@/components/PartnerCourses";
import PrizeTiers from "@/components/PrizeTiers";
import IndwePartnership from "@/components/IndwePartnership";
import IndweOffer from "@/components/IndweOffer";
import Membership from "@/components/Membership";
import Features from "@/components/Features";
import CorporateCTA from "@/components/CorporateCTA";
import GolfAgency from "@/components/GolfAgency";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <PartnerCourses />
        <PrizeTiers />
        <IndwePartnership />
        <IndweOffer />
        <Membership />
        <Features />
        <CorporateCTA />
        <GolfAgency />
      </main>
      <Footer />
    </>
  );
}
