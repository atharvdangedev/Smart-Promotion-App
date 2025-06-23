import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import LoadingFallback from "../../../LoadingFallback/LoadingFallback";
import { generatePDF } from "../../../utils/generatePDF.js";
import { handleApiError } from "../../../utils/handleApiError.js";
import { formatDate } from "../../../utils/formatDate.js";

const InvoiceDetails = () => {
  const { state } = useLocation();
  const token = localStorage.getItem("jwtToken");
  const APP_URL = import.meta.env.VITE_API_URL;

  const [invoiceId, setInvoiceId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState(null);

  // Fetch invoice details from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${APP_URL}/invoice-details/${invoiceId}`,
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

    if (state && state.invoiceId) {
      setInvoiceId(state.invoiceId);
    }

    if (invoiceId) {
      fetchData();
    }
  }, [APP_URL, invoiceId, state, token]);

  if (isLoading) return <LoadingFallback />;

  return (
    <div className="px-4 py-3 page-body">
      {/* Header with Download and Back Buttons */}
      <div className="d-flex justify-content-between align-items-center mb-4 mt-5">
        <h4>Invoice Details</h4>
        <div>
          <button
            className="btn btn-primary me-2"
            onClick={() => generatePDF("card")}
          >
            Download Invoice
          </button>
          <Link to={`/admin/app/orders`} className="btn btn-info text-white">
            Back
          </Link>
        </div>
      </div>
      <div className="card p-4" id="card">
        <div className="mb-4">
          <h5 className="mb-1">Invoice ID: {invoiceData.invoice_id}</h5>
          <p className="mb-0">
            Order Date: {formatDate(invoiceData.order_date)}
          </p>
        </div>
        <hr />
        <div className="row mb-4">
          <div className="col-md-6">
            <h6>
              <strong>Order Details</strong>
            </h6>
            <p>
              <strong>Order ID: </strong> {invoiceData.razorpay_order_id}
            </p>
            <p>
              <strong>
                Vendor: {invoiceData.firstname} {invoiceData.lastname}
              </strong>
            </p>
            {invoiceData.gst_number && (
              <p>
                <strong>GST Number: </strong> {invoiceData.gst_number}
              </p>
            )}
          </div>
          <div className="col-md-6">
            <h6>
              <strong>Customer Details</strong>
            </h6>
            {invoiceData.company_name && (
              <p>
                <strong>Company Name: </strong> {invoiceData.company_name}
              </p>
            )}
            <p
              style={{
                marginBottom: 0,
              }}
            >
              <strong>Name: </strong> {invoiceData.name}
            </p>
            <p
              style={{
                marginBottom: 0,
              }}
            >
              <strong>Email: </strong> {invoiceData.email}
            </p>
            <p
              style={{
                marginBottom: 0,
              }}
            >
              <strong>Mobile: </strong> {invoiceData.mobile}
            </p>
            <p
              style={{
                marginBottom: 0,
              }}
            >
              <strong>Address:</strong> {invoiceData.address},{" "}
              {invoiceData.city}, {invoiceData.state}, {invoiceData.zip_code}
            </p>
          </div>
        </div>
        <hr />
        <h5>Ordered Items</h5>
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Product Name</th>
                <th>Category</th>
                <th className="text-end">Price</th>
                <th className="text-end">Quantity</th>
                <th className="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items &&
                invoiceData.items.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.product_name}</td>
                    <td>{item.category_name || "-"}</td>
                    <td className="text-end">
                      {Number(item.price).toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </td>
                    <td className="text-end">{item.quantity}</td>
                    <td className="text-end">
                      {Number(item.total_price).toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5" className="text-end">
                  <strong>Subtotal:</strong>
                </td>
                <td className="text-end">
                  {Number(invoiceData.price).toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </td>
              </tr>
              <tr>
                <td colSpan="5" className="text-end">
                  <strong>Shipping:</strong>
                </td>
                <td className="text-end">₹80</td>
              </tr>
              <tr>
                <td colSpan="5" className="text-end">
                  <strong>Tax:</strong>
                </td>
                <td className="text-end">
                  {Number(invoiceData.tax).toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </td>
              </tr>
              <tr>
                <td colSpan="5" className="text-end">
                  <strong>Grand Total:</strong>
                </td>
                <td className="text-end">
                  <strong>
                    {Number(invoiceData.total_amount).toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
