/* eslint-disable react/prop-types */
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { validateAuthToken, logoutUser } from "./Redux/slices/authSlice";
import LoadingFallback from "./Partials/Apps/LoadingFallback/LoadingFallback";

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Extract auth state from Redux
  const { isAuthenticated, isLoading, token } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (isAuthenticated && token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded.exp * 1000 < Date.now() + 5 * 60 * 1000) {
            console.warn(
              "Client-side: Token is nearing expiration, triggering server validation."
            );
            const resultAction = await dispatch(validateAuthToken());
            if (validateAuthToken.rejected.match(resultAction)) {
              console.error(
                "Token re-validation failed during active session."
              );
              dispatch(logoutUser());
              navigate("/signin", {
                replace: true,
                state: { from: location.pathname },
              });
            }
          }
        } catch (e) {
          console.error(
            "Error decoding token from Redux state during check:",
            e
          );
          dispatch(logoutUser());
          navigate("/signin", {
            replace: true,
            state: { from: location.pathname },
          });
        }
        return;
      }

      const storedToken = localStorage.getItem("jwtToken");
      if (storedToken) {
        console.log(
          "No active Redux auth state, attempting to validate stored token."
        );
        const resultAction = await dispatch(validateAuthToken());
        if (validateAuthToken.rejected.match(resultAction)) {
          console.warn(
            "Stored token validation failed. Redirecting to signin."
          );
          navigate("/signin", {
            replace: true,
            state: { from: location.pathname },
          });
        }
      } else if (!isAuthenticated && !isLoading) {
        console.log(
          "No token found in Redux state or localStorage. Redirecting to signin."
        );
        navigate("/signin", {
          replace: true,
          state: { from: location.pathname },
        });
      }
    };

    checkAuthStatus();
  }, [
    isAuthenticated,
    token,
    isLoading,
    navigate,
    location.pathname,
    dispatch,
  ]);

  if (isLoading || (!isAuthenticated && token)) {
    return <LoadingFallback />;
  }

  return isAuthenticated ? children : null;
};

export default AuthWrapper;
