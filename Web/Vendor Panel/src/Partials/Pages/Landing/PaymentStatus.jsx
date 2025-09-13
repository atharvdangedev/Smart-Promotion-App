import { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const navgiate = useNavigate();

  useEffect(() => {
    if (status === "success") {
      const redirectTimer = setTimeout(() => {
        navgiate("/signin", { replace: true });
      }, 3000);

      return () => {
        clearTimeout(redirectTimer);
      };
    }
  }, [navgiate, status]);

  const renderContent = () => {
    switch (status) {
      case "success":
        return (
          <div className="card text-center w-100" style={{ maxWidth: "400px" }}>
            <div className="card-body">
              <div className="mx-auto bg-success-soft rounded-circle p-3 d-inline-block">
                <i
                  className="bi bi-check-circle-fill text-success"
                  style={{ fontSize: "4rem" }}
                ></i>
              </div>
              <h2 className="card-title mt-4">Payment Successful!</h2>
              <p className="card-text">
                Your subscription is active. Redirecting you to your
                dashboard...
              </p>
            </div>
          </div>
        );
      case "failed":
        return (
          <div className="card text-center w-100" style={{ maxWidth: "400px" }}>
            <div className="card-body">
              <div className="mx-auto bg-danger-soft rounded-circle p-3 d-inline-block">
                <i
                  className="bi bi-x-circle-fill text-danger"
                  style={{ fontSize: "4rem" }}
                ></i>
              </div>
              <h2 className="card-title mt-4">Payment Failed</h2>
              <p className="card-text">
                There was an issue processing your payment. No charge was made.
              </p>
            </div>
            <div className="card-footer">
              <Link to="/" className="btn btn-primary">
                Try Again
              </Link>
            </div>
          </div>
        );
      default:
        return (
          <div className="card text-center w-100" style={{ maxWidth: "400px" }}>
            <div className="card-body">
              <div className="mx-auto bg-warning-soft rounded-circle p-3 d-inline-block">
                <i
                  className="bi bi-exclamation-triangle-fill text-warning"
                  style={{ fontSize: "4rem" }}
                ></i>
              </div>
              <h2 className="card-title mt-4">Invalid Status</h2>
              <p className="card-text">
                Something went wrong. Please return to the homepage.
              </p>
            </div>
            <div className="card-footer">
              <Link to="/" className="btn btn-primary">
                Go Home
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      <Header />
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light px-4 my-2">
        {renderContent()}
      </div>
      <Footer />
    </>
  );
};

export default PaymentStatus;
