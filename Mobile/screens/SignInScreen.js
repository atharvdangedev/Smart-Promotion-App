import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import InputField from '../components/InputField';
import { api } from '../utils/api';
import { Check } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '../store/useAuthStore';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [error, setError] = useState('');
  const [error2, setError2] = useState('');
  const setAuth = useAuthStore(state => state.setAuth);

  useFocusEffect(
    useCallback(() => {
      setError('');
      setError2('');
      setFormError('');
    }, []),
  );

  const handleLogin = async () => {
    if (!email || !password) {
      if (!email) setError('email');
      if (!password) setError2('password');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('login', {
        email,
        password,
        remember: rememberMe ? 1 : 0,
      });

      if (res.status === 200 && res.data.token) {
        const { token, user } = res.data;

        if (user.rolename === 'affiliate') {
          Toast.show({
            type: 'error',
            text1: 'Affiliate User Found!',
            text2: 'Affiliate users are not allowed',
            position: 'top',
          });
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
      } else {
        Toast.show({
          type: 'error',
          text1: res.data?.message,
        });
      }
    } catch (error) {
      console.error('Login Error:', error);
      let message =
        error.response?.data?.message ||
        'Something went wrong. Please try again.';
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: message,
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = text => {
    setEmail(text);
    if (formError) setFormError('');
    if (error) setError('');
  };

  const handlePasswordChange = text => {
    setPassword(text);
    if (formError) setFormError('');
    if (error2) setError2('');
  };

  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <SafeAreaWrapper className="flex-1 justify-center px-6 bg-light-background dark:bg-dark-background">
      <Text className="text-3xl font-bold mb-12 text-center text-light-text dark:text-dark-text">
        Sign In{' '}
      </Text>

      <InputField
        icon="user"
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={handleEmailChange}
      />
      {error === 'email' && (
        <Text className="text-light-danger dark:text-dark-danger text-sm mb-3 text-center">
          Email is required
        </Text>
      )}
      {formError ? (
        <Text className="text-light-danger dark:text-dark-danger text-sm mb-3 text-center">
          {formError}
        </Text>
      ) : null}
      <InputField
        icon="lock"
        placeholder="Password"
        secureTextEntry={!passwordVisible}
        value={password}
        onChangeText={handlePasswordChange}
        isPassword
        togglePasswordVisibility={togglePasswordVisibility}
      />
      {error2 === 'password' && (
        <Text className="text-light-danger dark:text-dark-danger text-sm  text-center">
          Password is required
        </Text>
      )}

      <View className="flex-row items-center justify-between mx-1">
        <View className="flex-row">
          <TouchableOpacity
            className="flex-row mb-2 items-center justify-center"
            onPress={() => setRememberMe(!rememberMe)}
            activeOpacity={0.7}
          >
            <View
              className={`h-5 w-5 mr-2 border-2 rounded ${rememberMe ? 'bg-black border-black' : 'border-gray-400'}`}
            >
              {rememberMe && <Check size={16} color="white" />}
            </View>
            <Text className="text-light-text dark:text-dark-text">
              Remember me
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          className="mb-2"
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text className="text-center border-b-hairline text-gray-500">
            Forgot Password
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleLogin}
        className="bg-black py-3 rounded-xl mb-4"
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-center text-white font-semibold">Log In</Text>
        )}
      </TouchableOpacity>

      <View className="flex-row justify-center">
        <Text className="text-center text-base text-gray-500">
          Don’t have an account?
        </Text>
        <TouchableOpacity>
          <Text className="font-semibold text-gray-5 border-b-hairline">
            {' '}
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaWrapper>
  );
}
