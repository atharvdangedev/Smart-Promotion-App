import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Loader2,
  Mail,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { RegistrationSchema } from "../utils/validationSchema";
import Header from "./Header";
import Footer from "./Footer";
import { useTransition } from "react";
import { useMutation } from "@tanstack/react-query";
import { evaluatePasswordStrength } from "@/utils/evaluatePasswordStrength";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";
import PasswordInput from "./password-input";
import { Button } from "./ui/button";
import FormField from "./form-field";

const Registration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: yupResolver(RegistrationSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      contact_no: "",
      password: "",
      cnfPassword: "",
    },
  });

  const {
    watch,
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const password = watch("password");
  const cnfPassword = watch("cnfPassword");
  const passwordStrength = evaluatePasswordStrength(password);

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/vendor-register`,
        {
          method: "POST",
          body: formData,
          headers: {
            "X-App-Secret": `${import.meta.env.VITE_SECRET_KEY}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to register");
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast.success(data.message);
      startTransition(() => {
        const plan = location.state?.plan;
        const token = data.token;
        const user = data.user;
        sessionStorage.setItem(
          "checkout_state",
          JSON.stringify({ plan, token, user })
        );
        navigate("/checkout", {
          state: {
            plan,
            token,
            user,
          },
          replace: true,
        });
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred");
    },
  });

  const onSubmit = (values) => {
    const formData = new FormData();
    formData.append("first_name", values.firstname);
    formData.append("last_name", values.lastname);
    formData.append("email", values.email);
    formData.append("contact_no", values.contact_no);
    formData.append("password", values.password);
    startTransition(() => {
      mutation.mutate(formData);
    });
  };

  return (
    <>
      <Header />

      <div className="bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Vendor Registration
            </h2>
            <div className="mt-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-md text-center">
              <p className="text-sm">
                Please create an account to connect your plan purchase to your
                profile.
              </p>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            <FormField
              label="First Name"
              htmlFor="firstname"
              required
              error={errors.firstname?.message}
            >
              <div className="relative">
                <input
                  type="text"
                  id="firstname"
                  {...register("firstname")}
                  autoComplete="given-name"
                  className={`w-full px-4 py-3 pl-12 border ${
                    errors.firstname ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C6EA5] focus:border-transparent transition-colors`}
                  placeholder="Enter your first name"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <User className="w-4 h-4 text-[#646263]" />
                </div>
              </div>
            </FormField>

            <FormField
              label="Last Name"
              htmlFor="lastname"
              required
              error={errors.lastname?.message}
            >
              <div className="relative">
                <input
                  type="text"
                  id="lastname"
                  {...register("lastname")}
                  autoComplete="family-name"
                  className={`w-full px-4 py-3 pl-12 border ${
                    errors.lastname ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C6EA5] focus:border-transparent transition-colors`}
                  placeholder="Enter your last name"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <User className="w-4 h-4 text-[#646263]" />
                </div>
              </div>
            </FormField>

            <FormField
              label="Email Address"
              htmlFor="email"
              required
              error={errors.email?.message}
            >
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  autoComplete="email"
                  className={`w-full px-4 py-3 pl-12 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C6EA5] focus:border-transparent transition-colors`}
                  placeholder="Enter your email address"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Mail className="w-4 h-4 text-[#646263]" />
                </div>
              </div>
            </FormField>

            <FormField
              label="Contact Number"
              htmlFor="contact_no"
              required
              error={errors.contact_no?.message}
            >
              <input
                type="tel"
                id="contact_no"
                inputMode="numeric"
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value
                    .replace(/\D+/g, "")
                    .slice(0, 10);
                }}
                {...register("contact_no")}
                autoComplete="tel"
                className={`w-full px-4 py-3 border ${
                  errors.contact_no ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C6EA5] focus:border-transparent transition-colors`}
                placeholder="Enter your contact number"
              />
            </FormField>

            <FormField
              label="Password"
              htmlFor="password"
              required
              error={errors.password?.message}
            >
              <PasswordInput
                id="password"
                {...register("password")}
                placeholder="Create a strong password"
                autoComplete="new-password"
                className={`${errors.password ? "border-red-500" : ""}`}
              />
              {password && (
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#646263]">
                      Password strength:
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        passwordStrength.isStrong
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {passwordStrength.isStrong ? "Strong" : "Weak"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength.isStrong
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${passwordStrength.isStrong ? 100 : 20}%`,
                      }}
                    />
                  </div>
                  {passwordStrength.errors.length > 0 && (
                    <ul className="text-sm text-red-600 space-y-1">
                      {passwordStrength.errors.map((error, index) => (
                        <li key={index} className="flex items-center">
                          <AlertCircle className="w-3 h-3 mr-2 text-red-500" />
                          {error}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </FormField>

            <FormField
              label="Confirm Password"
              htmlFor="cnfPassword"
              required
              error={errors.cnfPassword?.message}
            >
              <PasswordInput
                id="cnfPassword"
                {...register("cnfPassword")}
                placeholder="Confirm your password"
                autoComplete="new-password"
                className={`${errors.cnfPassword ? "border-red-500" : ""}`}
              />
              {cnfPassword &&
                password === cnfPassword &&
                !errors.cnfPassword && (
                  <p className="text-sm text-green-600 flex items-center mt-2">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Passwords match
                  </p>
                )}
              {cnfPassword &&
                password !== cnfPassword &&
                !errors.cnfPassword && (
                  <p className="text-sm text-red-600 flex items-center mt-2">
                    <XCircle className="w-4 h-4 mr-1" />
                    Passwords do not match
                  </p>
                )}
            </FormField>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-[#1C6EA5] hover:bg-[#FF5604] text-white py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending || mutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Registration;
