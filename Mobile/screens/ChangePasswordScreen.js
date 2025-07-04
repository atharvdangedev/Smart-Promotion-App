import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { api } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChangePasswordScreen({ navigation }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            setErrorMsg('All fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMsg('Passwords do not match');
            return;
        }

        setLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            const token = await AsyncStorage.getItem('token');

            const res = await api.post(
                'change-password',
                {
                    old_password: oldPassword,
                    new_password: newPassword,
                    confirm_password: confirmPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data?.status) {
                setSuccessMsg('Password changed successfully. Logging out...');

                // 👇 Optional logout API call
                await api.post(
                    'logout',
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Clear token and navigate to SignIn
                await AsyncStorage.removeItem('token');

                setTimeout(() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'SignIn' }],
                    });
                }, 2000); // Give 2s for user to see success message
            } else {
                setErrorMsg(res.data.message || 'Failed to change password');
            }
        } catch (error) {
            console.error('Change Password Error:', error);
            setErrorMsg('Something went wrong');
        } finally {
            setLoading(false);
        }
    };


    return (
        <SafeAreaView className="flex-1 bg-white px-6 justify-center">
            <Text className="text-xl font-bold text-center mb-6 text-black">Change Password</Text>

            <TextInput
                placeholder="Old Password"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                value={oldPassword}
                onChangeText={(text) => {
                    setOldPassword(text);
                    setErrorMsg('');
                }}
                className="bg-gray-100 text-black px-4 py-3 rounded-xl mb-4"
            />

            <TextInput
                placeholder="New Password"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                value={newPassword}
                onChangeText={(text) => {
                    setNewPassword(text);
                    setErrorMsg('');
                }}
                className="bg-gray-100 text-black px-4 py-3 rounded-xl mb-4"
            />

            <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#9ca3af"
                secureTextEntry
                value={confirmPassword}
                onChangeText={(text) => {
                    setConfirmPassword(text);
                    setErrorMsg('');
                }}
                className="bg-gray-100 text-black px-4 py-3 rounded-xl mb-4"
            />

            {errorMsg ? <Text className="text-red-500 mb-2 text-center">{errorMsg}</Text> : null}
            {successMsg ? <Text className="text-green-600 mb-2 text-center">{successMsg}</Text> : null}

            <TouchableOpacity
                onPress={handleChangePassword}
                disabled={loading}
                className="bg-black py-3 rounded-xl"
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text className="text-white text-center font-semibold">Change Password</Text>
                )}
            </TouchableOpacity>
        </SafeAreaView>
    );
}
