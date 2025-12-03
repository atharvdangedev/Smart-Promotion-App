import { jsPDF } from "jspdf";
import formatCurrency from "./formatCurrency";
// import logoImg from "../../../assets/images/swp.webp";

export const generateBrandedInvoicePDF = (invoice) => {
  const doc = new jsPDF();

  // COMPANY INFO
  doc.setFontSize(14).setFont("helvetica", "bold");
  doc.text("Smartscripts Pvt Ltd", 50, 18);
  doc.setFontSize(10).setFont("helvetica", "normal");
  // doc.text("123 Startup Street, Baner, Pune, India", 50, 24);
  doc.text("support@intentdesk.com | +91-9876543210", 50, 30);

  // RIGHT-SIDE INVOICE HEADER
  doc.setFontSize(20).setTextColor(40, 128, 185).setFont("helvetica", "bold");
  doc.text("INVOICE", 160, 20);

  doc.setFontSize(11).setTextColor(0).setFont("helvetica", "normal");
  doc.text(`Invoice #: ${invoice.invoice_number}`, 160, 28);
  doc.text(`Date: ${invoice.invoice_created_at}`, 160, 34);
  doc.text(`Status: ${invoice.invoice_status}`, 160, 40);

  // BILLING INFO
  doc.setFontSize(12).setFont("helvetica", "bold");
  doc.text("Bill To:", 14, 55);
  doc.setFontSize(11).setFont("helvetica", "normal");
  doc.text(
    `${invoice.first_name} ${invoice.last_name}\n${invoice.email}\n${invoice.contact_no}`,
    14,
    62
  );

  // PAYMENT INFO
  doc.setFontSize(12).setFont("helvetica", "bold");
  doc.text("Payment Info:", 105, 55);
  doc.setFontSize(11).setFont("helvetica", "normal");
  doc.text(
    `Method: ${invoice.payment_method}\nTransaction: ${
      invoice.transaction_id || "-"
    }`,
    105,
    62
  );

  // PLAN DETAILS
  let planStartY = 90;
  doc.setFontSize(12).setFont("helvetica", "bold");
  doc.text("Plan Details:", 14, planStartY);
  doc.setFontSize(11).setFont("helvetica", "normal");
  doc.text(
    `Plan Name: ${invoice.title}\nPlan Type: ${invoice.plan_type}`,
    14,
    planStartY + 8
  );

  // TOTALS BOX
  let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 120;

  doc.setFillColor(240);
  doc.roundedRect(120, finalY, 75, 35, 3, 3, "F");

  doc.setFontSize(11).setFont("helvetica", "bold");
  doc.text("Subtotal:", 125, finalY + 10);
  doc.text("Discount:", 125, finalY + 18);
  doc.text("Tax:", 125, finalY + 26);
  doc.text("Grand Total:", 125, finalY + 34);

  doc.setFont("helvetica", "normal");
  doc.text(formatCurrency(invoice.price), 185, finalY + 10, { align: "right" });
  doc.text(formatCurrency(invoice.invoice_discount), 185, finalY + 18, {
    align: "right",
  });
  doc.text(formatCurrency(invoice.invoice_tax), 185, finalY + 26, {
    align: "right",
  });

  doc.setFont("helvetica", "bold");
  doc.text(formatCurrency(invoice.order_amount), 185, finalY + 34, {
    align: "right",
  });

  // FOOTER
  doc.setFontSize(10).setTextColor(120);
  doc.text(
    "Thank you for your business!\nFor support, contact support@intentdesk.com",
    14,
    285
  );

  doc.save(`invoice-${invoice.invoice_number}.pdf`);
};
