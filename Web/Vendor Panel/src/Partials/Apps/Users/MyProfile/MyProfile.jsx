/* eslint-disable no-useless-escape */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { handleApiError } from "../../utils/handleApiError";
import { setPageTitle } from "../../utils/docTitle";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import BecomeAnAffiliate from "../../BecomeAnAffiliate/BecomeAnAffiliate";
import { APP_PERMISSIONS, ROLE_PERMISSIONS } from "../../utils/permissions";

const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
const accountNumberRegex = /^[0-9]{9,18}$/;
const upiRegex = /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Schema definition
const baseSchema = yup.object().shape({
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

  old_profile_pic: yup.string().notRequired(),
});

const vendorSchema = yup.object().shape({
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
});

const affiliateSchema = yup.object().shape({
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
});

const MyProfile = () => {
  setPageTitle("My Profile");

  const dispatch = useDispatch();

  const schemaMap = {
    base: baseSchema,
    vendor: baseSchema.concat(vendorSchema),
    affiliate: baseSchema.concat(affiliateSchema),
  };

  // State initialisation
  const { user: userData = {}, token } = useSelector((state) => state.auth);

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

  // State initialisation
  const profilePicRef = useRef();
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [updated, setUpdated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formKey = userData?.rolename || "base";

  const selectedSchema = useMemo(() => {
    const role = userData?.rolename?.toLowerCase();
    return schemaMap[role] ?? baseSchema;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.rolename]);

  // Use form initialisation
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(selectedSchema),
    key: formKey,
    mode: "onChange",
  });

  /**
   * Checks if the current user has a specific permission.
   * This function remains the same as it checks for *capability*.
   * @param permission The permission string (e.g., APP_PERMISSIONS.BECOME_AN_AFFILIATE).
   * @returns True if the user has the permission, false otherwise.
   */
  const hasPermission = useCallback(
    (permission) => {
      if (!userData || !userData.role) {
        return false;
      }

      const userRoleIds = userData.role
        .split(",")
        .map((id) => parseInt(id.trim(), 10));

      for (const roleId of userRoleIds) {
        const permissionsForRole = ROLE_PERMISSIONS[roleId];
        if (permissionsForRole && permissionsForRole.includes(permission)) {
          return true;
        }
      }
      return false;
    },
    [userData]
  );

  //fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${APP_URL}/${userData?.rolename}/${userData?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (res.status === 200) {
          const user = res.data[userData?.rolename];

          setValue("firstname", user.first_name);
          setValue("lastname", user.last_name);
          setValue("email", user.email);
          setValue("contact_no", user.contact_no);
          setValue("old_profile_pic", user.profile_pic);
          if (user.profile_pic) {
            setValue("profile_pic", user.profile_pic);
            setProfilePicPreview(`${Img_url}/profile/${user.profile_pic}`);
          }

          if (hasPermission(APP_PERMISSIONS.AGENTS_VIEW)) {
            if (user.business_name)
              setValue("business_name", user.business_name);
            if (user.business_email)
              setValue("business_email", user.business_email);
            if (user.business_contact)
              setValue("business_contact", user.business_contact);
            if (user.website) setValue("website_url", user.website);
            if (user.business_address)
              setValue("business_address", user.business_address);
            if (user.business_type)
              setValue("business_type", user.business_type);

            if (user.gst_number) setValue("gst_number", user.gst_number);
          }

          if (hasPermission(APP_PERMISSIONS.COMMISSIONS_VIEW)) {
            if (user.account_holder)
              setValue("account_holder", user.account_holder);
            if (user.account_type) setValue("account_type", user.account_type);
            if (user.bank_name) setValue("bank_name", user.bank_name);
            if (user.bank_account_no)
              setValue("bank_account_no", user.bank_account_no);
            if (user.branch) setValue("branch", user.branch);
            if (user.upi_id) setValue("upi_id", user.upi_id);
            if (user.gst_number) setValue("gst_number", user.gst_number);
          }
        }
      } catch (error) {
        handleApiError(error, "fetching", `${userData?.rolename} details`);
      }
    };

    if (userData?.id) fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    token,
    updated,
    APP_URL,
    setValue,
    Img_url,
    userData?.rolename,
    dispatch,
    userData?.id,
  ]);

  const handleProfilePic = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  /**
   * Determines if the "Become An Affiliate" button should be shown based on specific role conditions.
   * This handles the new business rule.
   * @returns True if the button should be shown, false otherwise.
   */
  const shouldShowBecomeAffiliateButton = () => {
    if (!userData || !userData.role) {
      return false;
    }

    const userRoleIds = userData.role
      .split(",")
      .map((id) => parseInt(id.trim(), 10));

    // Rule 1: User must have exactly one role
    if (userRoleIds.length !== 1) {
      return false;
    }

    const singleRoleId = userRoleIds[0];

    // Rule 2: That single role must be either 5 or 6
    const eligibleSingleRoles = [5, 6];
    if (!eligibleSingleRoles.includes(singleRoleId)) {
      return false;
    }

    // Rule 3: The user must also have the 'BECOME_AN_AFFILIATE' permission
    return hasPermission(APP_PERMISSIONS.BECOME_AN_AFFILIATE);
  };

  // Handle submit
  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("first_name", data.firstname);
    formData.append("last_name", data.lastname);
    formData.append("email", userData.email);
    formData.append("contact_no", data.contact_no);
    formData.append("password", data.password);
    if (data.profile_pic && data.profile_pic[0] instanceof File)
      formData.append("profile_pic", data.profile_pic[0]);

    if (data.old_profile_pic)
      formData.append("old_profile_pic", data.old_profile_pic);

    if (hasPermission(APP_PERMISSIONS.AGENTS_VIEW)) {
      if (data.gst_number) formData.append("gst_number", data.gst_number);
      if (data.business_name)
        formData.append("business_name", data.business_name);
      if (data.website) formData.append("website", data.website_url);
      if (data.business_email)
        formData.append("business_email", data.business_email);
      if (data.business_contact)
        formData.append("business_contact", data.business_contact);

      formData.append("business_address", data.business_address);
      formData.append("business_type", data.business_type);
    }

    if (hasPermission(APP_PERMISSIONS.COMMISSIONS_VIEW)) {
      formData.append("account_holder", data.account_holder);
      formData.append("account_type", data.account_type);
      formData.append("bank_name", data.bank_name);
      formData.append("bank_account_no", data.bank_account_no);
      formData.append("branch", data.branch);
      formData.append("upi_id", data.upi_id);
      if (data.gst_number) formData.append("gst_number", data.gst_number);
    }

    try {
      const res = await axios.post(
        `${APP_URL}/${userData?.rolename}/${userData?.id}`,
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
      handleApiError(error, "updating", `${userData?.rolename}`);
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
                    ? `${Img_url}/profile/${userData?.profile_pic}`
                    : `${Img_url}/default/list/user.webp`
                }
                alt={userData?.first_name || "User profile"}
                className="avatar rounded xl"
                onError={(e) => {
                  e.target.src = `${Img_url}/default/list/user.webp`;
                }}
              />
            </div>
            <div className="media-body ms-md-5 m-0 mt-md-0 text-md-start text-center">
              <h4 className="mb-1 mt-3">
                {userData?.first_name} {userData?.last_name}
              </h4>
              <p>{userData?.email}</p>
              {shouldShowBecomeAffiliateButton() && (
                <div className="col-12">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary"
                  >
                    Become An Affiliate
                  </button>
                </div>
              )}
            </div>
          </div>
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
              {(hasPermission(APP_PERMISSIONS.AGENTS_VIEW) ||
                hasPermission(APP_PERMISSIONS.COMMISSIONS_VIEW)) && (
                <h4 className="mt-4">Additional Information</h4>
              )}

              {hasPermission(APP_PERMISSIONS.AGENTS_VIEW) && (
                <>
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
                        inputMode="numeric"
                        maxLength={15}
                        onInput={(e) =>
                          (e.target.value = e.target.value.replace(/\D+/g, ""))
                        }
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
                </>
              )}

              {hasPermission(APP_PERMISSIONS.COMMISSIONS_VIEW) && (
                <>
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
                      <label htmlFor="account_holder">
                        Account Holder Name
                      </label>
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
                  {!hasPermission(APP_PERMISSIONS.AGENTS_VIEW) && (
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
                  )}
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
                </>
              )}

              <div className="col-12">
                <button
                  type="submit"
                  tabIndex="20"
                  className="me-1 btn btn-primary"
                >
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {isModalOpen && (
        <>
          <div className="modal-backdrop show"></div>

          <BecomeAnAffiliate setIsModalOpen={setIsModalOpen} />
        </>
      )}
    </div>
  );
};

export default MyProfile;
