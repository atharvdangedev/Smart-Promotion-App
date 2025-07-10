/* eslint-disable react/prop-types */
import { Route, Routes, Navigate } from "react-router-dom";
import { lazyLoad } from "./lazyLoad";
import AuthWrapper from "./AuthWrapper";

// Lazy loaded components using custom lazyLoad
const NotFound = lazyLoad(() => import("./NotFound/NotFound"));
const Templates = lazyLoad(() => import("./Partials/Apps/Templates/Templates"));
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
const Plans = lazyLoad(() => import("./Partials/Apps/Plans/Plans"));
const AddPlan = lazyLoad(() => import("./Partials/Apps/Plans/AddPlan"));
const EditPlan = lazyLoad(() => import("./Partials/Apps/Plans/EditPlan"));
const Contacts = lazyLoad(() => import("./Partials/Apps/Contacts/Contacts"));
const Vendors = lazyLoad(() => import("./Partials/Apps/Vendors/Vendors"));
const AddVendor = lazyLoad(() => import("./Partials/Apps/Vendors/AddVendor"));
const EditVendor = lazyLoad(() => import("./Partials/Apps/Vendors/EditVendor"));
const Agents = lazyLoad(() => import("./Partials/Apps/Agents/Agents"));
const AddAgent = lazyLoad(() => import("./Partials/Apps/Agents/AddAgent"));
const EditAgent = lazyLoad(() => import("./Partials/Apps/Agents/EditAgent"));
const Subscriptions = lazyLoad(() =>
  import("./Partials/Apps/Subscriptions/Subscriptions")
);
const CouponCodeManagement = lazyLoad(() =>
  import("./Partials/Apps/CouponCodeManagement/CouponCodeManagement")
);
const Affiliates = lazyLoad(() =>
  import("./Partials/Apps/Affiliates/Affiliates")
);
const AddAffiliate = lazyLoad(() =>
  import("./Partials/Apps/Affiliates/AddAffiliate")
);
const EditAffiliate = lazyLoad(() =>
  import("./Partials/Apps/Affiliates/EditAffiliate")
);
const Commissions = lazyLoad(() =>
  import("./Partials/Apps/Commissions/Commissions")
);
const VendorContacts = lazyLoad(() =>
  import("./Partials/Apps/VendorContacts/VendorContacts")
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/signin" element={<Signin />} />
      <Route path="/forgot-password" element={<PasswordReset />} />
      <Route path="/resetPassword" element={<TwoStep />} />
      <Route path="/user-activation" element={<UserActivation />} />

      <Route
        path="/*"
        element={
          <AuthWrapper>
            <Routes>
              {/* Root route */}
              <Route
                path="/"
                element={<Navigate to="/admin/index" replace />}
              />
              {/* dashboard and payment related routes */}
              <Route path="/admin/index" element={<Index />} />
              <Route path="/admin/payments" element={<MyWallet />} />
              <Route path="/admin/app/orders" element={<Invoices />} />
              <Route
                path="/admin/app/orders/:orderId"
                element={<OrderDetails />}
              />
              <Route path="/admin/app/invoice" element={<InvoiceDetails />} />
              <Route
                path="/admin/app/subscriptions"
                element={<Subscriptions />}
              />

              {/* Plan Routes */}
              <Route path="/admin/plans" element={<Plans />} />
              <Route path="/admin/plans/add-plan" element={<AddPlan />} />
              <Route
                path="/admin/plans/edit-plan/:planId"
                element={<EditPlan />}
              />

              {/* logged in user profile */}
              <Route path="/admin/user/my-profile" element={<MyProfile />} />
              <Route
                path="/admin/user/change-password"
                element={<ChangePassword />}
              />

              {/* user management routes */}
              <Route path="/admin/users" element={<ClientsList />} />
              <Route path="/admin/user/add-user" element={<Adduser />} />
              <Route
                path="/admin/user/edit-user/:userId"
                element={<EditUser />}
              />

              {/* vendor management */}
              <Route path="/admin/vendors" element={<Vendors />} />
              <Route path="/admin/vendor/add-vendor" element={<AddVendor />} />
              <Route
                path="/admin/vendor/edit-vendor/:vendorId"
                element={<EditVendor />}
              />

              {/* agent management */}
              <Route path="/admin/vendor/agents/:vendorId" element={<Agents />} />
              <Route
                path="/admin/vendor/agents/add-agent"
                element={<AddAgent />}
              />
              <Route
                path="/admin/vendor/agents/edit-agent/:agentId"
                element={<EditAgent />}
              />

              {/* affiliates */}
              <Route path="/admin/affiliates" element={<Affiliates />} />
              <Route
                path="/admin/affiliates/add-affiliate"
                element={<AddAffiliate />}
              />
              <Route
                path="/admin/affiliates/edit-affiliate/:affiliateId"
                element={<EditAffiliate />}
              />

              {/* Coupon Code Management */}
              <Route
                path="/admin/coupon-codes"
                element={<CouponCodeManagement />}
              />

              {/* Comissions */}
              <Route path="/admin/commissions" element={<Commissions />} />

              {/* Contacts */}
              <Route path="/admin/contacts" element={<Contacts />} />
              <Route
                path="/admin/contacts/vendor/:vendorId"
                element={<VendorContacts />}
              />

              {/* template management */}
              <Route path="/admin/templates" element={<Templates />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthWrapper>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
