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
  role: yup.string().required("User role is required"),
  old_profile_pic: yup.string().notRequired(),
  address: yup.string().notRequired(),
});

const EditUser = () => {
  // Navigate function
  const navigate = useNavigate();
  const location = useLocation();

  // Access token
  const token = localStorage.getItem("jwtToken");

  // API URL
  const APP_URL = import.meta.env.VITE_API_URL;
  const Img_url = import.meta.env.VITE_IMG_URL;

  // User details from query string
  const { userId } = useParams();
  const fileInputRef = useRef();

  // State initialisation
  const [profileImage, setProfileImage] = useState(null);
  const [firstName, setFirstName] = useState("");

  const handleProfilePic = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
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
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const formValues = watch();

  //fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${APP_URL}/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.status === 200) {
          setValue("firstname", res.data.user.first_name);
          setValue("lastname", res.data.user.last_name);
          setValue("address", res.data.user.address);
          setValue("email", res.data.user.email);
          setValue("contact_no", res.data.user.contact_no);
          setValue("old_profile_pic", res.data.user.profile_pic);
          setValue("role", res.data.user.role_name);
          setValue("role_id", res.data.user.role);

          // Set profile image if available
          if (res.data.user.profile_pic) {
            setValue("profile_pic", res.data.user.profile_pic);
            setProfileImage(`${Img_url}/profile/${res.data.user.profile_pic}`);
          }
        }
      } catch (error) {
        handleApiError(error, "fetching", "user details");
      }
    };
    fetchUser();
  }, [userId, token, APP_URL, Img_url, setValue]);

  // Handle submit
  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("first_name", data.firstname);
    formData.append("last_name", data.lastname);
    formData.append("address", data.address);
    formData.append("email", data.email);
    formData.append("role", formValues.role_id);
    formData.append("contact_no", data.contact_no);
    if (data.profile_pic && data.profile_pic[0] instanceof File)
      formData.append("profile_pic", data.profile_pic[0]);
    if (data.old_profile_pic)
      formData.append("old_profile_pic", data.old_profile_pic);

    try {
      const res = await axios.post(`${APP_URL}/users/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status === 200) {
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/admin/users");
        }, 2000);
      }
    } catch (error) {
      handleApiError(error, "updating", "user");
    }
  };

  // Handle cancel
  const handleCancel = () => {
    reset();
    navigate("/admin/users");
  };

  return (
    <div className="px-4 py-3 page-body">
      <Toaster />
      <div className="card">
        <div className="card-header py-3 bg-transparent border-bottom-0">
          <h4 className="title-font mt-2 mb-0">
            <strong>Edit {firstName}</strong>
          </h4>
          <Link className="btn btn-info text-white" to="/admin/users">
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
              {profileImage && (
                <div className="col-md-1">
                  <img
                    src={profileImage}
                    alt="User Profile"
                    className="img-thumbnail"
                    style={{ maxWidth: "100%", height: "60px" }}
                    onError={(e) => {
                      e.target.src = `${Img_url}/default/list/user.webp`;
                    }}
                  />
                </div>
              )}
              <div className={`${profileImage ? "col-md-3" : "col-md-4"}`}>
                <div className="form-floating">
                  <input
                    type="file"
                    ref={fileInputRef}
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
                  <input
                    type="text"
                    disabled
                    className={`form-control ${
                      errors.role ? "is-invalid" : ""
                    }`}
                    id="role"
                    {...register("role")}
                    tabIndex="6"
                  />
                  <label htmlFor="Role">Role</label>
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
                    tabIndex="7"
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
                  type="submit"
                  tabIndex="8"
                  className="me-1 btn btn-primary"
                >
                  Update
                </button>
                <button
                  type="button"
                  tabIndex="9"
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

export default EditUser;
