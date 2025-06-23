import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { handleApiError } from "../../../Apps/utils/handleApiError";
import { setPageTitle } from "../../../Apps/utils/docTitle";

const UserActivation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const APP_URL = import.meta.env.VITE_API_URL;
  const [activateToken, setActivateToken] = useState("");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(5);

  setPageTitle("User Activation | Vendor Panel");

  // Extract token from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("activate_token");
    if (token) {
      setActivateToken(token);
    } else {
      toast.error(
        "Activation token is missing. Please use the link from your email."
      );
    }
  }, [location]);

  // Handle activation when token is set
  useEffect(() => {
    if (activateToken) {
      activateUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activateToken]);

  useEffect(() => {
    if (countdown === 0) {
      navigate("/signin");
    }
  }, [countdown, navigate]);

  useEffect(() => {
    if (message && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [countdown, message]);

  // Function to handle user activation
  const activateUser = async () => {
    const params = new URLSearchParams();
    params.append("activate_token", activateToken);
    try {
      const response = await axios.post(`${APP_URL}/ActivateUser`, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      if (response.status === 200) {
        setMessage(
          "User activation successful! Redirecting to sign in page..."
        );
        setCountdown(5);
      }
    } catch (error) {
      handleApiError(error, "activating", "user");
    }
  };

  return (
    <div className="px-xl-5 px-4 auth-body">
      <Toaster />
      <div className="text-center">
        <h2 className="mb-4 text-primary">{message || "Activating user..."}</h2>
        {message && (
          <div className="mt-4">
            {countdown > 0 && (
              <>
                <p className="text-lg">Redirecting you to sign in page in</p>
                <p className="text-4xl font-bold text-primary">{countdown}</p>
                <p>seconds</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActivation;
