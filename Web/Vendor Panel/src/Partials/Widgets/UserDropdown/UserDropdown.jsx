import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logoutUser } from "../../../Redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

const UserDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const { user: userData = {} } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const resultAction = await dispatch(logoutUser());

      if (logoutUser.fulfilled.match(resultAction)) {
        toast.success("Logged out successfully!");
        setTimeout(() => {
          navigate("/signin", { replace: true });
        }, 2000);
      } else if (logoutUser.rejected.match(resultAction)) {
        toast.error(resultAction.payload || "Logout failed!");
        console.error("Logout failed:", resultAction.payload);
      }
    } catch (error) {
      toast.error("An unexpected error occurred during logout.");
      console.error("Unexpected error during logout:", error);
    }
  };

  return (
    <div className="dropdown-menu dropdown-menu-end shadow p-2 p-xl-3 rounded-4">
      <div className="bg-body p-2 rounded-3">
        <h4 className="mb-1 title-font text-gradient">
          {userData?.first_name}
        </h4>
        <p className="small text-muted">{userData?.email}</p>
        <p className="mb-0 animation-blink">
          <span className={isOnline ? "text-primary" : "text-danger"}>●</span>
          {isOnline ? " Online" : " Offline"}
        </p>
      </div>
      <ul className="list-unstyled mt-3">
        <li>
          <Link
            className="dropdown-item rounded-pill"
            aria-label="my profile"
            to="/my-profile"
          >
            My Profile
          </Link>
        </li>
        <li>
          <Link
            className="dropdown-item rounded-pill"
            aria-label="change password"
            to="/change-password"
          >
            Change Password
          </Link>
        </li>
        <li className="dropdown-divider"></li>
      </ul>
      <button
        className="btn py-2 btn-primary w-100 mt-3 rounded-pill"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default UserDropdown;
