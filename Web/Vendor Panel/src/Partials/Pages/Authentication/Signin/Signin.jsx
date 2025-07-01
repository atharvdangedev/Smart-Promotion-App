// Library Imports
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { handleApiError } from "../../../Apps/utils/handleApiError";

// Validation schema
const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email"),
  password: yup.string().required("Password is required"),
  remember: yup.boolean().notRequired(),
});

const Signin = () => {
  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;
  const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

  // Navigation
  const navigate = useNavigate();

  // State Variables
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // useForm Initialization
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // Show/hide password function
  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Handle Submit Function
  const onSubmit = async (data) => {
    setIsLoading(true);

    const formdata = new FormData();

    formdata.append("email", data.email);
    formdata.append("password", data.password);
    formdata.append("remember", data.remember ? 1 : 0);

    try {
      const res = await axios.post(`${APP_URL}/login`, formdata, {
        headers: {
          "X-App-Secret": `${SECRET_KEY}`,
        },
      });

      if (res.status === 200) {
        const { token } = res.data;
        localStorage.setItem("jwtToken", token);
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("dashboard");
        }, 2000);
      }
    } catch (error) {
      handleApiError(error, "logging in", "user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-xl-5 px-4 auth-body">
      <Toaster
        containerStyle={{
          top: 140,
          left: 760,
          bottom: 20,
          right: 20,
        }}
        toastOptions={{
          duration: 1000,
        }}
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <ul className="row g-3 list-unstyled li_animate">
          <li className="col-12">
            <h1 className="h2 title-font">Welcome to Smart Promotion App</h1>
            <p>Your Dashboard</p>
          </li>

          <li className="col-12">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`form-control form-control-lg ${
                errors.email ? "is-invalid" : ""
              }`}
              placeholder="Enter your email"
              {...register("email")}
              aria-label="Email"
              tabIndex="1"
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </li>

          <li className="col-12">
            <div className="form-label">
              <span className="d-flex justify-content-between align-items-center">
                Password
                <Link className="text-primary" to="/forgot-password">
                  Forgot Password?
                </Link>
              </span>
            </div>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`form-control form-control-lg ${
                  errors.password ? "is-invalid" : ""
                }`}
                placeholder="Enter your password"
                {...register("password")}
                aria-label="Password"
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
              {errors.password && (
                <div className="invalid-feedback">
                  {errors.password.message}
                </div>
              )}
            </div>
          </li>

          <li className="col-12">
            <div className="form-check fs-5">
              <input
                className="form-check-input"
                type="checkbox"
                id="Rememberme"
                {...register("remember")}
                tabIndex="3"
              />
              <label className="form-check-label fs-6" htmlFor="Rememberme">
                Remember this Device
              </label>
            </div>
          </li>

          <li className="col-12 my-lg-4">
            <button
              className="btn btn-lg w-100 btn-primary text-uppercase mb-2"
              type="submit"
              tabIndex="3"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </li>
        </ul>
      </form>
    </div>
  );
};

export default Signin;
