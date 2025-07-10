export const routePatterns = [
  { pattern: "dashboard", title: "Dashboard" },
  { pattern: "payments", title: "Payments" },
  { pattern: "orders", title: "Orders" },
  { pattern: "orders/:orderId", title: "Orders / Order Details" },
  { pattern: "invoice", title: "Invoices / Invoice Details" },
  { pattern: "change-password", title: "Change Password" },
  // user routes
  { pattern: "my-profile", title: "User / My Profile" },
  // agent routes
  { pattern: "agents", title: "Agents / List" },
  { pattern: "agents/add-agent", title: "Agents / Add Agent" },
  {
    pattern: "agents/edit-agent/:agentId",
    title: "Agents / Edit Agent",
  },
  // Coupon Code Management
  {
    pattern: "coupon-codes",
    title: "Coupon Code Management",
  },
  {
    pattern: "coupon-codes/add-coupon",
    title: "Coupon Codes / Add Coupon",
  },
  {
    pattern: "coupon-codes/edit-coupon/:couponId",
    title: "Coupon Code / Edit Coupon",
  },
  // Commissions
  {
    pattern: "commissions",
    title: "Commissions",
  },
  // template routes
  { pattern: "templates", title: "Templates / List" },
  { pattern: "templates/add-template", title: "Templates / Add Template" },
  {
    pattern: "templates/edit-template/:templateId",
    title: "Templates / Edit Template",
  },
  // Contacts
  {
    pattern: "contacts",
    title: "Contacts",
  },
  {
    pattern: "contacts/edit-contact/:contactId",
    title: "Contacts / Edit Contact",
  },
];
