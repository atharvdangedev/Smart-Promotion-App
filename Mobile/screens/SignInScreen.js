import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import InputField from '../components/InputField';

export default function LoginScreen({ navigation }) {
    return (
        <SafeAreaView className="flex-1 justify-center px-6 bg-white">
            <Text className="text-2xl font-semibold mb-20 text-black">Welcome Back Glad to see you, Again!</Text>

            <InputField icon="user" placeholder="Email" />
            <InputField icon="lock" placeholder="Password" secureTextEntry />

            <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                className="mb-4">
                <Text className="text-right text-sm text-gray-500">Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-black py-3 rounded-xl mb-4">
                <Text className="text-center text-white font-semibold">Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                <Text className="text-center text-gray-500 mb-3">Reset Password</Text>
            </TouchableOpacity>

            {/* <View className="flex-row justify-center space-x-6 mb-6">
                <Text>🌐</Text><Text>📘</Text><Text>🍎</Text>
            </View> */}

            <TouchableOpacity onPress={() => navigation.navigate('EnterpriseLogin')}>
                <Text className="text-center text-sm text-gray-500">
                    Don’t have an account? <Text className="font-semibold text-black">Sign Up</Text>
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
