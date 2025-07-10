import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { handleApiError } from "../utils/handleApiError";
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
  address: yup.string().notRequired(),
});

const EditAgent = () => {
  // Navigate function
  const navigate = useNavigate();

  const location = useLocation();

  const { agentId } = useParams();

  // Access token
  const { token, user } = useSelector((state) => state.auth);

  // API URLs
  const APP_URL = import.meta.env.VITE_API_URL;
  const Img_url = import.meta.env.VITE_IMG_URL;

  // State initialization
  const [vendorId, setVendorId] = useState("");
  const [userId, setUserId] = useState("");
  const profilePicRef = useRef();
  const [firstName, setFirstName] = useState("");
  const [profilePicPreview, setProfilePicPreview] = useState(null);

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

  const handleProfilePic = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (location.state) {
      const { firstname, vendorId, userId } = location.state;
      setVendorId(vendorId);
      setUserId(userId);
      setFirstName(firstname);
    }
  }, [location.state]);

  //fetch agent data
  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const res = await axios.get(
          `${APP_URL}/${user.rolename}/agents/${agentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (res.status === 200) {
          setValue("firstname", res.data.agent.first_name);
          setValue("lastname", res.data.agent.last_name);
          setValue("address", res.data.agent.address);
          setValue("email", res.data.agent.email);
          setValue("contact_no", res.data.agent.contact_no);
          setValue("old_profile_pic", res.data.agent.profile_pic);

          // Set profile image if available
          if (res.data.agent.profile_pic) {
            setValue("profile_pic", res.data.agent.profile_pic);
            setProfilePicPreview(
              `${Img_url}/profile/${res.data.agent.profile_pic}`
            );
          }
        }
      } catch (error) {
        handleApiError(error, "fetching", "agent details");
      }
    };
    if (userId) fetchAgent();
  }, [userId, token, APP_URL, Img_url, setValue, user.rolename, agentId]);

  // Handle submit
  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("vendor_id", vendorId);
    formData.append("first_name", data.firstname);
    formData.append("last_name", data.lastname);
    formData.append("address", data.address);
    formData.append("email", data.email);
    formData.append("contact_no", data.contact_no);
    if (data.profile_pic && data.profile_pic[0] instanceof File)
      formData.append("profile_pic", data.profile_pic[0]);
    if (data.old_profile_pic)
      formData.append("old_profile_pic", data.old_profile_pic);

    try {
      const res = await axios.post(
        `${APP_URL}/${user.rolename}/agents/${agentId}`,
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
          navigate(`/admin/vendor/agents/${vendorId}`, {
            state: { userId },
          });
        }, 2000);
      }
    } catch (error) {
      handleApiError(error, "updating", "agent");
    }
  };

  // Handle cancel
  const handleCancel = () => {
    reset();
    navigate(`/admin/vendor/agents/${vendorId}`, {
      state: { userId },
    });
  };

  return (
    <div className="px-4 py-3 page-body">
      <Toaster />
      <div className="card">
        <div className="card-header py-3 bg-transparent border-bottom-0">
          <h4 className="title-font mt-2 mb-0">
            <strong>Edit Agent {firstName}</strong>
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
              <div className="col-md-4">
                <div className="form-floating">
                  <textarea
                    type="text"
                    className={`form-control ${
                      errors.address ? "is-invalid" : ""
                    }`}
                    id="address"
                    {...register("address")}
                    placeholder="Address"
                    tabIndex="8"
                  />
                  <label htmlFor="address">Address</label>
                  {errors.address && (
                    <div className="invalid-feedback">
                      {errors.address.message}
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

export default EditAgent;
