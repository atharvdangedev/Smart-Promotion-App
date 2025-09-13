import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { evaluatePasswordStrength } from "../../Apps/utils/evaluatePasswordStrength";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "react-hot-toast";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const RegistrationSchema = yup.object().shape({
  firstname: yup
    .string()
    .min(2, "Minimum 2 characters required.")
    .max(50, "Maximum 50 characters allowed.")
    .matches(/^[A-Za-z]+$/, "First name must contain only alphabets.")
    .required("First name is required"),
  lastname: yup
    .string()
    .min(2, "Minimum 2 characters required.")
    .max(50, "Maximum 50 characters allowed.")
    .matches(/^[A-Za-z]+$/, "Last name must contain only alphabets.")
    .required("Last name is required"),
  email: yup
    .string()
    .required("Email is required")
    .matches(emailRegex, "Invalid email address"),
  contact_no: yup
    .string()
    .min(10, "Contact number must be minimun 10 digits")
    .required("Contact number is required"),
  password: yup.string().required("Password is required"),
  cnfPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const VendorRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // API URLs
  const APP_URL = import.meta.env.VITE_API_URL;
  const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);

  // Use form initialization
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: yupResolver(RegistrationSchema),
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

  // Handle submit
  const onSubmit = async (data) => {
    const { isStrong, errors } = evaluatePasswordStrength(data.password);

    if (!isStrong) {
      setPasswordErrors(errors);
      return;
    }

    try {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("first_name", data.firstname);
      formData.append("last_name", data.lastname);
      formData.append("email", data.email);
      formData.append("contact_no", data.contact_no);
      formData.append("password", data.password);

      const response = await axios.post(
        `${APP_URL}/vendor-register`,
        formData,
        {
          headers: {
            "X-App-Secret": `${SECRET_KEY}`,
          },
        }
      );
      if (response.status === 201) {
        toast.success(response.data.message);
        const plan = location.state?.plan;
        const token = response.data.token;
        const user = response.data.user;
        sessionStorage.setItem(
          "checkout_state",
          JSON.stringify({ plan, token, user })
        );

        const redirectTimer = setTimeout(() => {
          navigate("/checkout", {
            state: {
              plan,
              token,
              user,
            },
            replace: true,
          });
        }, 2000);

        return () => {
          clearTimeout(redirectTimer);
        };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Toaster />

      <Header />

      <div className="d-flex justify-content-center align-items-center my-5">
        <div className="w-100" style={{ maxWidth: "500px" }}>
          <h4 className="text-center mb-4">
            <strong>Vendor Registration</strong>
          </h4>
          <div className="alert alert-info text-center my-4">
            <p className="mb-0">
              Please create an account to connect your plan purchase to your
              profile.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-3">
              <div className="col-md-12">
                <div className="form-floating">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.firstname ? "is-invalid" : ""
                    }`}
                    id="firstname"
                    {...register("firstname")}
                    placeholder="First Name"
                    tabIndex="1"
                  />
                  <label htmlFor="firstname">First Name</label>
                  {errors.firstname && (
                    <div className="invalid-feedback">
                      {errors.firstname.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-floating">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.lastname ? "is-invalid" : ""
                    }`}
                    id="lastname"
                    {...register("lastname")}
                    placeholder="Last Name"
                    tabIndex="2"
                  />
                  <label htmlFor="lastname">Last Name</label>
                  {errors.lastname && (
                    <div className="invalid-feedback">
                      {errors.lastname.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-floating">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    id="email"
                    {...register("email")}
                    placeholder="Email"
                    tabIndex="3"
                  />
                  <label htmlFor="email">Email</label>
                  {errors.email && (
                    <div className="invalid-feedback">
                      {errors.email.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-floating">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/\D+/g, ""))
                    }
                    className={`form-control ${
                      errors.contact_no ? "is-invalid" : ""
                    }`}
                    id="contact_no"
                    {...register("contact_no")}
                    placeholder="Contact"
                    tabIndex="4"
                  />
                  <label htmlFor="contact_no">Contact</label>
                  {errors.contact_no && (
                    <div className="invalid-feedback">
                      {errors.contact_no.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-12">
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
                    tabIndex="5"
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
              <div className="col-md-12">
                <div className="form-floating">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${
                      errors.cnfPassword ? "is-invalid" : ""
                    }`}
                    id="cnfPassword"
                    {...register("cnfPassword")}
                    placeholder="Confirm Password"
                    tabIndex="6"
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
              <div className="col-md-12">
                <button
                  tabIndex="10"
                  style={{
                    backgroundColor: "#216EA5",
                    color: "white",
                  }}
                  className="me-1 btn"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default VendorRegistration;
