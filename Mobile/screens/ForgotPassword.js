import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import InputField from '../components/InputField';
import { api } from '../utils/api';


export default function ForgotPassword({ navigation }) {
    const [email, setEmail] = useState('');
    const [formError, setFormError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email) {
            setFormError('Please enter your email');
            return;
        }

        setLoading(true);
        setFormError('');
        setSuccessMsg('');

        try {
            const res = await api.post('forgot-password', { email });

            console.log('Forgot Password Response:', res.data);

            if (res.data?.status === true) {
                setSuccessMsg(res.data.message || 'Reset link sent! Please check your email.');
                setTimeout(() => navigation.navigate('SignIn'), 2000); // Auto-redirect 
            } else {
                setFormError(res.data.message || 'Failed to send reset link');
            }
        } catch (error) {
            console.error('Forgot Password Error:', error);
            if (error.response?.data?.message) {
                setFormError(error.response.data.message);
            } else {
                setFormError('Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 justify-center px-6 bg-[#FDFDFD] dark:bg-[#4A5568]">
            <Text className="text-3xl font-bold text-center mb-8 text-[#333333] dark:text-[#E0E0E0]">Forgot Password</Text>

            <InputField
                icon="user"
                placeholder="Email"
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={(text) => {
                    setEmail(text);
                    if (formError) setFormError('');
                }}
            />

            {/* Error or Success Messages */}
            {formError ? (
                <Text className="text-[#FF6B6B] dark:text-[#FF8A80] text-sm mt-2 mb-2 text-center">{formError}</Text>
            ) : null}

            {successMsg ? (
                <Text className="text-green-600 text-sm mt-2 mb-2 text-center">
                    {successMsg} {'\n'}Redirecting to login...
                </Text>
            ) : null}
            <View className='flex-row items-center'>
                {/* <Text className='text-sm font-semibold  text-[#333333] dark:text-[#E0E0E0]'>Note : </Text> */}
                <Text className='text-sm font-medium text-[#333333] dark:text-[#E0E0E0]'><Text className='text-base font-semibold underline'>Note : </Text> Enter the email associated with your account and we'll send you a link to reset your password.</Text>
            </View>
            <TouchableOpacity
                onPress={handleSubmit}
                className="bg-black py-3 rounded-xl mt-5 mb-3"
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text className="text-center text-white font-semibold">Send Reset Link</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                className='bg-white border border-[#E0E0E0] dark:border-[#4A5568] py-3 rounded-xl'>
                <Text className='text-center text-black font-semibold'>Back to Log In</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
