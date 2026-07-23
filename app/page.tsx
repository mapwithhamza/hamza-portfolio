import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import AboutSection from "@/components/AboutSection";
import CartographySection from "@/components/CartographySection";
import ProjectsSection from "@/components/ProjectsSection";
import MissionControl from "@/components/MissionControl";
import ConnectTransition from "@/components/ConnectTransition";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <ProjectsSection />
      <CartographySection />
      <MissionControl />
      <ConnectTransition />
      <ContactSection />
    </>
  );
}
