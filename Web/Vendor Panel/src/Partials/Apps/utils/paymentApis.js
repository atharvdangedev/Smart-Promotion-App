export const validateCouponApi = async (BASE_URL, token, coupon, planId) => {
  const response = await fetch(`${BASE_URL}/validate-coupon`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ coupon_code: coupon, plan_id: planId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to validate coupon");
  }

  return response.json();
};

export const createOrderApi = async (BASE_URL, token, planId, coupon) => {
  const payload = { plan_id: planId, coupon_code: coupon };
  const response = await fetch(`${BASE_URL}/vendor/create-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Failed to create order");
  return response.json();
};

export const verifyPaymentApi = async (BASE_URL, token, formdata) => {
  const response = await fetch(`${BASE_URL}/vendor/verify-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formdata),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Payment verification failed");
  }

  return response.json();
};
