import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';
import InputField from '../components/InputField';

export default function ResetPassword({ navigation }) {
    const route = useRoute();
    const { token } = route.params || {}; // token from deep link

    return (
        <SafeAreaView className='flex-1 justify-center px-6 bg-white'>
            <Text className="text-2xl font-semibold mb-2 text-black">Reset Your Password</Text>
            {token ? (
                <Text className="text-gray-600 mb-6">Token: {token}</Text>
            ) : (
                <Text className="text-red-600 mb-6">No token found in link</Text>
            )}

            <InputField icon='lock' placeholder="Enter Password" />
            <InputField icon='lock' placeholder="Confirm Password" />

            <TouchableOpacity
                onPress={() => navigation.navigate('SignIn')}
                className="bg-black py-3 rounded-xl mb-4 mt-4">
                <Text className="text-center text-white font-semibold">Reset Password</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
