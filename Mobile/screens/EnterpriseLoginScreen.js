import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import InputField from '../components/InputField';

export default function RegisterScreen({ navigation }) {
    return (
        <SafeAreaView className="flex-1 justify-center px-6 bg-white">
            <Text className="text-2xl font-semibold mb-10 text-black">Hello! Register to get started</Text>

            <InputField icon="user" placeholder="Username" />
            <InputField icon="mail" placeholder="Email" />
            <InputField icon="lock" placeholder="Password" secureTextEntry />
            <InputField icon="user" placeholder="Role" />
            <InputField icon="Phone" placeholder="Contact No" />

            <TouchableOpacity className="bg-black py-3 rounded-xl mb-4">
                <Text className="text-center text-white font-semibold">Register</Text>
            </TouchableOpacity>

            {/* <Text className="text-center text-gray-500 mb-3">Or Login with Enterprise</Text> */}

            {/* <View className="flex-row justify-center mb-6">
                <Text className="text-black text-lg font-medium">🏢 Enterprise</Text>
            </View> */}

            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text className="text-center text-sm text-gray-500">
                    Already have an account? <Text className="font-semibold text-black">Login</Text>
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
