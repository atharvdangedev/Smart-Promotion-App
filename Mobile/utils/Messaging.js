import { Linking } from 'react-native';

export const openWhatsApp = async (number, templateMessage) => {
  const url = `whatsapp://send?phone=${number}&text=${encodeURIComponent(
    templateMessage,
  )}`;
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(
        'WhatsApp is not installed on this device. Opening web link.',
      );
      await Linking.openURL(
        `https://wa.me/${number}?text=${encodeURIComponent(templateMessage)}`,
      );
    }
  } catch (error) {
    console.error('An error occurred while trying to open WhatsApp:', error);
  }
};

export const openSMS = async (number, templateMessage) => {
  const url = `sms:${number}?body=${encodeURIComponent(templateMessage)}`;
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.error('SMS functionality is not supported on this device.');
    }
  } catch (error) {
    console.error('An error occurred while trying to open SMS:', error);
  }
};
