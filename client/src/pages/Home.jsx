import Navbar from "../components/common/NavBar";
import Hero from "../components/common/Hero";
import Features from "../components/common/Features";
import FeaturedCourses from "../components/common/FeatureCourses";
import HowItWorks from "../components/common/HowItWorks";
import FinalCTA from "../components/common/FinalCTA";
import Footer from "../components/common/Footer";

function Home() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#15121F]">
      <Navbar />

      <main>
        <Hero />
        <Features />
        <FeaturedCourses />
        <HowItWorks />
        <FinalCTA />
      </main>

      <div
        aria-hidden="true"
        className="h-16 bg-[#FBFAF7] sm:h-20 lg:h-24"
      />

      <Footer />
    </div>
  );
}

export default Home;