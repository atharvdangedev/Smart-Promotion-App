export const routePatterns = [
  { pattern: "vendor/index", title: "Dashboard" },
  { pattern: "vendor/payments", title: "Payments" },
  { pattern: "vendor/app/orders", title: "Orders" },
  { pattern: "vendor/app/orders/:orderId", title: "Orders / Order Details" },
  { pattern: "vendor/app/invoice", title: "Invoices / Invoice Details" },
  { pattern: "vendor/change-password", title: "Vendor / Change Password" },
  // user routes
  { pattern: "vendor/my-profile", title: "User / My Profile" },
  // agent routes
  { pattern: "vendor/agents", title: "Agents / List" },
  { pattern: "vendor/agents/add-agent", title: "Agents / Add Agent" },
  {
    pattern: "vendor/agents/edit-agent/:agentId",
    title: "Agents / Edit Agent",
  },
  // Coupon Code Management
  {
    pattern: "vendor/coupon-codes",
    title: "Coupon Code Management",
  },
  // Commissions
  {
    pattern: "vendor/commissions",
    title: "Commissions",
  },
  // template routes
  { pattern: "vendor/templates", title: "Templates / List" },
  { pattern: "vendor/addTemplate", title: "Templates / Add Template" },
  {
    pattern: "vendor/editTemplate/:templateName/:templateId",
    title: "Templates / Edit Template",
  },
];
