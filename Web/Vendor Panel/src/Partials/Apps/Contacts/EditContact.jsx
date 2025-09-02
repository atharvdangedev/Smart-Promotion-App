import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { handleApiError } from "../utils/handleApiError";
import { useSelector } from "react-redux";
import { setPageTitle } from "../utils/docTitle";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Schema definition
const schema = yup.object().shape({
  contact_name: yup
    .string()
    .min(2, "Minimum 2 characters required.")
    .max(50, "Maximum 50 characters allowed.")
    .required("Contact name is required"),
  email: yup
    .string()
    .required("Email is required")
    .matches(emailRegex, "Invalid email note"),
  contact_number: yup
    .string()
    .min(10, "Contact number must be minimun 10 digits")
    .required("Contact number is required"),
  label: yup.string().notRequired(),
  note: yup.string().notRequired(),
});

const EditContact = () => {
  // Navigate function
  const navigate = useNavigate();

  const location = useLocation();

  const { contactId } = useParams();

  // Access token
  const { token, user } = useSelector((state) => state.auth);

  // API URLs
  const APP_URL = import.meta.env.VITE_API_URL;
  const Img_url = import.meta.env.VITE_IMG_URL;

  const profilePicRef = useRef();
  const [firstName, setFirstName] = useState("");
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  useEffect(() => {
    if (location.state) {
      const { firstname } = location.state;
      setFirstName(firstname);
    }
  }, [location.state]);

  setPageTitle("Edit Contact: " + firstName + " | Vendor Panel");

  const handleProfilePic = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  // Use form initialization
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

  //fetch contact data
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await axios.get(
          `${APP_URL}/${user.rolename}/contacts/${contactId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (res.status === 200) {
          setValue("contact_name", res.data.contact.contact_name);
          setValue("email", res.data.contact.email);
          setValue("contact_number", res.data.contact.contact_number);
          setValue("label", res.data.contact.label);
          setValue("note", res.data.contact.note);

          // Set profile image if available
          if (res.data.contact.image) {
            setValue("image", res.data.contact.image);
            setProfilePicPreview(
              `${Img_url}/contacts/${res.data.contact.image}`
            );
          }
        }
      } catch (error) {
        handleApiError(error, "fetching", "contact details");
      }
    };
    fetchContact();
  }, [token, APP_URL, setValue, user.rolename, contactId, Img_url]);

  // Handle submit
  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("vendor_id", user?.id);
    formData.append("contact_name", data.contact_name);
    formData.append("email", data.email);
    formData.append("contact_number", data.contact_number);
    formData.append("label", data.label);
    formData.append("note", data.note);
    if (data.image && data.image[0] instanceof File)
      formData.append("image", data.image[0]);
    // if (data.old_image)
    //   formData.append("old_image", data.old_image);

    try {
      const res = await axios.post(
        `${APP_URL}/${user.rolename}/contacts/${contactId}`,
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
          navigate(`/contacts`);
        }, 2000);
      }
    } catch (error) {
      handleApiError(error, "updating", "contact");
    }
  };

  // Handle cancel
  const handleCancel = () => {
    reset();
    navigate(`/contacts`);
  };

  return (
    <div className="px-4 py-3 page-body">
      <Toaster />
      <div className="card">
        <div className="card-header py-3 bg-transparent border-bottom-0">
          <h4 className="title-font mt-2 mb-0">
            <strong>Edit Contact {firstName}</strong>
          </h4>
          <button className="btn btn-info text-white" onClick={handleCancel}>
            Back
          </button>
        </div>
        <div className="card-body card-main-one">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.contact_name ? "is-invalid" : ""
                    }`}
                    id="contact_name"
                    {...register("contact_name")}
                    placeholder="Contact Name"
                    tabIndex="1"
                  />
                  <label htmlFor="contact_name">Contact Name</label>
                  {errors.contact_name && (
                    <div className="invalid-feedback">
                      {errors.contact_name.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type="text"
                    className={`form-control ${
                      errors.label ? "is-invalid" : ""
                    }`}
                    id="label"
                    {...register("label")}
                    placeholder="Last Name"
                    tabIndex="2"
                  />
                  <label htmlFor="label">Label/Tag</label>
                  {errors.label && (
                    <div className="invalid-feedback">
                      {errors.label.message}
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
                      errors.contact_number ? "is-invalid" : ""
                    }`}
                    id="contact_number"
                    {...register("contact_number")}
                    placeholder="Contact"
                    tabIndex="4"
                  />
                  <label htmlFor="contact_number">Contact Number</label>
                  {errors.contact_number && (
                    <div className="invalid-feedback">
                      {errors.contact_number.message}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-floating">
                  <textarea
                    type="text"
                    className={`form-control ${
                      errors.note ? "is-invalid" : ""
                    }`}
                    id="note"
                    {...register("note")}
                    placeholder="note"
                    tabIndex="8"
                  />
                  <label htmlFor="note">Note</label>
                  {errors.note && (
                    <div className="invalid-feedback">
                      {errors.note.message}
                    </div>
                  )}
                </div>
              </div>
              {profilePicPreview && (
                <div className="col-md-1">
                  <img
                    src={profilePicPreview}
                    alt="Contact Picture"
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
                      errors.image ? "is-invalid" : ""
                    }`}
                    id="image"
                    {...register("image")}
                    accept="image/*"
                    onChange={handleProfilePic}
                    tabIndex="5"
                  />
                  <label htmlFor="image">Contact Picture (Optional)</label>
                  {errors.image && (
                    <div className="invalid-feedback">
                      {errors.image.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12">
                <button
                  tabIndex="10"
                  className="me-1 btn btn-primary"
                  type="submit"
                >
                  Update
                </button>
                <button
                  tabIndex="11"
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

export default EditContact;
