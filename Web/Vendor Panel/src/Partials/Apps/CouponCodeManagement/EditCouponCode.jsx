import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { handleApiError } from "../utils/handleApiError";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "./datepicker.css";
import "react-datepicker/dist/react-datepicker.css";
import { setPageTitle } from "../utils/docTitle";

// Schema initialization
const schema = yup.object().shape({
  coupon_code: yup
    .string()
    .required("Coupon Name is required")
    .min(3, "Minimum 3 characters required.")
    .max(200, "Maximum 200 characters allowed."),
  description: yup
    .string()
    .required("Coupon Description is required")
    .min(3, "Minimum 3 characters required.")
    .max(500, "Maximum 500 characters allowed."),
  plan_id: yup.string().required("Plan Type is required"),
  discount_type: yup.string().required("Discount Type is required"),
  discount: yup.string().required("Discount is required"),
  is_recurring: yup.boolean().required("Is recurring is required"),
  valid_from: yup.date().required("Coupon validity start date is required"),
  valid_till: yup.date().required("Coupon validity end date is required"),
});

const EditCouponCode = () => {
  // Navigation function
  const navigate = useNavigate();
  const location = useLocation();

  // Access token
  const token = localStorage.getItem("jwtToken");

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;

  const { couponId } = useParams();

  const [plans, setPlans] = useState([]);
  const [couponName, setCouponName] = useState("");

  setPageTitle("Edit Coupon Code " + couponName + " | Vendor Panel");

  const discountOptions = [
    { value: "percent", label: "Percentage" },
    { value: "flat", label: "Flat" },
  ];

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  useEffect(() => {
    if (location.state) {
      setCouponName(location.state.couponName);
    }
  }, [location.state]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  //fetch plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get(`${APP_URL}/affiliate/active-plans`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json;",
          },
        });
        if (response.status === 200) {
          const planOptions = response.data.active_plans.map((plan) => ({
            value: plan.id,
            label: plan.title,
          }));
          setPlans(planOptions);
        }
      } catch (error) {
        handleApiError(error, "fetching", "active plans");
      }
    };

    fetchPlans();
  }, [APP_URL, token]);

  //fetch area details
  useEffect(() => {
    const fetchCouponDetails = async () => {
      try {
        const response = await axios.get(
          `${APP_URL}/affiliate/coupons/${couponId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          const couponData = response.data.coupon;
          setValue("coupon_code", couponData.coupon_code);
          setValue("description", couponData.description);
          setValue("plan_id", couponData.plan_id);
          setValue("discount_type", couponData.discount_type);
          setValue("discount", couponData.discount);
          setValue("is_recurring", Number(couponData.is_recurring));
          setValue(
            "valid_from",
            couponData.valid_from ? new Date(couponData.valid_from) : null
          );
          setValue(
            "valid_till",
            couponData.valid_till ? new Date(couponData.valid_till) : null
          );
        }
      } catch (error) {
        handleApiError(error, "fetching", "coupon details");
      }
    };

    fetchCouponDetails();
  }, [APP_URL, couponId, reset, setValue, token]);

  // Handle cancel
  const handleCancel = () => {
    reset();
    navigate("/coupon-codes");
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("coupon_code", data.coupon_code);
      formData.append("description", data.description);
      formData.append("plan_id", data.plan_id);
      formData.append("discount_type", data.discount_type);
      formData.append("discount", data.discount);
      formData.append("is_recurring", data.is_recurring ? 1 : 0);
      formData.append(
        "valid_from",
        data.valid_from.toISOString().split("T")[0]
      );
      formData.append(
        "valid_till",
        data.valid_till.toISOString().split("T")[0]
      );
      const response = await axios.post(
        `${APP_URL}/affiliate/coupons/${couponId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/coupon-codes");
        }, 2000);
      }
    } catch (error) {
      handleApiError(error, "adding", "coupon code");
    }
  };

  const ReactSelectStyles = {
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
  };

  return (
    <div className="px-4 py-3 page-body">
      <Toaster />
      <div className="card">
        <div className="card-header py-3 bg-transparent border-bottom-0">
          <h4 className="title-font mt-2 mb-0">
            <strong>Edit Coupon {couponName}</strong>
          </h4>
          <Link className="btn btn-info text-white" to="/coupon-codes">
            Back
          </Link>
        </div>
        <div className="card-body card-main-one">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.coupon_code ? "is-invalid" : ""
                    }`}
                    {...register("coupon_code")}
                    placeholder="Coupon Name"
                    tabIndex="1"
                  />
                  <label htmlFor="coupon_code" className="col-form-label">
                    Coupon Name
                  </label>
                  {errors.coupon_code && (
                    <div className="invalid-feedback">
                      {errors.coupon_code.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <Controller
                    name="plan_id"
                    control={control}
                    rules={{ required: "Plan Type is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={plans}
                        tabIndex="4"
                        className={`basic-single ${
                          errors.plan_id ? "is-invalid" : ""
                        }`}
                        classNamePrefix="select"
                        isClearable={true}
                        isSearchable={true}
                        placeholder="Select plan type"
                        value={
                          plans.find((type) => type.value === field.value) ||
                          null
                        }
                        onChange={(selectedOption) =>
                          field.onChange(
                            selectedOption ? selectedOption.value : ""
                          )
                        }
                        styles={ReactSelectStyles}
                      />
                    )}
                  />
                  {errors.plan_id && (
                    <div className="invalid-feedback">
                      {errors.plan_id.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <Controller
                    name="discount_type"
                    control={control}
                    rules={{ required: "Discount Type is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={discountOptions}
                        tabIndex="2"
                        className={`basic-single ${
                          errors.discount_type ? "is-invalid" : ""
                        }`}
                        classNamePrefix="select"
                        isClearable={true}
                        isSearchable={true}
                        placeholder="Select Discount type"
                        value={
                          discountOptions.find(
                            (type) => type.value === field.value
                          ) || null
                        }
                        onChange={(selectedOption) =>
                          field.onChange(
                            selectedOption ? selectedOption.value : ""
                          )
                        }
                        styles={ReactSelectStyles}
                      />
                    )}
                  />
                  {errors.discount_type && (
                    <div className="invalid-feedback">
                      {errors.discount_type.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    maxLength={5}
                    inputMode="decimal"
                    onInput={(e) => {
                      e.target.value = e.target.value
                        .replace(/[^0-9.]/g, "") // Allow only digits and a decimal point
                        .replace(/(\..*)\./g, "$1") // Prevent multiple decimals
                        .replace(/^0+(?=\d)/, "") // Prevent leading zeros like 007 -> 7
                        .replace(/(\.\d{2})\d+/, "$1"); // Allow only up to 2 decimal places
                    }}
                    className={`form-control ${
                      errors.discount ? "is-invalid" : ""
                    }`}
                    id="discount"
                    {...register("discount")}
                    placeholder="Discount"
                  />
                  <label htmlFor="discount">Discount</label>
                  {errors.discount && (
                    <div className="invalid-feedback">
                      {errors.discount.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Date</label>
                <Controller
                  control={control}
                  name="valid_from"
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      minDate={new Date()}
                      dateFormat="yyyy-MM-dd"
                      className={`form-control ${
                        errors.valid_from ? "is-invalid" : ""
                      }`}
                      placeholderText="Select a valid from date"
                    />
                  )}
                />
                {errors.valid_from && (
                  <div className="text-danger">{errors.valid_from.message}</div>
                )}
              </div>

              <div className="col-md-6">
                <label className="form-label">Date</label>
                <Controller
                  control={control}
                  name="valid_till"
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      minDate={new Date()}
                      dateFormat="yyyy-MM-dd"
                      className={`form-control ${
                        errors.valid_till ? "is-invalid" : ""
                      }`}
                      placeholderText="Select a valid till date"
                    />
                  )}
                />
                {errors.valid_till && (
                  <div className="text-danger">{errors.valid_till.message}</div>
                )}
              </div>

              <div className="col-md-12">
                <Controller
                  name="description"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <ReactQuill
                        theme="snow"
                        placeholder="Enter Coupon description..."
                        modules={modules}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        tabIndex="2"
                        className={errors.description ? "is-invalid" : ""}
                      />
                      {errors.description && (
                        <div className="invalid-feedback">
                          {errors.description.message}
                        </div>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="col-md-6">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className={`form-check-input ${
                      errors.is_recurring ? "is-invalid" : ""
                    }`}
                    {...register("is_recurring")}
                    placeholder="Is Recurring"
                    tabIndex="1"
                  />
                  <label
                    htmlFor="is_recurring"
                    className="form-check-label fs-6"
                  >
                    Is Recurring
                  </label>
                  {errors.is_recurring && (
                    <div className="text-danger">
                      {errors.is_recurring.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-12">
                <button
                  tabIndex="3"
                  className="me-1 btn btn-primary"
                  type="submit"
                >
                  Update
                </button>
                <button
                  tabIndex="4"
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

export default EditCouponCode;
