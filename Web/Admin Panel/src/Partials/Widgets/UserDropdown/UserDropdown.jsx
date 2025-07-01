import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { handleApiError } from "../../Apps/utils/handleApiError";

const UserDropdown = () => {
  const token = localStorage.getItem("jwtToken");
  const APP_URL = import.meta.env.VITE_API_URL;
  const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

  const [userData, setUserData] = useState({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const decoded = jwtDecode(token);
        const { id } = decoded.data;
        const res = await axios.get(`${APP_URL}/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.data.status === 200) {
          setUserData(res.data.user);
        }
      } catch (error) {
        handleApiError(error, "fetching", "user details");
      }
    };

    if (token) {
      fetchUser();
    }
  }, [APP_URL, token]);

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
      if (!token) {
        throw new Error("Token not found");
      }

      const response = await axios.post(`${APP_URL}/admin-logout`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-App-Secret": `${SECRET_KEY}`,
        },
      });
      if (response.status === 200) {
        localStorage.removeItem("jwtToken");
        toast.success(response.data.message);
        setTimeout(() => {
          window.location.href = "/signin";
        }, 1000);
      }
    } catch (error) {
      handleApiError(error, "logging out", "user");
    }
  };

  return (
    <div className="dropdown-menu dropdown-menu-end shadow p-2 p-xl-3 rounded-4">
      <div className="bg-body p-2 rounded-3">
        <h4 className="mb-1 title-font text-gradient">{userData.first_name}</h4>
        <p className="small text-muted">{userData.email}</p>
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
            to="/admin/user/my-profile"
          >
            My Profile
          </Link>
        </li>
        <li>
          <Link
            className="dropdown-item rounded-pill"
            aria-label="change password"
            to="/admin/user/change-password"
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
