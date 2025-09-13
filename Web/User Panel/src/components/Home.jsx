import Hero from "./Hero.jsx";
import Header from "./Header.jsx";
import HowItWorks from "./HowItWorks.jsx";
import Features from "./Features.jsx";
import Stats from "./Stats.jsx";
import Testimonials from "./Testimonials.jsx";
import Pricing from "./Pricing.jsx";
import CTA from "./CTA.jsx";
import Footer from "./Footer.jsx";

const Home = () => {
  return (
    <div
      className="bg-white"
      style={{
        scrollBehavior: "smooth",
      }}
    >
      <Header />

      {/* <Hero />

      <HowItWorks />

      <Features />

      <Stats />

      <Testimonials /> */}

      <Pricing />

      {/* <CTA /> */}

      <Footer />
    </div>
  );
};

export default Home;
