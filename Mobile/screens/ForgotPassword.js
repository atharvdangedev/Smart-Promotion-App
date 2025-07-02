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
            const res = await api.post('admin-forgot-password', { email });

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
        <SafeAreaView className="flex-1 justify-center px-6 bg-white">
            <Text className="text-2xl font-semibold mb-8 text-black">Enter Your Email</Text>

            <InputField
                icon="user"
                placeholder="Email"
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    if (formError) setFormError('');
                }}
            />

            {/* Error or Success Messages */}
            {formError ? (
                <Text className="text-red-500 text-sm mt-2 mb-2 text-center">{formError}</Text>
            ) : null}

            {successMsg ? (
                <Text className="text-green-600 text-sm mt-2 mb-2 text-center">
                    {successMsg} {'\n'}Redirecting to login...
                </Text>
            ) : null}

            <TouchableOpacity
                onPress={handleSubmit}
                className="bg-black py-3 rounded-xl mt-4 mb-4"
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text className="text-center text-white font-semibold">Send Reset Link</Text>
                )}
            </TouchableOpacity>
        </SafeAreaView>
    );
}
