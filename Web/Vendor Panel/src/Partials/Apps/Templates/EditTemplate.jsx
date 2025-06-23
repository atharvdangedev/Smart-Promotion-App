import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { handleApiError } from "../utils/handleApiError";

// Schema initialization
const schema = yup.object().shape({
  title: yup
    .string()
    .required("Template Name is required")
    .min(3, "Minimum 3 characters required.")
    .max(200, "Maximum 200 characters allowed."),
  template_slug: yup
    .string()
    .required("Template slug is required")
    .min(3, "Minimum 3 characters required.")
    .max(200, "Maximum 200 characters allowed."),
});

const EditTemplate = () => {
  // Navigation function
  const navigate = useNavigate();

  // Access token
  const token = localStorage.getItem("jwtToken");

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;

  const { templateName, templateId } = useParams();

  // useForm hook initialization
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  //fetch area details
  useEffect(() => {
    const fetchTemplateDetails = async () => {
      try {
        const response = await axios.get(
          `${APP_URL}/template-details/${templateId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 200) {
          const templateData = response.data.Templates;
          reset({
            title: templateData.title,
            template_slug: templateData.template_slug,
          });
        }
      } catch (error) {
        handleApiError(error, "fetching", "template details");
      }
    };

    fetchTemplateDetails();
  }, [APP_URL, reset, templateId, token]);

  // Handle submit
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("template_slug", data.template_slug);

    try {
      const res = await axios.post(
        `${APP_URL}/edit-template/${templateId}`,
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
          navigate("/admin/templates");
        }, 2000);
      }
    } catch (error) {
      handleApiError(error, "updating", "template");
    }
  };

  // Handle cancel
  const handleCancel = () => {
    reset();
    navigate("/admin/templates");
  };

  return (
    <div className="px-4 py-3 page-body">
      <Toaster />
      <div className="card">
        <div className="card-header py-3 bg-transparent border-bottom-0">
          <h4 className="title-font mt-2 mb-0">
            <strong>Edit Template {templateName}</strong>
          </h4>
          <Link className="btn btn-info text-white" to="/admin/templates">
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
                    className={`form-control ${errors.title ? "is-invalid" : ""}`}
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
                  <input
                    type="text"
                    className={`form-control ${errors.template_slug ? "is-invalid" : ""}`}
                    {...register("template_slug")}
                    placeholder="Template slug"
                    tabIndex="2"
                  />
                  <label htmlFor="template_slug" className="col-form-label">
                    Template Slug
                  </label>
                  <small className="form-text text-muted">
                    Slug should be unique, lowercase and without spaces, only
                    underscores
                  </small>
                  <p className="px-1 mb-0 fst-italic text-dark mt-2">
                    <a
                      href="https://smartmeta.vercel.app/smart-tools/slug-generator"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-decoration-underline"
                    >
                      You can use our slug generator to generate slug
                    </a>
                  </p>
                  {errors.template_slug && (
                    <div className="invalid-feedback">
                      {errors.template_slug.message}
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

export default EditTemplate;
