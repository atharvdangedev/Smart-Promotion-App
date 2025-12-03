import logoImg from "../../../assets/images/swp.webp";
import "./Header.css";

const navItems = [
  { label: "Home", path: "https://intentdesk.com/" },
  {
    label: "Smart Whatsapp Promotion App",
    path: "https://intentdesk.com/smart-promotion-app/",
  },
  { label: "Affiliate Registration", path: "/affiliate-registration" },
  { label: "Sign In", path: "/signin" },
];

const Header = () => {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
        <div className="container">
          <a href="https://intentdesk.com/" className="navbar-brand">
            <img
              src={logoImg}
              alt="Intentdesk Logo"
              style={{ width: "180px" }}
            />
          </a>

          <ul className="navbar-nav ms-auto">
            {navItems.map((item) => (
              <li key={item.path} className="nav-item mx-1">
                <a href={item.path} className="nav-link px-3 py-2">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
