import { View, Text, FlatList, TouchableOpacity, Linking } from 'react-native';
import React from 'react';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import useThemeColors from '../hooks/useThemeColor';
import { useAuthStore } from '../store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { fetchCall_log } from '../apis/Call_LogApi';
import { getCallIcon } from '../utils/constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SubHeader from '../components/SubHeader';

export default function All_Logs() {
  const colors = useThemeColors();
  const user = useAuthStore(state => state.rolename);
  const {
    data: call_logs = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['call_logs'],
    queryFn: () => fetchCall_log(user),
  });

  const openWhatsApp = phone => {
    const number = phone.replace(/\D/g, '');
    Linking.openURL(`https://wa.me/${number}`).catch(console.error);
  };

  return (
    <SafeAreaWrapper style={{ backgroundColor: colors.background }}>
      <SubHeader title="All Logs" />
      <View className="mx-4 my-3">
        <Text className="text-xl my-3 font-bold" style={{ color: colors.text }}>
          All Logs
        </Text>
        <FlatList
          data={call_logs}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              //   onPress={() =>
              //     navigation.navigate('ContactDetails', {
              //       contact_id: item.contact_id,
              //     })
              //   }
              className="mb-3"
            >
              <View className="flex-row justify-between items-center bg-light-card dark:bg-dark-card border border-[#E0E0E0] dark:border-[#4A5568] rounded-xl px-4 py-3 mb-3">
                <View className="flex-1">
                  <View className="flex-row mb-1">
                    <Text className="flex-1 text-light-text dark:text-dark-text font-semibold">
                      {item.contact_name ? item.contact_name : 'Unkown'}
                    </Text>
                    <Text className="flex-1 text-light-text dark:text-dark-text font-semibold">
                      Type: {item.type}
                    </Text>
                  </View>
                  <View className="flex-row gap-2">
                    <Text className="text-gray-400">{item.contact_number}</Text>
                    <Text className="text-gray-400 text-xs mt-1">
                      {item.created_at}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-4">
                  {getCallIcon(item.type)}
                  <TouchableOpacity
                    onPress={() => openWhatsApp(item.contact_number)}
                  >
                    <FontAwesome name="whatsapp" size={22} color="#25D366" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text className="text-center text-gray-400 mt-10">
              No call logs
            </Text>
          }
        />
      </View>
    </SafeAreaWrapper>
  );
}
