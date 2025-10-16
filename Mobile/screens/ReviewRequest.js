import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Linking } from 'react-native';
import useThemeColors from '../hooks/useThemeColor';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Header from '../components/Header';
import Toast from 'react-native-toast-message';

export default function RequestReview() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const reviewLink = 'https://tinyurl.com/mr3ve9mw';

  const sendReviewRequest = () => {
    if (!phone) return Toast.show({
        type: 'error',
        text1: 'Empty Fields',
        text2: 'Please enter phone number'
    })
    const message = `Hi ${name || ''}, thank you for visiting us! Please take a moment to share your experience:👉 ⭐ [Click Here to Review](${reviewLink})`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'WhatsApp not installed');
    });
  };

  const colors = useThemeColors();

  return (
    <SafeAreaWrapper
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
        <Header title='Review'/>
      <View className='flex-1 mt-6 px-6'>
        <Text className="text-2xl text-center font-semibold mb-6" style={{color: colors.text}}>
          Request Review on WhatsApp
        </Text>

        <Text className='font-semibold mb-2' style={{color: colors.text}}>Customer Name</Text>
        <TextInput
          placeholder="Customer Name (optional)"
          placeholderTextColor="black"
          value={name}
          onChangeText={setName}
          className="border border-gray-300 rounded-xl p-3 mb-3 text-black"
          style={{backgroundColor: colors.inputBg}}
        />

        <Text className='font-semibold mb-2' style={{color: colors.text}}>Customer Number</Text>
        <TextInput
          placeholder="Phone Number"
          placeholderTextColor="black"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          className="border border-gray-300 rounded-xl p-3 mb-3 text-black"
          style={{backgroundColor: colors.inputBg}}
        />

        <TouchableOpacity
          onPress={sendReviewRequest}
          className="p-4 my-2 rounded-2xl"
          style={{backgroundColor: colors.orange}}
        >
          <Text className="text-white text-center font-medium">
            Send on WhatsApp
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaWrapper>
  );
}
