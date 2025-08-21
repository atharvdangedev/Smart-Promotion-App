import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import SubHeader from '../components/SubHeader';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { useAuthStore } from '../store/useAuthStore';
import { TemplateApis } from '../APIs/TemplateApi';

export default function TemplateDetailScreen({ route }) {
  const { templateId } = route.params;
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = useAuthStore(state => state.token);
  const ActiveUser = useAuthStore(state => state.rolename);

  useEffect(() => {
    const fetchTemplateDetail = async () => {
      try {
        const response = await TemplateApis.templateDetails(
          templateId,
          ActiveUser,
        );

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
      <SafeAreaWrapper className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </SafeAreaWrapper>
    );
  }

  if (!template) {
    return (
      <SafeAreaWrapper className="flex-1 bg-black justify-center items-center">
        <Text className="text-white">Template not found</Text>
      </SafeAreaWrapper>
    );
  }

  const renderFormattedText = text => {
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
          if (before)
            elements.push(
              <Text key={elements.length} style={{ color: 'white' }}>
                {before}
              </Text>,
            );
          elements.push(
            <Text key={elements.length} style={[{ color: 'white' }, style]}>
              {innerText}
            </Text>,
          );
          remaining = remaining.slice(match.index + fullMatch.length);
          found = true;
          break;
        }
      }

      if (!found) {
        elements.push(
          <Text key={elements.length} style={{ color: 'white' }}>
            {remaining}
          </Text>,
        );
        break;
      }
    }
    return elements;
  };

  return (
    <SafeAreaWrapper className="flex-1 bg-light-background dark:bg-dark-background px-4 py-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <SubHeader title="Template Details" />
        <Text className="text-2xl text-light-text dark:text-dark-text font-bold mt-6">
          {template.title}
        </Text>
        <Text className="text-sm text-light-text dark:text-dark-text mb-4">
          Type: {template.template_type}
        </Text>
        <View className="bg-neutral-800 rounded p-4">
          <Text className="text-white text-lg">
            {renderFormattedText(template.description)}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}
