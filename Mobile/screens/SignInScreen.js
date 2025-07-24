import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ActivityIndicator, useColorScheme } from 'react-native';
import InputField from '../components/InputField';
import { api } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Check } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');
    const [error, setError] = useState('');
    const [error2, setError2] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            // setFormError('Please enter both email and password');
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

            console.log('Login Response:', JSON.stringify(res.data, null, 2));

            if (res.data?.status === true && res.data.token) {
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

                if (rememberMe) {
                    await AsyncStorage.setItem('remember_me', '1');
                } else {
                    await AsyncStorage.setItem('remember_me', '0');
                }
                await AsyncStorage.setItem('token', token);
                await AsyncStorage.setItem('user_id', user.id.toString());
                await AsyncStorage.setItem('user_type', user.rolename);


                navigation.reset({
                    index: 0,
                    routes: [{ name: 'HomeScreen' }]
                });
            }
            else {
                setFormError(res.data?.message || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Login Error:', error);

            if (error.response && error.response.data?.message) {
                setFormError(error.response.data.message);
            } else {
                setFormError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };


    const handleEmailChange = (text) => {
        const txt = text.toLowerCase();
        setEmail(txt);
        if (formError) setFormError('');
        if (error) setError('');
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
        if (formError) setFormError('');
        if (error2) setError2('');
    };

    const [passwordVisible, setPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const theme = useColorScheme();

    return (
        <SafeAreaView className='flex-1 justify-center px-6 bg-[#FDFDFD] dark:bg-[#2C3E50]'>
            <Text className="text-3xl font-bold mb-12 text-center text-[#333333] dark:text-[#E0E0E0]">Sign In </Text>
            {/* <Text className="text-2xl font-semibold mb-20 text-center text-black">Glad to see you, Again! </Text> */}

            <InputField icon="user" placeholder="Email" value={email} onChangeText={handleEmailChange} />
            {error === 'email' && (
                <Text className="text-[#FF6B6B] text-sm mb-3 text-center">Email is required</Text>
            )}
            {formError ? (
                <Text className="text-[#FF6B6B] text-sm mb-3 text-center">{formError}</Text>
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
                <Text className="text-[#FF6B6B] text-sm  text-center">Password is required</Text>
            )}

            {/* Remember Me Checkbox */}
            <TouchableOpacity
                className=" mb-4"
                onPress={() => setRememberMe(!rememberMe)}
                activeOpacity={0.7}
            >
                <View className='flex-row items-center justify-between mx-1'>
                    <View className='flex-row'>
                        <View className={`h-5 w-5 mr-2 border-2 rounded ${rememberMe ? 'bg-black border-black' : 'border-gray-400'}`}>
                            {rememberMe && <Check size={16} color="white" />}
                        </View>
                        <Text className="text-black">Remember me</Text>
                    </View>
                    <TouchableOpacity
                        className=''
                        onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text className="text-center border-b-hairline text-gray-500">Forgot Password</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogin} className="bg-black py-3 rounded-xl mb-4" disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-center text-white font-semibold">Log In</Text>}
            </TouchableOpacity>

            <View className='flex-row justify-center'>
                <Text className="text-center text-base text-gray-500">
                    Don’t have an account?
                </Text>
                <TouchableOpacity >
                    <Text className="font-semibold text-black border-b-hairline"> Sign Up</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}