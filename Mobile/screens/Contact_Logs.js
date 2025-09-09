import { View, Text } from 'react-native';
import React, { useState } from 'react';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { useQuery } from '@tanstack/react-query';
import { fetchCall_log, fetchLog } from '../apis/Call_LogApi';
import { getCallIcon } from '../utils/constants';
import { useRoute } from '@react-navigation/native';
import SubHeader from '../components/SubHeader';
import useThemeColors from '../hooks/useThemeColor';
import { User } from 'lucide-react-native';
import { handleApiError } from '../utils/handleApiError';
import { useAuthStore } from '../store/useAuthStore';

export default function Contact_Logs() {
  const route = useRoute();

  const { contact_id, contact_name } = route.params;

  const colors = useThemeColors();

  const user = useAuthStore(state => state.rolename);

  const [filters, setFilters] = useState({});

  const {
    data: call_logs = [],
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['call_logs', filters],
    queryFn: () => fetchCall_log(user),
  });

  return (
    <SafeAreaWrapper
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <SubHeader title="Contact Logs" />
      <View className="flex-row justify-center items-center m-3">
        <User size={20} color={colors.icon} />
        <Text
          className="text-2xl font-bold text-center"
          style={{ color: colors.text }}
        >
          {' '}
          {contact_name} (Logs)
        </Text>
      </View>
      <View className="m-3">
        {call_logs.map(call_log => (
          <View
            key={call_log.id}
            className="flex-row justify-between items-center bg-[#FFFFFF] dark:bg-[#3A506B] border border-[#E0E0E0] dark:border-[#4A5568] rounded-xl px-4 py-3 mb-3"
          >
            <View className="flex-1">
              <View className="flex-row gap-8 mb-0">
                <Text
                  style={{ color: colors.text }}
                  className="text-lg pl-1 font-semibold"
                >
                  {contact_name ? contact_name : 'Unkown'}
                </Text>
                <Text style={{ color: colors.text }}>
                  Type: {call_log.type}{' '}
                </Text>
              </View>
              <View className="flex-row gap-4">
                <Text className="text-light-subtext dark:text-dark-subtext">
                  {call_log.number}
                </Text>
                <Text className="text-light-text dark:text-dark-text text-xs mt-1">
                  {call_log.created_at}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-4">
              {getCallIcon(call_log.type)}
            </View>
          </View>
        ))}
      </View>
    </SafeAreaWrapper>
  );
}
