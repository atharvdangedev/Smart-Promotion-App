import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import PaymentComponent from "./PaymentComponent";
import formatCurrency from "../../Apps/utils/formatCurrency";
import { Toaster } from "react-hot-toast";
import Header from "./Header";
import Footer from "./Footer";
import LoadingFallback from "./../../Apps/LoadingFallback/LoadingFallback";

const Checkout = () => {
  const APP_URL = import.meta.env.VITE_API_URL;

  const location = useLocation();
  const navigate = useNavigate();
  const state =
    location.state ||
    JSON.parse(sessionStorage.getItem("checkout_state") || "{}");

  const plan = state?.plan;
  const token = state?.token;
  const user = state?.user;

  const [coupon, setCoupon] = useState("");
  const [couponDetails, setCouponDetails] = useState(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [isValidCoupon, setIsValidCoupon] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentVerifying, setIsPaymentVerifying] = useState(false);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const { handleSubmit } = useForm();

  const validateCoupon = async () => {
    setIsValidatingCoupon(true);
    try {
      const response = await axios.post(
        `${APP_URL}/validate-coupon`,
        { coupon_code: coupon, plan_id: plan.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsValidCoupon(true);
      setCouponMessage(response.data.message);
      setCouponDetails(response.data.data);
    } catch (error) {
      setIsValidCoupon(false);
      setCouponMessage(error.response.data.message);
      setCouponDetails(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const verifyPayment = async (formdata) => {
    try {
      setIsPaymentVerifying(true);
      const response = await axios.post(
        `${APP_URL}/vendor/verify-payment`,
        formdata,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        navigate(`/payment-status?status=success`, { replace: true });
      }
    } catch (error) {
      toast.error(error.response.data.message);
      navigate(`/payment-status?status=failed`, { replace: true });
    } finally {
      setIsPaymentVerifying(false);
    }
  };

  const createOrder = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${APP_URL}/vendor/create-order`,
        { plan_id: plan.id, coupon_code: isValidCoupon ? coupon : null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const order = response.data;

      if (plan.id === "1") {
        toast.success("Payment successful! Redirecting...");
        setTimeout(
          () => navigate(`/payment-status?status=success`, { replace: true }),
          2500
        );
        return;
      }

      const payment = new PaymentComponent({
        amount: order.amount,
        orderId: order.razorpay_order_id,
        customerInfo: {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          phone: user.contact_no,
        },
        metadata: {
          companyName: "Smartscripts Private Limited",
          description: `Purchase of subscription for ${plan.validity} days`,
        },
        onSuccess: ({ paymentId, orderId, signature }) =>
          verifyPayment({
            razorpay_order_id: orderId,
            razorpay_payment_id: paymentId,
            razorpay_signature: signature,
          }),
        onError: () => {
          toast.error("Payment failed. Redirecting...");
          setTimeout(() => navigate("/"), 2500);
        },
      });
      payment.initializePayment();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!plan) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
        <p className="h4 text-muted mb-4">No plan selected.</p>
        <button
          onClick={() => navigate("/")}
          className="btn btn-lg"
          style={{
            backgroundColor: "#216EA5",
            color: "white",
          }}
        >
          Go to Plans
        </button>
      </div>
    );
  }

  return (
    <>
      <Header />

      <Toaster />

      {isPaymentVerifying ? (
        <div
          className="container py-5"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
            height: "100vh",
          }}
        >
          <LoadingFallback message="Verifying Payment..." />
        </div>
      ) : (
        <div className="container py-5">
          <div className="row g-5">
            <div className="col-lg-7">
              <div className="card shadow-sm">
                <div className="card-body p-5">
                  <h2 className="card-title mb-4">Billing Information</h2>
                  <form onSubmit={handleSubmit(createOrder)}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Full Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={`${user.first_name} ${user.last_name}`}
                        disabled
                        className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={user.email}
                        disabled
                        className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={user.contact_no}
                        disabled
                        className="form-control"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      style={{
                        backgroundColor: "#216EA5",
                        color: "white",
                      }}
                      className="btn w-100 py-3 mt-4"
                    >
                      {isLoading ? (
                        <div
                          className="spinner-border spinner-border-sm"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        "Proceed to Payment"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="card shadow-sm">
                <div className="card-body p-5">
                  <h2 className="card-title mb-4">Order Summary</h2>
                  <div className="bg-light p-4 rounded mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h3 className="h5 mb-0">{plan.title}</h3>
                      <p className="h5 mb-0">{formatCurrency(plan.price)}</p>
                    </div>
                    <p className="text-muted small">
                      Subscription for {plan.validity} days
                    </p>

                    {couponDetails && (
                      <>
                        <div className="d-flex justify-content-between small">
                          <span>Discount</span>
                          <span>
                            - {formatCurrency(couponDetails.discount)}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between small">
                          <span>Tax</span>
                          <span>
                            {formatCurrency(couponDetails.tax_amount)}
                          </span>
                        </div>
                      </>
                    )}

                    <hr />

                    <div className="d-flex justify-content-between align-items-center fw-bold">
                      <span>Total</span>
                      <span>
                        {formatCurrency(
                          couponDetails?.final_price || plan.price
                        )}
                      </span>
                    </div>
                  </div>

                  {plan.id !== "1" && (
                    <div>
                      <label htmlFor="coupon" className="form-label">
                        Coupon Code
                      </label>
                      <div className="input-group">
                        <input
                          id="coupon"
                          type="text"
                          value={coupon}
                          onChange={(e) => setCoupon(e.target.value)}
                          className="form-control"
                        />
                        <button
                          onClick={validateCoupon}
                          disabled={isValidatingCoupon}
                          type="button"
                          style={{
                            backgroundColor: "#216EA5",
                            color: "white",
                          }}
                          className="btn"
                        >
                          {isValidatingCoupon ? (
                            <div
                              className="spinner-border spinner-border-sm"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                          ) : (
                            "Apply"
                          )}
                        </button>
                      </div>
                      {couponMessage && (
                        <p
                          className={`mt-2 small ${
                            isValidCoupon ? "text-success" : "text-danger"
                          }`}
                        >
                          {couponMessage}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Checkout;
