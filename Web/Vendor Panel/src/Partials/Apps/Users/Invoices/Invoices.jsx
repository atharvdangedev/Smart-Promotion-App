import { useEffect, useState } from "react";
import CalenderTab from "../../../Widgets/CalenderTab/CalenderTab";
import InvoicesTable from "./Components/InvoicesTable";
import axios from "axios";
import { handleApiError } from "../../utils/handleApiError";
import { setPageTitle } from "../../utils/docTitle";

const Invoices = () => {
  // Access token
  const token = localStorage.getItem("jwtToken");

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;

  setPageTitle("Orders | Vendor Panel");

  const [invoiceData, setInvoiceData] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all orders
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${APP_URL}/all-vendor-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.status === 200) {
          setInvoiceData(response.data.orders);
          setFilteredOrders(response.data.orders);
        } else if (response.status === 204) {
          setInvoiceData([]);
          setFilteredOrders([]);
        }
      } catch (error) {
        setInvoiceData([]);
        setFilteredOrders([]);
        handleApiError(error, "fetching", "orders");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [APP_URL, token]);

  // Filter orders based on the selected date
  useEffect(() => {
    if (date) {
      const filtered = invoiceData.filter((order) => order.order_date === date);
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(invoiceData); // If no date selected, show all orders
    }
  }, [date, invoiceData]);

  return (
    <div className="px-4 py-3 page-body">
      <div className="row g-3">
        <div className="col-12">
          <div className="card bg-card">
            <div className="card-header">
              <h5>Recent Orders:</h5>
              <h3
                className="btn btn-primary"
                style={{
                  padding: "15px",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {date ? "Orders on " + date : "Total Orders"}:{" "}
                {filteredOrders.length}
              </h3>
            </div>
            <div className="card-body">
              <div className="row g-2 mb-4">
                {filteredOrders.slice(0, 3).length > 0 ? (
                  filteredOrders.slice(0, 3).map((data) => {
                    return (
                      <div
                        className="col-lg-4 col-md-6 col-sm-12"
                        key={data.id}
                      >
                        <div
                          className="card hr-arrow p-4"
                          style={{
                            "--dynamic-color": "var(--theme-color1)",
                          }}
                        >
                          <h6 className="mb-3">{data.name}</h6>
                          <ul className="small text-muted ps-3 lh-lg mb-0">
                            <li>{data.email}</li>
                            <li>
                              Order Date:{" "}
                              <span className="ms-2">{data.order_date}</span>
                            </li>
                            <li>
                              Amount:{" "}
                              <span className="badge rounded bg-secondary ms-2">
                                {Number(data.total_amount).toLocaleString(
                                  "en-IN",
                                  {
                                    style: "currency",
                                    currency: "INR",
                                  }
                                )}
                              </span>
                            </li>
                          </ul>
                          <span className="go-corner">
                            <div className="go-arrow"></div>
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-12 text-center">
                    <p className="text-muted">No orders on {date}</p>
                  </div>
                )}
              </div>
              <CalenderTab setDate={setDate} />
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title fw-normal mb-0">Orders List</h5>
            </div>
            <div className="card-body">
              <InvoicesTable
                invoiceData={filteredOrders}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoices;
