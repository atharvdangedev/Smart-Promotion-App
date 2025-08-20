import React, { useCallback, useEffect, useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, Modal, ActivityIndicator,
    useColorScheme,
} from 'react-native';
import { Pencil, Plus, Trash2 } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { API_URL } from '@env';
import { useAuthStore } from '../store/useAuthStore';
import { TemplateApis } from '../APIs/TemplateApi';

// const callTypes = ['Incoming', 'Outgoing', 'Missed', 'Rejected'];

export default function TemplateScreen({ navigation }) {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profilePic, setProfilePic] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedTemplateForStatus, setSelectedTemplateForStatus] = useState(null);
    const [selectedTemp, setSelectedTemp] = useState({});

    const user = useAuthStore((state) => state.rolename);
    const token = useAuthStore((state) => state.token);
    const profile_pic = useAuthStore((state) => state.profilePic);

    useFocusEffect(
        useCallback(() => {
            if (user) {
                fetchTemplates(user);
            }
        }, [user])
    );


    const theme = useColorScheme();
    let editcolor = '';
    theme === 'light' ? editcolor = '#333333' : editcolor = '#E0E0E0';

    const fetchTemplates = async (user) => {
        try {

            const response = await TemplateApis.fetchTemplate(user, token);

            if (response.status === 200) {
                setTemplates(response.data.templates);
            }
        } catch (error) {
            console.error('Failed to load templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (template) => {
        setSelectedTemplateId(template.id);
        setSelectedTemp(template);
        setShowDeleteModal(true);
    };

    const deleteTemplate = async (id) => {
        try {
            if (user === 'agent') {
                Toast.show({
                    type: 'info',
                    text1: 'User not autherized'
                });
                return
            }

            const response = await TemplateApis.deleteTemplate(id, token);

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
                    type: 'error',
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
        setSelectedTemp(template);
        setShowStatusModal(true);
    };

    const toggleTemplateStatus = async (template) => {
        try {

            const response = await TemplateApis.toggleStatus(token, template.id);

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
            if (profile_pic) {
                const url = `${API_URL}/${profile_pic}`;
                setProfilePic(url);
            } else {
                setProfilePic(null);
            }
            // await fetchTemplates(ActiveUser);
        };
        init();
    }, []);


    return (
        <SafeAreaWrapper className="flex-1 bg-light-background dark:bg-dark-background px-4 py-6">
            <Header title="Message Template" profilePic={profilePic} />
            {loading ? (
                <ActivityIndicator size="large" color="#0ea5e9" className="mt-10" />
            ) : templates.length === 0 ? (
                <View className="flex-1 justify-center items-center mt-20">
                    <Text className="text-light-text dark:text-dark-text text-base">No templates found.</Text>
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} className="flex-1" keyboardShouldPersistTaps="handled">
                    {templates.map((template, index) => (
                        <View key={template.id} className="bg-[#e6ebf0] dark:bg-[#233140] rounded-xl p-4 mb-4 border border-[#E0E0E0] dark:border-[#4A5568]">
                            <TouchableOpacity onPress={() => { navigation.navigate('TemplateDetails', { templateId: template.id }) }}>
                                <Text className="text-light-text dark:text-dark-text text-lg font-bold mb-2">{template.title}</Text>

                                <View className="bg-neutral-900 p-2 rounded">
                                    <Text numberOfLines={3} className="text-gray-300">{renderFormattedText(template.description)}</Text>
                                </View>
                                {user === 'agent' ? null : (<View className="flex-row justify-between items-center mt-3">
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

                                        <TouchableOpacity onPress={() => handleDelete(template)}>
                                            <Trash2 color="red" size={20} />
                                        </TouchableOpacity>
                                    </View>
                                </View>)}
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            )}

            {/* FAB */}
            {user === 'agent' ? null : (<TouchableOpacity
                onPress={() => navigation.navigate('ShowTemplate')}
                className="absolute bottom-6 right-6 bg-sky-500 p-4 rounded-full"
            >
                <Plus color="white" size={24} />
            </TouchableOpacity>)}


            <Modal
                visible={showDeleteModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowDeleteModal(false)}
            >
                <View className="flex-1 bg-black/60 justify-center items-center px-6">
                    <View className="bg-light-background dark:bg-dark-background w-full rounded-xl p-4">
                        <Text className="text-xl font-semibold text-light-text dark:text-dark-text mb-2 text-center">Confirm Delete</Text>
                        <Text className="text-base text-light-text dark:text-dark-text mb-6 text-center">
                            Are you sure you want to delete template {selectedTemp.title}?
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
                    <View className="bg-light-background dark:bg-dark-background w-full rounded-xl p-4">
                        <Text className="text-xl text-center font-semibold text-light-text dark:text-dark-text mb-2">Confirm Status Change</Text>
                        <Text className="text-base text-center text-light-text dark:text-dark-text mb-6">
                            Are you sure you want to {selectedTemplateForStatus?.status === '1' ? 'deactive' : 'active'} template {selectedTemp.title}?
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
        </SafeAreaWrapper>
    );
}