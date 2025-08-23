import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Eye, EyeOff, CheckCircle, Circle } from 'lucide-react-native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { useAuthStore } from '../store/useAuthStore';
import { signinSchema } from '../utils/schemas';
import { handleApiSuccess } from '../utils/handleApiSuccess';
import { handleApiError } from '../utils/handleApiError';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import { BASE_URL, API_KEY } from '@env';
import axios from 'axios';

export default function LoginScreen({ navigation }) {
  const setAuth = useAuthStore(state => state.setAuth);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(signinSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const signinMutation = useMutation({
    mutationFn: async data => {
      try {
        const endpoint = `${BASE_URL}login`;

        const res = await axios.post(endpoint, data, {
          headers: {
            'X-App-Secret': API_KEY,
          },
        });
        return res;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: res => {
      handleApiSuccess(res.data.message, 'Sign In');

      const { token, user } = res.data;

      if (user.rolename === 'affiliate') {
        handleApiError(null, 'Affiliate users are not allowed');
        return;
      }

      setAuth({
        token,
        user,
      });

      navigation.reset({
        index: 0,
        routes: [{ name: 'HomeScreen' }],
      });
    },
    onError: error => {
      handleApiError(error, 'logging ', 'in');
    },
  });

  // Handle Submit Function
  const onSubmit = async data => {
    const payload = {
      email: data.email,
      password: data.password,
      remember: data.remember ? 1 : 0,
    };

    signinMutation.mutate(payload);
  };

  return (
    <SafeAreaWrapper className="flex-1 justify-center px-6 bg-light-background dark:bg-dark-background">
      <Text className="text-3xl font-bold mb-12 mx-3 text-white">Sign In</Text>

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

      {/* Password */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <View className="mb-4 mx-3">
            <Text className="text-white mb-1">Password</Text>
            <View className="relative">
              <TextInput
                onChangeText={onChange}
                value={value}
                secureTextEntry={!passwordVisible}
                placeholder="Enter Your Password"
                placeholderTextColor="#9ca3af"
                className={`px-4 py-2 pr-10 rounded-xl border text-[#000000] ${
                  error ? 'border-red-500' : 'border-gray-700'
                } bg-[#D8DADC]`}
              />
              <TouchableOpacity
                onPress={togglePasswordVisibility}
                className="absolute right-3 top-3"
              >
                {passwordVisible ? (
                  <Eye size={20} color="#000000" />
                ) : (
                  <EyeOff size={20} color="#000000" />
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

      {/* Remember Me */}
      <Controller
        control={control}
        name="remember"
        render={({ field: { value, onChange } }) => (
          <TouchableOpacity
            className="flex-row mb-2 ml-4 items-center"
            onPress={() => onChange(!value)}
            activeOpacity={0.7}
          >
            {value ? (
              <CheckCircle size={18} color="white" />
            ) : (
              <Circle size={18} color="white" />
            )}
            <Text className="ml-2 text-white">Remember me</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        className="mb-2 self-end"
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        <Text className="text-center border-b-hairline text-white">
          Forgot Password
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        className="bg-white dark:bg-dark-buttonBg1 py-3 rounded-xl mb-4"
        disabled={signinMutation.isPending}
      >
        {signinMutation.isPending ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-center text-[#0083C4] dark:text-white font-semibold">
            Log In
          </Text>
        )}
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-center text-base text-white">
          Don’t have an account?
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text className="font-semibold text-white border-b-hairline">
            {' '}
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaWrapper>
  );
}
