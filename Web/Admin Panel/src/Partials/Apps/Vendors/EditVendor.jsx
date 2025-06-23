/* eslint-disable no-useless-escape */
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { handleApiError } from "../utils/handleApiError";

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
    .notRequired()
    .min(2, "Minimum 2 characters required.")
    .max(100, "Maximum 100 characters allowed."),

  gst_number: yup.string().notRequired(),

  business_email: yup.string().email("Invalid business email").notRequired(),

  business_contact: yup.string().notRequired(),

  website_url: yup.string().notRequired().url("Invalid website URL"),

  company_address: yup
    .string()
    .notRequired()
    .max(200, "Maximum 200 characters allowed."),

  logo: yup.mixed().notRequired(),

  footer_logo: yup.mixed().notRequired(),

  facebook_social_link: yup.string().notRequired(),

  instagram_social_link: yup.string().notRequired(),

  linkedin_social_link: yup.string().notRequired(),

  youtube_social_link: yup.string().notRequired(),

  old_profile_pic: yup.string().notRequired(),
});

const EditVendor = () => {
  // Navigate function
  const navigate = useNavigate();
  const location = useLocation();

  // Access token
  const token = localStorage.getItem("jwtToken");

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;
  const Img_url = import.meta.env.VITE_IMG_URL;

  // vendor details from query string
  const { vendorId } = useParams();

  // State initialization
  const profilePicRef = useRef();
  const logoRef = useRef();
  const footerLogoRef = useRef();
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [footerLogoPreview, setFooterLogoPreview] = useState(null);
  const [firstName, setFirstName] = useState("");

  const handleProfilePic = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

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
        const res = await axios.get(`${APP_URL}/vendor-details/${vendorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.status === 200) {
          setValue("firstname", res.data.vendor.firstname);
          setValue("lastname", res.data.vendor.lastname);
          setValue("email", res.data.vendor.email);
          setValue("contact_no", res.data.vendor.contact_no);
          setValue("old_profile_pic", res.data.vendor.profile_pic);
          if (res.data.vendor.company_name)
            setValue("company_name", res.data.vendor.company_name);
          if (res.data.vendor.business_email)
            setValue("business_email", res.data.vendor.business_email);
          if (res.data.vendor.business_contact)
            setValue("business_contact", res.data.vendor.business_contact);
          if (res.data.vendor.website_url)
            setValue("website_url", res.data.vendor.website_url);
          if (res.data.vendor.company_address)
            setValue("company_address", res.data.vendor.company_address);

          // Set profile image if available
          if (res.data.vendor.profile_pic) {
            setValue("profile_pic", res.data.vendor.profile_pic);
            setProfilePicPreview(
              `${Img_url}/profile/list/${res.data.vendor.profile_pic}`
            );
          }

          // Set logo image if available
          if (res.data.vendor.company_logo) {
            setValue("logo", res.data.vendor.company_logo);
            setLogoPreview(
              `${Img_url}/vendor-logos/${res.data.vendor.company_logo}`
            );
          }

          if (res.data.vendor.company_footer_logo) {
            setValue("footer_logo", res.data.vendor.company_footer_logo);
            setFooterLogoPreview(
              `${Img_url}/vendor-logos/${res.data.vendor.company_footer_logo}`
            );
          }

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
        }
      } catch (error) {
        handleApiError(error, "fetching", "vendor details");
      }
    };
    fetchvendor();
  }, [vendorId, token, APP_URL, Img_url, setValue]);

  // Handle submit
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("firstname", data.firstname);
    formData.append("lastname", data.lastname);
    formData.append("email", data.email);
    formData.append("contact_no", data.contact_no);
    formData.append("role", "3");
    formData.append("website_url", data.website_url);

    if (data.company_name) formData.append("company_name", data.company_name);
    if (data.business_email)
      formData.append("business_email", data.business_email);
    if (data.business_contact)
      formData.append("business_contact", data.business_contact);
    if (data.website_url) formData.append("website_url", data.website_url);
    if (data.company_address)
      formData.append("company_address", data.company_address);

    if (data.logo && data.logo[0] instanceof File) {
      formData.append("logo", data.logo[0]);
    }

    if (data.footer_logo && data.footer_logo[0] instanceof File) {
      formData.append("footer_logo", data.footer_logo[0]);
    }

    if (data.profile_pic && data.profile_pic[0] instanceof File) {
      formData.append("profile_pic", data.profile_pic[0]);
    }

    if (data.old_profile_pic)
      formData.append("old_profile_pic", data.old_profile_pic);

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
        `${APP_URL}/edit-vendor/${vendorId}`,
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
                    type="email"
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
                      errors.company_name ? "is-invalid" : ""
                    }`}
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
                  <input
                    type="text"
                    className={`form-control ${
                      errors.company_address ? "is-invalid" : ""
                    }`}
                    id="company_address"
                    {...register("company_address")}
                    placeholder="Company Address"
                    tabIndex="13"
                  />
                  <label htmlFor="company_address">Company Address</label>
                  {errors.company_address && (
                    <div className="invalid-feedback">
                      {errors.company_address.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.facebook_social_link ? "is-invalid" : ""
                    }`}
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
                    className={`form-control ${
                      errors.instagram_social_link ? "is-invalid" : ""
                    }`}
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
                    className={`form-control ${
                      errors.linkedin_social_link ? "is-invalid" : ""
                    }`}
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
                    className={`form-control ${
                      errors.youtube_social_link ? "is-invalid" : ""
                    }`}
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
                    className={`form-control ${
                      errors.logo ? "is-invalid" : ""
                    }`}
                    id="logo"
                    {...register("logo")}
                    accept="image/*"
                    onChange={handleLogo}
                    tabIndex="14"
                  />
                  <label htmlFor="logo">Logo (Optional)</label>
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
                    className={`form-control ${
                      errors.footer_logo ? "is-invalid" : ""
                    }`}
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
