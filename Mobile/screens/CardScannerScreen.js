import React, { useState, useEffect } from 'react';
import {
    View, Text, TouchableOpacity, ScrollView,
    Modal, Pressable, PermissionsAndroid, Platform, TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Contacts from 'react-native-contacts';
import ImagePicker from 'react-native-image-crop-picker';
import MLKitOcr from 'react-native-mlkit-ocr';
import { Camera, Save, Phone } from 'lucide-react-native';
import Toast from 'react-native-toast-message';

export default function CardScannerScreen() {
    const [text, setText] = useState('');
    const [numbers, setNumbers] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedNumber, setSelectedNumber] = useState(null);
    const [contactName, setContactName] = useState('');

    useEffect(() => {
        requestPermissions();
    }, []);

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
                setText(fullText);
                parseContact(fullText);
            }
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
                setText(fullText);
                parseContact(fullText);
            }
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


    const saveContact = async () => {
        if (!selectedNumber || !contactName.trim()) {
            Toast.show({
                type: 'error',
                text1: 'Validation',
                text2: 'Name and number are required',
                position: 'top',
            });
            return;
        }

        const contact = {
            givenName: contactName.trim(),
            phoneNumbers: [selectedNumber],
        };

        try {
            await Contacts.addContact(contact);
            Toast.show({
                type: 'success',
                text1: 'Saved!',
                text2: `Contact "${contactName}" saved`,
                position: 'top',
            });

            // reset
            setText('');
            setNumbers([]);
            setSelectedNumber(null);
            setContactName('');
            setModalVisible(false);
        } catch (error) {
            console.error('Save Contact Error:', error);
            Toast.show({
                type: 'error',
                text1: 'Error!',
                text2: 'Failed to save contact',
                position: 'top',
            });
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-zinc-900 p-4">
            <Text className="text-xl font-bold text-white my-4">Scan Visiting Card</Text>

            <TouchableOpacity
                onPress={handleScan}
                className="bg-sky-600 rounded-2xl px-4 py-3 flex-row items-center justify-center mb-4"
            >
                <Camera color="white" size={20} className="mr-2" />
                <Text className="text-white text-base font-medium"> Scan Card</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handlePickFromGallery}
                className="bg-purple-600 rounded-2xl px-4 py-3 flex-row items-center justify-center mb-4"
            >
                <Camera color="white" size={20} className="mr-2" />
                <Text className="text-white text-base font-medium"> Pick from Gallery</Text>
            </TouchableOpacity>

            <Text className='text-xl font-semibold text-white'>Instructions :</Text>
            <View className='my-3 p-4 rounded-xl bg-white'>
                <Text className='text-lg text-black font-semibold'>1) It Scans all the text in the image.</Text>
                <Text className='text-lg text-black font-semibold'>2) So crop the image accordigly.</Text>
                <Text className='text-lg text-black font-semibold'>3) User should verfiy the number and name before saving the contact.</Text>
            </View>
            {text ? (
                <View className="bg-zinc-800 p-4 rounded-2xl mb-4 max-h-60">
                    <ScrollView>
                        <Text className="text-white whitespace-pre-line">{text}</Text>
                    </ScrollView>
                </View>
            ) : null}

            {/* FAB Save Button */}
            {numbers.length > 0 && (
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    className="absolute bottom-6 right-6 bg-zinc-800 p-4 rounded-full border border-white"
                >
                    <Save color="white" size={24} />
                </TouchableOpacity>
            )}

            {/* Modal */}
            <Modal
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
            </Modal>
        </SafeAreaView>
    );
}
