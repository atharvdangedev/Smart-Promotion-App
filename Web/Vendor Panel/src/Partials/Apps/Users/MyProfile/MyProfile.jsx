/* eslint-disable no-useless-escape */
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import UploadProgress from "../../utils/UploadProgress";
import { handleApiError } from "../../utils/handleApiError";
import { setPageTitle } from "../../utils/docTitle";

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

  email: yup.string().email("Invalid email").required("Email is required"),

  contact_no: yup.string().required("Contact number is required"),

  profile_pic: yup.mixed().notRequired(),

  company_name: yup
    .string()
    .required("Company Name is required")
    .matches(
      /^[A-Za-z0-9\s]+$/,
      "Company name must contain only alphanumeric characters and spaces."
    )
    .min(2, "Minimum 2 characters required.")
    .max(100, "Maximum 100 characters allowed."),

  gst_number: yup.string().notRequired(),

  business_email: yup
    .string()
    .email("Invalid business email")
    .required("Business Email is required"),

  business_contact: yup
    .string()
    .required("Business Contact number is required"),

  website_url: yup.string().notRequired(),

  company_address: yup
    .string()
    .required("Company Address is required")
    .min(5, "Minimum 5 characters required.")
    .max(300, "Maximum 300 characters allowed."),

  logo: yup.mixed().required("Header Logo is required"),

  address_map_link: yup
    .string()
    .required("Google maps link is required")
    .test("is-valid-url", "Invalid Google Maps URL", (value) => {
      const googleMapsLinkRegex =
        /^https?:\/\/(?:www\.)?(google\.com\/maps|maps\.google\.com|maps\.app\.goo\.gl)\/.+$/;

      return googleMapsLinkRegex.test(value);
    }),

  footer_logo: yup.mixed().notRequired(),

  banner_image: yup.mixed().notRequired(),

  facebook_social_link: yup.string().notRequired(),
  instagram_social_link: yup.string().notRequired(),
  linkedin_social_link: yup.string().notRequired(),
  youtube_social_link: yup.string().notRequired(),

  old_profile_pic: yup.string().notRequired(),

  bank_account_name: yup.string().notRequired(),
  bank_account_number: yup.string().notRequired(),
  ifsc_code: yup.string().notRequired(),

  upi_id: yup
    .string()
    .required("UPI ID is required")
    .matches(
      /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/,
      "Invalid UPI ID format (e.g., name@bank)"
    ),

  razorpay_api_key: yup.string().when("website_url", {
    is: (val) => val && val.trim().length > 0,
    then: (schema) => schema.required("Razorpay API Key is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  razorpay_api_secret: yup.string().when("website_url", {
    is: (val) => val && val.trim().length > 0,
    then: (schema) => schema.required("Razorpay API Secret is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const MyProfile = () => {
  // Access token
  const token = localStorage.getItem("jwtToken");

  setPageTitle("My Profile | Vendor Panel");

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;
  const Img_url = import.meta.env.VITE_IMG_URL;

  // User details from token
  const decoded = jwtDecode(token);
  const { user_id } = decoded.data;

  // State initialisation
  const [uploadProgress, setUploadProgress] = useState(0);
  const [userData, setUserData] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  const [footerLogoPreview, setFooterLogoPreview] = useState(null);
  const [bannerImagePreview, setBannerImagePreview] = useState(null);
  const [updated, setUpdated] = useState(false);
  const [showPassword, setShowPassword] = useState({
    api_key: false,
    secret_key: false,
  });

  const fileInputRef = useRef();
  const logoRef = useRef();
  const footerLogoRef = useRef();
  const bannerImageRef = useRef();

  // Use form initialisation
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleFooterLogo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFooterLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImagePreview(URL.createObjectURL(file));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  //fetch vendor data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${APP_URL}/vendor-details/${user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.status === 200) {
          setUserData(res.data.vendor);
          setValue("firstname", res.data.vendor.firstname);
          setValue("lastname", res.data.vendor.lastname);
          setValue("email", res.data.vendor.email);
          setValue("upi_id", res.data.vendor.upi_id);
          setValue("address_map_link", res.data.vendor.address_map_link);
          setValue("contact_no", res.data.vendor.contact_no);
          setValue("old_profile_pic", res.data.vendor.profile_pic);
          if (res.data.vendor.company_name)
            setValue("company_name", res.data.vendor.company_name);

          if (res.data.vendor.gst_number)
            setValue("gst_number", res.data.vendor.gst_number);

          if (res.data.vendor.business_email)
            setValue("business_email", res.data.vendor.business_email);

          if (res.data.vendor.business_contact)
            setValue("business_contact", res.data.vendor.business_contact);

          if (res.data.vendor.website_url)
            setValue("website_url", res.data.vendor.website_url);

          if (res.data.vendor.razorpay_api_key)
            setValue("razorpay_api_key", res.data.vendor.razorpay_api_key);

          if (res.data.vendor.razorpay_api_secret)
            setValue(
              "razorpay_api_secret",
              res.data.vendor.razorpay_api_secret
            );

          if (res.data.vendor.company_address)
            setValue("company_address", res.data.vendor.company_address);

          if (res.data.vendor.bank_account_name)
            setValue("bank_account_name", res.data.vendor.bank_account_name);

          if (res.data.vendor.bank_account_number)
            setValue(
              "bank_account_number",
              res.data.vendor.bank_account_number
            );

          if (res.data.vendor.ifsc_code)
            setValue("ifsc_code", res.data.vendor.ifsc_code);

          if (res.data.vendor.facebook_social_link)
            setValue(
              "facebook_social_link",
              res.data.vendor.facebook_social_link
            );

          if (res.data.vendor.instagram_social_link)
            setValue(
              "instagram_social_link",
              res.data.vendor.instagram_social_link
            );

          if (res.data.vendor.linkedin_social_link)
            setValue(
              "linkedin_social_link",
              res.data.vendor.linkedin_social_link
            );
          if (res.data.vendor.youtube_social_link)
            setValue(
              "youtube_social_link",
              res.data.vendor.youtube_social_link
            );

          setValue("logo", res.data.vendor.company_logo);
          setLogoPreview(
            `${Img_url}/vendor-logos/${res.data.vendor.company_logo}`
          );

          if (res.data.vendor.company_footer_logo) {
            setValue("footer_logo", res.data.vendor.company_footer_logo);
            setFooterLogoPreview(
              `${Img_url}/vendor-logos/${res.data.vendor.company_footer_logo}`
            );
          }

          if (res.data.vendor.banner_image) {
            setValue("banner_image", res.data.vendor.banner_image);
            setBannerImagePreview(
              `${Img_url}/site-banner-image/${res.data.vendor.banner_image}`
            );
          }
        }
      } catch (error) {
        handleApiError(error, "fetching", "vendor details");
      }
    };

    fetchUser();
  }, [user_id, token, updated, APP_URL, setValue, Img_url]);

  // Handle profile picture click
  const handleProfilePicClick = () => {
    fileInputRef.current.click();
  };

  // Handle profile picture change
  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_pic", file);

    try {
      const res = await axios.post(
        `${APP_URL}/update-profile-pic/${user_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      if (res.status === 200) {
        toast.success(res.data.message);
      }
    } catch (error) {
      handleApiError(error, "updating", "profile picture");
    } finally {
      setUpdated((prev) => !prev);
      setUploadProgress(0);
    }
  };

  // Handle submit
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("firstname", data.firstname);
    formData.append("lastname", data.lastname);
    formData.append("email", data.email);
    formData.append("contact_no", data.contact_no);
    formData.append("role", "3");
    formData.append("address_map_link", data.address_map_link);
    formData.append("business_contact", data.business_contact);
    formData.append("company_address", data.company_address);
    formData.append("company_name", data.company_name);
    formData.append("business_email", data.business_email);
    formData.append("website_url", userData.website_url);
    if (userData.website_url) {
      formData.append("razorpay_api_key", data.razorpay_api_key);
      formData.append("razorpay_api_secret", data.razorpay_api_secret);
    }
    formData.append("upi_id", data.upi_id);

    if (data.bank_account_name)
      formData.append("bank_account_name", data.bank_account_name);

    if (data.bank_account_number)
      formData.append("bank_account_number", data.bank_account_number);

    if (data.ifsc_code) formData.append("ifsc_code", data.ifsc_code);

    if (data.logo && data.logo[0] instanceof File) {
      formData.append("logo", data.logo[0]);
    }

    if (data.footer_logo && data.footer_logo[0] instanceof File) {
      formData.append("footer_logo", data.footer_logo[0]);
    }

    if (data.banner_image && data.banner_image[0] instanceof File) {
      formData.append("site_banner_image", data.banner_image[0]);
    }

    if (data.gst_number) formData.append("gst_number", data.gst_number);

    if (data.facebook_social_link)
      formData.append("facebook_social_link", data.facebook_social_link);
    if (data.instagram_social_link)
      formData.append("instagram_social_link", data.instagram_social_link);
    if (data.linkedin_social_link)
      formData.append("linkedin_social_link", data.linkedin_social_link);
    if (data.youtube_social_link)
      formData.append("youtube_social_link", data.youtube_social_link);

    try {
      const res = await axios.post(
        `${APP_URL}/edit-vendor-profile/${user_id}`,
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
        setUpdated((prev) => !prev);
      }
    } catch (error) {
      handleApiError(error, "updating", "vendor");
    }
  };

  return (
    <div className="px-4 py-3 page-body">
      <Toaster />
      <div className="card border-0">
        <div className="card-header bg-card pb-3">
          <h6 className="card-title mb-0">My Profile</h6>
          <div className="d-flex align-items-md-start align-items-center flex-column flex-md-row mt-4 w-100">
            <div
              className="position-relative rounded"
              style={{ border: "0.5px solid #cecece" }}
            >
              <img
                src={
                  userData?.profile_pic
                    ? `${Img_url}/profile/list/${userData.profile_pic}`
                    : `${Img_url}/default/list/user.webp`
                }
                alt={userData?.firstname || "User profile"}
                className="avatar rounded xl"
                onError={(e) => {
                  e.target.src = `${Img_url}/default/list/user.webp`;
                }}
              />
              <div
                className="position-absolute bottom-0 end-0 bg-primary rounded px-1"
                style={{
                  cursor: "pointer",
                  border: "0.5px solid #00B8D6",
                  color: "white",
                  fontSize: "14px",
                }}
                onClick={handleProfilePicClick}
              >
                <i className="bi bi-pencil"></i>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleProfilePicChange}
                accept="image/*"
              />
              {uploadProgress > 0 && (
                <UploadProgress uploadProgress={uploadProgress} />
              )}
            </div>
            <div className="media-body ms-md-5 m-0 mt-md-0 text-md-start text-center">
              <h4 className="mb-1 mt-3">
                {userData.firstname} {userData.lastname}
              </h4>
              <p>{userData.email}</p>
            </div>
          </div>
        </div>
        <div className="card-body card-main-one">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-3">
              <div className="col-md-6">
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
              <div className="col-md-6">
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
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    style={{ cursor: "not-allowed" }}
                    id="email"
                    disabled={true}
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
              <div className="col-md-6">
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

              {/* Additional Information */}
              <h4 className="mt-4">Additional Information</h4>

              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type="text"
                    className={`form-control ${errors.company_name ? "is-invalid" : ""}`}
                    id="company_name"
                    {...register("company_name")}
                    placeholder="Company Name"
                    tabIndex="8"
                  />
                  <label htmlFor="company_name">Company Name</label>
                  {errors.company_name && (
                    <div className="invalid-feedback">
                      {errors.company_name.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={15}
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/\D+/g, ""))
                    }
                    className={`form-control ${errors.gst_number ? "is-invalid" : ""}`}
                    id="gst_number"
                    {...register("gst_number")}
                    placeholder="GST Number"
                    tabIndex="9"
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
                  <input
                    type="text"
                    className={`form-control ${errors.business_email ? "is-invalid" : ""}`}
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
                    className={`form-control ${errors.business_contact ? "is-invalid" : ""}`}
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
                    className={`form-control ${errors.website_url ? "is-invalid" : ""}`}
                    id="website_url"
                    {...register("website_url")}
                    placeholder="Website"
                    tabIndex="12"
                    disabled
                  />
                  <label htmlFor="website_url">
                    Website (https://example.com)
                  </label>
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type={showPassword.api_key ? "text" : "password"}
                    className={`form-control ${errors.razorpay_api_key ? "is-invalid" : ""}`}
                    id="razorpay_api_key"
                    {...register("razorpay_api_key")}
                    placeholder="Razorpay API Key"
                    tabIndex="12"
                  />
                  <div
                    className="position-absolute top-50 end-0 translate-middle-y pe-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => togglePasswordVisibility("api_key")}
                  >
                    <i
                      className={`bi ${showPassword.api_key ? "bi-eye-fill" : "bi-eye-slash-fill"}`}
                    ></i>
                  </div>
                  <label htmlFor="razorpay_api_key">Razorpay API Key</label>
                  {errors.razorpay_api_key && (
                    <div className="invalid-feedback">
                      {errors.razorpay_api_key.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type={showPassword.secret_key ? "text" : "password"}
                    className={`form-control ${errors.razorpay_api_secret ? "is-invalid" : ""}`}
                    id="razorpay_api_secret"
                    {...register("razorpay_api_secret")}
                    placeholder="Razorpay API Secret"
                    tabIndex="12"
                  />
                  <div
                    className="position-absolute top-50 end-0 translate-middle-y pe-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => togglePasswordVisibility("secret_key")}
                  >
                    <i
                      className={`bi ${showPassword.secret_key ? "bi-eye-fill" : "bi-eye-slash-fill"}`}
                    ></i>
                  </div>
                  <label htmlFor="razorpay_api_secret">
                    Razorpay API Secret
                  </label>
                  {errors.razorpay_api_secret && (
                    <div className="invalid-feedback">
                      {errors.razorpay_api_secret.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type="text"
                    className={`form-control ${errors.company_address ? "is-invalid" : ""}`}
                    maxLength={300}
                    minLength={5}
                    id="company_address"
                    {...register("company_address")}
                    placeholder="Company Address"
                    tabIndex="13"
                  />
                  <label htmlFor="company_address">Company Address</label>
                  <p className="px-1 mb-0 mt-2 text-dark">
                    Please provide the google maps link in the next field same
                    as this address
                  </p>
                  {errors.company_address && (
                    <div className="invalid-feedback">
                      {errors.company_address.message}
                    </div>
                  )}
                </div>
              </div>

              {logoPreview && (
                <div className="col-md-1">
                  <img
                    src={logoPreview}
                    alt="vendor logo"
                    className="img-thumbnail"
                    style={{ maxWidth: "100%", height: "60px" }}
                  />
                </div>
              )}
              <div className={`${logoPreview ? "col-md-3" : "col-md-4"}`}>
                <div className="form-floating">
                  <input
                    type="file"
                    ref={logoRef}
                    className={`form-control ${errors.logo ? "is-invalid" : ""}`}
                    id="logo"
                    {...register("logo")}
                    accept="image/*"
                    onChange={handleLogo}
                    tabIndex="14"
                  />
                  <label htmlFor="logo">Header Logo</label>
                  {errors.logo && (
                    <div className="invalid-feedback">
                      {errors.logo.message}
                    </div>
                  )}
                </div>
              </div>

              {footerLogoPreview && (
                <div className="col-md-1">
                  <img
                    src={footerLogoPreview}
                    alt="vendor footer logo"
                    className="img-thumbnail"
                    style={{ maxWidth: "100%", height: "60px" }}
                  />
                </div>
              )}
              <div className={`${footerLogoPreview ? "col-md-3" : "col-md-4"}`}>
                <div className="form-floating">
                  <input
                    type="file"
                    ref={footerLogoRef}
                    className={`form-control ${errors.footer_logo ? "is-invalid" : ""}`}
                    id="footer_logo"
                    {...register("footer_logo")}
                    accept="image/*"
                    onChange={handleFooterLogo}
                    tabIndex="15"
                  />
                  <label htmlFor="footer_logo">Footer Logo </label>
                  {errors.footer_logo && (
                    <div className="invalid-feedback">
                      {errors.footer_logo.message}
                    </div>
                  )}
                </div>
              </div>

              {bannerImagePreview && (
                <div className="col-md-1">
                  <img
                    src={bannerImagePreview}
                    alt="vendor banner image"
                    className="img-thumbnail"
                    style={{ maxWidth: "100%", height: "60px" }}
                  />
                </div>
              )}
              <div
                className={`${bannerImagePreview ? "col-md-3" : "col-md-4"}`}
              >
                <div className="form-floating">
                  <input
                    type="file"
                    ref={bannerImageRef}
                    className={`form-control ${errors.banner_image ? "is-invalid" : ""}`}
                    id="banner_image"
                    {...register("banner_image")}
                    accept="image/*"
                    onChange={handleBannerImage}
                    tabIndex="16"
                  />
                  <label htmlFor="banner_image">Banner Image </label>
                  {errors.banner_image && (
                    <div className="invalid-feedback">
                      {errors.banner_image.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type="text"
                    className={`form-control ${errors.address_map_link ? "is-invalid" : ""}`}
                    id="address_map_link"
                    {...register("address_map_link")}
                    placeholder="Google Maps Link"
                    tabIndex="17"
                  />
                  <label htmlFor="address_map_link">Google Maps Link</label>

                  <p className="px-1 mb-0 mt-2 fst-italic text-dark">
                    <a
                      href="https://www.google.com/maps"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-decoration-underline"
                    >
                      You can get Google Maps Link from Google Maps
                    </a>
                  </p>
                  {errors.address_map_link && (
                    <div className="invalid-feedback">
                      {errors.address_map_link.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type="text"
                    className={`form-control ${errors.facebook_social_link ? "is-invalid" : ""}`}
                    id="facebook_social_link"
                    {...register("facebook_social_link")}
                    placeholder="Facebook Handle"
                    tabIndex="18"
                  />
                  <label htmlFor="facebook_social_link">Facebook Handle</label>
                  {errors.facebook_social_link && (
                    <div className="invalid-feedback">
                      {errors.facebook_social_link.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type="text"
                    className={`form-control ${errors.instagram_social_link ? "is-invalid" : ""}`}
                    id="instagram_social_link"
                    {...register("instagram_social_link")}
                    placeholder="Instagram Handle"
                    tabIndex="19"
                  />
                  <label htmlFor="instagram_social_link">
                    Instagram Handle
                  </label>
                  {errors.instagram_social_link && (
                    <div className="invalid-feedback">
                      {errors.instagram_social_link.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type="text"
                    className={`form-control ${errors.linkedin_social_link ? "is-invalid" : ""}`}
                    id="linkedin_social_link"
                    {...register("linkedin_social_link")}
                    placeholder="Linkedin Handle"
                    tabIndex="20"
                  />
                  <label htmlFor="linkedin_social_link">Linkedin Handle</label>
                  {errors.linkedin_social_link && (
                    <div className="invalid-feedback">
                      {errors.linkedin_social_link.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type="text"
                    className={`form-control ${errors.youtube_social_link ? "is-invalid" : ""}`}
                    id="youtube_social_link"
                    {...register("youtube_social_link")}
                    placeholder="Youtube Handle"
                    tabIndex="20"
                  />
                  <label htmlFor="youtube_social_link">Youtube Handle</label>
                  {errors.youtube_social_link && (
                    <div className="invalid-feedback">
                      {errors.youtube_social_link.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type="text"
                    className={`form-control ${errors.bank_account_name ? "is-invalid" : ""}`}
                    id="bank_account_name"
                    {...register("bank_account_name")}
                    placeholder="Bank account name"
                    tabIndex="21"
                  />
                  <label htmlFor="bank_account_name">Bank account name</label>
                  {errors.bank_account_name && (
                    <div className="invalid-feedback">
                      {errors.bank_account_name.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type="text"
                    inputMode="numeric"
                    onInput={(e) =>
                      (e.target.value = e.target.value.replace(/\D+/g, ""))
                    }
                    className={`form-control ${errors.bank_account_number ? "is-invalid" : ""}`}
                    id="bank_account_number"
                    {...register("bank_account_number")}
                    placeholder="Bank account number"
                    tabIndex="22"
                  />
                  <label htmlFor="bank_account_number">
                    Bank account number
                  </label>
                  {errors.bank_account_number && (
                    <div className="invalid-feedback">
                      {errors.bank_account_number.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type="text"
                    className={`form-control ${errors.ifsc_code ? "is-invalid" : ""}`}
                    id="ifsc_code"
                    {...register("ifsc_code")}
                    placeholder="IFSC code"
                    tabIndex="23"
                  />
                  <label htmlFor="ifsc_code">IFSC code</label>
                  {errors.ifsc_code && (
                    <div className="invalid-feedback">
                      {errors.ifsc_code.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type="text"
                    className={`form-control ${errors.upi_id ? "is-invalid" : ""}`}
                    id="upi_id"
                    {...register("upi_id")}
                    placeholder="UPI ID"
                    tabIndex="24"
                  />
                  <label htmlFor="upi_id">UPI ID</label>
                  {errors.upi_id && (
                    <div className="invalid-feedback">
                      {errors.upi_id.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-12">
                <button
                  tabIndex="25"
                  className="me-1 btn btn-primary"
                  type="submit"
                >
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
