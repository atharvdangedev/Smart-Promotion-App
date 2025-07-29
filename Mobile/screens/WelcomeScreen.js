import React from 'react';
import { View, Text, Image, TouchableOpacity, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function WelcomeScreen({ navigation }) {

    const theme = useColorScheme();
    return (
        // <SafeAreaView className={theme === 'light' ? `flex-1 bg-[#FDFDFD] px-6` : `flex-1 bg-[#2C3E50] px-6`}>
        <SafeAreaView className='flex-1 px-6 bg-[#FDFDFD] dark:bg-[#2C3E50]'>
            {/* Title */}
            <View className="items-center mt-[15%]">
                <Text className="text-[#333333] dark:text-[#E0E0E0] font-bold text-4xl my-4 mt-6 text-center">
                    Automate your call Follow-ups (exp)
                </Text>
            </View>


            <Text className="text-[#888888] dark:text-[#A0A0A0] font-semibold text-lg my-2 text-center">
                Send smart WhatsApp messages Automatically after incoming and outgoing, or missed calls.
            </Text>

            {/* Logo */}
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

            {/* Buttons */}
            <View className="items-center mb-4 space-y-3">
                <TouchableOpacity
                    onPress={() => navigation.navigate('SignIn')}
                    className="bg-[#FDFDFD] dark:bg-[#2C3E50] px-6 py-3 rounded-md w-full border border-black mb-3">
                    <Text className="text-center text-black font-semibold">APP-Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-zinc-800 px-6 py-3 rounded-md w-full">
                    <Text className="text-center text-white font-semibold">Create Account or Sign Up</Text>
                </TouchableOpacity>
            </View>

            {/* Footer */}
            <View className="items-center pb-4">
                <Text className="text-xs text-zinc-400 text-center">
                    By signing in you accept our{' '}
                    <Text className="underline text-blue-500">Terms of use</Text> and{' '}
                    <Text className="underline text-blue-500">Privacy policy</Text>.
                </Text>
                <Text className="text-xs text-blue-500 mt-2 underline">Trouble signing in?</Text>
            </View>
        </SafeAreaView >
    );
}
