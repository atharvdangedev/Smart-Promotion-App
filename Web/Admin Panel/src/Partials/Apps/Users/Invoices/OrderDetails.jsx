import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingFallback from "../../LoadingFallback/LoadingFallback";
import ImagePopup from "./ImagePopup";
import { handleApiError } from "../../utils/handleApiError";
import { formatDate } from "../../utils/formatDate";
import { useSelector } from "react-redux";

/* eslint-disable react/prop-types */
const OrderDetails = () => {
  const { orderId } = useParams();

  // Access token
  const { token, user } = useSelector((state) => state.auth);

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderData, setOrderData] = useState({ items: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [requiresShipping, setRequiresShipping] = useState(false);
  const [popupDetails, setPopupDetails] = useState({
    template: "",
    cardId: "",
  });

  const checkIfRequiresShipping = (items = []) =>
    items.some((item) => {
      const category = item.category_name.toLowerCase();
      return (
        category.includes("digital business") ||
        category.includes("digital review") ||
        category.includes("digital-social-media")
      );
    });

  //fetch order details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${APP_URL}/${user.rolename}/order-details/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          setOrderData(response.data.order);
          const requiresShipping = checkIfRequiresShipping(
            response.data.order.items
          );
          setRequiresShipping(requiresShipping);
        } else if (response.status === 204) {
          setOrderData([]);
        }
      } catch (error) {
        setOrderData([]);
        handleApiError(error, "fetching", "order details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [APP_URL, orderId, token]);

  const handleClosePopup = () => {
    setIsModalOpen(false);
  };

  const handleOpenPopup = (template, cardId) => {
    setPopupDetails({ template, cardId });
    setIsModalOpen(true);
  };

  return (
    <div className="px-4 py-3 page-body">
      {isLoading ? (
        <LoadingFallback />
      ) : (
        <>
          {/* Order Status Banner */}
          <div
            className={`alert ${
              orderData.order_status === "Pending"
                ? "alert-warning"
                : "alert-success"
            } mb-4 mt-5 d-flex justify-content-between`}
          >
            <h4 className="alert-heading mb-0">
              Order Status: {orderData.order_status}
            </h4>
            <button
              onClick={() => window.history.back()}
              className="btn btn-info text-white text-decoration-none"
            >
              Back
            </button>
          </div>

          <div className="row">
            {/* Order Summary Card */}
            <div className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="card-title mb-0">Order Summary</h5>
                </div>
                <div className="card-body">
                  <p className="mb-2">
                    <strong>Order ID:</strong> #{orderData.razorpay_order_id}
                  </p>
                  <p className="mb-2">
                    <strong>Order Date:</strong>{" "}
                    {formatDate(orderData.order_date)}
                  </p>
                  <hr />
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>
                      {Number(orderData.price).toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </span>
                  </div>
                  {requiresShipping && (
                    <div className="d-flex justify-content-between mb-2">
                      <span>Shipping:</span>
                      <span>₹80</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tax:</span>
                    <span>
                      {Number(orderData.tax).toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </span>
                  </div>

                  {orderData.note && (
                    <div className="d-flex justify-content-between mb-2">
                      <span>Note:</span>
                      <span>{orderData.note}</span>
                    </div>
                  )}
                  {orderData.note && (
                    <div className="d-flex justify-content-between mb-2">
                      <span>Accepted Amount:</span>
                      <span>
                        {Number(orderData.total_amount).toLocaleString(
                          "en-IN",
                          {
                            style: "currency",
                            currency: "INR",
                          }
                        )}
                      </span>
                    </div>
                  )}
                  <hr />
                  <div className="d-flex justify-content-between">
                    <strong>Total:</strong>
                    <strong>
                      {Number(orderData.total_amount).toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR",
                      })}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Details Card */}
            <div className="col-md-8 mb-4">
              <div className="card h-100">
                <div className="card-header">
                  <h5 className="card-title mb-0">Customer Details</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-6">
                      <p className="mb-2">
                        <strong>Name:</strong> {orderData.name}
                      </p>
                      <p className="mb-2">
                        <strong>Email:</strong> {orderData.email}
                      </p>
                      <p className="mb-2">
                        <strong>Phone:</strong> {orderData.mobile}
                      </p>
                    </div>
                    <div className="col-sm-6">
                      <p className="mb-2">
                        <strong>Shipping Address:</strong>
                      </p>
                      <p className="mb-0">
                        {orderData.address}
                        <br />
                        {orderData.city}, {orderData.state}
                        <br />
                        {orderData.zip_code}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items Card */}
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0 w-100">Order Items</h5>
              <p className="my-1 text-muted">
                Invitation cards will be sharable from user panel, no view card
                button will be disabled for them here!
              </p>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th className="text-center">Category</th>
                      <th className="text-center">Quantity</th>
                      <th className="text-center">Price</th>
                      <th className="text-center">Total</th>
                      <th className="text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderData.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.product_name}</td>
                        <td className="text-center">{item.category_name}</td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-center">
                          {Number(item.price).toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </td>
                        <td className="text-center">
                          {Number(item.total_price).toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </td>
                        <td className="text-center">
                          <button
                            className={`btn btn-sm btn-outline-success`}
                            style={{
                              cursor:
                                item.category_name === "Digital Invitations"
                                  ? "not-allowed"
                                  : "pointer",
                            }}
                            onClick={() =>
                              handleOpenPopup(
                                item.category_name,
                                item.pre_order_id
                              )
                            }
                          >
                            View Card
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {isModalOpen && (
        <>
          <div className="modal-backdrop show"></div>
          <ImagePopup
            onClose={handleClosePopup}
            template={popupDetails.template}
            cardId={popupDetails.cardId}
            orderStatus={orderData.order_status}
          />
        </>
      )}
    </div>
  );
};

export default OrderDetails;
