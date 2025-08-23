import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import SubHeader from '../components/SubHeader';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { useAuthStore } from '../store/useAuthStore';
import { renderFormattedText } from '../utils/renderFormattedText';
import { useQuery } from '@tanstack/react-query';
import { templateDetails } from '../APIs/TemplateApi';

export default function TemplateDetailScreen({ route }) {
  const { templateId } = route.params;
  const ActiveUser = useAuthStore(state => state.rolename);

  const { data: template = {}, isLoading } = useQuery({
    queryKey: ['templateDetails', templateId],
    queryFn: () => templateDetails(templateId, ActiveUser),
    onError: error => handleApiError(error, 'fetching template details'),
    enabled: !!templateId,
  });

  if (isLoading) {
    return (
      <SafeAreaWrapper className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </SafeAreaWrapper>
    );
  }

  if (!template || Object.keys(template).length === 0) {
    return (
      <SafeAreaWrapper className="flex-1 bg-black justify-center items-center">
        <Text className="text-white">Template not found</Text>
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper className="flex-1 bg-light-background dark:bg-dark-background px-4 py-4">
      <SubHeader title="Template Details" />
      <ScrollView showsVerticalScrollIndicator={false} className="px-4 my-4">
        <View className="mb-6">
          <Text className="text-2xl text-light-text dark:text-dark-text font-bold">
            {template.title}
          </Text>
          <Text className="text-sm text-gray-500 mt-1">
            Type:{' '}
            <Text className="font-semibold">{template.template_type}</Text>
          </Text>
        </View>

        <View>
          <Text className="text-lg text-light-text dark:text-dark-text font-semibold mb-2">
            Description
          </Text>
          <View className="bg-neutral-800 rounded-lg p-4">
            <Text className="text-white text-base leading-relaxed">
              {renderFormattedText(template.description)}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}
