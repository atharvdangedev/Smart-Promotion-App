import Toast from 'react-native-toast-message';

export const handleApiError = (
  error,
  operation = 'performing',
  module = 'operation',
) => {
  const errorMessage = error?.response?.data?.message;

  let formattedMessage = 'Unknown error';

  if (errorMessage && typeof errorMessage === 'object') {
    const errorMessages = Object.values(errorMessage).join(', ');
    formattedMessage = errorMessages;
  } else if (typeof errorMessage === 'string') {
    formattedMessage = errorMessage;
  } else if (error?.request) {
    Toast.show({
      type: 'error',
      text1: 'Network Error',
      text2: 'No response from server. Please try again.',
    });
    return;
  } else if (error?.message) {
    formattedMessage = error.message;
  }

  Toast.show({
    type: 'error',
    text1: `Error ${operation} ${module}`,
    text2: formattedMessage,
  });
};
