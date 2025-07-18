import React, { useEffect, useRef, useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Switch,
    Pressable, ActivityIndicator,
    ToastAndroid,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pencil, Trash, Plus } from 'lucide-react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api';
import Toast from 'react-native-toast-message';

const callTypes = ['Incoming', 'Outgoing', 'Missed', 'Rejected'];

export default function TemplateScreen({ navigation }) {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [newTemplate, setNewTemplate] = useState({
        title: '',
        text: '',
        type: callTypes[0],
        active: false,
    });
    const [editIndex, setEditIndex] = useState(null);
    const webviewRef = useRef(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedTemplateForStatus, setSelectedTemplateForStatus] = useState(null);

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
        setNewTemplate(
            index !== null
                ? {
                    title: templates[index].title || '',
                    text: templates[index].description || '',
                    type:
                        callTypes.find(
                            (ct) =>
                                ct.toLowerCase() ===
                                (templates[index].template_type || '').toLowerCase()
                        ) || callTypes[0],
                    active: templates[index].status === '1',
                }
                : {
                    title: '',
                    text: '',
                    type: callTypes[0],
                    active: false,
                }
        );
        setModalVisible(true);
    };

    const saveTemplate = () => {
        if (newTemplate.title.trim().length < 3 || newTemplate.title.trim().length > 200) {
            return ToastAndroid.show('Title must be 3 to 200 characters', ToastAndroid.SHORT);
        }

        if (webviewRef.current) {
            webviewRef.current.injectJavaScript(`
        document.dispatchEvent(new MessageEvent('message', { data: "getContent" }));
        true;
      `);
        }
    };

    const onMessage = async (event) => {
        const htmlContent = event.nativeEvent.data;
        const plainText = htmlContent.replace(/<[^>]*>?/gm, '').trim();
        if (plainText.length < 3 || plainText.length > 700) {
            ToastAndroid.show("Description must be 3 to 700 characters", ToastAndroid.SHORT);
            return;
        }

        try {
            const token = await AsyncStorage.getItem('token');
            const currentTemplate = { ...newTemplate };

            if (!currentTemplate.title?.trim()) {
                return ToastAndroid.show('Please enter a title', ToastAndroid.SHORT);
            }

            if (!currentTemplate.type?.trim()) {
                return Alert.alert('Validation Error', 'Please select a call type');
            }

            const isEditing = editIndex !== null;
            const templateId = isEditing ? templates[editIndex].id : null;

            const url = isEditing ? `vendor/templates/${templateId}` : 'vendor/templates';

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
                Toast.show({
                    type: 'success',
                    text1: isEditing ? 'Template Updated' : 'Template Saved',
                    text2: isEditing ? 'Template updated successfully' : 'Template saved successfully',
                    position: 'top',
                });
                await fetchTemplates();
                setModalVisible(false);
                setEditIndex(null);
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error!',
                    text2: 'Failed to save template',
                    position: 'top',
                });
            }
        } catch (error) {
            console.error('Error saving/updating template:', error);
            Toast.show({
                type: 'error',
                text1: 'Error!',
                text2: 'Something went wrong',
                position: 'top',
            });
        }
    };

    const handleDelete = (id) => {
        setSelectedTemplateId(id);
        setShowDeleteModal(true);
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
                Toast.show({
                    type: 'success',
                    text1: 'Deleted',
                    text2: 'Template deleted succesfully',
                    position: 'top',
                });
                await fetchTemplates();
            } else {
                Toast.show({
                    type: 'Error',
                    text1: 'Error!',
                    text2: 'Failed to delete template',
                    position: 'top',
                });
            }
        } catch (error) {
            console.error(' Error deleting template:', error);
            Toast.show({
                type: 'Error',
                text1: 'Error!',
                text2: 'Something went wrong while deleting template',
                position: 'top',
            });
        }
    };

    const confirmToggleStatus = (template) => {
        setSelectedTemplateForStatus(template);
        setShowStatusModal(true);
    };

    const toggleTemplateStatus = async (template) => {
        try {
            const token = await AsyncStorage.getItem('token');

            const response = await api.put(
                `vendor/update-template-status/${template.id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                }
            );

            if (response.data.status) {
                Toast.show({
                    type: 'success',
                    text1: 'Status Updated',
                    text2: 'Template status updated',
                    position: 'top',
                });
                await fetchTemplates();
            } else {
                Toast.show({
                    type: 'Error',
                    text1: 'Error!',
                    text2: 'Failed to update status',
                    position: 'top',
                });
            }
        } catch (error) {
            console.error(' Error updating template status:', error);
            Toast.show({
                type: 'Error',
                text1: 'Error!',
                text2: 'Something went wrong while updating status',
                position: 'top',
            });
        }
    };

    const callTypeColors = {
        missed: 'bg-red-400',
        incoming: 'bg-green-400',
        outgoing: 'bg-blue-400',
        rejected: 'bg-purple-400',
        default: 'bg-sky-600',
    };


    return (
        <SafeAreaView className="flex-1 bg-black px-4 py-2">
            <Text className="text-white text-2xl font-bold mb-4">Message Templates</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#0ea5e9" className="mt-10" />
            ) : templates.length === 0 ? (
                <View className="flex-1 justify-center items-center mt-20">
                    <Text className="text-gray-400 text-base">No templates found.</Text>
                </View>
            ) : (
                <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
                    {templates.map((template, index) => (
                        <View key={template.id} className="bg-neutral-800 rounded-xl p-4 mb-4 border border-slate-300">
                            <TouchableOpacity onPress={() => navigation.navigate('TemplateDetails', { templateId: template.id })}>
                                <Text className="text-white text-lg font-bold mb-2">{template.title}</Text>
                            </TouchableOpacity>
                            <View className="bg-neutral-900 p-2 rounded">
                                <Text className="text-gray-300">{template.description.replace(/<[^>]*>?/gm, '')}</Text>
                            </View>
                            <View className="flex-row justify-between items-center mt-3">
                                <View className="flex-row gap-2">
                                    <TouchableOpacity onPress={() => {
                                        // toggleTemplateStatus(template)
                                        confirmToggleStatus(template);
                                    }}>
                                        <Text className={`text-xs px-2 py-1 rounded ${template.status === '1' ? 'bg-red-600' : 'bg-green-600'} text-white`}>
                                            {template.status === '1' ? 'Disabled' : 'Enabled'}
                                        </Text>
                                    </TouchableOpacity>

                                    <Text
                                        className={`text-xs px-2 py-1 text-white rounded ${callTypeColors[template.template_type.toLowerCase()] || callTypeColors.default
                                            }`}
                                    >
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
            <Modal
                visible={showDeleteModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowDeleteModal(false)}
            >
                <View className="flex-1 bg-black/60 justify-center items-center px-6">
                    <View className="bg-slate-300 w-full rounded-xl p-4">
                        <Text className="text-lg font-semibold text-black mb-2">Confirm Delete</Text>
                        <Text className="text-base text-gray-700 mb-6">
                            Are you sure you want to delete this template?
                        </Text>
                        <View className="flex-row justify-end space-x-4">
                            <TouchableOpacity
                                onPress={() => setShowDeleteModal(false)}
                                className="px-4 py-2 rounded-md bg-white mr-2"
                            >
                                <Text className="text-black font-medium">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setShowDeleteModal(false);
                                    deleteTemplate(selectedTemplateId);
                                }}
                                className="px-4 py-2 rounded-md bg-black"
                            >
                                <Text className="text-white font-medium">Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                visible={showStatusModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowStatusModal(false)}
            >
                <View className="flex-1 bg-black/60 justify-center items-center px-6">
                    <View className="bg-slate-300 w-full rounded-xl p-4">
                        <Text className="text-lg font-semibold text-black mb-2">Confirm Status Change</Text>
                        <Text className="text-base text-gray-700 mb-6">
                            Are you sure you want to {selectedTemplateForStatus?.status === '1' ? 'enable' : 'disable'} this template?
                        </Text>
                        <View className="flex-row justify-end space-x-4">
                            <TouchableOpacity
                                onPress={() => setShowStatusModal(false)}
                                className="px-4 py-2 rounded-md bg-white mr-2"
                            >
                                <Text className="text-black font-medium">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setShowStatusModal(false);
                                    toggleTemplateStatus(selectedTemplateForStatus);
                                }}
                                className="px-4 py-2 rounded-md bg-black"
                            >
                                <Text className="text-white font-medium">Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}