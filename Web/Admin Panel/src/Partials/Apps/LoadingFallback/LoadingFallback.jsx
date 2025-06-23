/* eslint-disable react/prop-types */
import { Loader } from "lucide-react";
import { useState, useEffect, memo } from "react";

const LoadingFallback = memo(
  ({ message = "Loading...", timeout = 10000, onTimeout }) => {
    const [showTimeout, setShowTimeout] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => {
        setShowTimeout(true);
        if (onTimeout) onTimeout();
      }, timeout);
      return () => clearTimeout(timer);
    }, [timeout, onTimeout]);

    return (
      <div className="text-center p-4 rounded">
        <Loader
          className="mb-4 mx-auto"
          color="#5BC43A"
          style={{
            animation: "spin 1s linear infinite",
          }}
          aria-hidden="true"
        />
        <h2 className="h4 fw-semibold text-dark mb-2">{message}</h2>

        {showTimeout && (
          <div className="mt-4 p-3 bg-warning bg-opacity-10 rounded">
            <p className="text-warning-emphasis small mb-0">
              This is taking longer than expected. Please be patient or try
              refreshing the page.
            </p>
          </div>
        )}
      </div>
    );
  }
);

// Add required keyframes for spin animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
document.head.appendChild(styleSheet);

LoadingFallback.displayName = "LoadingFallback";

export default LoadingFallback;
