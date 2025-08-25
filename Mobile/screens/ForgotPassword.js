import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { yupResolver } from '@hookform/resolvers/yup';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { useNavigation } from '@react-navigation/native';
import { forgotPasswordSchema } from '../utils/schemas';
import { Controller, useForm } from 'react-hook-form';
import { forgotPassword } from '../apis/Auth';
import { useMutation } from '@tanstack/react-query';
import { handleApiSuccess } from '../utils/handleApiSuccess';
import { handleApiError } from '../utils/handleApiError';

export default function ForgotPassword() {
  const navigation = useNavigation();

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
    },
  });

  const forgetPasswordMutation = useMutation({
    mutationFn: data => forgotPassword(data),
    onSuccess: res => {
      handleApiSuccess(res.data.message, 'Forgot Password');
      setTimeout(() => navigation.navigate('SignIn'), 2000);
    },
    onError: error => {
      handleApiError(error, 'in sending', 'password reset link');
    },
  });

  const onSubmit = async data => {
    const payload = {
      email: data.email,
    };

    forgetPasswordMutation.mutate(payload);
  };

  const navigateSignIn = () => {
    navigation.goBack();
    reset();
  };

  return (
    <SafeAreaWrapper className="flex-1 justify-center px-6 bg-[#FDFDFD] dark:bg-[#2C3E50]">
      <Text className="text-3xl font-bold mb-20 text-white">
        Forgot Password
      </Text>

      {/* Email */}
      <Controller
        control={control}
        name="email"
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <View className="mb-4 mx-3">
            <Text className="text-white mb-1">Email</Text>
            <TextInput
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="Enter Your Email"
              placeholderTextColor="#9ca3af"
              className={`px-4 py-2 rounded-xl border text-[#000000] ${
                error ? 'border-red-500' : 'border-gray-700'
              } bg-[#D8DADC]`}
            />
            {error && (
              <Text className="text-light-danger dark:text-dark-danger text-xs mt-1">
                {error.message}
              </Text>
            )}
          </View>
        )}
      />

      <View className="flex-row items-center m-4">
        <Text className="text-sm font-medium text-white">
          <Text className="text-base text-white font-semibold">Note : </Text>
          Enter the email associated with your account and we'll send you a link
          to reset your password.
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        className="bg-white dark:bg-dark-buttonBg1 py-3 rounded-xl mt-5 mb-3"
        disabled={forgetPasswordMutation.isPending}
      >
        {forgetPasswordMutation.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-center text-[#0088CC] dark:text-white font-semibold">
            Send Reset Link
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={navigateSignIn}
        className="border border-light-border dark:border-dark-border py-3 rounded-xl"
      >
        <Text className="text-center text-white font-semibold">
          Back to Log In
        </Text>
      </TouchableOpacity>
    </SafeAreaWrapper>
  );
}
