import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { handleApiError } from "../../../Apps/utils/handleApiError";

const UserActivation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const APP_URL = import.meta.env.VITE_API_URL;
  const [activateToken, setActivateToken] = useState("");
  const [message, setMessage] = useState("");
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [countdown, setCountdown] = useState(5);

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

  // redirection useEffect
  useEffect(() => {
    if (shouldRedirect && countdown === 0) {
      navigate("/signin");
    }
  }, [countdown, shouldRedirect, navigate]);

  // countdown useEffect
  useEffect(() => {
    if (shouldRedirect && message && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [countdown, message, shouldRedirect]);

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
        const role = response.data?.user?.role;
        setMessage("User activation successful!");

        if (role === "1" || role === "2") {
          setShouldRedirect(true);
          setCountdown(5);
        }
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
        {message && shouldRedirect && (
          <div className="mt-4">
            <p className="text-lg">Redirecting you to sign in page in</p>
            <p className="text-4xl font-bold text-primary">{countdown}</p>
            <p>seconds</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActivation;
