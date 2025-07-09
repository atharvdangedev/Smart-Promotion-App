import React, { useEffect, useRef, useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Switch,
    Pressable, ActivityIndicator, Alert,
    ToastAndroid,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pencil, Trash, Plus } from 'lucide-react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api';

const callTypes = ['Incoming', 'Outgoing', 'Missed', 'Rejected'];

export default function TemplateScreen() {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [newTemplate, setNewTemplate] = useState({
        title: '',
        text: '',
        type: callTypes[0],
        active: true,
    });
    const [editIndex, setEditIndex] = useState(null);
    const webviewRef = useRef(null);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await api.get('vendor/templates', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            if (response.data.status && Array.isArray(response.data.templates)) {
                setTemplates(response.data.templates);
            } else {
                console.error('Invalid API response', response.data);
            }
        } catch (error) {
            console.error('Failed to load templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (index = null) => {
        setEditIndex(index);
        setNewTemplate(index !== null ? {
            title: templates[index].title || '',
            text: templates[index].description || '',
            type: templates[index].template_type || callTypes[0],
            active: templates[index].status === '1'
        } : {
            title: '',
            text: '',
            type: callTypes[0],
            active: true,
        });
        setModalVisible(true);
    };

    const saveTemplate = () => {
        console.log('💾 Save button pressed');
        if (webviewRef.current) {
            webviewRef.current.injectJavaScript(`
        document.dispatchEvent(new MessageEvent('message', { data: "getContent" }));
        true;
      `);
        }
    };

    const onMessage = async (event) => {
        const htmlContent = event.nativeEvent.data;
        console.log('📩 Received from WebView:', htmlContent);

        try {
            const token = await AsyncStorage.getItem('token');
            const currentTemplate = { ...newTemplate };

            if (!currentTemplate.title?.trim()) {
                return Alert.alert('Validation Error', 'Please enter a title');
            }

            if (!currentTemplate.type?.trim()) {
                return Alert.alert('Validation Error', 'Please select a call type');
            }

            const isEditing = editIndex !== null;
            const templateId = isEditing ? templates[editIndex].id : null;

            const url = isEditing
                ? `vendor/templates/${templateId}`
                : 'vendor/templates';


            const response = await api.post(url, {
                title: currentTemplate.title.trim(),
                description: htmlContent,
                template_type: currentTemplate.type.toLowerCase(),
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            });

            if (response.data.status) {
                if (Platform.OS === 'android') {
                    ToastAndroid.show(
                        isEditing ? 'Template updated successfully!' : 'Template saved successfully!',
                        ToastAndroid.SHORT
                    );
                }

                await fetchTemplates(); // this refreshes the list
                setModalVisible(false);
                setEditIndex(null);


                setModalVisible(false);
                setEditIndex(null);
            } else {
                Alert.alert('Error', response.data.message || 'Failed to save template');
            }
        } catch (error) {
            console.error('Error saving/updating template:', error);
            Alert.alert('Error', 'Something went wrong while saving/updating template');
        }
    };


    const handleDelete = (id) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this template?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteTemplate(id),
                },
            ]
        );
    };


    const deleteTemplate = async (id) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await api.delete(`vendor/templates/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });

            if (response.data.status) {
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Template deleted successfully!', ToastAndroid.SHORT);
                }
                await fetchTemplates(); // Refresh list
            } else {
                Alert.alert('Error', response.data.message || 'Failed to delete template');
            }
        } catch (error) {
            console.error('❌ Error deleting template:', error);
            Alert.alert('Error', 'Something went wrong while deleting template');
        }
    };


    const toggleTemplateStatus = async (template) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const newStatus = template.status === '1' ? '0' : '1';

            const response = await api.put(
                `vendor/update-template-status/${template.id}`,
                {}, // No body required
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                }
            );

            if (response.data.status) {
                if (Platform.OS === 'android') {
                    ToastAndroid.show('Template status updated!', ToastAndroid.SHORT);
                }
                await fetchTemplates(); // Refresh the list
            } else {
                Alert.alert('Error', response.data.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('❌ Error updating template status:', error);
            Alert.alert('Error', 'Something went wrong while updating status');
        }
    };


    return (
        <SafeAreaView className="flex-1 bg-black px-4 py-2">
            <Text className="text-white text-2xl font-bold mb-4">Message Templates</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#0ea5e9" className="mt-10" />
            ) : (
                <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
                    {templates.map((template, index) => (
                        <View key={template.id} className="bg-neutral-800 rounded-xl p-4 mb-4 border border-slate-300">
                            <Text className="text-white text-lg font-bold mb-2">{template.title}</Text>
                            <View className="bg-neutral-900 p-2 rounded">
                                <Text className="text-gray-300">{template.description.replace(/<[^>]*>?/gm, '')}</Text>
                            </View>
                            <View className="flex-row justify-between items-center mt-3">
                                <View className="flex-row gap-2">
                                    <TouchableOpacity onPress={() => toggleTemplateStatus(template)}>
                                        <Text className={`text-xs px-2 py-1 rounded ${template.status === '1' ? 'bg-red-600' : 'bg-green-600'} text-white`}>
                                            {template.status === '1' ? 'Disable' : 'Enable'}
                                        </Text>
                                    </TouchableOpacity>

                                    <Text className="text-xs px-2 py-1 bg-sky-700 text-white rounded">
                                        {template.template_type.toUpperCase()}
                                    </Text>
                                </View>
                                <View className="flex-row gap-5">
                                    <TouchableOpacity onPress={() => openModal(index)}>
                                        <Pencil color="white" size={20} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDelete(template.id)}>
                                        <Trash color="red" size={20} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}

            {/* FAB */}
            <TouchableOpacity
                onPress={() => openModal()}
                className="absolute bottom-6 right-6 bg-sky-500 p-4 rounded-full"
            >
                <Plus color="white" size={24} />
            </TouchableOpacity>

            {/* Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View className="flex-1 bg-black bg-opacity-90 justify-center px-6">
                    <View className="bg-neutral-900 p-6 rounded-2xl h-[85%]">
                        <Text className="text-white text-xl font-bold mb-3">
                            {editIndex !== null ? 'Edit Template' : 'Add Template'}
                        </Text>

                        <TextInput
                            placeholder="Template Title"
                            placeholderTextColor="#ccc"
                            value={newTemplate.title}
                            onChangeText={(text) => setNewTemplate({ ...newTemplate, title: text })}
                            className="border border-gray-700 text-white rounded px-3 py-2 mb-3"
                        />

                        <View className="h-[35%] overflow-hidden mb-4 rounded-lg border border-gray-700">
                            <WebView
                                ref={webviewRef}
                                originWhitelist={['*']}
                                source={{ uri: 'file:///android_asset/editor.html' }}
                                javaScriptEnabled={true}
                                domStorageEnabled={true}
                                onMessage={onMessage}
                                style={{ flex: 1 }}
                                injectedJavaScript={`
                  setTimeout(() => {
                    document.dispatchEvent(new MessageEvent('message', { data: ${JSON.stringify(newTemplate.text)} }));
                  }, 500);
                  true;
                `}
                            />
                        </View>

                        {/* Call Type Picker */}
                        <View className="mb-4">
                            <Text className="text-gray-300 mb-1">Call Type</Text>
                            {callTypes.map((type) => (
                                <Pressable
                                    key={type}
                                    onPress={() => setNewTemplate({ ...newTemplate, type })}
                                    className={`px-3 py-2 mb-1 rounded ${newTemplate.type === type ? 'bg-sky-600' : 'bg-neutral-800'}`}
                                >
                                    <Text className={newTemplate.type === type ? 'text-white' : 'text-gray-400'}>
                                        {type}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        {/* Active Toggle */}
                        {/* <View className="flex-row items-center justify-between mb-6">
                            <Text className="text-white">Active</Text>
                            <Switch
                                value={newTemplate.active}
                                onValueChange={(val) => setNewTemplate({ ...newTemplate, active: val })}
                            />
                        </View> */}

                        {/* Buttons */}
                        <View className="flex-row justify-between my-3">
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(false);
                                    setEditIndex(null);
                                }}
                                className="bg-gray-700 px-4 py-2 rounded"
                            >
                                <Text className="text-white">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={saveTemplate}
                                className="bg-green-600 px-4 py-2 rounded"
                            >
                                <Text className="text-white font-semibold">
                                    {editIndex !== null ? 'Update' : 'Save'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}