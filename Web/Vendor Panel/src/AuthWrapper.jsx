/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingFallback from "./Partials/Apps/LoadingFallback/LoadingFallback";

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/signin", {
        replace: true,
        state: { from: location.pathname },
      });
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) <LoadingFallback />;

  return isAuthenticated ? children : null;
};

export default AuthWrapper;
