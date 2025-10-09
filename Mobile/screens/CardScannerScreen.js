import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import MLKitOcr from 'react-native-mlkit-ocr';
import { Camera, Upload } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import useThemeColors from '../hooks/useThemeColor';

export default function CardScannerScreen() {
  const navigation = useNavigation();

    const extractPhoneNumbers = rawText => {
  const matches = rawText.match(/(?:\+?\d[\d\s-]{8,15})/g); 
  if (!matches) return [];

  return matches
    .map(num => num.replace(/[^\d]/g, '')) 
    .filter(num =>
      
      (num.length === 10 && /^[6-9]\d{9}$/.test(num)) ||
      
      (num.length === 12 && num.startsWith('91') && /^[6-9]\d{9}$/.test(num.slice(2))) ||
      
      (num.length >= 10 && num.length <= 12 && /^0\d{2,4}\d{6,8}$/.test(num)) ||
      
      (num.length >= 12 && num.startsWith('91') && /^0?\d{2,4}\d{6,8}$/.test(num.slice(2)))
    )
    .map(num => {
      if (num.length === 10) {
        
        return { label: 'mobile', number: `+91${num}` };
      } else if (num.length === 12 && num.startsWith('91')) {

        return { label: 'mobile', number: `+${num}` };
      } else {
        return { label: 'landline', number: num.startsWith('91') ? `+${num}` : `+91${num}` };
      }
    });
};

const extractEmails = rawText => {
  const matches = rawText.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g
  );
  return matches ? [...new Set(matches)] : [];
};

const extractAddress = (text) => {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  const addressKeywords = /(street|st\.|road|rd\.|nagar|colony|lane|tower|building|floor|area|sector|phase|block|pincode|pin|dist\.|city|village|taluka|po|opp\.|near)/i;
  const pincodeRegex = /\b\d{6}\b/;

  const phoneRegex = /(\+?\d[\d\s-]{9,})/;

  const addressLines = lines.filter(line =>
    addressKeywords.test(line) || pincodeRegex.test(line) && !phoneRegex.test(line) // exclude lines that are phone numbers
  );

  return addressLines.join(', ');
};

  const handleScan = async () => {
    try {
      const result = await ImagePicker.openCamera({
        cropping: true,
        cropperToolbarTitle: 'Crop Visiting Card',
        compressImageQuality: 0.9,
        freeStyleCropEnabled: true,
        hideBottomControls: false,
      });

      if (result?.path) {
        const ocrResult = await MLKitOcr.detectFromFile(result.path);
        const fullText = ocrResult.map(b => b.text).join('\n');
        parseContactAndNavigate(fullText);
      }
    } catch (err) {
      console.log('Scan Error:', err);
      Toast.show({
        type: 'error',
        text1: 'Error!',
        text2: 'Failed to scan image',
        position: 'top',
      });
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const result = await ImagePicker.openPicker({
        cropping: true,
        cropperToolbarTitle: 'Crop Visiting Card',
        compressImageQuality: 0.9,
        freeStyleCropEnabled: true,
        hideBottomControls: false,
      });

      if (result?.path) {
        const ocrResult = await MLKitOcr.detectFromFile(result.path);
        const fullText = ocrResult.map(b => b.text).join('\n');
        parseContactAndNavigate(fullText);
      }
    } catch (err) {
      console.log('Gallery Pick Error:', err);
      Toast.show({
        type: 'error',
        text1: 'Error!',
        text2: 'Failed to pick image',
        position: 'top',
      });
    }
  };

  const parseContactAndNavigate = fullText => {
  const cleanedText = fullText.replace(/\s+/g, ' ').trim();

  const phones = extractPhoneNumbers(cleanedText);
  const emails = extractEmails(cleanedText);
  const address = extractAddress(fullText);

  const lines = fullText.split('\n').map(l => l.trim()).filter(Boolean);
  const probableName = lines.find(line => /^[A-Za-z\s]+$/.test(line)) || 'Unknown';

  if (phones.length === 0) {
    Toast.show({
      type: 'error',
      text1: 'Oops!',
      text2: 'No valid number found',
      position: 'top',
    });
    return;
  }

  navigation.navigate('CardResultScreen', {
    fullText,
    numbers: phones,
    name: probableName,
    emails: emails?.[0] || '',
    address: address || '',
  });
};

  const colors = useThemeColors();

  return (
    <SafeAreaWrapper className="flex-1 bg-light-background dark:bg-dark-background ">
      <Header title="Card Scanner" />
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold text-light-text dark:text-dark-text text-center mt-8">
          Add Contacts Instantly
        </Text>
        <Text className="text-lg font-medium text-light-subtext dark:text-dark-subtext text-center my-2">
          Scan a bussiness card or upload an image to automatically extract the
          contact details.
        </Text>

        <View className="flex-1 justify-end items-end">
          <TouchableOpacity
            onPress={handleScan}
            className="bg-[#A8E6CF] dark:bg-[#7ED9B0] rounded-2xl px-4 py-3 flex-row items-center justify-center mb-4 w-full"
          >
            <Camera color="black" size={20} className="mr-2" />
            <Text className="text-[#333333] text-base font-medium">
              {' '}
              Scan with Camera
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handlePickFromGallery}
            className="border border-light-border dark:border-dark-border rounded-2xl px-4 py-3 flex-row items-center justify-center w-full"
          >
            <Upload color={colors.text} size={20} className="mr-2" />
            <Text className="text-light-text dark:text-dark-text text-base font-medium">
              {' '}
              Upload from Gallery
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaWrapper>
  );
}
