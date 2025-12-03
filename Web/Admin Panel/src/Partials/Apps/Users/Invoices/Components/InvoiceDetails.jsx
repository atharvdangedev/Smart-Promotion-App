import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import LoadingFallback from "../../../LoadingFallback/LoadingFallback";
// import { generatePDF } from "../../../utils/generatePDF.js";
import { handleApiError } from "../../../utils/handleApiError.js";
import { formatDate } from "../../../utils/formatDate.js";
import formatCurrency from "../../../utils/formatCurrency.js";
import { useSelector } from "react-redux";
// import { generateBrandedInvoicePDF } from "../../../utils/generateInvoicePDF.js";
import { openInvoicePrintWindow } from "../../../utils/printInvoice.js";

const InvoiceDetails = () => {
  const { state } = useLocation();
  const { token, user } = useSelector((state) => state.auth);
  const APP_URL = import.meta.env.VITE_API_URL;

  const [invoiceId, setInvoiceId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState(null);

  // Fetch invoice details from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${APP_URL}/${user.rolename}/invoice-details/${invoiceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setInvoiceData(response.data.invoice);
        }
      } catch (error) {
        handleApiError(error, "fetching", "invoice details");
      } finally {
        setIsLoading(false);
      }
    };

    if (state?.invoiceId) {
      setInvoiceId(state.invoiceId);
    }

    if (invoiceId) {
      fetchData();
    }
  }, [APP_URL, invoiceId, state, token, user.rolename]);

  if (isLoading) return <LoadingFallback />;
  if (!invoiceData) return <p>No invoice found.</p>;

  return (
    <div className="px-4 py-3 page-body">
      <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
        <h4>Invoice #{invoiceData.invoice_number}</h4>
        <div>
          <button
            className="btn btn-primary me-2"
            onClick={() => openInvoicePrintWindow(invoiceData)}
          >
            Print / Save as PDF
          </button>

          <Link to={`/admin/app/orders`} className="btn btn-info text-white">
            Back
          </Link>
        </div>
      </div>

      <div className="card p-4" id="card">
        {/* Invoice Meta */}
        <div className="mb-4">
          <h5 className="mb-1">Invoice ID: {invoiceData.invoice_number}</h5>
          <p className="mb-0">
            Payment Date: {formatDate(invoiceData.invoice_payment_date)}
          </p>
          <p>
            Status:{" "}
            <span
              className={`badge ${
                invoiceData.invoice_status === "paid"
                  ? "bg-success"
                  : "bg-warning"
              }`}
            >
              {invoiceData.invoice_status}
            </span>
          </p>
        </div>

        <hr />

        {/* Customer Details */}
        <div className="row mb-4">
          <div className="col-md-4">
            <h6>
              <strong>Customer Details</strong>
            </h6>
            <p>
              <strong>Name: </strong>
              {invoiceData.first_name} {invoiceData.last_name}
            </p>
            <p>
              <strong>Email: </strong>
              {invoiceData.email}
            </p>
            <p>
              <strong>Mobile: </strong>
              {invoiceData.contact_no}
            </p>
          </div>

          <div className="col-md-4">
            <h6>
              <strong>Payment Details</strong>
            </h6>
            <p>
              <strong>Method: </strong>
              {invoiceData.invoice_payment_method}
            </p>
            <p>
              <strong>Transaction ID: </strong>
              {invoiceData.transaction_id || "N/A"}
            </p>
            <p>
              <strong>Order ID: </strong>
              {invoiceData.razorpay_order_id}
            </p>
          </div>

          <div className="col-md-4">
            <h6>
              <strong>Plan Details</strong>
            </h6>
            <p>
              <strong>Plan Name: </strong>
              {invoiceData.title}
            </p>
            <p>
              <strong>Plan Type: </strong>
              {invoiceData.plan_type}
            </p>
          </div>
        </div>

        <hr />

        {/* Invoice Summary */}
        <hr />
        <h5>Invoice Summary</h5>
        <div className="table-responsive">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>Price</td>
                <td className="text-end">
                  {formatCurrency(invoiceData.price)}
                </td>
              </tr>
              <tr>
                <td>Discount</td>
                <td className="text-end text-success">
                  -{formatCurrency(invoiceData.invoice_discount)}
                </td>
              </tr>
              <tr>
                <td>Tax</td>
                <td className="text-end">
                  {formatCurrency(invoiceData.invoice_tax)}
                </td>
              </tr>
              <tr>
                <th>Total Amount</th>
                <th className="text-end">
                  {formatCurrency(invoiceData.invoice_amount)}
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
