import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { User, UserPen } from 'lucide-react-native';
import SubHeader from '../components/SubHeader';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { API_CONTACT } from '@env';
import useThemeColors from '../hooks/useThemeColor';
import { fetchContactDetails } from '../apis/ContactsApi';
import { handleApiError } from '../utils/handleApiError';
import { useAuthStore } from '../store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { fetchLog } from '../apis/Call_LogApi';
import { getCallIcon } from '../utils/constants';
import { formatDate } from '../utils/FormateDateHelper';

export default function ContactDetails({ navigation }) {
  const route = useRoute();
  const contact_id = route.params?.contact_id;
  const colors = useThemeColors();
  const ActiveUser = useAuthStore(state => state.rolename);

  const { data: contact = {}, isLoading } = useQuery({
    queryKey: ['contact', contact_id],
    queryFn: () => fetchContactDetails(contact_id, ActiveUser),
    onError: error => handleApiError(error, 'fetching contact details'),
  });

  const { data: call_logs = [] } = useQuery({
    queryKey: ['call-log', contact_id],
    queryFn: () => fetchLog(contact_id, ActiveUser),
    onError: error => handleApiError(error, 'fetching call log'),
  });

  const openWhatsApp = phone => {
    const number = phone.replace(/\D/g, '');
    Linking.openURL(`https://wa.me/${number}`).catch(console.error);
  };

  const handleCall = () => {
    const number = contact.contact_number.replace(/\D/g, '');
    Linking.openURL(`tel:${number}`).catch(error =>
      console.error('Failed to open dialer', error),
    );
  };

  const firstLetter =
    contact.contact_name && contact.contact_name.charAt(0).toUpperCase();

  if (isLoading) {
    return (
      <SafeAreaWrapper className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#0ea5e9" />
      </SafeAreaWrapper>
    );
  }

  return (
    <SafeAreaWrapper
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <SubHeader title="Contact Details" />
      <View className="items-end mx-6 mt-3 ">
        <TouchableOpacity>
          <UserPen size={30} color={colors.text} />
        </TouchableOpacity>
      </View>
      <ScrollView className="px-4 pt-0" showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-center items-center mt-0  ">
          <View className=" w-24 h-24 rounded-full bg-gray-700 mb-3 border-4 border-sky-500 overflow-hidden">
            <View className="border border-gray-700 rounded-full ">
              {contact.image ? (
                <Image
                  source={{ uri: `${API_CONTACT}/${contact.image}` }}
                  className="w-full h-full rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <View
                  className="w-full h-full rounded-full justify-center items-center"
                  style={{ backgroundColor: '#0ea5e9' }}
                >
                  {firstLetter ? (
                    <Text className="text-white text-4xl font-bold">
                      {firstLetter}
                    </Text>
                  ) : (
                    <User size={30} color="white" />
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
        <View className=" justify-center items-center">
          <Text className="text-light-text dark:text-dark-text text-2xl font-bold">
            {contact.contact_name ? contact.contact_name : 'Unkown'}
          </Text>
          <Text className="text-gray-400 text-base mt-1">
            {contact.contact_number}
          </Text>
          {contact.label ? (
            <Text className="bg-purple-600 text-white px-3 py-1 rounded-full mt-2 text-xs">
              {contact.label}
            </Text>
          ) : null}
        </View>
        <View className="flex-row justify-center gap-4 mt-5">
          <TouchableOpacity
            onPress={() => handleCall()}
            className="bg-green-500 px-4 items-center justify-center py-2 rounded-xl"
          >
            <Text className="text-white font-semibold">Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openWhatsApp(contact.contact_number)}
            className="flex-row bg-blue-400 px-6 items-center justify-center py-2 rounded-xl"
          >
            <Text className="text-white mr-2 font-semibold">Message on</Text>

            <FontAwesome name="whatsapp" size={20} color="#25D366" />
          </TouchableOpacity>
        </View>

        <Text className="text-light-text dark:text-dark-text text-lg font-bold mt-6">
          {' '}
          Information
        </Text>
        <View className="bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border rounded-xl p-4 ">
            
              <View>
              {contact.dates.map((d)=>(
                <View key={d.id} className='flex-row items-center gap-3'>
                  <Text className='text-lg font-semibold' style={{color: colors.text}}>{d.date_title}: </Text>
                  <Text style={{color: colors.text}}>{formatDate(d.date)}</Text>
                </View>
              ))}
            </View>
          
          <Text className="text-white mt-1">
            <Text className="text-light-text dark:text-dark-text">
              Last Message Sent:{' '}
            </Text>
            <Text className="text-blue-400 font-semibold">2 days ago</Text>
          </Text>
        </View>

        <Text className="text-light-text dark:text-dark-text text-lg font-bold mt-4">
          Notes
        </Text>
        <View className="bg-light-background dark:bg-dark-background border border-light-border dark:border-dark-border rounded-xl p-4">
          <Text className="text-light-text dark:text-dark-text">
            {contact.note ? contact.note : 'Note not added'}
          </Text>
        </View>

        <View className="my-5">
          <Text className="text-light-text dark:text-dark-text text-lg font-bold mb-2">
            Recent Activity
          </Text>
          <View className=" rounded-xl overflow-hidden">
            <Text className="text-light-text dark:text-dark-text font-medium mb-2">
              Logs{' '}
            </Text>
            {call_logs.slice(0, 4).map(call_log => (
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
                      {contact.contact_name ? contact.contact_name : 'Unkown'}
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
            {call_logs.length === 0 && (
              <View className="flex-row justify-between items-center bg-[#FFFFFF] dark:bg-[#3A506B] border border-[#E0E0E0] dark:border-[#4A5568] rounded-xl px-4 py-3 mb-3">
                <Text>No Logs Found</Text>
              </View>
            )}
            {call_logs.length > 4 && (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Contact_Logs', {
                    contact_id: contact.id,
                    contact_name: contact.contact_name,
                  })
                }
                className="my-2 items-center bg-sky-100 dark:bg-sky-700 px-4 py-2 rounded-md"
              >
                <Text className="text-sky-800 dark:text-white font-semibold text-sm">
                  View All Logs
                </Text>
              </TouchableOpacity>
            )}
            <Text className="text-light-text dark:text-dark-text font-medium mb-2">
              Message Sent{' '}
            </Text>
            {contact.recent_messages.length > 0 ? (
              contact.recent_messages.map((msg, index) => (
                <View key={index} className="p-4 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl">
                  <Text className="text-light-text dark:text-dark-text font-semibold">
                    {msg.message_sent}
                  </Text>
                  <Text className="text-light-text dark:text-dark-text text-xs mt-1">
                    {formatDate(contact.created_at)}
                  </Text>
                </View>
              ))
            ) : (
              <Text className="text-gray-500" style={{color: colors.text}}>No recent messages</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}
