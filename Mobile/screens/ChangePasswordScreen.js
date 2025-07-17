import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { api } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Check } from 'lucide-react-native';

export default function ChangePasswordScreen({ navigation }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(true);

    const isValidPassword = (password) => {
        // Minimum 6 characters
        if (password.length < 6) return 'Password must be at least 6 characters long.';

        // At least one uppercase letter
        if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';

        // At least one number
        if (!/[0-9]/.test(password)) return 'Password must contain at least one number.';

        // At least one special character
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least one special character.';

        // No repeated characters more than twice in a row
        if (/([a-zA-Z0-9!@#$%^&*()])\1\1+/.test(password)) return 'Password must not contain repeated characters.';

        // No simple sequences (e.g., abc, 123, qwerty)
        const sequences = ['0123456789', 'abcdefghijklmnopqrstuvwxyz', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
        const lowerPass = password.toLowerCase();

        for (let seq of sequences) {
            for (let i = 0; i < seq.length - 2; i++) {
                const sub = seq.slice(i, i + 3);
                if (lowerPass.includes(sub)) {
                    return 'Password must not contain common sequences (e.g., abc, 123, qwe).';
                }
            }
        }

        return ''; // Empty string means valid
    };

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            setErrorMsg('All fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMsg('Passwords do not match');
            return;
        }
        if (newPassword === oldPassword) {
            setErrorMsg("Old and new password cannot be same");
            return;
        }
        const passwordValidationError = isValidPassword(newPassword);
        if (passwordValidationError) {
            setErrorMsg(passwordValidationError);
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
                }, 2000);
            } else {
                setErrorMsg(res.data.message || 'Failed to change password');
            }
        } catch (error) {
            console.error('Change Password Error:', error);
            setErrorMsg('Please enter correct old password');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    }


    return (
        <SafeAreaView className="flex-1 bg-white px-6 justify-center">
            <Text className="text-xl font-bold text-center mb-6 text-black">Change Password</Text>
            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 mb-4">
                <TextInput
                    placeholder="Old Password"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!passwordVisible}
                    value={oldPassword}
                    onChangeText={(text) => {
                        setOldPassword(text);
                        setErrorMsg('');
                    }}
                    className="flex-1 ml-2 py-3 text-black"
                />


            </View>
            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 mb-4">
                <TextInput
                    placeholder="New Password"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!passwordVisible}
                    value={newPassword}
                    onChangeText={(text) => {
                        setNewPassword(text);
                        setErrorMsg('');
                    }}
                    className="flex-1 ml-2 py-3 text-black"
                />

            </View>
            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 mb-4">
                <TextInput
                    placeholder="Confirm Password"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!passwordVisible}
                    value={confirmPassword}
                    onChangeText={(text) => {
                        setConfirmPassword(text);
                        setErrorMsg('');
                    }}
                    className="flex-1 ml-2 py-3 text-black"
                />

            </View>
            <TouchableOpacity
                className="flex-row items-center mb-4"
                onPress={togglePasswordVisibility}
                activeOpacity={0.7}
            >
                <View className={`h-5 w-5 mr-2 border-2 rounded ${passwordVisible ? 'bg-black border-black' : 'border-gray-400'}`}>
                    {passwordVisible && <Check size={16} color="white" />}
                </View>
                <Text className="text-black">Show Password</Text>
            </TouchableOpacity>
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
                    <Text className="text-white text-lg text-center font-semibold">Change Password</Text>
                )}
            </TouchableOpacity>
        </SafeAreaView>
    );
}
