import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";

const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    console.error("Failed to decode token", error);
    return true;
  }
};

const useTokenValidation = (validationInterval = 5 * 60 * 1000) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [isValidationComplete, setIsValidationComplete] = useState(false);
  const [authError, setAuthError] = useState(false);
  const lastValidationRef = useRef(0);
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    const validateToken = async () => {
      const token = localStorage.getItem("jwtToken");
      const now = Date.now();

      if (!token) {
        setIsValidationComplete(true);
        return;
      }

      if (isTokenExpired(token)) {
        console.warn("Token is expired locally.");
        setAuthError(true);
        setIsValidationComplete(true);
        return;
      }

      if (now - lastValidationRef.current < validationInterval) {
        setIsValidationComplete(true);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/validate-token`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (cancelled) return;

        if (response.status === 200) {
          lastValidationRef.current = now;
        } else {
          console.warn("Token invalid from server validation.");
          setAuthError(true);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Token validation failed:", error);
          setAuthError(true);
        }
      } finally {
        if (!cancelled) {
          setIsValidationComplete(true);
        }
      }
    };

    validateToken();

    return () => {
      cancelled = true;
    };
  }, [location.pathname, API_URL, validationInterval]);

  return { isValidationComplete, authError };
};

export default useTokenValidation;
