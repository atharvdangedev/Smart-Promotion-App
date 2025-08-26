/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import logoImg from "../../assets/images/swp.webp";
import MenuItem from "./MenuItem";
import { memo } from "react";
import { APP_PERMISSIONS } from "../../Partials/Apps/utils/permissions";
import Can from "../../Partials/Apps/Can/Can";

const CommonSidebar = memo(({ iconColor }) => {
  return (
    <aside className="ps-4 pe-3 py-3 sidebar" id="sidebar" data-bs-theme="none">
      <nav className="navbar navbar-expand-xl py-0">
        <div
          className="offcanvas offcanvas-start"
          data-bs-scroll="true"
          tabIndex="-1"
          id="offcanvas_Navbar"
        >
          <div className="offcanvas-header">
            <div className="d-flex">
              <Link to="index" className="brand-icon me-2">
                <img
                  src={logoImg}
                  alt="logo"
                  className="brand-icon-img"
                  style={{ width: "60%" }}
                />
              </Link>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div className="offcanvas-body flex-column custom_scroll ps-4 ps-xl-0">
            <h6
              className="fl-title title-font ps-2 small text-uppercase text-muted"
              style={{ "--text-color": "var(--theme-color1)" }}
            >
              Workspace
            </h6>
            <ul className={`list-unstyled mb-4 menu-list ${iconColor}`}>
              <MenuItem
                title="Dashboard"
                link="dashboard"
                icon={<i className="bi bi-house-door"></i>}
                menuItems={[]}
              />
              <MenuItem
                title="Payments"
                link="payments"
                icon={<i className="bi bi-wallet2"></i>}
                menuItems={[]}
              />
              <MenuItem
                title="Orders"
                link="orders"
                icon={<i className="bi bi-cart"></i>}
                menuItems={[]}
              />
              <Can do={APP_PERMISSIONS.AGENTS_VIEW}>
                <MenuItem
                  title="Agents"
                  link="agents"
                  icon={<i className="bi bi-person"></i>}
                  menuItems={[]}
                />
              </Can>
              <Can do={APP_PERMISSIONS.COUPONS_VIEW}>
                <MenuItem
                  title="Coupon Codes"
                  link="coupon-codes"
                  icon={<i className="bi bi-cash-stack"></i>}
                  menuItems={[]}
                />
              </Can>
              <Can do={APP_PERMISSIONS.COMMISSIONS_VIEW}>
                <MenuItem
                  title="Commissions"
                  link="commissions"
                  icon={<i className="bi bi-cash"></i>}
                  menuItems={[]}
                />
              </Can>
              <Can do={APP_PERMISSIONS.TEMPLATES_VIEW}>
                <MenuItem
                  title="Templates"
                  link="templates"
                  icon={<i className="bi bi-file-earmark-richtext"></i>}
                  menuItems={[]}
                />
              </Can>
              <Can do={APP_PERMISSIONS.CONTACTS_VIEW}>
                <MenuItem
                  title="Contacts"
                  link="contacts"
                  icon={<i className="bi bi-person-lines-fill"></i>}
                  menuItems={[]}
                />
              </Can>
            </ul>
          </div>
        </div>
      </nav>
    </aside>
  );
});

CommonSidebar.displayName = "CommonSidebar";

export default CommonSidebar;
