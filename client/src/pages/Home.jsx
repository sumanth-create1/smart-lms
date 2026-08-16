import Navbar from "../components/common/NavBar";
import Hero from "../components/common/Hero";
import Features from "../components/common/Features";
import FeaturedCourses from "../components/common/FeatureCourses";
import HowItWorks from "../components/common/HowItWorks";
import FinalCTA from "../components/common/FinalCTA";
import Footer from "../components/common/Footer";

function Home() {
  return (
    <div
      className="min-h-screen w-full overflow-x-hidden"
      style={{
        backgroundColor: "#15121F",
      }}
    >
      <Navbar />

      <main className="w-full">
        <Hero />

        <Features />

        <FeaturedCourses />

        <HowItWorks />

        <FinalCTA />
      </main>

      {/* Space between CTA and Footer */}

      <div
        className="h-16 sm:h-20 lg:h-24"
        style={{
          backgroundColor: "#FBFAF7",
        }}
      />

      <Footer />
    </div>
  );
}

export default Home;