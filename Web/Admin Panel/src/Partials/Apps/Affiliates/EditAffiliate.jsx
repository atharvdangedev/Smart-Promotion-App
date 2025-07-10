/* eslint-disable no-useless-escape */
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { handleApiError } from "../utils/handleApiError";
import Select from "react-select";
import { useSelector } from "react-redux";

const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
// const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const accountNumberRegex = /^[0-9]{9,18}$/;
const upiRegex = /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/;
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

  gst_number: yup
    .string()
    .required("GST Number is required")
    .matches(gstRegex, "Invalid GST Number (e.g., 22AAAAA0000A1Z5)"),

  account_holder: yup
    .string()
    .required("Account holder name is required")
    .matches(
      /^[A-Za-z\s]+$/,
      "Account holder name must contain only alphabets and spaces."
    )
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name is too long"),

  account_type: yup
    .string()
    .required("Account type is required")
    .oneOf(
      ["savings", "current"],
      "Account type must be 'savings' or 'current'"
    ),

  bank_name: yup
    .string()
    .required("Bank name is required")
    .min(3, "Bank name must be at least 3 characters"),

  bank_account_no: yup
    .string()
    .required("Bank account number is required")
    .matches(
      accountNumberRegex,
      "Invalid account number (must be 9–18 digits)"
    ),

  branch: yup
    .string()
    .required("Branch is required")
    .min(3, "Branch name must be at least 3 characters"),

  upi_id: yup
    .string()
    .required("UPI ID is required")
    .matches(upiRegex, "Invalid UPI ID format (e.g., name@bank)"),

  // ifsc_code: yup.string().notRequired(),

  old_profile_pic: yup.string().notRequired(),
});

const EditAffiliate = () => {
  // Navigate function
  const navigate = useNavigate();

  // Access token
  const { token, user } = useSelector((state) => state.auth);

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;
  const Img_url = import.meta.env.VITE_IMG_URL;

  const accountTypes = [
    {
      value: "savings",
      label: "Savings",
    },
    {
      value: "current",
      label: "Current",
    },
  ];

  // affiliate details from query string
  const { affiliateId } = useParams();

  // State initialization
  const profilePicRef = useRef();
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  const handleProfilePic = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

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

  //fetch affiliate data
  useEffect(() => {
    const fetchAffiliate = async () => {
      try {
        const res = await axios.get(
          `${APP_URL}/${user.rolename}/affiliates/${affiliateId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (res.status === 200) {
          setValue("firstname", res.data.affiliate.first_name);
          setValue("lastname", res.data.affiliate.last_name);
          setValue("email", res.data.affiliate.email);
          setValue("contact_no", res.data.affiliate.contact_no);
          setValue("old_profile_pic", res.data.affiliate.profile_pic);
          if (res.data.affiliate.account_holder)
            setValue("account_holder", res.data.affiliate.account_holder);
          if (res.data.affiliate.account_type)
            setValue("account_type", res.data.affiliate.account_type);
          if (res.data.affiliate.bank_name)
            setValue("bank_name", res.data.affiliate.bank_name);
          if (res.data.affiliate.bank_account_no)
            setValue("bank_account_no", res.data.affiliate.bank_account_no);
          if (res.data.affiliate.branch)
            setValue("branch", res.data.affiliate.branch);
          if (res.data.affiliate.upi_id)
            setValue("upi_id", res.data.affiliate.upi_id);
          if (res.data.affiliate.gst_number)
            setValue("gst_number", res.data.affiliate.gst_number);

          // Set profile image if available
          if (res.data.affiliate.profile_pic) {
            setValue("profile_pic", res.data.affiliate.profile_pic);
            setProfilePicPreview(
              `${Img_url}/profile/${res.data.affiliate.profile_pic}`
            );
          }
        }
      } catch (error) {
        handleApiError(error, "fetching", "affiliate details");
      }
    };
    fetchAffiliate();
  }, [affiliateId, token, APP_URL, Img_url, setValue, user.rolename]);

  // Handle submit
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("first_name", data.firstname);
      formData.append("last_name", data.lastname);
      formData.append("email", data.email);
      formData.append("contact_no", data.contact_no);
      formData.append("role", "7");
      formData.append("account_holder", data.account_holder);
      formData.append("account_type", data.account_type);
      formData.append("bank_name", data.bank_name);
      formData.append("bank_account_no", data.bank_account_no);
      formData.append("branch", data.branch);
      formData.append("upi_id", data.upi_id);
      if (data.gst_number) formData.append("gst_number", data.gst_number);

      if (data.profile_pic && data.profile_pic[0] instanceof File)
        formData.append("profile_pic", data.profile_pic[0]);

      const res = await axios.post(
        `${APP_URL}/${user.rolename}/affiliates/${affiliateId}`,
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
          navigate("/admin/affiliates");
        }, 2000);
      }
    } catch (error) {
      handleApiError(error, "adding", "affiliate");
    }
  };

  // Handle cancel
  const handleCancel = () => {
    reset();
    navigate("/admin/affiliates");
  };

  return (
    <div className="px-4 py-3 page-body">
      <Toaster />
      <div className="card">
        <div className="card-header py-3 bg-transparent border-bottom-0">
          <h4 className="title-font mt-2 mb-0">
            <strong>Edit Affiliate</strong>
          </h4>
          <Link className="btn btn-info text-white" to="/admin/affiliates">
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
                      errors.account_holder ? "is-invalid" : ""
                    }`}
                    id="account_holder"
                    {...register("account_holder")}
                    placeholder="Account Holder Name"
                    tabIndex="8"
                  />
                  <label htmlFor="account_holder">Account Holder Name</label>
                  {errors.account_holder && (
                    <div className="invalid-feedback">
                      {errors.account_holder.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.bank_name ? "is-invalid" : ""
                    }`}
                    id="bank_name"
                    {...register("bank_name")}
                    placeholder="Bank Name"
                    tabIndex="9"
                  />
                  <label htmlFor="bank_name">Bank Name</label>
                  {errors.bank_name && (
                    <div className="invalid-feedback">
                      {errors.bank_name.message}
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
                    className={`form-control ${
                      errors.bank_account_no ? "is-invalid" : ""
                    }`}
                    id="bank_account_no"
                    {...register("bank_account_no")}
                    placeholder="Bank Account No:"
                    tabIndex="11"
                  />
                  <label htmlFor="bank_account_no">Bank Account No:</label>
                  {errors.bank_account_no && (
                    <div className="invalid-feedback">
                      {errors.bank_account_no.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.branch ? "is-invalid" : ""
                    }`}
                    id="branch"
                    {...register("branch")}
                    placeholder="Branch"
                    tabIndex="12"
                  />
                  <label htmlFor="branch">Branch</label>
                  {errors.branch && (
                    <div className="invalid-feedback">
                      {errors.branch.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.upi_id ? "is-invalid" : ""
                    }`}
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
                    name="account_type"
                    control={control}
                    rules={{ required: "Account Type is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={accountTypes}
                        tabIndex="15"
                        className={`basic-single ${
                          errors.account_type ? "is-invalid" : ""
                        }`}
                        classNamePrefix="select"
                        isClearable={true}
                        isSearchable={true}
                        placeholder="Select Account Type"
                        value={
                          accountTypes.find(
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
                  {errors.account_type && (
                    <div className="invalid-feedback">
                      {errors.account_type.message}
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
                  Update
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

export default EditAffiliate;
