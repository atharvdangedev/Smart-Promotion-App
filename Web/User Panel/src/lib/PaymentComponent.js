class PaymentComponent {
  constructor({
    amount,
    orderId,
    onSuccess,
    onError,
    customerInfo = {},
    metadata = {},
  }) {
    this.amount = amount;
    this.orderId = orderId;
    this.onSuccess = onSuccess;
    this.onError = onError;
    this.customerInfo = customerInfo;
    this.metadata = metadata;
  }

  async loadRazorpayScript() {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
      document.body.appendChild(script);
    });
  }

  async initializePayment() {
    try {
      if (!window.Razorpay) {
        await this.loadRazorpayScript();
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: this.amount * 100,
        currency: "INR",
        name: this.metadata.companyName,
        description: this.metadata.description,
        order_id: this.orderId,
        handler: (response) => {
          this.onSuccess?.({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          });
        },
        prefill: {
          name: this.customerInfo.name,
          email: this.customerInfo.email,
          contact: this.customerInfo.phone,
        },
        theme: {
          color: this.metadata.themeColor || "#0d6efd",
        },
        modal: {
          ondismiss: () => {
            this.onError?.(new Error("Payment cancelled by user"));
          },
          escape: false,
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", (response) => {
        this.onError?.(response.error);
      });

      paymentObject.open();
    } catch (error) {
      this.onError?.(error);
    }
  }
}

export default PaymentComponent;
