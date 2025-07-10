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
    "/dashboard": "Index",
    "/payments": "MyWallet",
    "/orders": "Invoices",
    "/order-details": "OrderDetails",
    "/invoice": "InvoiceDetails",
    "/my-profile": "MyProfile",
    "/change-password": "ChangePassword",
    "/agents": "Agents",
    "/agents/add-agent": "AddAgent",
    "/agents/edit-agent": "EditAgent",
    "/coupon-codes": "CouponCodeManagement",
    "/coupon-codes/add-coupon": "AddCouponCode",
    "/coupon-codes/edit-coupon": "EditCouponCode",
    "/commissions": "Commissions",
    "/contacts": "Contacts",
    "/contacts/edit-contact": "EditContact",
    "/templates": "Templates",
    "/templates/add-template": "AddTemplate",
    "/templates/edit-template": "EditTemplate",
  };

  // API URL
  const isAuthRoute = authTitleMapping[pathname];
  const isAdminRoute = Object.keys(adminTitleMapping).some((route) =>
    pathname.startsWith(route)
  );

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

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
