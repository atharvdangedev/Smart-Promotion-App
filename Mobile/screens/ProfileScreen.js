import React, { useEffect, useState } from 'react';
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
    Modal,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import { useForm, Controller } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import SubHeader from '../components/SubHeader';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { useUserRole } from '../hooks/UserRoleHook';
import { api } from '../utils/api';

const vendorFields = [
    { name: 'first_name', label: 'First Name' },
    { name: 'last_name', label: 'Last Name' },
    { name: 'email', label: 'Email' },
    { name: 'contact_no', label: 'Contact No' },
    { name: 'business_name', label: 'Business Name' },
    { name: 'business_type', label: 'Business Type' },
    { name: 'business_email', label: 'Business Email' },
    { name: 'business_contact', label: 'Business Contact' },
    { name: 'business_address', label: 'Business Address' },
    { name: 'gst_number', label: 'GST Number' },
    { name: 'website', label: 'Website' },
];

const agentFields = [
    { name: 'first_name', label: 'First Name' },
    { name: 'last_name', label: 'Last Name' },
    { name: 'email', label: 'Email' },
    { name: 'address', label: 'Address' },
    { name: 'contact_no', label: 'Contact No' },
    { name: 'vendor_name', label: 'Vendor Name' },
];

const businessTypes = [
    { label: 'Private Limited', value: 'private limited' },
    { label: 'Limited', value: 'limited' },
    { label: 'LLP', value: 'LLP' },
    { label: 'Proprietor', value: 'proprietor' },
];

