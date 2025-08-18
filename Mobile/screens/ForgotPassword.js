import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import InputField from '../components/InputField';
import { api } from '../utils/api';
import SafeAreaWrapper from '../components/SafeAreaWrapper';


export default function ForgotPassword({ navigation }) {
    const [email, setEmail] = useState('');
    const [formError, setFormError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            setFormError('Email is required');
            return;
        }

        if (!emailRegex.test(email)) {
            setFormError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        setFormError('');
        setSuccessMsg('');

        try {
            const res = await api.post('forgot-password', { email });

            console.log('Forgot Password Response:', res.data);

            if (res.status === 200) {
                setSuccessMsg(res.data.message || 'Reset link sent! Please check your email.');
                setTimeout(() => navigation.navigate('SignIn'), 2000);
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

    const validateEmail = (text) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!text) {
            setFormError('Email is required');
        } else if (!emailRegex.test(text)) {
            setFormError('Please enter a valid email address');
        } else {
            setFormError('');
        }
    };


    return (
        <SafeAreaWrapper className="flex-1 justify-center px-6 bg-[#FDFDFD] dark:bg-[#2C3E50]">
            <Text className="text-3xl font-bold text-center mb-8 text-[#333333] dark:text-[#E0E0E0]">Forgot Password</Text>

            <InputField
                icon="user"
                placeholder="Email"
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={(text) => {
                    setEmail(text);
                    validateEmail(text);
                }}
            />

            {formError ? (
                <Text className="text-light-danger dark:text-dark-danger text-sm mt-2 mb-2 text-center">{formError}</Text>
            ) : null}

            {successMsg ? (
                <Text className="text-green-600 text-sm mt-2 mb-2 text-center">
                    {successMsg} {'\n'}Redirecting to login...
                </Text>
            ) : null}
            <View className='flex-row items-center'>
                <Text className='text-sm font-medium text-light-text dark:text-dark-text'><Text className='text-base font-semibold '>Note : </Text> Enter the email associated with your account and we'll send you a link to reset your password.</Text>
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
                className='bg-white border border-light-border dark:border-dark-border py-3 rounded-xl'>
                <Text className='text-center text-black font-semibold'>Back to Log In</Text>
            </TouchableOpacity>
        </SafeAreaWrapper>
    );
}
