/* eslint-disable no-useless-escape */
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ImagePreview from "../utils/ImagePreview";
import { evaluatePasswordStrength } from "../utils/evaluatePasswordStrength";
import { handleApiError } from "../utils/handleApiError";
import Select from "react-select";
import { useSelector } from "react-redux";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Schema definition
const schema = yup.object().shape({
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

  profile_pic: yup.mixed().notRequired(),

  business_name: yup
    .string()
    .required("Business Name is required")
    .matches(
      /^[A-Za-z0-9\s]+$/,
      "Business name must contain only alphanumeric characters and spaces."
    )
    .min(2, "Minimum 2 characters required.")
    .max(100, "Maximum 100 characters allowed."),

  gst_number: yup.string().notRequired(),

  business_type: yup.string().required("Business Type is required"),

  business_email: yup
    .string()
    .email("Invalid business email")
    .required("Business Email is required"),

  business_contact: yup.string().required("Business Contact is required"),

  website_url: yup.string().notRequired().url("Invalid website URL"),

  business_address: yup
    .string()
    .required("Business Address is required")
    .max(200, "Maximum 200 characters allowed."),
  old_profile_pic: yup.string().notRequired(),
});

const AddVendor = () => {
  // Navigate function
  const navigate = useNavigate();

  // Access token
  const { token, user } = useSelector((state) => state.auth);

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;

  const businessTypes = [
    {
      value: "private-limited",
      label: "Private Limited",
    },
    {
      value: "limited",
      label: "Limited",
    },
    {
      value: "llp",
      label: "LLP",
    },
    {
      value: "proprietor",
      label: "Proprietor",
    },
  ];

  // State initialization
  const profilePicRef = useRef();
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);

  // Use form initialization
  const {
    register,
    handleSubmit,
    reset,
    control,
    resetField,
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

  const handleProfilePic = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveProfilePic = () => {
    setProfilePicPreview(null);
    resetField("profile_pic");
    if (profilePicRef.current) {
      profilePicRef.current.value = "";
    }
  };

  // Handle submit
  const onSubmit = async (data) => {
    const { isStrong, errors } = evaluatePasswordStrength(data.password);
    if (!isStrong) {
      setPasswordErrors(errors);
      return;
    }

    try {
      const formData = new FormData();

      formData.append("first_name", data.firstname);
      formData.append("last_name", data.lastname);
      formData.append("email", data.email);
      formData.append("contact_no", data.contact_no);
      formData.append("password", data.password);
      formData.append("role", "3");
      formData.append("business_address", data.business_address);
      formData.append("business_type", data.business_type);

      if (data.gst_number) formData.append("gst_number", data.gst_number);
      if (data.business_name)
        formData.append("business_name", data.business_name);
      if (data.website) formData.append("website", data.website_url);
      if (data.business_email)
        formData.append("business_email", data.business_email);
      if (data.business_contact)
        formData.append("business_contact", data.business_contact);
      if (data.website_url) formData.append("website", data.website_url);

      if (data.profile_pic && data.profile_pic[0] instanceof File)
        formData.append("profile_pic", data.profile_pic[0]);

      const res = await axios.post(
        `${APP_URL}/${user.rolename}/vendors`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status === 201) {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/admin/vendors");
        }, 2000);
      }
    } catch (error) {
      handleApiError(error, "adding", "vendor");
    }
  };

  // Handle cancel
  const handleCancel = () => {
    reset();
    navigate("/admin/vendors");
  };

  return (
    <div className="px-4 py-3 page-body">
      <Toaster />
      <div className="card">
        <div className="card-header py-3 bg-transparent border-bottom-0">
          <h4 className="title-font mt-2 mb-0">
            <strong>Add New Vendor</strong>
          </h4>
          <Link className="btn btn-info text-white" to="/admin/vendors">
            Back
          </Link>
        </div>
        <div className="card-body card-main-one">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-3">
              <div className="col-md-4">
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
              <div className="col-md-4">
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
              <div className="col-md-4">
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
              <div className="col-md-4">
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
              <div className="col-md-4">
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
              <div className="col-md-4">
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
              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    ref={profilePicRef}
                    type="file"
                    className={`form-control ${
                      errors.profile_pic ? "is-invalid" : ""
                    }`}
                    id="profile_pic"
                    {...register("profile_pic")}
                    onChange={handleProfilePic}
                    accept="image/*"
                    tabIndex="7"
                  />
                  <label htmlFor="profile_pic">
                    Profile Picture (Optional)
                  </label>
                  {errors.profile_pic && (
                    <div className="invalid-feedback">
                      {errors.profile_pic.message}
                    </div>
                  )}
                </div>
                {profilePicPreview && (
                  <ImagePreview
                    ImagePreviewURL={profilePicPreview}
                    onRemove={handleRemoveProfilePic}
                  />
                )}
              </div>

              {/* Additional Information */}
              <h4 className="mt-4">Additional Information</h4>

              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.business_name ? "is-invalid" : ""
                    }`}
                    id="business_name"
                    {...register("business_name")}
                    placeholder="Business Name"
                    tabIndex="8"
                  />
                  <label htmlFor="business_name">Business Name</label>
                  {errors.business_name && (
                    <div className="invalid-feedback">
                      {errors.business_name.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.business_email ? "is-invalid" : ""
                    }`}
                    id="business_email"
                    {...register("business_email")}
                    placeholder="Business Email"
                    tabIndex="10"
                  />
                  <label htmlFor="business_email">Business Email</label>
                  {errors.business_email && (
                    <div className="invalid-feedback">
                      {errors.business_email.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/\D+/g, ""))
                    }
                    className={`form-control ${
                      errors.business_contact ? "is-invalid" : ""
                    }`}
                    id="business_contact"
                    {...register("business_contact")}
                    placeholder="Business Contact"
                    tabIndex="11"
                  />
                  <label htmlFor="business_contact">Business Contact</label>
                  {errors.business_contact && (
                    <div className="invalid-feedback">
                      {errors.business_contact.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.website_url ? "is-invalid" : ""
                    }`}
                    id="website_url"
                    {...register("website_url")}
                    placeholder="Website"
                    tabIndex="12"
                  />
                  <label htmlFor="website_url">
                    Website (https://example.com)
                  </label>
                  {errors.website_url && (
                    <div className="invalid-feedback">
                      {errors.website_url.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-floating">
                  <textarea
                    type="text"
                    className={`form-control ${
                      errors.business_address ? "is-invalid" : ""
                    }`}
                    id="business_address"
                    {...register("business_address")}
                    placeholder="Business Address"
                    tabIndex="13"
                  />
                  <label htmlFor="business_address">Business Address</label>
                  {errors.business_address && (
                    <div className="invalid-feedback">
                      {errors.business_address.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type="text"
                    maxLength={15}
                    className={`form-control ${
                      errors.gst_number ? "is-invalid" : ""
                    }`}
                    id="gst_number"
                    {...register("gst_number")}
                    placeholder="GST Number"
                    tabIndex="14"
                  />
                  <label htmlFor="gst_number">GST Number</label>
                  {errors.gst_number && (
                    <div className="invalid-feedback">
                      {errors.gst_number.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-floating">
                  <Controller
                    name="business_type"
                    control={control}
                    rules={{ required: "Business Type is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={businessTypes}
                        tabIndex="15"
                        className={`basic-single ${
                          errors.business_type ? "is-invalid" : ""
                        }`}
                        classNamePrefix="select"
                        isClearable={true}
                        isSearchable={true}
                        placeholder="Select Business type"
                        value={
                          businessTypes.find(
                            (type) => type.value === field.value
                          ) || null
                        }
                        onChange={(selectedOption) =>
                          field.onChange(
                            selectedOption ? selectedOption.value : ""
                          )
                        }
                        styles={{
                          control: (baseStyles) => ({
                            ...baseStyles,
                            height: "calc(3.5rem + 2px)",
                            borderRadius: "0.375rem",
                            border: "1px solid #ced4da",
                          }),
                          valueContainer: (baseStyles) => ({
                            ...baseStyles,
                            height: "100%",
                            padding: "0.7rem 0.6rem",
                          }),
                          placeholder: (baseStyles) => ({
                            ...baseStyles,
                            color: "#6c757d",
                          }),
                          input: (baseStyles) => ({
                            ...baseStyles,
                            margin: 0,
                            padding: 0,
                          }),
                          menu: (baseStyles) => ({
                            ...baseStyles,
                            zIndex: 9999,
                          }),
                        }}
                      />
                    )}
                  />
                  {errors.business_type && (
                    <div className="invalid-feedback">
                      {errors.business_type.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-12">
                <button
                  tabIndex="16"
                  className="me-1 btn btn-primary"
                  type="submit"
                >
                  Add Vendor
                </button>
                <button
                  tabIndex="17"
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={handleCancel}
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

export default AddVendor;
