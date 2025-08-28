import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import useThemeColors from '../hooks/useThemeColor';
import Header from '../components/Header';
import { useQuery } from '@tanstack/react-query';
import { fetchContacts } from '../apis/ContactsApi';
import { useAuthStore } from '../store/useAuthStore';
import { API_PROFILE } from '@env';

export default function ContactList() {
  const colors = useThemeColors();
  const user = useAuthStore(state => state.rolename);

  const {
    data: contacts = [],
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['contacts'],
    queryFn: () => fetchContacts(user),
    enabled: !!user,
  });

  const renderItem = ({ item }) => {
    const firstLetter = item.contact_name ? item.contact_name.charAt(0).toUpperCase() : '?';
    return (
      <TouchableOpacity
        
        className={`flex-row justify-start gap-6 items-center p-3 rounded-xl mb-2 border-b border-gray-300 ${'bg-sky-100'}`}
      >
        <View className="border border-gray-700 rounded-full ">
          {item.image ? (
            <Image
              source={{ uri: `${API_PROFILE}/${item.image}` }}
              className="w-14 h-14 rounded-full"
              resizeMode="cover"
            />
          ) : (
            <View
          className="w-14 h-14 rounded-full justify-center items-center"
          style={{ backgroundColor: '#0ea5e9' }} 
        >
          <Text className="text-white text-xl font-bold">{firstLetter}</Text>
        </View>
          )}
        </View>
        <View className="px-2 ">
          <Text className="text-black text-lg">{item.contact_name}</Text>
          <Text className="text-gray-500 text-base">{item.contact_number}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaWrapper
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <Header title="Contacts List" />
      <View className="flex-1 m-4">
        {isLoading ? (
          <ActivityIndicator size="large" color="#0ea5e9" className="mt-10" />
        ) : contacts.length === 0 ? (
          <View className="flex-1 justify-center items-center mt-20">
            <Text className="text-light-text dark:text-dark-text text-base">
              No Contacts Found.
            </Text>
          </View>
        ) : (
          <View className="mx-2">
            <Text
              className="text-2xl font-bold mb-2"
              style={{ color: colors.headingText }}
            >
              Contacts List
            </Text>
            <FlatList
              data={contacts}
              keyExtractor={item => item.id}
              renderItem={renderItem}
            />
          </View>
        )}
      </View>
    </SafeAreaWrapper>
  );
}
