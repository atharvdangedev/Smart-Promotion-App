import logoImg from "../../../assets/images/swp.webp";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-main">
        <div className="container py-5">
          <div className="row mb-4">
            <div className="col-12">
              <img
                src={logoImg}
                alt="Intentdesk"
                className="footer-logo mb-2"
              />
              <p
                style={{
                  fontSize: "18px",
                  color: "#b0c4de",
                }}
              >
                Smart business automation made simple. Easy to implement, quick
                to start, and designed to help you manage, secure, and grow your
                business effortlessly.
              </p>
            </div>
          </div>
          <hr className="footer-divider" />
          <div className="row g-4">
            <div
              className="col-12 col-md-6 col-lg-3"
              style={{
                color: "#b0c4de",
              }}
            >
              <h5 className="footer-heading">Get In Touch</h5>
              <p>
                Pusegaon, Satara,
                <br />
                Maharashtra, India – 415502
              </p>
              <p>
                402, Olympia Phase I, Mumbai-Bangalore Highway, Baner, Pune,
                <br />
                Maharashtra, India – 411045
              </p>
              <p>
                <a className="footer-link" href="mailto:support@intentdesk.com">
                  Email: support@intentdesk.com
                </a>
              </p>
              <p>
                <a className="footer-link" href="tel:+91 7389304545">
                  Phone: +91 7389304545
                </a>
              </p>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <h5 className="footer-heading">Quick Links</h5>
              <ul className="list-unstyled">
                <li>
                  <a
                    href="https://intentdesk.com/about-us/"
                    className="footer-link"
                  >
                    About us
                  </a>
                </li>
                <li>
                  <a
                    to="https://intentdesk.com/contact/"
                    className="footer-link"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a to="https://intentdesk.com/blogs/" className="footer-link">
                    Blogs
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <h5 className="footer-heading">Our Products</h5>
              <ul className="list-unstyled">
                <li>
                  <a
                    href="https://intentdesk.com/smart-promotion-app/"
                    className="footer-link"
                  >
                    Smart Promotion App
                  </a>
                </li>
                <li>
                  <a
                    href="https://intentdesk.com/nfc-cards/"
                    className="footer-link"
                  >
                    Smart Nfc Cards
                  </a>
                </li>
                <li>
                  <a
                    href="https://intentdesk.com/local-business-seo/"
                    className="footer-link"
                  >
                    Smart NTM
                  </a>
                </li>
                <li>
                  <a
                    href="https://intentdesk.com/mobile-device-management/"
                    className="footer-link"
                  >
                    Smart MDM
                  </a>
                </li>
                <li>
                  <a
                    href="https://intentdesk.com/upcoming/"
                    className="footer-link"
                  >
                    Upcoming
                  </a>
                </li>
              </ul>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <h5 className="footer-heading">Follow Us</h5>
              <div className="social-icons">
                <a href="#" className="footer-link me-3">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="footer-link me-3">
                  <i className="bi bi-youtube"></i>
                </a>
                <a href="#" className="footer-link me-3">
                  <i className="bi bi-linkedin"></i>
                </a>
                <a href="#" className="footer-link me-3">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" className="footer-link">
                  <i className="bi bi-github"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-copyright text-center py-3">
        &copy; {new Date().getFullYear()} All Rights Reserved.
      </div>

      <a href="#top" className="scroll-to-top">
        <i className="bi bi-arrow-up"></i>
      </a>
    </footer>
  );
};

export default Footer;
