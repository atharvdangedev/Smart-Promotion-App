import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import { api } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Check } from 'lucide-react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import SafeAreaWrapper from '../components/SafeAreaWrapper';


export default function ChangePasswordScreen({ navigation }) {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(true);
    const [passwordValidationMessages, setPasswordValidationMessages] = useState([]);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error2, setError2] = useState('');
    const [error3, setError3] = useState('');



    const isValidPassword = (password) => {

        if (password.length < 6) return 'Password must be at least 6 characters long.';

        if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter.';

        if (!/[0-9]/.test(password)) return 'Password must contain at least one number.';

        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain at least one special character.';

        if (/([a-zA-Z0-9!@#$%^&*()])\1\1+/.test(password)) return 'Password must not contain repeated characters.';

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

    const getPasswordValidationMessages = (password) => {
        const messages = [];

        if (password.length < 6) {
            messages.push('• Password must be at least 6 characters long');
        }
        if (!/[A-Z]/.test(password)) {
            messages.push('• Must include at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            messages.push('• Must include at least one lowercase letter');
        }
        if (!/[0-9]/.test(password)) {
            messages.push('• Must include at least one number');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            messages.push('• Must include at least one special character');
        }
        if (/([a-zA-Z0-9!@#$%^&*()])\1\1+/.test(password)) {
            messages.push('• Must not contain repeated characters (e.g., aaa)');
        }

        const sequences = ['0123456789', 'abcdefghijklmnopqrstuvwxyz', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
        const lowerPass = password.toLowerCase();
        for (let seq of sequences) {
            for (let i = 0; i < seq.length - 2; i++) {
                const sub = seq.slice(i, i + 3);
                if (lowerPass.includes(sub)) {
                    messages.push('• Must not contain common sequences (e.g., abc, 123)');
                    break;
                }
            }
        }

        return messages;
    };

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            if (!oldPassword) {
                setError3('Current password is required');
            }
            if (!newPassword) {
                setError2('New password is required');
            }
            if (!confirmPassword) {
                setErrorMsg('Confirm password is required');
            }
            return;
        }


        if (newPassword !== confirmPassword) {
            setErrorMsg('Passwords do not match');
            return;
        }
        if (newPassword === oldPassword) {
            setErrorMsg("New password must be different from the current password");
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
                // setSuccessMsg('Password changed successfully. Logging out...');
                setTimeout(() => {
                    Toast.show({
                        type: 'info',
                        text1: 'Logging out...',
                        visibilityTime: 2000,
                        position: 'top'
                    });
                }, 2000);
                Toast.show({
                    type: 'success',
                    text1: 'Password Changed',
                    text2: 'Password changed successfully',
                    position: 'top',
                });
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
            // setErrorMsg('Please enter correct current password');
            Toast.show({
                type: 'error',
                text1: 'Change Password Error',
                text2: 'Please enter correct current password'
            })
        } finally {
            setLoading(false);
        }
    };

    // const togglePasswordVisibility = () => {
    //     setPasswordVisible(!passwordVisible);
    // }


    return (
        <SafeAreaWrapper className="flex-1 bg-light-background dark:bg-dark-background px-6 justify-center">
            <Text className="text-2xl font-bold text-center mb-6 text-light-text dark:text-dark-text">Change Password</Text>
            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 mb-4">
                <TextInput
                    placeholder="Current Password"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showOldPassword}
                    value={oldPassword}
                    onChangeText={(text) => {
                        setOldPassword(text);
                        setErrorMsg('');
                        setError3('');
                    }}
                    className="flex-1 ml-2 py-3 text-black"
                />
                <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)}>
                    {showOldPassword ? <Eye size={20} color="gray" /> : <EyeOff size={20} color="gray" />}
                </TouchableOpacity>
            </View>
            {error3 ? <Text className="text-light-danger dark:text-dark-danger mb-2 text-center">{error3}</Text> : null}

            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 mb-4">
                <TextInput
                    placeholder="New Password"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showNewPassword}
                    value={newPassword}
                    onChangeText={(text) => {
                        setNewPassword(text);
                        setErrorMsg('');
                        setError2('');
                        const messages = getPasswordValidationMessages(text);
                        setPasswordValidationMessages(messages);
                    }}
                    className="flex-1 ml-2 py-3 text-black"
                />
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <Eye size={20} color="gray" /> : <EyeOff size={20} color="gray" />}
                </TouchableOpacity>
            </View>
            {error2 ? <Text className="text-light-danger dark:text-dark-danger mb-2 text-center">{error2}</Text> : null}
            {newPassword.length > 0 && passwordValidationMessages.length > 0 && (
                <View className="mb-4 ml-1">
                    {passwordValidationMessages.map((msg, index) => (
                        <Text key={index} className="text-light-danger dark:text-dark-danger text-sm">
                            {msg}
                        </Text>
                    ))}
                </View>
            )}

            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 mb-4">
                <TextInput
                    placeholder="Confirm Password"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={(text) => {
                        setConfirmPassword(text);
                        if (newPassword === confirmPassword) {
                            setErrorMsg("Current and new password cannot be same")
                            return;
                        }
                        setErrorMsg('');
                    }}
                    className="flex-1 ml-2 py-3 text-black"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <Eye size={20} color="gray" /> : <EyeOff size={20} color="gray" />}
                </TouchableOpacity>
            </View>

            {errorMsg ? <Text className="text-light-danger dark:text-dark-danger mb-2 text-center">{errorMsg}</Text> : null}
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
        </SafeAreaWrapper>
    );
}
