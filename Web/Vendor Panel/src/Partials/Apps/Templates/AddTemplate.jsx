import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { handleApiError } from "../utils/handleApiError";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Schema initialization
const schema = yup.object().shape({
  title: yup
    .string()
    .required("Template Name is required")
    .min(3, "Minimum 3 characters required.")
    .max(200, "Maximum 200 characters allowed."),
  description: yup
    .string()
    .required("Template Description is required")
    .min(3, "Minimum 3 characters required.")
    .max(700, "Maximum 700 characters allowed."),
  type: yup
    .string()
    .required("Template Type is required")
    .min(3, "Minimum 3 characters required.")
    .max(50, "Maximum 50 characters allowed."),
});

const AddTemplate = () => {
  // Navigation function
  const navigate = useNavigate();

  // Access token
  const token = localStorage.getItem("jwtToken");

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;

  const types = [
    { value: "incoming", label: "Incoming" },
    { value: "outgoing", label: "Outgoing" },
    { value: "missed", label: "Missed" },
    { value: "rejected", label: "Rejected" },
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

  // useForm hook initialization
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  // Handle submit
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("template_type", data.type);

    try {
      const res = await axios.post(`${APP_URL}/vendor/templates`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 201) {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/templates");
        }, 2000);
      }
    } catch (error) {
      handleApiError(error, "adding", "template");
    }
  };

  // Handle cancel
  const handleCancel = () => {
    reset();
    navigate("/templates");
  };

  return (
    <div className="px-4 py-3 page-body">
      <Toaster />
      <div className="card">
        <div className="card-header py-3 bg-transparent border-bottom-0">
          <h4 className="title-font mt-2 mb-0">
            <strong>Add New Template</strong>
          </h4>
          <Link className="btn btn-info text-white" to="/templates">
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
                      errors.title ? "is-invalid" : ""
                    }`}
                    {...register("title")}
                    placeholder="Template Name"
                    tabIndex="1"
                  />
                  <label htmlFor="title" className="col-form-label">
                    Template Name
                  </label>
                  {errors.title && (
                    <div className="invalid-feedback">
                      {errors.title.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating">
                  <Controller
                    name="type"
                    control={control}
                    rules={{ required: "Template Type is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={types}
                        tabIndex="2"
                        className={`basic-single ${
                          errors.type ? "is-invalid" : ""
                        }`}
                        classNamePrefix="select"
                        isClearable={true}
                        isSearchable={true}
                        placeholder="Select template type"
                        value={
                          types.find((type) => type.value === field.value) ||
                          null
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
                  {errors.type && (
                    <div className="invalid-feedback">
                      {errors.type.message}
                    </div>
                  )}
                </div>
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
                        placeholder="Enter template description..."
                        modules={modules}
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        tabIndex="3"
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
              <div className="col-12">
                <button
                  tabIndex="3"
                  className="me-1 btn btn-primary"
                  type="submit"
                >
                  Add Template
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

export default AddTemplate;
