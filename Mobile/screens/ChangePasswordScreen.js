import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react-native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { useAuthStore } from '../store/useAuthStore';
import { evaluatePasswordStrength } from '../utils/evaluatePasswordStrength';
import { useMutation } from '@tanstack/react-query';
import { changePassword } from '../apis/Auth';
import { handleApiSuccess } from '../utils/handleApiSuccess';
import { changePasswordSchema } from '../utils/schemas';

export default function ChangePasswordScreen() {
  const logout = useAuthStore(state => state.logout);
  const token = useAuthStore(state => state.token);

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [passwordErrors, setPasswordErrors] = useState([]);

  const { control, handleSubmit, watch } = useForm({
    resolver: yupResolver(changePasswordSchema),
    mode: 'onBlur',
  });

  const passwordValue = watch('newpassword');

  const togglePasswordVisibility = field => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  useEffect(() => {
    const { errors } = evaluatePasswordStrength(passwordValue);
    setPasswordErrors(errors);
  }, [passwordValue]);

  const changePasswordMutation = useMutation({
    mutationFn: data => changePassword(data, token),
    onSuccess: res => {
      handleApiSuccess(res.data.message, 'Change Password');
      setTimeout(() => {
        handleApiSuccess('Logging out', 'Log Out');
        logout();
      }, 2000);
    },
    onError: error => {
      handleApiError(error, 'Changing', 'password');
    },
  });

  const onSubmit = async data => {
    const { isStrong, errors } = evaluatePasswordStrength(data.newpassword);

    if (!isStrong) {
      setPasswordErrors(errors);
      return;
    }

    const payload = {
      old_password: data.old_password,
      new_password: data.newpassword,
      confirmPassword: data.confirmPassword,
    };

    changePasswordMutation.mutate(payload);
  };
  return (
    <SafeAreaWrapper className="flex-1 bg-light-background dark:bg-dark-background px-6 justify-center">
      <Text className="text-2xl font-bold text-center mb-6 text-light-text dark:text-dark-text">
        Change Password
      </Text>

      <Controller
        control={control}
        name="old_password"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View className="mb-4 mx-3">
            <Text className="text-light-text dark:text-dark-text mb-1">
              Current Password
            </Text>
            <View className="relative">
              <TextInput
                onChangeText={onChange}
                value={value}
                secureTextEntry={!showPassword.old}
                placeholder="Enter Current Password"
                placeholderTextColor="#9ca3af"
                className={`px-4 py-2 pr-10 rounded-xl border text-light-subtext dark:text-dark-subtext ${
                  error ? 'border-red-500' : 'border-gray-700'
                } bg-[#e6ebf0] dark:bg-[#233140]`}
              />
              <TouchableOpacity
                onPress={() => togglePasswordVisibility('old')}
                className="absolute right-3 top-3"
              >
                {showPassword.old ? (
                  <Eye size={20} color="#6b7280" />
                ) : (
                  <EyeOff size={20} color="#6b7280" />
                )}
              </TouchableOpacity>
            </View>
            {error && (
              <Text className="text-light-danger dark:text-dark-danger text-xs mt-1">
                {error.message}
              </Text>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="newpassword"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View className="mb-4 mx-3">
            <Text className="text-light-text dark:text-dark-text mb-1">
              New Password
            </Text>
            <View className="relative">
              <TextInput
                onChangeText={onChange}
                value={value}
                secureTextEntry={!showPassword.new}
                placeholder="Enter New Password"
                placeholderTextColor="#9ca3af"
                className={`px-4 py-2 pr-10 rounded-xl border text-light-subtext dark:text-dark-subtext ${
                  error ? 'border-red-500' : 'border-gray-700'
                } bg-[#e6ebf0] dark:bg-[#233140]`}
              />
              <TouchableOpacity
                onPress={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-3"
              >
                {showPassword.new ? (
                  <Eye size={20} color="#6b7280" />
                ) : (
                  <EyeOff size={20} color="#6b7280" />
                )}
              </TouchableOpacity>
            </View>
            {error && (
              <Text className="text-light-danger dark:text-dark-danger text-xs mt-1">
                {error.message}
              </Text>
            )}
            {passwordValue && passwordErrors.length > 0 && (
              <View className="mt-2">
                <View className="bg-red-100 rounded-lg p-2">
                  {passwordErrors.map((error, index) => (
                    <Text key={index} className="text-red-600 text-sm mb-1">
                      • {error}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View className="mb-4 mx-3">
            <Text className="text-light-text dark:text-dark-text mb-1">
              Confirm Password
            </Text>
            <View className="relative">
              <TextInput
                onChangeText={onChange}
                value={value}
                secureTextEntry={!showPassword.confirm}
                placeholder="Enter Confirm Password"
                placeholderTextColor="#9ca3af"
                className={`px-4 py-2 pr-10 rounded-xl border text-light-subtext dark:text-dark-subtext ${
                  error ? 'border-red-500' : 'border-gray-700'
                } bg-[#e6ebf0] dark:bg-[#233140]`}
              />
              <TouchableOpacity
                onPress={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-3"
              >
                {showPassword.confirm ? (
                  <Eye size={20} color="#6b7280" />
                ) : (
                  <EyeOff size={20} color="#6b7280" />
                )}
              </TouchableOpacity>
            </View>
            {error && (
              <Text className="text-light-danger dark:text-dark-danger text-xs mt-1">
                {error.message}
              </Text>
            )}
          </View>
        )}
      />

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={changePasswordMutation.isPending}
        className="bg-black py-3 rounded-xl mt-4"
      >
        {changePasswordMutation.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-lg text-center font-semibold">
            Change Password
          </Text>
        )}
      </TouchableOpacity>
    </SafeAreaWrapper>
  );
}
