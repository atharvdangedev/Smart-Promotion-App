/* eslint-disable react/no-unescaped-entities */
// Library Imports
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { evaluatePasswordStrength } from "../../../Apps/utils/evaluatePasswordStrength";
import { handleApiError } from "../../../Apps/utils/handleApiError";

// Validation Schema
const schema = yup.object().shape({
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  cnfPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const TwoStep = () => {
  // Navigation
  const navigate = useNavigate();
  const location = useLocation();

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;
  const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

  // State Variables
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [resetToken, setResetToken] = useState("");

  // Extract the reset token from the URL query parameters and set the reset token on component mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("reset_token");
    if (token) {
      setResetToken(token);
    } else {
      // Handle case where token is not present
      toast.error(
        "Reset token is missing. Please use the link from your email."
      );
    }
  }, [location, navigate]);

  // useForm Initialization
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // Watch for password changes and update password errors
  const passwordValue = watch("password");

  // Handle toggle password
  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  // Set password errors
  useEffect(() => {
    const { errors } = evaluatePasswordStrength(passwordValue);
    setPasswordErrors(errors);
  }, [passwordValue]);

  // Handle Submit Function and upon success redirect to signin page
  const onSubmit = async (data) => {
    const { isStrong, errors } = evaluatePasswordStrength(data.password);
    if (!isStrong) {
      setPasswordErrors(errors);
      return;
    }

    const formdata = new FormData();
    formdata.append("token", resetToken);
    formdata.append("password", data.password);

    try {
      const res = await axios.post(
        `${APP_URL}/admin-reset-password`,
        formdata,
        {
          headers: {
            "X-App-Secret": `${SECRET_KEY}`,
          },
        }
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      }
    } catch (error) {
      handleApiError(error, "changing", "password");
    }
  };

  // Reset the form, when this function is called
  const handleCancel = () => reset();

  return (
    <div className="px-xl-5 px-4 auth-body">
      <Toaster />
      <ul className="row g-3 list-unstyled li_animate">
        <li className="col-12">
          <h1 className="h2 title-font">Welcome to Smart Promotion App</h1>
          <p>Your Admin Dashboard</p>
        </li>

        <li className="col-12">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-3">
              <div className="col-md-6">
                <div
                  className={`form-floating ${
                    errors.password ? "is-invalid" : ""
                  }`}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    id="password"
                    {...register("password")}
                    placeholder="Password"
                    tabIndex="1"
                  />
                  <label htmlFor="password">Password</label>
                  <div
                    className="position-absolute top-50 end-0 translate-middle-y pe-3"
                    style={{ cursor: "pointer" }}
                    onClick={toggleShowPassword}
                  >
                    <i
                      className={`bi ${
                        showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"
                      }`}
                    ></i>
                  </div>
                </div>
                {errors.password && (
                  <div className="invalid-feedback">
                    {errors.password.message}
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

              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${
                      errors.cnfPassword ? "is-invalid" : ""
                    }`}
                    id="cnfPassword"
                    {...register("cnfPassword")}
                    placeholder="Confirm Password"
                    tabIndex="2"
                  />
                  <div
                    className="position-absolute top-50 end-0 translate-middle-y pe-3"
                    style={{ cursor: "pointer" }}
                    onClick={toggleShowPassword}
                  >
                    <i
                      className={`bi ${
                        showPassword ? "bi-eye-fill" : "bi-eye-slash-fill"
                      }`}
                    ></i>
                  </div>
                  <label htmlFor="cnfPassword">Confirm Password</label>
                  {errors.cnfPassword && (
                    <div className="invalid-feedback">
                      {errors.cnfPassword.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-12">
                <button
                  tabIndex="3"
                  className="me-1 btn btn-primary"
                  type="submit"
                >
                  Reset Password
                </button>
                <button
                  tabIndex="4"
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <br />
                <br />
                <Link className="m-" to="/forgot-password">
                  Haven't received it? Resend a new code
                </Link>
              </div>
            </div>
          </form>
        </li>
      </ul>
    </div>
  );
};

export default TwoStep;
