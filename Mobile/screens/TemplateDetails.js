import React, { useEffect, useState } from 'react';
import {
    View, Text, ScrollView, ActivityIndicator,
    TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import SubHeader from '../components/SubHeader';
import SafeAreaWrapper from '../components/SafeAreaWrapper';

export default function TemplateDetailScreen({ route }) {
    const { templateId } = route.params;
    const [template, setTemplate] = useState(null);
    const [loading, setLoading] = useState(true);

    // const navigation = useNavigation();

    useEffect(() => {
        const fetchTemplateDetail = async () => {
            try {
                // const token = await AsyncStorage.getItem('token');

                // const response = await api.get(`vendor/templates/${templateId}`, {
                //     headers: {
                //         Authorization: `Bearer ${token}`,
                //         Accept: 'application/json',
                //     },
                // });
                const token = await AsyncStorage.getItem('token');
                const ActiveUser = await AsyncStorage.getItem('user_type');
                console.log('name:', ActiveUser);
                const endpoint = ActiveUser === 'agent' ? `agent/templates/${templateId}` : `vendor/templates/${templateId}`;

                const response = await api.get(endpoint, {
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
        <SafeAreaWrapper className="flex-1 bg-light-background dark:bg-dark-background px-4 py-4">
            <ScrollView showsVerticalScrollIndicator={false}>
                <SubHeader title="Template Details" />
                <Text className="text-2xl text-light-text dark:text-dark-text font-bold mt-6">{template.title}</Text>
                <Text className="text-sm text-light-text dark:text-dark-text mb-4">Type: {template.template_type}</Text>
                <View className="bg-neutral-800 rounded p-4">
                    <Text className="text-white text-lg">{renderFormattedText(template.description)}</Text>
                </View>
            </ScrollView>
        </SafeAreaWrapper>
    );
}
