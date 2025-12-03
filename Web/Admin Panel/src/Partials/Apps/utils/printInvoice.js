import formatCurrency from "./formatCurrency";

/**
 * Open a new window with a nicely-styled invoice HTML and call window.print()
 * @param {Object} invoice - invoice object from API
 */
export function openInvoicePrintWindow(invoice) {
  if (!invoice) return;

  const subtotal = formatCurrency(invoice.price ?? "0");
  const discount = formatCurrency(
    invoice.invoice_discount ?? invoice.discount ?? "0"
  );
  const tax = formatCurrency(invoice.invoice_tax ?? invoice.tax_amount ?? "0");
  const total = formatCurrency(
    invoice.invoice_amount ?? invoice.order_amount ?? invoice.total ?? "0"
  );

  // sanitize strings a bit (simple)
  const escapeHtml = (s) =>
    String(s ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

  const html = `
    <!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Invoice ${escapeHtml(invoice.invoice_number)}</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
      padding: 0;
      background: #fff;
      color: #333;
    }
    .invoice-box {
      max-width: 900px;
      margin: auto;
      padding: 40px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #eee;
      padding-bottom: 20px;
    }
    .company h2 {
      margin: 0;
      font-size: 22px;
      font-weight: 600;
    }
    .company small {
      font-size: 12px;
      color: #666;
    }
    .invoice-meta {
      text-align: right;
    }
    .invoice-meta h1 {
      color: #2a97d1;
      margin: 0;
      font-size: 28px;
    }
    .invoice-meta p {
      margin: 4px 0;
      font-size: 13px;
    }
    .section {
      margin-top: 30px;
    }
    h3 {
      font-size: 16px;
      margin-bottom: 10px;
      color: #2a2a2a;
    }
    .details {
      display: flex;
      justify-content: space-between;
    }
    .details .box {
      flex: 1;
      padding: 12px;
      background: #f9f9f9;
      border: 1px solid #eee;
      border-radius: 6px;
      font-size: 13px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    table th {
      background: #f2f2f2;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      border-bottom: 1px solid #ddd;
    }
    table td {
      padding: 12px;
      border-bottom: 1px solid #eee;
    }
    .totals {
      margin-top: 20px;
      width: 300px;
      margin-left: auto;
      font-size: 14px;
    }
    .totals tr td {
      padding: 6px;
    }
    .totals tr:last-child td {
      font-weight: 700;
      border-top: 2px solid #333;
    }
    footer {
      text-align: center;
      margin-top: 40px;
      font-size: 12px;
      color: #777;
    }
    @media print {
      body { margin: 0; }
      .invoice-box { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="invoice-box">
    <div class="header">
      <div class="company">
        <h2>Smartscripts Pvt Ltd</h2>
        <small>support@intentdesk.com | +91-9876543210</small>
      </div>
      <div class="invoice-meta">
        <h1>INVOICE</h1>
        <p>Invoice #: ${escapeHtml(invoice.invoice_number)}</p>
        <p>Date: ${escapeHtml(
          invoice.invoice_created_at ?? invoice.invoice_payment_date ?? ""
        )}</p>
        <p>Status: ${escapeHtml(
          invoice.invoice_status ?? invoice.payment_status ?? ""
        )}</p>
      </div>
    </div>

    <div class="section details">
      <div class="box">
        <h3>Bill To</h3>
        ${escapeHtml(invoice.first_name)} ${escapeHtml(invoice.last_name)}<br/>
        ${escapeHtml(invoice.email)}<br/>
        ${escapeHtml(invoice.contact_no)}
      </div>
      <div class="box">
        <h3>Payment Info</h3>
        Method: ${escapeHtml(
          invoice.payment_method ?? invoice.invoice_payment_method ?? ""
        )}<br/>
        Transaction: ${escapeHtml(invoice.transaction_id || "-")}<br/>
        Order ID: ${escapeHtml(
          invoice.razorpay_order_id || invoice.order_id || "-"
        )}
      </div>
    </div>

    <div class="section">
      <h3>Plan Details</h3>
      <div class="box">
        <strong>Plan Name:</strong> ${escapeHtml(invoice.title ?? "-")}<br/>
        <strong>Plan Type:</strong> ${escapeHtml(invoice.plan_type ?? "-")}
      </div>
    </div>

    <div class="section">
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th style="text-align:right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${escapeHtml(invoice.title ?? "Plan")}</td>
            <td style="text-align:right">${subtotal}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="section">
      <table class="totals">
        <tr>
          <td>Subtotal:</td>
          <td style="text-align:right">${subtotal}</td>
        </tr>
        <tr>
          <td>Discount:</td>
          <td style="text-align:right">${discount}</td>
        </tr>
        <tr>
          <td>Tax:</td>
          <td style="text-align:right">${tax}</td>
        </tr>
        <tr>
          <td>Grand Total:</td>
          <td style="text-align:right">${total}</td>
        </tr>
      </table>
    </div>

    <footer>
      Thank you for your business!<br/>
      For support, contact support@intentdesk.com
    </footer>
  </div>

  <script>
      window.onload = function() {
        setTimeout(() => {
          window.print();
          window.close();
        }, 200);
      };
    </script>
</body>
</html>
  `;

  const win = window.open("", "_blank", "width=900,height=800");
  if (!win) {
    alert(
      "Pop-up blocked. Please allow pop-ups for this site to print the invoice."
    );
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
}
