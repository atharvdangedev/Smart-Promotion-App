// Library Imports
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

const PasswordReset = () => {
  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;
  const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

  // State Variables
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // useForm hook initialization
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema), mode: "onChange" });

  // Send token to user's email and show error/success messages
  const onSubmit = async (data) => {
    setIsLoading(true);
    setMessage("");
    const formdata = new FormData();
    formdata.append("email", data.email);

    try {
      const response = await axios.post(
        `${APP_URL}/forgot-password`,
        formdata,
        {
          headers: {
            "X-App-Secret": `${SECRET_KEY}`,
          },
        }
      );
      if (response.status === 200) {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage(error.response?.data?.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-xl-5 px-4 auth-body">
      <form onSubmit={handleSubmit(onSubmit)}>
        <ul className="row g-3 list-unstyled li_animate">
          <li className="col-12">
            <h1 className="h2 title-font">Welcome to Smart Promotion App</h1>
            <p>Your Dashboard</p>
          </li>

          <li className="col-12">
            <div className="form-floating mb-4">
              <input
                type="text"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                id="email"
                {...register("email")}
                placeholder="Please Enter Your Email"
                tabIndex="1"
              />
              <label htmlFor="email">Email</label>
              {errors.email && (
                <div className="invalid-feedback">{errors.email.message}</div>
              )}
            </div>
            <small className="text-muted">
              An email will be sent to the above address with a link to set your
              new password.
            </small>
          </li>

          {message && (
            <li className="col-12">
              <div
                className={`alert ${
                  message.includes("error") ? "alert-danger" : "alert-success"
                }`}
              >
                {message}
              </div>
            </li>
          )}

          <li className="col-12 my-lg-2">
            <button
              type="submit"
              tabIndex="2"
              className="btn btn-lg w-100 btn-primary text-uppercase mb-2"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </li>

          <li className="col-12">
            <span className="text-muted">
              <Link to="/signin">Back to Sign in</Link>
            </span>
          </li>
        </ul>
      </form>
    </div>
  );
};

export default PasswordReset;
