import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import { Camera } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api';

// Input Component
const Input = ({ label, placeholder, name, formData, handleChange, errors }) => {
    const [focused, setFocused] = useState(false);
    const error = errors[name];

    return (
        <View className="mb-4 mx-3">
            <Text className="text-gray-300 mb-1">{label}</Text>
            <TextInput
                className={`px-4 py-2 rounded-xl bg-gray-800 text-white border ${focused ? 'border-white' : error ? 'border-red-500' : 'border-gray-700'
                    }`}
                placeholder={placeholder}
                placeholderTextColor="#9ca3af"
                value={formData[name] || ''}
                onChangeText={(text) => handleChange(name, text)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />
            {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
        </View>
    );
};

export default function ProfileScreen({ navigation }) {
    const [profilePic, setProfilePic] = useState(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contact: '',
        vendorId: '',
        // businessName: '',
        // businessType: '',
        // businessEmail: '',
        // businessContact: '',
        // businessAddress: '',
        // gst: '',
        // website: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        const requiredFields = ['firstName', 'lastName', 'email', 'contact', 'vendorId'];

        requiredFields.forEach((field) => {
            if (!formData[field]) {
                newErrors[field] = 'This field is required';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validate()) {
            console.log('Form submitted:', formData);
        }
    };

    const handleSelectImage = () => {
        const options = {
            mediaType: 'photo',
            quality: 0.7,
            includeBase64: false,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets && response.assets.length > 0) {
                const uri = response.assets[0].uri;
                setProfilePic(uri);
            }
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-black">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView
                    className="flex-1 bg-black px-5 py-2"
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingBottom: 30 }}
                >
                    <Text className="text-3xl font-bold text-white mb-3 text-center">Profile</Text>

                    {/* Header with background image */}
                    <View className="relative mb-8">
                        <ImageBackground
                            source={require('../assets/header-bg.jpg')}
                            resizeMode="cover"
                            className="h-44 w-full rounded-b-3xl overflow-hidden"
                        >
                            <View className="flex-1 bg-black/30 rounded-b-3xl" />
                        </ImageBackground>

                        {/* Profile Picture */}
                        <View className="absolute top-28 left-1/2 -ml-12">
                            <TouchableOpacity
                                onPress={handleSelectImage}
                                className="w-24 h-24 rounded-full bg-gray-700 border-4 border-black justify-center items-center overflow-hidden"
                            >
                                {profilePic ? (
                                    <Image source={{ uri: profilePic }} className="w-full h-full rounded-full" />
                                ) : (
                                    <Text className="text-gray-400 text-sm">Upload</Text>
                                )}
                                <View className="absolute bottom-1 right-1 bg-white p-1 rounded-full border border-black">
                                    <Camera size={16} color="black" />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Agent Fields Only */}
                    <Input name="firstName" label="First Name" placeholder="Enter first name" {...{ formData, handleChange, errors }} />
                    <Input name="lastName" label="Last Name" placeholder="Enter last name" {...{ formData, handleChange, errors }} />
                    <Input name="email" label="Email" placeholder="Enter email" {...{ formData, handleChange, errors }} />
                    <Input name="contact" label="Contact No" placeholder="Enter contact number" {...{ formData, handleChange, errors }} />
                    <Input name="vendorId" label="Vendor ID" placeholder="Enter vendor ID" {...{ formData, handleChange, errors }} />

                    {/* Save Button */}
                    <TouchableOpacity
                        onPress={handleSave}
                        className="mt-6 bg-white border border-white rounded-xl py-3 mb-6"
                    >
                        <Text className="text-black text-center font-semibold">Save Profile</Text>
                    </TouchableOpacity>
                    {/* Logout Button */}

                    <TouchableOpacity
                        onPress={() => {
                            Alert.alert(
                                'Logout',
                                'Are you sure you want to logout?',
                                [
                                    { text: 'Cancel', style: 'cancel' },
                                    {
                                        text: 'Logout',
                                        style: 'destructive',
                                        onPress: async () => {
                                            try {
                                                const token = await AsyncStorage.getItem('token');

                                                if (token) {
                                                    await api.post(
                                                        'admin-logout',
                                                        {},
                                                        {
                                                            headers: {
                                                                Authorization: `Bearer ${token}`,
                                                            },
                                                        }
                                                    );
                                                }

                                                await AsyncStorage.removeItem('token');
                                                navigation.reset({
                                                    index: 0,
                                                    routes: [{ name: 'SignIn' }],
                                                });
                                            } catch (error) {
                                                console.error('Logout Error:', error);
                                                await AsyncStorage.removeItem('token'); // fallback
                                                navigation.reset({
                                                    index: 0,
                                                    routes: [{ name: 'SignIn' }],
                                                });
                                            }
                                        },
                                    },
                                ],
                                { cancelable: true }
                            );
                        }}
                        className="bg-black border border-white rounded-xl py-3 mb-6"
                    >
                        <Text className="text-white text-center font-semibold">Logout</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
