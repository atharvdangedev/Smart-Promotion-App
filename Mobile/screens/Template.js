import React, { useEffect, useRef, useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Switch,
    Pressable, ActivityIndicator,
    useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pencil, Trash, Plus, Trash2 } from 'lucide-react-native';
// import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';

// const callTypes = ['Incoming', 'Outgoing', 'Missed', 'Rejected'];

export default function TemplateScreen({ navigation }) {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profilePic, setProfilePic] = useState('');
    // const [modalVisible, setModalVisible] = useState(false);
    // const [newTemplate, setNewTemplate] = useState({
    //     title: '',
    //     text: '',
    //     type: callTypes[0],
    //     active: false,
    // });
    // const [editIndex, setEditIndex] = useState(null);
    // const webviewRef = useRef(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedTemplateForStatus, setSelectedTemplateForStatus] = useState(null);
    // const [error, setError] = useState('');
    // const [error2, setError2] = useState('');

    useFocusEffect(
        React.useCallback(() => {
            fetchTemplates();
        }, [])
    );

    const theme = useColorScheme();
    let editcolor = '';
    if (theme === 'light') {
        editcolor = '#333333'
    } else {
        editcolor = '#E0E0E0'
    }

    // const handleEdit = (template) => {
    //     navigation.navigate('ShowTemplate', {
    //         template,
    //         isEdit: true,
    //     });
    // };

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

    // const openModal = (index = null) => {
    //     setEditIndex(index);
    //     setNewTemplate(
    //         index !== null
    //             ? {
    //                 title: templates[index].title || '',
    //                 text: templates[index].description || '',
    //                 type:
    //                     callTypes.find(
    //                         (ct) =>
    //                             ct.toLowerCase() ===
    //                             (templates[index].template_type || '').toLowerCase()
    //                     ) || callTypes[1],
    //                 active: templates[index].status === '1',
    //             }
    //             : {
    //                 title: '',
    //                 text: '',
    //                 type: callTypes[0],
    //                 active: false,
    //             }
    //     );
    //     setModalVisible(true);
    // };

    // const saveTemplate = () => {
    //     if (newTemplate.title.trim().length < 3 || newTemplate.title.trim().length > 200) {
    //         // return ToastAndroid.show('Title must be 3 to 200 characters', ToastAndroid.SHORT);
    //         setError("Title must be 3 to 200 characters");
    //     }

    //     if (webviewRef.current) {
    //         webviewRef.current.injectJavaScript(`
    //     document.dispatchEvent(new MessageEvent('message', { data: "getContent" }));
    //     true;
    //   `);
    //     }
    // };

    // const onMessage = async (event) => {
    //     const htmlContent = event.nativeEvent.data;
    //     const plainText = htmlContent.replace(/<[^>]*>?/gm, '').trim();
    //     if (plainText.length < 3 || plainText.length > 700) {
    //         return ToastAndroid.show("Description must be 3 to 700 characters", ToastAndroid.SHORT);
    //         // setError2("Description must be 3 to 700 characters");

    //     }

    //     try {
    //         const token = await AsyncStorage.getItem('token');
    //         const currentTemplate = { ...newTemplate };

    //         if (!currentTemplate.title?.trim()) {
    //             // return ToastAndroid.show('Please enter a title', ToastAndroid.SHORT);
    //             setError('Please enter a title');
    //         }

    //         if (!currentTemplate.type?.trim()) {
    //             return Alert.alert('Validation Error', 'Please select a call type');
    //         }

    //         const isEditing = editIndex !== null;
    //         const templateId = isEditing ? templates[editIndex].id : null;

    //         const url = isEditing ? `vendor/templates/${templateId}` : 'vendor/templates';

    //         const response = await api.post(url, {
    //             title: currentTemplate.title.trim(),
    //             description: htmlContent,
    //             template_type: currentTemplate.type.toLowerCase(),
    //         }, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //                 Accept: 'application/json'
    //             }
    //         });

    //         if (response.data.status) {
    //             Toast.show({
    //                 type: 'success',
    //                 text1: isEditing ? 'Template Updated' : 'Template Saved',
    //                 text2: isEditing ? 'Template updated successfully' : 'Template saved successfully',
    //                 position: 'top',
    //             });
    //             await fetchTemplates();
    //             setModalVisible(false);
    //             setEditIndex(null);
    //         } else {
    //             Toast.show({
    //                 type: 'error',
    //                 text1: 'Error!',
    //                 text2: 'Failed to save template',
    //                 position: 'top',
    //             });
    //         }
    //     } catch (error) {
    //         console.error('Error saving/updating template:', error);
    //         Toast.show({
    //             type: 'error',
    //             text1: 'Error!',
    //             text2: 'Error saving/updating template',
    //             position: 'top',
    //         });
    //         // return ToastAndroid.show('Template with same title already exists', ToastAndroid.SHORT);
    //         setError("Template with same name already exists");


    //     }
    // };

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

    useEffect(() => {
        const init = async () => {
            const filename = await AsyncStorage.getItem('profile_pic');
            if (filename) {
                const url = `https://swp.smarttesting.in/public/uploads/profile/${filename}`;
                setProfilePic(url);
            } else {
                setProfilePic(null); // fallback
            }
        }
        init();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-[#FDFDFD] dark:bg-[#2C3E50] px-4 py-2">
            <Header title="Message Template" profilePic={profilePic} />
            <Text className="text-[#333333] dark:text-[#E0E0E0] text-2xl font-bold mb-4">Message Templates </Text>
            {loading ? (
                <ActivityIndicator size="large" color="#0ea5e9" className="mt-10" />
            ) : templates.length === 0 ? (
                <View className="flex-1 justify-center items-center mt-20">
                    <Text className="text-gray-400 text-base">No templates found.</Text>
                </View>
            ) : (
                <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
                    {templates.map((template, index) => (
                        <View key={template.id} className="bg-[#FFFFFF] dark:bg-[#3A506B] rounded-xl p-4 mb-4 border border-[#E0E0E0] dark:border-[#4A5568]">
                            <TouchableOpacity onPress={() => navigation.navigate('TemplateDetails', { templateId: template.id })}>
                                <Text className="text-[#333333] dark:text-[#E0E0E0] text-lg font-bold mb-2">{template.title}</Text>

                                <View className="bg-neutral-900 p-2 rounded">
                                    <Text numberOfLines={3} className="text-gray-300">{renderFormattedText(template.description)}</Text>
                                </View>
                                <View className="flex-row justify-between items-center mt-3">
                                    <View className="flex-row gap-2">
                                        <TouchableOpacity onPress={() => {
                                            confirmToggleStatus(template);
                                        }}>
                                            <Text className={`text-xs px-2 py-1 rounded ${template.status === '1' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                                                {template.status === '0' ? 'Inactive' : 'Active'}
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
                                        <TouchableOpacity onPress={() => navigation.navigate('ShowTemplate', {
                                            template: template,
                                            isEdit: true,
                                        })}>
                                            <Pencil color={editcolor} size={20} />
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => handleDelete(template.id)}>
                                            <Trash2 color="red" size={20} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            )}

            {/* FAB */}
            <TouchableOpacity
                onPress={() => navigation.navigate('ShowTemplate')}
                className="absolute bottom-6 right-6 bg-sky-500 p-4 rounded-full"
            >
                <Plus color="white" size={24} />
            </TouchableOpacity>


            <Modal
                visible={showDeleteModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowDeleteModal(false)}
            >
                <View className="flex-1 bg-black/60 justify-center items-center px-6">
                    <View className="bg-white w-full rounded-xl p-4">
                        <Text className="text-lg font-semibold text-black mb-2 text-center">Confirm Delete</Text>
                        <Text className="text-base text-gray-700 mb-6 text-center">
                            Are you sure you want to delete this template?
                        </Text>
                        <View className="flex-row justify-between">
                            <TouchableOpacity
                                onPress={() => setShowDeleteModal(false)}
                                className="flex-1 py-3 rounded-md bg-gray-200 mr-2"
                            >
                                <Text className="text-black font-medium text-center">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setShowDeleteModal(false);
                                    deleteTemplate(selectedTemplateId);
                                }}
                                className="flex-1 py-3 mr-2 rounded-md bg-black"
                            >
                                <Text className="text-white font-medium text-center">Delete</Text>
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
                    <View className="bg-white w-full rounded-xl p-4">
                        <Text className="text-lg text-center font-semibold text-black mb-2">Confirm Status Change</Text>
                        <Text className="text-base text-center text-gray-700 mb-6">
                            Are you sure you want to {selectedTemplateForStatus?.status === '1' ? 'inactive' : 'active'} this template?
                        </Text>
                        <View className="flex-row justify-between">
                            <TouchableOpacity
                                onPress={() => setShowStatusModal(false)}
                                className="flex-1 py-3 rounded-md bg-gray-200 mr-2"
                            >
                                <Text className="text-black font-medium text-center">Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setShowStatusModal(false);
                                    toggleTemplateStatus(selectedTemplateForStatus);
                                }}
                                className="flex-1 py-3 rounded-md bg-black"
                            >
                                <Text className="text-white font-medium text-center">Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}