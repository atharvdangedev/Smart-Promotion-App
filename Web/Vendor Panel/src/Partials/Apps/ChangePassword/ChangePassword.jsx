import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { evaluatePasswordStrength } from "../utils/evaluatePasswordStrength";
import { handleApiError } from "../utils/handleApiError";
import { setPageTitle } from "../utils/docTitle";
import { logoutUser } from "../../../Redux/slices/authSlice";
import { useDispatch } from "react-redux";

const ChangePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Access token
  const token = localStorage.getItem("jwtToken");

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;
  const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

  setPageTitle("Change Password");

  // State initialization
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [passwordErrors, setPasswordErrors] = useState([]);

  // Schema definition
  const schema = yup.object().shape({
    old_password: yup.string().required("Current password is required"),
    newpassword: yup
      .string()
      .required("New Password is required")
      .test(
        "not-same-as-old",
        "New password must be different from the current password",
        function (value) {
          const { old_password } = this.parent;
          return value !== old_password;
        }
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newpassword"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  // Use form initialization
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // Watch for password changes and update password errors
  const passwordValue = watch("newpassword");

  // Handle toggle password
  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Set password errors
  useEffect(() => {
    const { errors } = evaluatePasswordStrength(passwordValue);
    setPasswordErrors(errors);
  }, [passwordValue]);

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

  // Handle submit
  const onSubmit = async (data) => {
    const { isStrong, errors } = evaluatePasswordStrength(data.newpassword);

    if (!isStrong) {
      setPasswordErrors(errors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("old_password", data.old_password);
      formData.append("new_password", data.newpassword);
      formData.append("confirm_password", data.confirmPassword);

      const res = await axios.post(`${APP_URL}/change-password`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-App-Secret": `${SECRET_KEY}`,
        },
      });
      if (res.status === 200) {
        toast.success(res.data.message);
        await handleLogout();
      }
    } catch (error) {
      handleApiError(error, "changing", "password");
    }
  };

  return (
    <div className="px-4 py-3 page-body">
      <Toaster />
      <div className="card">
        <div className="card-header py-3 bg-transparent border-bottom-0">
          <h4 className="title-font mt-2 mb-0">
            <strong>Change Password</strong>
          </h4>
          <span
            className="btn btn-info text-white"
            onClick={() => navigate(-1)}
          >
            Back
          </span>
        </div>

        <div className="card-body card-main-one">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type={showPassword.old ? "text" : "password"}
                    className={`form-control ${
                      errors.old_password ? "is-invalid" : ""
                    }`}
                    id="old_password"
                    {...register("old_password")}
                    placeholder="Current Password"
                    tabIndex="1"
                  />
                  <div
                    className="position-absolute top-50 end-0 translate-middle-y pe-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => togglePasswordVisibility("old")}
                  >
                    <i
                      className={`bi ${
                        showPassword.old ? "bi-eye-fill" : "bi-eye-slash-fill"
                      }`}
                    ></i>
                  </div>
                  <label htmlFor="old_password">Current Password</label>
                  {errors.old_password && (
                    <div className="invalid-feedback">
                      {errors.old_password.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div
                  className={`form-floating ${
                    errors.newpassword ? "is-invalid" : ""
                  }`}
                >
                  <input
                    type={showPassword.new ? "text" : "password"}
                    className={`form-control ${
                      errors.newpassword ? "is-invalid" : ""
                    }`}
                    id="newpassword"
                    {...register("newpassword")}
                    placeholder="New Password"
                    tabIndex="2"
                  />
                  <label htmlFor="newpassword">New Password</label>
                  <div
                    className="position-absolute top-50 end-0 translate-middle-y pe-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => togglePasswordVisibility("new")}
                  >
                    <i
                      className={`bi ${
                        showPassword.new ? "bi-eye-fill" : "bi-eye-slash-fill"
                      }`}
                    ></i>
                  </div>
                </div>
                {errors.newpassword && (
                  <div className="invalid-feedback">
                    {errors.newpassword.message}
                  </div>
                )}
                {passwordValue && (
                  <div className="invalid-feedback d-block">
                    <ul className="list-unstyled mb-0">
                      {passwordErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    className={`form-control ${
                      errors.confirmPassword ? "is-invalid" : ""
                    }`}
                    id="confirmPassword"
                    {...register("confirmPassword")}
                    placeholder="Confirm Password"
                    tabIndex="3"
                  />
                  <div
                    className="position-absolute top-50 end-0 translate-middle-y pe-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => togglePasswordVisibility("confirm")}
                  >
                    <i
                      className={`bi ${
                        showPassword.confirm
                          ? "bi-eye-fill"
                          : "bi-eye-slash-fill"
                      }`}
                    ></i>
                  </div>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">
                      {errors.confirmPassword.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12">
                <button
                  tabIndex="4"
                  className="me-1 btn btn-primary"
                  type="submit"
                >
                  Change Password
                </button>
                <button
                  tabIndex="5"
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
