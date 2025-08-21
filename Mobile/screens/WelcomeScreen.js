import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SafeAreaWrapper from '../components/SafeAreaWrapper';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaWrapper className="flex-1 px-6 bg-light-background dark:bg-dark-background">
      <View className="items-center mt-[15%]">
        <Text className="text-light-text dark:text-dark-text font-bold text-4xl my-4 mt-4 text-center">
          Automate your call Follow-ups (exp)
        </Text>
      </View>

      <Text className="text-light-subtext dark:text-dark-subtext font-semibold text-lg my-2 text-center">
        Send smart WhatsApp messages Automatically after incoming and outgoing,
        or missed calls.
      </Text>

      <View className="flex-1 justify-center items-center">
        <Image
          source={require('../assets/logo.png')}
          className="rounded-xl border-hairline"
          style={{
            width: wp('30%'),
            height: wp('30%'),
            resizeMode: 'contain',
          }}
        />
      </View>

      <View className="items-center mb-4 space-y-3">
        <TouchableOpacity
          onPress={() => navigation.navigate('SignIn')}
          className="bg-light-background dark:bg-dark-background px-6 py-3 rounded-md w-full border border-light-border dark:border-dark-border mb-3"
        >
          <Text className="text-center text-black dark:text-white font-semibold">
            APP-Sign In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-zinc-800 px-6 py-3 rounded-md w-full">
          <Text className="text-center text-white font-semibold">
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
    </SafeAreaWrapper>
  );
}
