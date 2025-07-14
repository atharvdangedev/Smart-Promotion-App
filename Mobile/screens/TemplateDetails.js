import React, { useEffect, useState } from 'react';
import {
    View, Text, ScrollView, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api'; // adjust path as needed

export default function TemplateDetailScreen({ route }) {
    const { templateId } = route.params;
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTemplateDetail = async () => {
            try {
                const token = await AsyncStorage.getItem('token');

                const response = await api.get(`vendor/templates/${templateId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                });

                if (response.data.status) {
                    setTemplate(response.data.template);
                } else {
                    console.error('API error:', response.data.message);
                }
            } catch (err) {
                console.error('Fetch error:', err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTemplateDetail();
    }, [templateId]);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-black justify-center items-center">
                <ActivityIndicator size="large" color="#0ea5e9" />
            </SafeAreaView>
        );
    }

    if (!template) {
        return (
            <SafeAreaView className="flex-1 bg-black justify-center items-center">
                <Text className="text-white">Template not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-black px-4 py-4">
            <ScrollView>
                <Text className="text-2xl text-white font-bold my-2">{template.title}</Text>
                <Text className="text-sm text-gray-400 mb-4">Type: {template.template_type}</Text>
                <View className="bg-neutral-800 rounded p-4">
                    <Text className="text-white text-lg">{template.description.replace(/<[^>]*>?/gm, '')}</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
