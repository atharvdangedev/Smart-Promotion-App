import { useLocation } from "react-router-dom";
import { lazyLoad } from "../lazyLoad";

const Signin = lazyLoad(() =>
  import("../Partials/Pages/Authentication/Signin/Signin")
);
const UserActivation = lazyLoad(() =>
  import("../Partials/Pages/Authentication/UserActivation/UserActivation")
);

const PasswordReset = lazyLoad(() =>
  import("../Partials/Pages/Authentication/PasswordReset/PasswordReset")
);
const TwoStep = lazyLoad(() =>
  import("../Partials/Pages/Authentication/TwoStep/TwoStep")
);
import NoPageFound from "../Partials/Pages/Authentication/NoPageFound/NoPageFound";
import loginImg from "../assets/images/login-img.png";
import logoImg from "../assets/images/swp.webp";

const AuthLayout = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const authTitleMapping = {
    "/signin": "Signin",
    "/forgot-password": "SendToken",
    "/resetPassword": "ResetPassword",
    "/user-activation": "UserActivation",
    "/404": "NoPage",
  };
  const authTitle = authTitleMapping[pathname] || "";

  const authComponents = {
    Signin: <Signin />,
    SendToken: <PasswordReset />,
    UserActivation: <UserActivation />,
    ResetPassword: <TwoStep />,
    NoPage: <NoPageFound />,
  };

  return (
    <body
      data-bvite="theme-CeruleanBlue"
      className="layout-border svgstroke-a layout-default auth"
    >
      <main className="container-fluid px-0">
        {/* <!-- start: project logo --> */}
        <div className="px-xl-5 px-4 auth-header" data-bs-theme="none">
          <a
            href="/signin"
            className="brand-icon text-decoration-none d-flex align-items-center"
            title="Smart Booking System"
          >
            <img
              src={logoImg}
              alt="logo"
              className="brand-icon-img"
              style={{ width: "200px", marginTop: "20px" }}
            />
          </a>
        </div>

        {/* <!-- start: page menu link --> */}
        <aside className="px-xl-5 px-4 auth-aside" data-bs-theme="none">
          <img className="login-img" src={loginImg} alt="" />
        </aside>

        {/* <!-- start: page body area --> */}
        {authComponents[authTitle]}

        {/* <!-- start: page footer --> */}
        <footer className="px-xl-5 px-4">
          <p className="mb-0 text-muted">
            Copyright <span>@{new Date().getFullYear()}</span> Developed by{" "}
            <a
              href="https://smartscripts.tech/"
              target="_blank"
              rel="noreferrer"
            >
              Smartscripts Private Limited.
            </a>{" "}
            All Rights Reserved
          </p>
        </footer>
      </main>
    </body>
  );
};

export default AuthLayout;
