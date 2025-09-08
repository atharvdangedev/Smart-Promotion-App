import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { LANDING_URL } from '@env';

export default function WelcomeScreen({ navigation }) {
  const handleSignupRedirect = () => {
    Linking.openURL(LANDING_URL).catch(err =>
      console.error('Failed to open URL:', err),
    );
  };
  return (
    <SafeAreaView className="flex-1 px-6 bg-white">
      <View className="items-center mt-[15%]">
        <Text className="text-[#0083C4] font-semibold text-4xl my-4 mt-4 text-center">
          Automate your call Follow-ups (exp)
        </Text>
      </View>

      <Text className="text-[#5497B8] font-semibold text-lg my-2 text-center">
        Send smart WhatsApp messages Automatically after incoming and outgoing,
        or missed calls.
      </Text>

      <View className="flex-1 justify-center items-center">
        <Image
          source={require('../assets/Website-logo.webp')}
          className=""
          style={{
            width: wp('80%'),
            height: hp('40%'),
            resizeMode: 'contain',
          }}
        />
      </View>

      <View className="items-center mb-4 space-y-3">
        <TouchableOpacity
          onPress={() => navigation.navigate('SignIn')}
          className="bg-[#FF5604] px-6 py-4 rounded-xl w-full mb-3"
        >
          <Text className="text-center text-white font-semibold">
            APP-Sign In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="px-6 py-4 border border-[#0083C4] rounded-xl w-full"
          onPress={handleSignupRedirect}
        >
          <Text className="text-center text-[#0083C4] font-semibold">
            Create Account or Sign Up
          </Text>
        </TouchableOpacity>
      </View>

      <View className="items-center pb-4">
        <Text className="text-xs text-light-subtext dark:text-dark-subtext text-center">
          By signing in you accept our{' '}
          <Text className="underline text-blue-500">Terms of use</Text> and{' '}
          <Text className="underline text-blue-500">Privacy policy</Text>.
        </Text>
        <Text className="text-xs text-blue-500 mt-2 underline">
          Trouble signing in?
        </Text>
      </View>
    </SafeAreaView>
  );
}