export default function ProfileScreen({ navigation }) {
    const role = useUserRole();
    const [userType, setUserType] = useState(null);
    const [fields, setFields] = useState([]);
    const [profilePic, setProfilePic] = useState(null);
    const [profilePicPreview, setProfilePicPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const { control, handleSubmit, reset } = useForm();
    const [logoutModalVisible, setLogoutModalVisible] = useState(false);
    const [businessTypeModal, setBusinessTypeModal] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, [role]);

    const fetchProfile = async () => {
        try {
            if (!role) return;

            setUserType(role);
            const userId = await AsyncStorage.getItem('user_id');
            const response = await api.get(`${role}/${userId}`);

            const data = role === 'vendor' ? response.data?.vendor : response.data?.agent;

            if (role === 'vendor') {
                setFields(vendorFields);
                reset({ ...data });
            } else if (role === 'agent') {
                setFields(agentFields);
                reset({ ...data });
            }
            await AsyncStorage.setItem('profile_pic', data.profile_pic);
            if (data?.profile_pic) {
                const uri = `https://swp.smarttesting.in/uploads/profile/${data.profile_pic}`;
                setProfilePicPreview(uri);
            }
        } catch (error) {
            console.error('API error:', error?.response?.data || error.message);
            Toast.show({
                type: 'error',
                text1: 'Profile Load Failed',
                text2: error?.response?.data?.message || 'Something went wrong',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSelectImage = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, response => {
            if (response.assets && response.assets.length > 0) {
                const asset = response.assets[0];
                setProfilePic({
                    uri: asset.uri,
                    type: asset.type || 'image/jpeg',
                    fileName: asset.fileName || 'profile.jpg',
                });
                setProfilePicPreview(asset.uri);
            }
        });
    };

    const handleSave = async (data) => {
        try {
            const userType = await AsyncStorage.getItem('user_type');
            const userId = await AsyncStorage.getItem('user_id');

            if (!userType || !userId) {
                console.error('User data not found in storage.');
                return;
            }

            const formData = new FormData();

            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formData.append(key, value);
                }
            });

            if (profilePic?.uri) {
                formData.append('profile_pic', {
                    uri: profilePic.uri,
                    type: profilePic.type,
                    name: profilePic.fileName,
                });
            }

            const response = await api.post(`${userType}/${userId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            fetchProfile();
            Toast.show({
                type: 'success',
                text1: 'Saved',
                text2: 'Data saved successfully',
                position: 'top',
            });
        } catch (error) {
            console.error('Update error:', error.response?.data || error.message);
            alert('Failed to update profile. Please try again.');
        }
    };

    return (
        <SafeAreaWrapper className="flex-1 bg-light-background dark:bg-dark-background">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                {loading ? (
                    <ActivityIndicator size="large" color="#0ea5e9" className="mt-32" />
                ) : (
                    <ScrollView
                        className="px-5"
                        contentContainerStyle={{ paddingBottom: 20 }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <SubHeader title={`Profile (${userType})`} />

                        {/* Header and Profile Pic */}
                        <View className="relative mt-4 mb-8">
                            <ImageBackground
                                source={require('../assets/header-bg.jpg')}
                                resizeMode="cover"
                                className="h-44 w-full rounded-b-3xl overflow-hidden"
                            >
                                <View className="flex-1 bg-black/30 rounded-b-3xl" />
                            </ImageBackground>

                            <View className="absolute top-28 left-1/2 -ml-12">
                                <TouchableOpacity
                                    onPress={handleSelectImage}
                                    className="w-24 h-24 rounded-full bg-gray-700 border-4 border-black justify-center items-center overflow-hidden"
                                >
                                    {profilePicPreview ? (
                                        <Image
                                            source={{ uri: profilePicPreview }}
                                            className="w-full h-full rounded-full"
                                        />
                                    ) : (
                                        <Text className="text-gray-400 text-sm mb-2">Upload</Text>
                                    )}
                                    <View className="absolute bottom-2 right-3 bg-white p-1 rounded-full border border-black">
                                        <Camera size={16} color="black" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Form Inputs */}
                        {fields.map(({ name, label }) => (
                            <Controller
                                key={name}
                                control={control}
                                name={name}
                                rules={{
                                    required: `${label} is required`,
                                    ...(name === 'first_name' || name === 'last_name'
                                        ? {
                                            minLength: { value: 2, message: `${label} must be at least 2 characters` },
                                            maxLength: { value: 50, message: `${label} must be less than 50 characters` },
                                        }
                                        : {}),
                                    ...(name === 'business_name'
                                        ? {
                                            minLength: { value: 2, message: 'Business name must be at least 2 characters' },
                                            maxLength: { value: 100, message: 'Business name must be less than 100 characters' },
                                        }
                                        : {}),
                                    ...(name === 'email'
                                        ? {
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: 'Invalid email format',
                                            },
                                        }
                                        : {}),
                                    ...(name === 'website'
                                        ? {
                                            pattern: {
                                                value: /^(https?:\/\/)?([\w\d-]+\.)+[\w]{2,}(\/.*)?$/,
                                                message: 'Invalid website URL',
                                            },
                                        }
                                        : {}),
                                    ...(name === 'contact_no'
                                        ? {
                                            pattern: {
                                                value: /^[0-9]{7,15}$/,
                                                message: 'Contact number must be 7-15 digits',
                                            },
                                        }
                                        : {}),
                                    ...(name === 'business_contact'
                                        ? {
                                            pattern: {
                                                value: /^[0-9]{7,15}$/,
                                                message: 'Business contact number must be 7-15 digits',
                                            },
                                        }
                                        : {}),
                                }}
                                render={({
                                    field: { onChange, value },
                                    fieldState: { error },
                                }) => (
                                    <View className="mb-4 mx-3">
                                        <Text className="text-light-text dark:text-dark-text mb-1">
                                            {label}
                                        </Text>

                                        {name === 'business_type' ? (
                                            <>
                                                <TouchableOpacity
                                                    onPress={() => setBusinessTypeModal(true)}
                                                    className={`px-4 py-2 rounded-xl border ${error ? 'border-red-500' : 'border-gray-700'} bg-light-background dark:bg-dark-background`}
                                                >
                                                    <Text className={`text-light-subtext dark:text-dark-subtext ${!value ? 'text-gray-400' : ''}`}>
                                                        {value ? businessTypes.find(b => b.value === value)?.label : 'Select business type'}
                                                    </Text>
                                                </TouchableOpacity>

                                                <Modal
                                                    transparent
                                                    visible={businessTypeModal}
                                                    animationType="fade"
                                                    onRequestClose={() => setBusinessTypeModal(false)}
                                                >
                                                    <View className="flex-1 justify-center items-center bg-black/50">
                                                        <View className="bg-light-background dark:bg-dark-background w-80 rounded-xl p-4">
                                                            {businessTypes.map(item => (
                                                                <TouchableOpacity
                                                                    key={item.value}
                                                                    onPress={() => {
                                                                        onChange(item.value);
                                                                        setBusinessTypeModal(false);
                                                                    }}
                                                                    className="py-3 border-b border-gray-300"
                                                                >
                                                                    <Text className="text-light-text dark:text-dark-text">{item.label}</Text>
                                                                </TouchableOpacity>
                                                            ))}
                                                            <TouchableOpacity
                                                                onPress={() => setBusinessTypeModal(false)}
                                                                className="mt-3 py-3 bg-gray-200 rounded-xl"
                                                            >
                                                                <Text className="text-center text-black font-semibold">Cancel</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </Modal>
                                            </>
                                        ) : (
                                            <TextInput
                                                value={value}
                                                onChangeText={(text) => {
                                                    if (name === 'contact_no' || name === 'business_contact') {
                                                        onChange(text.replace(/[^0-9]/g, ''));
                                                    } else {
                                                        onChange(text);
                                                    }
                                                }}
                                                placeholder={`Enter ${label.toLowerCase()}`}
                                                placeholderTextColor="#9ca3af"
                                                keyboardType={name === 'contact_no' || name === 'business_contact' ? 'numeric' : 'default'}
                                                secureTextEntry={name === 'password'}
                                                editable={name !== 'email'}
                                                selectTextOnFocus={name !== 'email'}
                                                maxLength={name === 'contact_no' || name === 'business_contact' ? 15 : undefined}
                                                className={`px-4 py-2 rounded-xl border-light-border dark:border-dark-border text-light-subtext dark:text-dark-subtext border ${error ? 'border-red-500' : 'border-gray-700'} bg-light-background dark:bg-dark-background`}
                                            />
                                        )}

                                        {error && (
                                            <Text className="text-light-danger dark:text-dark-danger text-xs mt-1">
                                                {error.message}
                                            </Text>
                                        )}
                                    </View>
                                )}
                            />
                        ))}

                        {/* Save */}
                        <TouchableOpacity
                            onPress={handleSubmit(handleSave)}
                            className="mt-6 bg-white border border-black rounded-xl py-3 mb-6"
                        >
                            <Text className="text-black text-center font-semibold">
                                Save Profile
                            </Text>
                        </TouchableOpacity>

                        {/* Change Password */}
                        <TouchableOpacity
                            onPress={() => navigation.navigate('ChangePassword')}
                            className="bg-white border border-black rounded-xl py-3 mb-6"
                        >
                            <Text className="text-black text-center font-semibold">
                                Change Password
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('SelectContacts')}
                            className="bg-white border border-black rounded-xl py-3 mb-6"
                        >
                            <Text className="text-black text-center font-semibold">
                                Export Contacts
                            </Text>
                        </TouchableOpacity>

                        {/* Logout */}
                        <TouchableOpacity
                            onPress={() => setLogoutModalVisible(true)}
                            className="bg-black border border-light-border dark:border-dark-border rounded-xl py-3 mb-6"
                        >
                            <Text className="text-white text-center font-semibold">Logout</Text>
                        </TouchableOpacity>

                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={logoutModalVisible}
                            onRequestClose={() => setLogoutModalVisible(false)}
                        >
                            <View className="flex-1 justify-center items-center bg-black/50 px-6">
                                <View className="bg-light-background dark:bg-dark-background w-full rounded-xl p-6">
                                    <Text className="text-xl font-semibold mb-4 text-light-text dark:text-dark-text text-center">
                                        Confirm Logout
                                    </Text>
                                    <Text className="text-light-text dark:text-dark-text text-center mb-6">
                                        Are you sure you want to logout?
                                    </Text>
                                    <View className="flex-row justify-between">
                                        <TouchableOpacity
                                            className="flex-1 bg-gray-200 rounded-xl py-3 mr-2"
                                            onPress={() => setLogoutModalVisible(false)}
                                        >
                                            <Text className="text-center text-black font-semibold">
                                                Cancel
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            className="flex-1 bg-black rounded-xl py-3 ml-2"
                                            onPress={async () => {
                                                setLogoutModalVisible(false);
                                                await AsyncStorage.multiRemove([
                                                    'token',
                                                    'user_type',
                                                    'user_id',
                                                    'username',
                                                    'profile_pic',
                                                ]);
                                                navigation.reset({
                                                    index: 0,
                                                    routes: [{ name: 'SignIn' }],
                                                });
                                            }}
                                        >
                                            <Text className="text-center text-white font-semibold">
                                                Logout
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </ScrollView>
                )}
            </KeyboardAvoidingView>
        </SafeAreaWrapper>
    );
}
