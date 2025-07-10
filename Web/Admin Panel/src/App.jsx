/* eslint-disable react/prop-types */
// Component Imports
import AdminLayout from "./Layout/AdminLayout";
import AuthLayout from "./Layout/AuthLayout";
import AppRoutes from "./Routes";
const NotFound = lazyLoad(() => import("./NotFound/NotFound"));
import ErrorComponent from "./Common/ErrorComponent/ErrorComponent";
// Library Imports
import { useSelector } from "react-redux";
import { useLocation, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import { lazyLoad } from "./lazyLoad";

// ErrorBoundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorComponent error={this.state.error} />;
    }

    return this.props.children;
  }
}

const App = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Theme Variables from redux
  const menuTitle = useSelector((state) => state.menu.menuTitle);
  const themeColor = useSelector((state) => state.theme.themeColor);
  const layout = useSelector((state) => state.layout.layout);
  const borderStroke = useSelector((state) => state.stroke.borderStroke);
  const borderLayout = useSelector((state) => state.borderLayout.borderLayout);
  const boxLayout = useSelector((state) => state.boxLayout.boxLayout);
  const monochrome = useSelector((state) => state.monochrome.monochrome);
  const borderRadius = useSelector((state) => state.borderRadius.borderRadius);
  const iconColor = useSelector((state) => state.iconColor.iconColor);
  const themeMode = useSelector((state) => state.themeMode.themeMode);

  const authTitleMapping = {
    "/signin": "Signin",
    "/forgot-password": "SendToken",
    "/resetPassword": "ResetPassword",
    "/user-activation": "UserActivation",
    "/404": "NoPage",
  };

  const adminTitleMapping = {
    "/admin/index": "Index",
    "/admin/payments": "MyWallet",
    "/admin/app/orders": "Invoices",
    "/admin/app/orders/:orderId": "OrderDetails",
    "/admin/app/invoice": "InvoiceDetails",
    "/admin/app/subscriptions": "Subscriptions",
    "/admin/plans": "Plans",
    "/admin/plans/add-plan": "AddPlan",
    "/admin/plans/edit-plan": "EditPlan",
    "/admin/users": "ClientsList",
    "/admin/user/my-profile": "MyProfile",
    "/admin/user/add-user": "Adduser",
    "/admin/user/edit-user": "EditUser",
    "/admin/user/change-password": "ChangePassword",
    "/admin/vendors": "Vendors",
    "/admin/vendor/add-vendor": "AddVendor",
    "/admin/vendor/edit-vendor": "EditVendor",
    "/admin/vendor/agents": "Agents",
    "/admin/vendor/agents/add-agent": "AddAgent",
    "/admin/vendor/agents/edit-agent": "EditAgent",
    "/admin/affiliates": "Affiliates",
    "/admin/affiliates/add-affiliate": "AddAffiliate",
    "/admin/affiliates/edit-affiliate": "EditAffiliates",
    "/admin/coupon-codes": "CouponCodeManagement",
    "/admin/commissions": "Commissions",
    "/admin/contacts": "Contacts",
    "/admin/contacts/vendor": "VendorContacts",
    "/admin/templates": "Templates",
  };

  // API URL
  const isAuthRoute = authTitleMapping[pathname];
  const isAdminRoute = Object.keys(adminTitleMapping).some((route) =>
    pathname.startsWith(route)
  );

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/index" replace />} />

        {isAuthRoute && (
          <Route element={<AuthLayout />}>
            <Route path={pathname} element={<AppRoutes />} />
          </Route>
        )}

        {isAdminRoute && (
          <Route
            element={
              <AdminLayout
                menuTitle={menuTitle}
                themeColor={themeColor}
                layout={layout}
                borderStroke={borderStroke}
                borderLayout={borderLayout}
                boxLayout={boxLayout}
                monochrome={monochrome}
                borderRadius={borderRadius}
                iconColor={iconColor}
                themeMode={themeMode}
              />
            }
          >
            <Route path="/*" element={<AppRoutes />} />
          </Route>
        )}

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
