/* eslint-disable react/prop-types */
import { Route, Routes, Navigate } from "react-router-dom";
import { lazyLoad } from "./lazyLoad";
import AuthWrapper from "./AuthWrapper";

// Lazy loaded components using custom lazyLoad
const NotFound = lazyLoad(() => import("./NotFound/NotFound"));

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
const ClientsList = lazyLoad(() =>
  import("./Partials/Apps/MyProjects/ClientsList/ClientsList")
);
const Adduser = lazyLoad(() => import("./Partials/Apps/AddUser/Adduser"));
const EditUser = lazyLoad(() => import("./Partials/Apps/EditUser/EditUser"));
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
const Contacts = lazyLoad(() => import("./Partials/Apps/Contacts/Contacts"));
import CouponCodeManagement from "./Partials/Apps/CouponCodeManagement/CouponCodeManagement";
import Commissions from "./Partials/Apps/Commissions/Commissions";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/signin" element={<Signin />} />
      <Route path="/forgot-password" element={<PasswordReset />} />
      <Route path="/resetPassword" element={<TwoStep />} />
      <Route path="/user-activation" element={<UserActivation />} />

      {/* All other routes wrapped in AuthWrapper */}
      <Route
        path="/*"
        element={
          <AuthWrapper>
            <Routes>
              {/* Root route */}
              <Route
                path="/"
                element={<Navigate to="/vendor/index" replace />}
              />
              {/* Protected routes */}
              <Route path="/vendor/index" element={<Index />} />
              <Route path="/vendor/payments" element={<MyWallet />} />
              <Route path="/vendor/app/orders" element={<Invoices />} />
              <Route
                path="/vendor/app/orders/:orderId"
                element={<OrderDetails />}
              />

              <Route path="/vendor/app/invoice" element={<InvoiceDetails />} />
              <Route path="/vendor/users" element={<ClientsList />} />
              <Route path="/vendor/user/my-profile" element={<MyProfile />} />
              <Route path="/vendor/user/add-user" element={<Adduser />} />
              <Route
                path="/vendor/user/edit-user/:userId"
                element={<EditUser />}
              />
              <Route
                path="/vendor/user/change-password"
                element={<ChangePassword />}
              />

              {/* Agent Management */}
              <Route path="/vendor/agents" element={<Agents />} />
              <Route path="/vendor/agents/add-agent" element={<AddAgent />} />
              <Route
                path="/vendor/agents/edit-agent/:agentId"
                element={<EditAgent />}
              />

              {/* Coupon Code Management */}
              <Route
                path="/vendor/coupon-codes"
                element={<CouponCodeManagement />}
              />

              {/* Comissions */}
              <Route path="/vendor/commissions" element={<Commissions />} />

              {/* Contacts */}
              <Route path="/vendor/contacts" element={<Contacts />} />

              {/* Template Management */}
              <Route path="/vendor/templates" element={<Templates />} />
              <Route path="/vendor/addTemplate" element={<AddTemplate />} />
              <Route
                path="/vendor/editTemplate/:templateName/:templateId"
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
