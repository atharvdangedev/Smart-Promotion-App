import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css";

const Landing = () => {
  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>

      <Header />
      <main
        style={{
          backgroundColor: "#ffffff",
        }}
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
