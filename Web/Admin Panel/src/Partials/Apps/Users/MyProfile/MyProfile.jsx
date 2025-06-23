import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import UploadProgress from "../../utils/UploadProgress";
import { handleApiError } from "../../utils/handleApiError";

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
  role: yup.string().required("User role is required"),
});

const MyProfile = () => {
  // Access token
  const token = localStorage.getItem("jwtToken");

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;
  const Img_url = import.meta.env.VITE_IMG_URL;

  // User details from token
  const decoded = jwtDecode(token);
  const { user_id } = decoded.data;

  // State initialisation
  const [uploadProgress, setUploadProgress] = useState(0);
  const [userData, setUserData] = useState({});
  const [updated, setUpdated] = useState(false);
  const fileInputRef = useRef(null);

  // Use form initialisation
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  //fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${APP_URL}/user-details/${user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.status === 200) {
          setUserData(res.data.user);
          setValue("firstname", res.data.user.firstname);
          setValue("lastname", res.data.user.lastname);
          setValue("email", res.data.user.email);
          setValue("role", res.data.user.role);
          setValue("role_id", res.data.user.role_id);
          setValue("contact_no", res.data.user.contact_no);
          setValue("old_profile_pic", res.data.user.profile_pic);
        }
      } catch (error) {
        handleApiError(error, "fetching", "user details");
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_id, token, updated, APP_URL]);

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

    if (data.firstname) formData.append("firstname", data.firstname);
    if (data.lastname) formData.append("lastname", data.lastname);
    if (data.email) formData.append("email", data.email);
    if (data.contact_no) formData.append("contact_no", data.contact_no);
    if (data.old_profile_pic)
      formData.append("old_profile_pic", data.old_profile_pic);
    formData.append("role", data.role_id);

    try {
      const res = await axios.post(
        `${APP_URL}/edit-user/${user_id}`,
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
        setUpdated(true);
      }
    } catch (error) {
      handleApiError(error, "updating", "user");
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
                  border: "0.5px solid #5bc43a",
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
            <div className="media-body ms-md-5 m-0 mt-4 mt-md-0 text-md-start text-center">
              <h4 className="mb-1">
                {userData.firstname} {userData.lastname}
              </h4>
              <p>{userData.email}</p>
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
              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    style={{ cursor: "not-allowed" }}
                    disabled
                    {...register("role")}
                    placeholder="Role"
                    tabIndex="5"
                  />
                  <label htmlFor="role">Role</label>
                </div>
              </div>
              <div className="col-12">
                <button
                  tabIndex="6"
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
