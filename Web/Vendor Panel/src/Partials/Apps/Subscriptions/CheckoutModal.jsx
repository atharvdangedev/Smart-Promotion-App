/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { validateCouponApi } from "../utils/paymentApis";
import { handleApiError } from "../utils/handleApiError";

const CheckoutModal = ({
  show,
  onClose,
  plan,
  onProceedToPayment,
  processingPayment,
}) => {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(plan?.price || 0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const { token } = useSelector((state) => state.auth);
  const APP_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (plan) {
      setCoupon("");
      setDiscount(0);
      setFinalPrice(plan.price);
      setCouponApplied(false);
      setCouponError("");
    }
  }, [plan]);

  if (!show || !plan) return null;

  const handleApplyCoupon = async () => {
    if (!coupon) {
      setCouponError("Please enter a coupon code.");
      return;
    }
    setIsApplying(true);
    setCouponError("");
    try {
      const response = await validateCouponApi(APP_URL, token, coupon, plan.id);
      if (response.status === 200) {
        setDiscount(response.data.discount);
        setFinalPrice(response.data.final_price);
        setCouponApplied(true);
      } else {
        setCouponError(response.message || "Invalid coupon code.");
      }
    } catch (error) {
      handleApiError(error, "applying", "coupon");
      setCouponError(error.message || "Invalid coupon code.");
    } finally {
      setIsApplying(false);
    }
  };

  const formatCurrency = (amount) =>
    Number(amount).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Order Summary</h5>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>
            <div className="modal-body">
              <div className="card bg-light border-0 mb-4 p-3">
                <h6 className="mb-1">{plan.title}</h6>
                <p className="text-muted mb-0">{plan.validity} days access</p>
              </div>

              <ul className="list-group list-group-flush mb-3">
                <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                  Plan Price
                  <span>{formatCurrency(plan.price)}</span>
                </li>
                {couponApplied && (
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0 text-success">
                    Discount
                    <span>- {formatCurrency(discount)}</span>
                  </li>
                )}
                <li className="list-group-item d-flex justify-content-between align-items-center px-0 fw-bold h5">
                  Total
                  <span>{formatCurrency(finalPrice)}</span>
                </li>
              </ul>

              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="COUPON CODE"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  disabled={couponApplied}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponApplied || isApplying}
                >
                  {isApplying ? "Applying..." : "Apply"}
                </button>
              </div>

              {couponError && (
                <div className="alert alert-danger py-2">{couponError}</div>
              )}
              {couponApplied && (
                <div className="alert alert-success py-2">
                  Coupon applied successfully!
                </div>
              )}
            </div>
            <div className="modal-footer border-0">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary w-50"
                onClick={() => onProceedToPayment(finalPrice, coupon)}
                disabled={processingPayment}
              >
                {processingPayment ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span className="ms-2">Processing...</span>
                  </>
                ) : (
                  `Pay ${formatCurrency(finalPrice)}`
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default CheckoutModal;
