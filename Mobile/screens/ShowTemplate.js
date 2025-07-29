import { View, Text, TextInput, Pressable, TouchableOpacity, Keyboard, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';


const callTypes = ['Incoming', 'Outgoing', 'Missed', 'Rejected'];
const windowWidth = Dimensions.get('window').width;

const ShowTemplate = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [preview, setPreview] = useState('');
    const [isDescFocused, setIsDescFocused] = useState(false);
    const [selection, setSelection] = useState({ start: 0, end: 0 });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState('');
    const [error2, setError2] = useState('');

    const navigation = useNavigation();
    const route = useRoute();

    const [newTemplate, setNewTemplate] = useState({
        title: '',
        text: '',
        type: callTypes[0],
        active: false,
    });


    useEffect(() => {
        if (route.params?.isEdit && route.params?.template) {
            const { template } = route.params;
            setEditMode(true);
            setEditId(template.id);
            setTitle(template.title);
            setDescription(template.description);
            setPreview(template.description);
            setNewTemplate({ ...newTemplate, type: template.template_type });
        }
    }, [route.params]);

    const handleSaveTemplate = async () => {
        let hasError = false;

        // Validate title
        if (!title.trim()) {
            setError("Template Name is required");
            hasError = true;
        } else if (title.trim().length < 3 || title.trim().length > 200) {
            setError("Template name must be between 3 and 200 characters");
            hasError = true;
        } else {
            setError('');
        }

        // Validate description
        if (!description.trim()) {
            setError2("Template description is required");
            hasError = true;
        } else if (description.trim().length < 3 || description.trim().length > 700) {
            setError2("Description must be between 3 and 700 characters");
            hasError = true;
        } else {
            setError2('');
        }

        if (hasError) return;


        try {
            const token = await AsyncStorage.getItem('token');

            if (!token) {
                Toast.show({
                    type: 'error',
                    text1: 'User not authenticated',
                });
                return;
            }

            const payload = {
                title: title.trim(),
                description: description.trim(),
                template_type: newTemplate.type,
            };

            const url = editMode
                ? `vendor/templates/${editId}`
                : `vendor/templates`;

            const response = await api.post(url, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 200 || response.status === 201) {
                Toast.show({
                    type: 'success',
                    text1: `Template ${editMode ? 'updated' : 'created'} successfully`,
                });

                setTitle('');
                setDescription('');
                setPreview('');
                setEditMode(false);
                setEditId(null);
                navigation.goBack();
                route.params?.onGoBack?.();
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Unexpected server response',
                });
            }
        } catch (err) {
            console.error(err.response?.data || err.message);
            Toast.show({
                type: 'error',
                text1: 'Failed to save template',
            });
        }
    };


    const formatText = (symbolStart, symbolEnd = symbolStart) => {
        const start = selection.start;
        const end = selection.end;
        const before = description.slice(0, start);
        const selected = description.slice(start, end);
        const after = description.slice(end);

        const newText = before + symbolStart + selected + symbolEnd + after;
        setDescription(newText);
        setPreview(newText);
    };

    const renderFormattedText = (text) => {
        const elements = [];

        const patterns = [
            { regex: /\*([^\*]+)\*/, style: { fontWeight: 'bold' } },
            { regex: /_([^_]+)_/, style: { fontStyle: 'italic' } },
            { regex: /~([^~]+)~/, style: { textDecorationLine: 'line-through' } },
            { regex: /```([\s\S]+?)```/, style: { fontFamily: 'monospace' } },
        ];

        let remaining = text;

        while (remaining.length > 0) {
            let found = false;

            for (let { regex, style } of patterns) {
                const match = remaining.match(regex);
                if (match) {
                    const [fullMatch, innerText] = match;
                    const before = remaining.slice(0, match.index);
                    if (before) elements.push(<Text key={elements.length} style={{ color: 'white' }}>{before}</Text>);
                    elements.push(<Text key={elements.length} style={[{ color: 'white' }, style]}>{innerText}</Text>);
                    remaining = remaining.slice(match.index + fullMatch.length);
                    found = true;
                    break;
                }
            }

            if (!found) {
                elements.push(<Text key={elements.length} style={{ color: 'white' }}>{remaining}</Text>);
                break;
            }
        }

        return elements;
    };

    return (
        <View className='flex-1 bg-black px-6 pt-6'>
            <Text className='text-white font-semibold text-xl py-2 px-2'>Template Name</Text>
            <TextInput
                placeholder="Template Name"
                placeholderTextColor="#ccc"
                value={title}
                onChangeText={(text) => {
                    setTitle(text);
                    if (text.trim().length >= 3 && text.trim().length <= 200) {
                        setError('');
                    }
                }}
                className="border border-gray-700 rounded-xl text-lg text-white bg-black px-3 py-2 mb-0"
            />

            {error && (
                <Text className="text-red-500 text-sm mb-3 text-center py-2">{error}</Text>
            )}

            <Text className='text-white font-semibold text-xl py-2 px-2'>Description</Text>

            {isDescFocused && (
                <View
                    className="absolute top-[140] left-6 right-6 z-10 bg-neutral-900 border border-gray-600 rounded-xl flex-row justify-around py-2"
                    style={{ width: windowWidth - 48 }}
                >
                    <TouchableOpacity onPress={() => formatText('*')}>
                        <Text className="text-white font-bold">B</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => formatText('_')}>
                        <Text className="text-white italic">I</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => formatText('~')}>
                        <Text className="text-white line-through">S</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => formatText('```')}>
                        <Text className="text-white font-mono">Mono</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TextInput
                placeholder="Template description"
                placeholderTextColor="#ccc"
                value={description}
                multiline
                numberOfLines={10}
                scrollEnabled={true}
                onChangeText={(text) => {
                    setDescription(text);
                    setPreview(text);
                    if (text.trim().length >= 3 && text.trim().length <= 700) {
                        setError2('');
                    }
                }}

                onFocus={() => setIsDescFocused(true)}
                onBlur={() => setIsDescFocused(false)}

                onSelectionChange={({ nativeEvent: { selection } }) => setSelection(selection)}
                className="border border-gray-700 rounded-xl h-44 bg-black px-3 py-2 mb-3"
            />
            {error2 && (
                <Text className="text-red-500 text-sm mb-3 text-center py-2">{error2}</Text>
            )}
            <View>
                <Text className='text-white text-lg'>Preview: </Text>
                <View className='border border-gray-700 rounded-xl px-3 my-2 py-2'>
                    <Text numberOfLines={3} ellipsizeMode="tail" className="text-white">
                        {renderFormattedText(preview)}
                    </Text>
                </View>
            </View>

            <View className="mb-4">
                <Text className="text-gray-300 mb-1 text-lg font-semibold px-2">Call Type</Text>
                {callTypes.map((type) => (
                    <Pressable
                        key={type}
                        onPress={() => setNewTemplate({ ...newTemplate, type })}
                        className={`px-3 py-2 mb-1 rounded-xl ${newTemplate.type === type ? 'bg-sky-600' : 'bg-neutral-800'}`}
                    >
                        <Text className={newTemplate.type === type ? 'text-white' : 'text-gray-400'}>
                            {type}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <View className="flex-row justify-between my-3 px-4">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="bg-gray-700 px-6 py-3 rounded"
                >
                    <Text className="text-white">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="bg-green-600 px-6 py-3 rounded"
                    onPress={handleSaveTemplate}
                >
                    <Text className="text-white font-semibold">
                        {editMode ? "Update" : "Save"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ShowTemplate;
