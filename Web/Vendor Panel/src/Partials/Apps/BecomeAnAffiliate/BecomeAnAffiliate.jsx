/* eslint-disable react/prop-types */
/* eslint-disable no-useless-escape */
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select from "react-select";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { handleApiError } from "../utils/handleApiError";
import { logoutUser } from "../../../Redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
// const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const accountNumberRegex = /^[0-9]{9,18}$/;
const upiRegex = /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/;

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

const BecomeAnAffiliate = ({ setIsModalOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const APP_URL = import.meta.env.VITE_API_URL;

  const { user: userData = {}, token } = useSelector((state) => state.auth);

  const [isUpdating, setIsUpdating] = useState(false);

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

  // Use form initialisation
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(affiliateSchema),
  });

  const handleLogout = async () => {
    try {
      const resultAction = await dispatch(logoutUser());

      if (logoutUser.fulfilled.match(resultAction)) {
        toast.success("Logged out successfully!");
        setTimeout(() => {
          navigate("/signin", { replace: true });
        }, 2000);
      } else if (logoutUser.rejected.match(resultAction)) {
        toast.error(resultAction.payload || "Logout failed!");
        console.error("Logout failed:", resultAction.payload);
      }
    } catch (error) {
      toast.error("An unexpected error occurred during logout.");
      console.error("Unexpected error during logout:", error);
    }
  };

  const onSubmit = async (data) => {
    setIsUpdating(true);
    const formData = new FormData();
    formData.append("account_holder", data.account_holder);
    formData.append("account_type", data.account_type);
    formData.append("bank_name", data.bank_name);
    formData.append("bank_account_no", data.bank_account_no);
    formData.append("branch", data.branch);
    formData.append("upi_id", data.upi_id);
    if (data.gst_number) formData.append("gst_number", data.gst_number);

    try {
      const res = await axios.post(
        `${APP_URL}/${userData?.rolename}/become-an-affiliate`,
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
        await handleLogout();
      }
    } catch (error) {
      handleApiError(error, "in becoming", `an affiliate`);
    } finally {
      setIsUpdating(false);
      setIsModalOpen(false);
      reset();
    }
  };

  const handleCancel = () => {
    reset();
    setIsModalOpen(false);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header border-bottom-0">
            <button
              type="button"
              className="btn-close"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close"
            />
          </div>

          <div className="modal-body pt-0">
            <h4 className="title-font">Become An Affiliate</h4>
            <p>Please fill up the following extra information</p>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row g-3">
                <div className="col-md-6">
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

                <div className="col-md-6">
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

                <div className="col-md-6">
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

                <div className="col-md-6">
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

                <div className="col-md-6">
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

                <div className="col-md-6">
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

                <div className="col-md-6">
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
                    className="me-1 btn btn-primary"
                    type="submit"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Processing..." : "Submit Details"}
                  </button>
                  <button
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
    </div>
  );
};

export default BecomeAnAffiliate;
