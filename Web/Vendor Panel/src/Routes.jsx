/* eslint-disable react/prop-types */
import { Route, Routes } from "react-router-dom";
import { lazyLoad } from "./lazyLoad";
import AuthWrapper from "./AuthWrapper";

// Lazy loaded components using custom lazyLoad
const NotFound = lazyLoad(() => import("./NotFound/NotFound"));
const Landing = lazyLoad(() => import("./Partials/Pages/Landing/Landing"));
const Home = lazyLoad(() => import("./Partials/Pages/Landing/Home"));
const OrderDetails = lazyLoad(() =>
  import("./Partials/Apps/Users/Invoices/OrderDetails")
);
const InvoiceDetails = lazyLoad(() =>
  import("./Partials/Apps/Users/Invoices/Components/InvoiceDetails")
);
const ChangePassword = lazyLoad(() =>
  import("./Partials/Apps/ChangePassword/ChangePassword")
);
const Signin = lazyLoad(() =>
  import("./Partials/Pages/Authentication/Signin/Signin")
);
const UserActivation = lazyLoad(() =>
  import("./Partials/Pages/Authentication/UserActivation/UserActivation")
);
const PasswordReset = lazyLoad(() =>
  import("./Partials/Pages/Authentication/PasswordReset/PasswordReset")
);
const TwoStep = lazyLoad(() =>
  import("./Partials/Pages/Authentication/TwoStep/TwoStep")
);
const Invoices = lazyLoad(() =>
  import("./Partials/Apps/Users/Invoices/Invoices")
);
const MyProfile = lazyLoad(() =>
  import("./Partials/Apps/Users/MyProfile/MyProfile")
);
const Index = lazyLoad(() => import("./Partials/Workspace/Dashboard/Index"));
const MyWallet = lazyLoad(() =>
  import("./Partials/Workspace/MyWallet/MyWallet")
);
const Agents = lazyLoad(() => import("./Partials/Apps/Agents/Agents"));
const AddAgent = lazyLoad(() => import("./Partials/Apps/Agents/AddAgent"));
const EditAgent = lazyLoad(() => import("./Partials/Apps/Agents/EditAgent"));
const Templates = lazyLoad(() => import("./Partials/Apps/Templates/Templates"));
const AddTemplate = lazyLoad(() =>
  import("./Partials/Apps/Templates/AddTemplate")
);
const EditTemplate = lazyLoad(() =>
  import("./Partials/Apps/Templates/EditTemplate")
);
const Subscriptions = lazyLoad(() =>
  import("./Partials/Apps/Subscriptions/Subscriptions")
);
const Contacts = lazyLoad(() => import("./Partials/Apps/Contacts/Contacts"));
import CouponCodeManagement from "./Partials/Apps/CouponCodeManagement/CouponCodeManagement";
import Commissions from "./Partials/Apps/Commissions/Commissions";
import AddCouponCode from "./Partials/Apps/CouponCodeManagement/AddCouponCode";
import EditCouponCode from "./Partials/Apps/CouponCodeManagement/EditCouponCode";
const EditContact = lazyLoad(() =>
  import("./Partials/Apps/Contacts/EditContact")
);
const VendorRegistration = lazyLoad(() =>
  import("./Partials/Pages/Landing/VendorRegistration")
);
const Checkout = lazyLoad(() => import("./Partials/Pages/Landing/Checkout"));
const PaymentStatus = lazyLoad(() =>
  import("./Partials/Pages/Landing/PaymentStatus")
);
const AffiliateRegistration = lazyLoad(() =>
  import("./Partials/Pages/Landing/AffiliateRegistration")
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />}>
        <Route index element={<Home />} />
      </Route>
      <Route path="/signin" element={<Signin />} />
      <Route path="/forgot-password" element={<PasswordReset />} />
      <Route path="/resetPassword" element={<TwoStep />} />
      <Route path="/user-activation" element={<UserActivation />} />
      <Route path="/vendor-registration" element={<VendorRegistration />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/payment-status" element={<PaymentStatus />} />
      <Route path="/affiliate-registration" element={<AffiliateRegistration />} />

      {/* All other routes wrapped in AuthWrapper */}
      <Route
        path="/*"
        element={
          <AuthWrapper>
            <Routes>
              {/* Protected routes */}
              <Route path="/dashboard" element={<Index />} />
              <Route path="/payments" element={<MyWallet />} />
              <Route path="/orders" element={<Invoices />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route
                path="/order-details/:orderId"
                element={<OrderDetails />}
              />

              <Route path="/invoice" element={<InvoiceDetails />} />
              <Route path="/my-profile" element={<MyProfile />} />
              <Route path="/change-password" element={<ChangePassword />} />

              {/* Agent Management */}
              <Route path="/agents" element={<Agents />} />
              <Route path="/agents/add-agent" element={<AddAgent />} />
              <Route
                path="/agents/edit-agent/:agentId"
                element={<EditAgent />}
              />

              {/* Coupon Code Management */}
              <Route path="/coupon-codes" element={<CouponCodeManagement />} />
              <Route
                path="/coupon-codes/add-coupon"
                element={<AddCouponCode />}
              />
              <Route
                path="/coupon-codes/edit-coupon/:couponId"
                element={<EditCouponCode />}
              />

              {/* Comissions */}
              <Route path="/commissions" element={<Commissions />} />

              {/* Contacts */}
              <Route path="/contacts" element={<Contacts />} />
              <Route
                path="/contacts/edit-contact/:contactId"
                element={<EditContact />}
              />

              {/* Template Management */}
              <Route path="/templates" element={<Templates />} />
              <Route path="/templates/add-template" element={<AddTemplate />} />
              <Route
                path="/templates/edit-template/:templateId"
                element={<EditTemplate />}
              />
              {/* Catch-all for undefined routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthWrapper>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
