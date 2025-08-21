import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { api } from '../utils/api';
import { Eye, EyeOff } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { useAuthStore } from '../store/useAuthStore';

export default function ChangePasswordScreen() {
    const token = useAuthStore((state) => state.token);
    const logout = useAuthStore((state) => state.logout);

    const [loading, setLoading] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        control,
        handleSubmit,
        watch,
        setError,
        formState: { errors },
    } = useForm({
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
        mode: 'onChange',
    });

    const newPassword = watch('newPassword');

    const handleChangePassword = async (data) => {
        if (data.newPassword === data.oldPassword) {
            setError('newPassword', { type: 'manual', message: 'New password must be different from old password' });
            return;
        }

        setLoading(true);

        try {
            const res = await api.post(
                'change-password',
                {
                    old_password: data.oldPassword,
                    new_password: data.newPassword,
                    confirm_password: data.confirmPassword,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (res.status === 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Password Changed',
                    text2: 'Password changed successfully',
                    position: 'top',
                });

                setTimeout(() => {
                    Toast.show({
                        type: 'info',
                        text1: 'Logging out...',
                        visibilityTime: 2000,
                        position: 'top',
                    });
                    logout();
                }, 2000);
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Change Password Error',
                text2: 'Please enter correct current password',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaWrapper className="flex-1 bg-light-background dark:bg-dark-background px-6 justify-center">
            <Text className="text-2xl font-bold text-center mb-6 text-light-text dark:text-dark-text">Change Password</Text>

            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 mb-2">
                <Controller
                    control={control}
                    name="oldPassword"
                    rules={{ required: 'Current password is required' }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            placeholder="Current Password"
                            placeholderTextColor="#9ca3af"
                            secureTextEntry={!showOldPassword}
                            value={value}
                            onChangeText={onChange}
                            className="flex-1 ml-2 py-3 text-black"
                        />
                    )}
                />
                <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)}>
                    {showOldPassword ? <Eye size={20} color="gray" /> : <EyeOff size={20} color="gray" />}
                </TouchableOpacity>
            </View>
            {errors.oldPassword && <Text className="text-light-danger dark:text-dark-danger mb-2 text-center">{errors.oldPassword.message}</Text>}

            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 mb-2">
                <Controller
                    control={control}
                    name="newPassword"
                    rules={{
                        required: 'New password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters long' },
                        validate: {
                            hasUpper: (v) => /[A-Z]/.test(v) || 'Must include at least one uppercase letter',
                            hasLower: (v) => /[a-z]/.test(v) || 'Must include at least one lowercase letter',
                            hasNumber: (v) => /[0-9]/.test(v) || 'Must include at least one number',
                            hasSpecial: (v) => /[!@#$%^&*(),.?":{}|<>]/.test(v) || 'Must include at least one special character',
                        },
                    }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            placeholder="New Password"
                            placeholderTextColor="#9ca3af"
                            secureTextEntry={!showNewPassword}
                            value={value}
                            onChangeText={onChange}
                            className="flex-1 ml-2 py-3 text-black"
                        />
                    )}
                />
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <Eye size={20} color="gray" /> : <EyeOff size={20} color="gray" />}
                </TouchableOpacity>
            </View>
            {errors.newPassword && <Text className="text-light-danger dark:text-dark-danger mb-2 text-center">{errors.newPassword.message}</Text>}

            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 mb-2">
                <Controller
                    control={control}
                    name="confirmPassword"
                    rules={{
                        required: 'Confirm password is required',
                        validate: (v) => v === newPassword || 'Passwords do not match',
                    }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            placeholder="Confirm Password"
                            placeholderTextColor="#9ca3af"
                            secureTextEntry={!showConfirmPassword}
                            value={value}
                            onChangeText={onChange}
                            className="flex-1 ml-2 py-3 text-black"
                        />
                    )}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <Eye size={20} color="gray" /> : <EyeOff size={20} color="gray" />}
                </TouchableOpacity>
            </View>
            {errors.confirmPassword && <Text className="text-light-danger dark:text-dark-danger mb-2 text-center">{errors.confirmPassword.message}</Text>}

            <TouchableOpacity
                onPress={handleSubmit(handleChangePassword)}
                disabled={loading}
                className="bg-black py-3 rounded-xl mt-4"
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
