import toast from "react-hot-toast";

export const handleApiError = (
  error,
  operation = "performing",
  module = "operation"
) => {
  const errorMessage = error.response?.data?.message;

  let formattedMessage = "Unknown error";

  if (errorMessage && typeof errorMessage === "object") {
    const errorMessages = Object.values(errorMessage).join(", ");
    formattedMessage = errorMessages;
  } else if (typeof errorMessage === "string") {
    formattedMessage = errorMessage;
  } else if (error.request) {
    toast.error("No response from server. Please try again.");
    return;
  } else if (error.message) {
    formattedMessage = error.message;
  }

  toast.error(`Error ${operation} ${module}: ${formattedMessage}`);
};
