import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Checkout from "./components/Checkout";
import VendorRegistration from "./components/VendorRegistration";
import AffiliateRegistration from "./components/AffiliateRegistration";
import AffiliateTerms from "./components/AffiliateTerms";
import AboutUs from "./components/AboutUs";
import TermsOfService from "./components/TermsOfService";
import PrivacyPolicy from "./components/PrivacyPolicy";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/register" element={<VendorRegistration />} />
      <Route path="/affiliate-register" element={<AffiliateRegistration />} />
      {/* <Route path="/affiliate-terms" element={<AffiliateTerms />} /> */}
      {/* <Route path="/about-us" element={<AboutUs />} /> */}
      {/* <Route path="/terms-of-service" element={<TermsOfService />} /> */}
      {/* <Route path="/privacy-policy" element={<PrivacyPolicy />} /> */}
    </Routes>
  );
};

export default App;
