import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default function WelcomeScreen({ navigation }) {
    return (
        <SafeAreaView className="flex-1 bg-black px-6">
            {/* Title */}
            <View className="items-center mt-[15%]">
                <Text className="text-white font-bold text-4xl">WELCOME</Text>
            </View>

            {/* Logo */}
            <View className="flex-1 justify-center items-center">
                <Image
                    source={require('../assets/logo.png')}
                    className="rounded-xl"
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
                    className="bg-white px-6 py-3 rounded-md w-full mb-3">
                    <Text className="text-center text-black font-semibold">SIGN IN TO APP</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-zinc-800 px-6 py-3 rounded-md w-full">
                    <Text className="text-center text-white font-semibold">SIGN UP</Text>
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
        </SafeAreaView>
    );
}
