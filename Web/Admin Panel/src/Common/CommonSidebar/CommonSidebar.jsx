/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import logoImg from "../../assets/images/swp.webp";
import MenuItem from "./MenuItem";
import { memo } from "react";

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
              <Link to="admin/index" className="brand-icon me-2">
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
                link="admin/index"
                icon={<i className="bi bi-house-door"></i>}
                menuItems={[]}
              />
              <MenuItem
                title="Payments"
                link="admin/payments"
                icon={<i className="bi bi-wallet2"></i>}
                menuItems={[]}
              />
              <MenuItem
                title="Orders"
                link="admin/app/orders"
                icon={<i className="bi bi-cart"></i>}
                menuItems={[]}
              />
              <MenuItem
                title="Subscriptions"
                link="admin/app/subscriptions"
                icon={<i className="bi bi-wallet"></i>}
                menuItems={[]}
              />
              <MenuItem
                title="Plans"
                link="admin/plans"
                icon={<i className="bi bi-receipt"></i>}
                menuItems={[]}
              />
              <MenuItem
                title="Users"
                link="admin/users"
                icon={<i className="bi bi-person"></i>}
                menuItems={[]}
              />
              <MenuItem
                title="Vendors"
                link="admin/vendors"
                icon={<i className="bi bi-person"></i>}
                menuItems={[]}
              />
              <MenuItem
                title="Affiliates"
                link="admin/affiliates"
                icon={<i className="bi bi-person"></i>}
                menuItems={[]}
              />
              <MenuItem
                title="Coupon Codes"
                link="admin/coupon-codes"
                icon={<i className="bi bi-cash-stack"></i>}
                menuItems={[]}
              />
              <MenuItem
                title="Commissions"
                link="admin/commissions"
                icon={<i className="bi bi-cash"></i>}
                menuItems={[]}
              />
              <MenuItem
                title="Templates"
                link="admin/templates"
                icon={<i className="bi bi-file-earmark-richtext"></i>}
                menuItems={[]}
              />
              <MenuItem
                title="Contacts"
                link="admin/contacts"
                icon={<i className="bi bi-person-lines-fill"></i>}
                menuItems={[]}
              />
            </ul>
          </div>
        </div>
      </nav>
    </aside>
  );
});

CommonSidebar.displayName = "CommonSidebar";

export default CommonSidebar;
