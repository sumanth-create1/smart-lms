import Navbar from "../components/common/NavBar";
import Hero from "../components/common/Hero";
import Features from "../components/common/Features"
import FeaturedCourses from "../components/common/FeatureCourses";
import HowItWorks from "../components/common/HowItWorks";
import FinalCTA from "../components/common/FinalCTA";
import Footer from "../components/common/Footer";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Features />
        <FeaturedCourses />
        <HowItWorks />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

export default Home;