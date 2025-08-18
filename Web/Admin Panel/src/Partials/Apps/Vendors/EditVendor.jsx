/* eslint-disable no-useless-escape */
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
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

  business_contact: yup
    .string()
    .min(10, "Business Contact must be minimun 10 digits")
    .required("Business Contact is required"),

  website_url: yup.string().notRequired().url("Invalid website URL"),

  business_address: yup
    .string()
    .required("Business Address is required")
    .max(200, "Maximum 200 characters allowed."),

  old_profile_pic: yup.string().notRequired(),
});

const EditVendor = () => {
  // Navigate function
  const navigate = useNavigate();
  const location = useLocation();

  // Access token
  const { token, user } = useSelector((state) => state.auth);

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;
  const Img_url = import.meta.env.VITE_IMG_URL;

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

  // vendor details from query string
  const { vendorId } = useParams();

  // State initialization
  const profilePicRef = useRef();
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [vendorData, setVendorData] = useState({});

  const handleProfilePic = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (location.state) {
      const { firstname } = location.state;
      setFirstName(firstname);
    }
  }, [location.state]);

  // Use form initialisation
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  //fetch vendor data
  useEffect(() => {
    const fetchvendor = async () => {
      try {
        const res = await axios.get(
          `${APP_URL}/${user.rolename}/vendors/${vendorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (res.status === 200) {
          setVendorData(res.data.vendor);
          setValue("firstname", res.data.vendor.first_name);
          setValue("lastname", res.data.vendor.last_name);
          setValue("email", res.data.vendor.email);
          setValue("contact_no", res.data.vendor.contact_no);
          setValue("old_profile_pic", res.data.vendor.profile_pic);
          if (res.data.vendor.business_name)
            setValue("business_name", res.data.vendor.business_name);
          if (res.data.vendor.business_email)
            setValue("business_email", res.data.vendor.business_email);
          if (res.data.vendor.business_contact)
            setValue("business_contact", res.data.vendor.business_contact);
          if (res.data.vendor.website)
            setValue("website_url", res.data.vendor.website);
          if (res.data.vendor.gst_number)
            setValue("gst_number", res.data.vendor.gst_number);
          if (res.data.vendor.business_address)
            setValue("business_address", res.data.vendor.business_address);
          if (res.data.vendor.business_type)
            setValue("business_type", res.data.vendor.business_type);

          // Set profile image if available
          if (res.data.vendor.profile_pic) {
            setValue("profile_pic", res.data.vendor.profile_pic);
            setProfilePicPreview(
              `${Img_url}/profile/${res.data.vendor.profile_pic}`
            );
          }
        }
      } catch (error) {
        handleApiError(error, "fetching", "vendor details");
      }
    };
    fetchvendor();
  }, [vendorId, token, APP_URL, Img_url, setValue, user.rolename]);

  // Handle submit
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("first_name", data.firstname);
    formData.append("last_name", data.lastname);
    formData.append("email", vendorData.email);
    formData.append("contact_no", data.contact_no);
    formData.append("role", vendorData.role);
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

    if (data.old_profile_pic)
      formData.append("old_profile_pic", data.old_profile_pic);

    try {
      const res = await axios.post(
        `${APP_URL}/${user.rolename}/vendors/${vendorId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status === 200) {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/admin/vendors");
        }, 2000);
      }
    } catch (error) {
      handleApiError(error, "updating", "vendor");
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
            <strong>Edit {firstName}</strong>
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
                    disabled
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
              {profilePicPreview && (
                <div className="col-md-1">
                  <img
                    src={profilePicPreview}
                    alt="Vendor Logo"
                    className="img-thumbnail"
                    style={{ maxWidth: "100%", height: "60px" }}
                  />
                </div>
              )}
              <div className={`${profilePicPreview ? "col-md-3" : "col-md-4"}`}>
                <div className="form-floating">
                  <input
                    type="file"
                    ref={profilePicRef}
                    className={`form-control ${
                      errors.profile_pic ? "is-invalid" : ""
                    }`}
                    id="profile_pic"
                    {...register("profile_pic")}
                    accept="image/*"
                    onChange={handleProfilePic}
                    tabIndex="5"
                  />
                  <input
                    type="hidden"
                    name="old_profile_pic"
                    id="old_profile_pic"
                    {...register("old_profile_pic")}
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
                  type="submit"
                  tabIndex="20"
                  className="me-1 btn btn-primary"
                >
                  Update
                </button>
                <button
                  type="button"
                  tabIndex="21"
                  className="btn btn-outline-secondary"
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

export default EditVendor;
