import {
    View,
    Text,
    TextInput,
    Pressable,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api';
import { RichTextInput } from '../components/RichTextEditor';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';

const callTypes = ['Incoming', 'Outgoing', 'Missed', 'Rejected'];

const ShowTemplate = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const template = route.params?.template;
    const isEdit = route.params?.isEdit;

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [errorTitle, setErrorTitle] = useState('');
    const [errorDesc, setErrorDesc] = useState('');
    const [callType, setCallType] = useState(callTypes[0]);

    useEffect(() => {
        if (isEdit && template) {
            setTitle(template.title || '');
            setDescription(template.description || '');

            // Normalize the template_type to match against callTypes
            const matchedType = callTypes.find(
                (type) => type.toLowerCase() === template.template_type?.toLowerCase()
            );
            if (matchedType) {
                setCallType(matchedType);
            }
        }
    }, [isEdit, template]);


    const validate = () => {
        let valid = true;

        if (!title.trim()) {
            setErrorTitle('Template Name is required');
            valid = false;
        } else if (title.length < 3 || title.length > 200) {
            setErrorTitle('Template name must be between 3 and 200 characters');
            valid = false;
        } else {
            setErrorTitle('');
        }

        if (!description.trim()) {
            setErrorDesc('Template Description is required');
            valid = false;
        } else if (description.length < 3 || description.length > 700) {
            setErrorDesc('Description must be between 3 and 700 characters');
            valid = false;
        } else {
            setErrorDesc('');
        }

        return valid;
    };

    const saveTemplate = async () => {
        if (!validate()) return;

        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const payload = {
            title,
            description,
            template_type: callType,
        };

        const headers = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            if (isEdit && template?.id) {
                await api.put(`vendor/templates/${template.id}`, payload, headers);
            } else {
                await api.post(`vendor/templates`, payload, headers);
            }

            Toast.show({
                type: 'success',
                text1: isEdit ? 'Template updated successfully' : 'Template saved successfully',
            });

            navigation.goBack();
        } catch (err) {
            console.log('Template save error:', err);
            Toast.show({
                type: 'error',
                text1: 'Failed to save template',
            });
        }
    };

    return (
        <SafeAreaView className='flex-1 bg-[#FDFDFD] dark:bg-[#2C3E50] py-4'>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 "
            >
                <ScrollView
                    className="flex-1 px-6"
                    keyboardShouldPersistTaps="always"
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    <Text className="text-[#333333] dark:text-[#E0E0E0] font-semibold text-xl py-2">Title</Text>
                    <TextInput
                        placeholder="Template Title"
                        placeholderTextColor="#ccc"
                        value={title}
                        onChangeText={(text) => {
                            setTitle(text);
                            if (errorTitle) setErrorTitle('');
                        }}
                        className="border border-gray-400 rounded-lg p-3 text-base mb-3 text-white bg-black"
                    />
                    {errorTitle !== '' && (
                        <Text className="text-red-500 mt-1 ml-1">{errorTitle}</Text>
                    )}

                    <Text className="text-[#333333] dark:text-[#E0E0E0] font-semibold text-xl py-2">Description</Text>
                    <RichTextInput
                        value={description}
                        onChange={(text) => {
                            setDescription(text);
                            if (errorDesc) setErrorDesc('');
                        }}
                        showPreview={true}
                    />
                    {errorDesc !== '' && (
                        <Text className="text-red-500 mt-1 ml-1">{errorDesc}</Text>
                    )}

                    <Text className="text-[#333333] dark:text-[#E0E0E0] mb-1 text-lg font-semibold">Call Type</Text>
                    {callTypes.map((type) => (
                        <Pressable
                            key={type}
                            onPress={() => setCallType(type)}
                            className={`px-3 py-2 mb-1 rounded-xl ${callType === type ? 'bg-sky-600' : 'bg-neutral-800'}`}
                        >
                            <Text className={callType === type ? 'text-white' : 'text-gray-400'}>
                                {type}
                            </Text>
                        </Pressable>
                    ))}

                    <View className="flex-row justify-between my-4 px-4">
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="bg-gray-700 px-6 py-3 rounded"
                        >
                            <Text className="text-white">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={saveTemplate}
                            className="bg-green-600 px-6 py-3 rounded"
                        >
                            <Text className="text-white font-semibold">Save</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ShowTemplate;
