import { Link } from "react-router-dom";
import logoImg from "../../assets/images/swp.webp";
import { memo } from "react";

const CommonBrand = memo(() => {
  return (
    <div className="px-4 pt-2 pb-2 brand" id="brand" data-bs-theme="none">
      <div>
        <div className="d-flex align-items-center pt-1 m-4">
          <button
            className="btn d-inline-flex d-xl-none border-0 p-0 pe-2"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvas_Navbar"
          >
            <svg
              className="svg-stroke"
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M4 6l16 0"></path>
              <path d="M4 12l16 0"></path>
              <path d="M4 18l16 0"></path>
            </svg>
          </button>
          {/* <!--[ Start:: Brand Logo icon ]--> */}
          <Link
            to="/vendor/index"
            className="brand-icon text-decoration-none d-flex align-items-center"
            title="Smart Digital Card"
          >
            <img
              src={logoImg}
              alt="logo"
              className="brand-icon-img"
              style={{ width: "100%" }}
            />
          </Link>
        </div>
      </div>
    </div>
  );
});

CommonBrand.displayName = "CommonBrand";
export default CommonBrand;
