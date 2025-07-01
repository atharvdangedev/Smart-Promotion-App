export const routePatterns = [
  { pattern: "admin/index", title: "Dashboard" },
  { pattern: "admin/payments", title: "Payments" },
  { pattern: "admin/app/orders", title: "Orders" },
  { pattern: "admin/app/orders/:orderId", title: "Orders / Order Details" },
  { pattern: "admin/app/invoice", title: "Invoices / Invoice Details" },
  { pattern: "admin/app/subscriptions", title: "Subscriptions" },
  // plan routes
  { pattern: "admin/plans", title: "Plans" },
  { pattern: "admin/plans/add-plan", title: "Plans / Add Plan" },
  { pattern: "admin/plans/edit-plan/:planId", title: "Plans / Edit Plan" },
  // user routes
  { pattern: "admin/users", title: "Users / List" },
  { pattern: "admin/user/my-profile", title: "User / My Profile" },
  { pattern: "admin/user/add-user", title: "User / Add User" },
  {
    pattern: "admin/user/edit-user/:userId",
    title: "User / Edit User",
  },
  { pattern: "admin/user/change-password", title: "User / Change Password" },
  //vendor routes
  { pattern: "admin/vendors", title: "Vendors / List" },
  { pattern: "admin/vendor/add-vendor", title: "Vendor / Add Vendor" },
  {
    pattern: "admin/vendor/edit-vendor/:vendorId",
    title: "Vendor / Edit Vendor",
  },
  // agent routes
  { pattern: "admin/vendor/agents", title: "Agents / List" },
  { pattern: "admin/vendor/agents/add-agent", title: "Agents / Add Agent" },
  {
    pattern: "admin/vendor/agents/edit-agent/:agentId",
    title: "Agents / Edit Agent",
  },
  // affiliate routes
  { pattern: "admin/affiliates", title: "Affiliates / List" },
  {
    pattern: "admin/affiliates/add-affiliate",
    title: "Affiliates / Add Affiliate",
  },
  {
    pattern: "admin/affiliates/edit-affiliate/:affiliateId",
    title: "Affiliates / Edit Affiliate",
  },
  // Coupon Code Management
  {
    pattern: "admin/coupon-codes",
    title: "Coupon Code Management",
  },
  // Commissions
  {
    pattern: "admin/commissions",
    title: "Commissions",
  },
  // Contacts
  {
    pattern: "admin/contacts",
    title: "Contacts",
  },
  {
    pattern: "admin/contacts/vendor/:vendorId",
    title: "Vendor Contacts",
  },
  // template routes
  { pattern: "admin/templates", title: "Templates / List" },
  { pattern: "admin/addTemplate", title: "Templates / Add Template" },
  {
    pattern: "admin/editTemplate/:templateName/:templateId",
    title: "Templates / Edit Template",
  },
];
