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

export default function CardScannerScreen() {
    const [text, setText] = useState('');
    const [numbers, setNumbers] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedNumber, setSelectedNumber] = useState(null);
    const [contactName, setContactName] = useState('');

    useEffect(() => {
        requestPermissions();
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

    const parseContact = (rawText) => {
        const cleanedText = rawText.replace(/\s+/g, ' ').trim();
        const nameMatch = rawText.split('\n')[0]?.trim();
        const name = nameMatch || 'Unknown';

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

        setContactName(name);
        setNumbers(phones);
        setSelectedNumber(phones[0]);
        setModalVisible(true);
    };

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
        <SafeAreaView className="flex-1 bg-[#FDFDFD] dark:bg-[#2C3E50] p-4">
            <Header title='Card Scanner' profilePic={true} />
            <Text className="text-2xl font-bold text-[#333333] dark:text-[#E0E0E0] text-center mt-8">Add Contacts Instantly</Text>
            <Text className='text-lg font-medium text-[#888888] dark:text-[#A0A0A0] text-center my-2'>Scan a bussiness card or upload an image to automatically extract the contact details.</Text>


            {/* <Text className='text-xl font-semibold text-white'>Instructions :</Text>
            <View className='my-3 p-4 rounded-xl bg-white'>
                <Text className='text-lg text-black font-semibold'>1) It Scans all the text in the image.</Text>
                <Text className='text-lg text-black font-semibold'>2) So crop the image accordigly.</Text>
                <Text className='text-lg text-black font-semibold'>3) User should verify the number and name before saving the contact.</Text>
                <Text className='text-lg text-black font-semibold'>4) It will scan only valid Indian numbers.</Text>
            </View> */}
            {/* {text ? (
                <View className="bg-zinc-800 p-4 rounded-2xl mb-4 max-h-60">
                    <ScrollView>
                        <Text className="text-[#333333] dark:text-[#E0E0E0] whitespace-pre-line">{text}</Text>
                    </ScrollView>
                </View>
            ) : null} */}

            {/* FAB Save Button */}
            {numbers.length > 0 && (
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    className="absolute bottom-6 right-6 bg-zinc-800 p-4 rounded-full border border-white"
                >
                    <Save color="white" size={24} />
                </TouchableOpacity>
            )}

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
                    className="border border-[#E0E0E0] dark:border-[#4A5568] rounded-2xl px-4 py-3 flex-row items-center justify-center w-full"
                >
                    <Upload color={iconcolor} size={20} className="mr-2" />
                    <Text className="text-[#333333] dark:text-[#E0E0E0] text-base font-medium"> Upload from Gallery</Text>
                </TouchableOpacity>
            </View>

            {/* Modal */}
            {/* <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 bg-black/60 justify-end">
                    <View className="bg-zinc-900 p-4 rounded-t-2xl">
                        <Text className="text-white mb-1">Contact Name</Text>
                        <View className="bg-zinc-800 rounded-xl px-4 py-2 mb-4">
                            <TextInput
                                placeholder="Enter contact name"
                                placeholderTextColor="#aaa"
                                className="text-white text-base"
                                value={contactName}
                                onChangeText={setContactName}
                            />
                        </View>

                        <Text className="text-white text-lg font-semibold mb-2">Select Number</Text>

                        {numbers.map((item, index) => (
                            <Pressable
                                key={index}
                                onPress={() => setSelectedNumber(item)}
                                className={`flex-row items-center px-4 py-3 rounded-xl mb-2 ${selectedNumber?.number === item.number
                                    ? 'bg-sky-600'
                                    : 'bg-zinc-800'
                                    }`}
                            >
                                <Phone color="white" size={18} className="mr-2" />
                                <Text className="text-white text-base">{item.number}</Text>
                            </Pressable>
                        ))}

                        <TouchableOpacity
                            onPress={saveContact}
                            className="bg-green-600 rounded-xl py-3 mt-4"
                        >
                            <Text className="text-center text-white text-base font-medium">
                                Save Contact
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal> */}
        </SafeAreaView>
    );
}
