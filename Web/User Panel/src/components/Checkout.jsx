import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import PaymentComponent from "../lib/PaymentComponent";
import Header from "./Header";
import Footer from "./Footer";
import formatCurrency from "@/utils/formatCurrency";
import {
  createOrderApi,
  validateCouponApi,
  verifyPaymentApi,
} from "@/lib/paymentApis";

const Checkout = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
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

  const { mutate: validateCoupon, isLoading: isValidatingCoupon } = useMutation(
    {
      mutationFn: () => validateCouponApi(BASE_URL, token, coupon, plan.id),
      onSuccess: (data) => {
        setIsValidCoupon(true);
        setCouponMessage(data.message);
        setCouponDetails(data.data);
      },
      onError: (error) => {
        setIsValidCoupon(false);
        setCouponMessage(error.message);
        setCouponDetails(null);
      },
    }
  );

  const { mutate: verifyPaymentMutation } = useMutation({
    mutationFn: (formdata) => verifyPaymentApi(BASE_URL, token, formdata),
    onSuccess: () => {
      toast.success("Payment verified! Redirecting...");
      navigate(`/payment-status?status=success`, { replace: true });
    },
    onError: (error) => {
      toast.error(error.message);
      navigate(`/payment-status?status=failed`, { replace: true });
    },
  });

  const { mutate: createOrder, isLoading } = useMutation({
    mutationFn: async () => {
      const order = await createOrderApi(
        BASE_URL,
        token,
        plan.id,
        isValidCoupon ? coupon : null
      );
      return { order };
    },
    onSuccess: ({ order }) => {
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
          verifyPaymentMutation({
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
    },
  });

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <p className="text-2xl text-gray-600 mb-4">No plan selected.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-[#1C6EA5] hover:bg-[#FF5604] text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-lg"
        >
          Go to Plans
        </button>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Billing Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Billing Information
            </h2>
            <form className="space-y-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={`${user.first_name} ${user.last_name}`}
                  disabled
                  className={`mt-1 block w-full px-4 py-3 border rounded-lg cursor-not-allowed focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className={`mt-1 block w-full px-4 py-3 border rounded-lg cursor-not-allowed focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={user.contact_no}
                  disabled
                  className={`mt-1 block w-full px-4 py-3 border rounded-lg cursor-not-allowed focus:ring-blue-500 focus:border-blue-500`}
                />
              </div>
              {/* Submit */}
              <div>
                <button
                  type="button"
                  onClick={() => createOrder()}
                  title="Proceed to Payment"
                  disabled={isLoading}
                  className="w-full flex justify-center py-4 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-[#1C6EA5] to-orange-500 hover:from-[#FF5604] hover:to-orange-600 focus:ring-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    "Proceed to Payment"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Order Summary
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {plan.title}
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(plan.price)}
                </p>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Subscription for {plan.validity} days
              </p>

              {couponDetails && (
                <>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Discount</span>
                    <span>- {formatCurrency(couponDetails.discount)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax</span>
                    <span>{formatCurrency(couponDetails.tax_amount)}</span>
                  </div>
                </>
              )}

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span>Total</span>
                  <span>
                    {formatCurrency(couponDetails?.final_price || plan.price)}
                  </span>
                </div>
              </div>
            </div>

            {/* Coupon Input */}
            {!plan.id === "1" && (
              <div>
                <label
                  htmlFor="coupon"
                  className="block text-sm font-medium text-gray-700"
                >
                  Coupon Code
                </label>
                <div className="mt-1 flex rounded-lg shadow-sm">
                  <input
                    id="coupon"
                    type="text"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="flex-1 block w-full px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() => validateCoupon()}
                    disabled={isValidatingCoupon}
                    type="button"
                    className="px-4 py-3 rounded-r-lg text-white bg-gray-800 hover:bg-gray-900 disabled:opacity-50"
                  >
                    {isValidatingCoupon ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Apply"
                    )}
                  </button>
                </div>
                {couponMessage && (
                  <p
                    className={`mt-2 text-sm ${
                      isValidCoupon ? "text-green-600" : "text-red-600"
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
      <Footer />
    </>
  );
};

export default Checkout;
