import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, ScrollView,
    Modal, Pressable, PermissionsAndroid, Platform, TextInput,
    useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Contacts from 'react-native-contacts';
import ImagePicker from 'react-native-image-crop-picker';
import MLKitOcr from 'react-native-mlkit-ocr';
import { Camera, Save, Phone, Upload } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SafeAreaWrapper from '../components/SafeAreaWrapper';

export default function CardScannerScreen() {
    const [numbers, setNumbers] = useState([]);
    // const [modalVisible, setModalVisible] = useState(false);
    // const [contactName, setContactName] = useState('');
    const [profilePic, setProfilePic] = useState('');

    useEffect(() => {
        const init = async () => {
            const filename = await AsyncStorage.getItem('profile_pic');
            if (filename) {
                const url = `https://swp.smarttesting.in/public/uploads/profile/${filename}`;
                setProfilePic(url);
                console.log('scan Url: ', url);
            } else {
                setProfilePic(null); // fallback
            }
        }
        requestPermissions();
        init();
    }, []);


    const navigation = useNavigation();

    const requestPermissions = async () => {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.CAMERA,
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            ]);

            const allGranted = Object.values(granted).every(
                status => status === PermissionsAndroid.RESULTS.GRANTED
            );

            if (!allGranted) {
                Toast.show({
                    type: 'error',
                    text1: 'Permission Required',
                    text2: 'Camera, storage and contact access needed!',
                    position: 'top',
                });
            }
        }
    };

    const extractPhoneNumbers = (rawText) => {
        const matches = rawText.match(/(?:\+?\d[\d\s-]{8,})/g);
        if (!matches) return [];

        return matches
            .map(num => num.replace(/[^\d]/g, '')) // digits only
            .filter(num => num.length >= 10 && num.length <= 13)
            .map(num => ({
                label: 'mobile',
                number: num.startsWith('91') ? `+${num}` : `+91${num}`
            }));
    };

    // const parseContact = (rawText) => {
    //     const cleanedText = rawText.replace(/\s+/g, ' ').trim();
    //     const nameMatch = rawText.split('\n')[0]?.trim();
    //     const name = nameMatch || 'Unknown';

    //     const phones = extractPhoneNumbers(cleanedText);

    //     if (phones.length === 0) {
    //         Toast.show({
    //             type: 'error',
    //             text1: 'Oops!',
    //             text2: 'No valid number found',
    //             position: 'top',
    //         });
    //         return;
    //     }

    //     setContactName(name);
    //     setNumbers(phones);
    //     setSelectedNumber(phones[0]);
    //     setModalVisible(true);
    // };

    const handleScan = async () => {
        try {
            const result = await ImagePicker.openCamera({
                cropping: true,
                cropperToolbarTitle: 'Crop Visiting Card',
                compressImageQuality: 0.9,
                freeStyleCropEnabled: true,
                hideBottomControls: false,
            });

            if (result?.path) {
                const ocrResult = await MLKitOcr.detectFromFile(result.path);
                const fullText = ocrResult.map(b => b.text).join('\n');
                parseContactAndNavigate(fullText);
            }
            // if (result?.path) {
            //     const ocrResult = await MLKitOcr.detectFromFile(result.path);
            //     const fullText = ocrResult.map(b => b.text).join('\n');
            //     setText(fullText);
            //     parseContact(fullText);
            // }
        } catch (err) {
            console.log('Scan Error:', err);
            Toast.show({
                type: 'error',
                text1: 'Error!',
                text2: 'Failed to scan image',
                position: 'top',
            });
        }
    };

    const handlePickFromGallery = async () => {
        try {
            const result = await ImagePicker.openPicker({
                cropping: true,
                cropperToolbarTitle: 'Crop Visiting Card',
                compressImageQuality: 0.9,
                freeStyleCropEnabled: true,
                hideBottomControls: false,
            });

            if (result?.path) {
                const ocrResult = await MLKitOcr.detectFromFile(result.path);
                const fullText = ocrResult.map(b => b.text).join('\n');
                parseContactAndNavigate(fullText);
            }
            // if (result?.path) {
            //     const ocrResult = await MLKitOcr.detectFromFile(result.path);
            //     const fullText = ocrResult.map(b => b.text).join('\n');
            //     setText(fullText);
            //     parseContact(fullText);
            // }
        } catch (err) {
            console.log('Gallery Pick Error:', err);
            Toast.show({
                type: 'error',
                text1: 'Error!',
                text2: 'Failed to pick image',
                position: 'top',
            });
        }
    };


    const parseContactAndNavigate = (fullText) => {
        const cleanedText = fullText.replace(/\s+/g, ' ').trim();
        const lines = fullText.split('\n').map(line => line.trim()).filter(Boolean);
        const probableName = lines.find(line => /^[A-Za-z\s]+$/.test(line)) || 'Unknown';

        const phones = extractPhoneNumbers(cleanedText);

        if (phones.length === 0) {
            Toast.show({
                type: 'error',
                text1: 'Oops!',
                text2: 'No valid number found',
                position: 'top',
            });
            return;
        }

        navigation.navigate('CardResultScreen', {
            fullText,
            numbers: phones,
            name: probableName
        });
    };

    const theme = useColorScheme();
    let iconcolor = '';
    if (theme === 'light') {
        iconcolor = '#333333'
    } else {
        iconcolor = '#E0E0E0'
    }

    return (
        <SafeAreaWrapper className="flex-1 bg-light-background dark:bg-dark-background p-4">
            <Header title='Card Scanner' profilePic={profilePic} />
            <Text className="text-2xl font-bold text-light-text dark:text-dark-text text-center mt-8">Add Contacts Instantly</Text>
            <Text className='text-lg font-medium text-light-subtext dark:text-dark-subtext text-center my-2'>Scan a bussiness card or upload an image to automatically extract the contact details.</Text>

            {/* FAB Save Button */}
            {/* {numbers.length > 0 && (
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    className="absolute bottom-6 right-6 bg-zinc-800 p-4 rounded-full border border-white"
                >
                    <Save color="white" size={24} />
                </TouchableOpacity>
            )} */}

            <View className='flex-1 justify-end items-end'>
                <TouchableOpacity
                    onPress={handleScan}
                    className="bg-[#A8E6CF] dark:bg-[#7ED9B0] rounded-2xl px-4 py-3 flex-row items-center justify-center mb-4 w-full"
                >
                    <Camera color="black" size={20} className="mr-2" />
                    <Text className="text-[#333333] text-base font-medium"> Scan with Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handlePickFromGallery}
                    className="border border-light-border dark:border-dark-border rounded-2xl px-4 py-3 flex-row items-center justify-center w-full"
                >
                    <Upload color={iconcolor} size={20} className="mr-2" />
                    <Text className="text-light-text dark:text-dark-text text-base font-medium"> Upload from Gallery</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaWrapper>
    );
}
