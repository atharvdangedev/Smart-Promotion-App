import Toast from 'react-native-toast-message';

export const handleApiSuccess = (
  message = 'Operation successful',
  context = '',
) => {
  let title = 'Success';
  if (context) {
    title = `${context} Successful`;
  }

  Toast.show({
    type: 'success',
    text1: title,
    text2: message,
  });
};
