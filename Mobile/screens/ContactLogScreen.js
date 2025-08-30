import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking } from 'react-native';
import {
  PhoneMissed,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneOff,
} from 'lucide-react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Header from '../components/Header';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { useQuery } from '@tanstack/react-query';
import { fetchCall_log } from '../apis/Call_LogApi';
import { useAuthStore } from '../store/useAuthStore';

export default function CallLogScreen({ navigation }) {
  const user= useAuthStore((state)=> state.rolename);
  // const contacts = [
  //   {
  //     id: 1,
  //     first_name: 'John',
  //     last_name: 'Doe',
  //     phone: '+919876543210',
  //     date: '27 Jul 1:22',
  //     type: 'missed',
  //   },
  //   {
  //     id: 2,
  //     first_name: 'Jane',
  //     last_name: 'Smith',
  //     phone: '+918123456789',
  //     date: '27 Jul 2:33',
  //     type: 'received',
  //   },
  //   {
  //     id: 3,
  //     first_name: 'Mike',
  //     last_name: 'Johnson',
  //     phone: '+917654321098',
  //     date: '26 Jul 3:13',
  //     type: 'outgoing',
  //   },
  //   {
  //     id: 4,
  //     first_name: 'Emily',
  //     last_name: 'Brown',
  //     phone: '+916543210987',
  //     date: '25 Jul 6:08',
  //     type: 'rejected',
  //   },
  // ];

  const {
    data : call_logs =[],
    isLoading,
    refetch,
  }= useQuery({
    queryKey : ['call_logs'],
    queryFn:()=> fetchCall_log(user),
  });
  const getCallIcon = type => {
    switch (type) {
      case 'missed':
        return <PhoneMissed size={20} color="#f87171" />;
      case 'incoming':
        return <PhoneIncoming size={20} color="#34d399" />;
      case 'outgoing':
        return <PhoneOutgoing size={20} color="#60a5fa" />;
      case 'rejected':
        return <PhoneOff size={20} color="#a855f7" />;
      default:
        return null;
    }
  };

  const openWhatsApp = phone => {
    const number = phone.replace(/\D/g, '');
    Linking.openURL(`https://wa.me/${number}`).catch(console.error);
  };

  const counts = {
    missed: call_logs.filter(c => c.type === 'missed').length,
    incoming: call_logs.filter(c => c.type === 'incoming').length,
    outgoing: call_logs.filter(c => c.type === 'outgoing').length,
    rejected: call_logs.filter(c => c.type === 'rejected').length,
  };
  useEffect(()=>{
    console.log(call_logs);
  },[call_logs]);

  return (
    <SafeAreaWrapper className="flex-1 bg-light-background dark:bg-dark-background">
        <Header title="Contact Log" />
      <View className="px-4">
        <View className="flex-row flex-wrap justify-between mb-5">
          <View className="w-[47%] items-center py-3 mb-3 rounded-xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
            <Text className="text-red-400 text-xl font-bold">
              {counts.missed}
            </Text>
            <View className="flex-row items-center justify-center">
              <Text className="text-light-text dark:text-dark-text">
                Missed{' '}
              </Text>
              <View className="">
                <PhoneMissed size={12} color="#f87171" />
              </View>
            </View>
          </View>
          <View className="w-[47%] items-center py-3 mb-3 rounded-xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
            <Text className="text-green-400 text-xl font-bold">
              {counts.incoming}
            </Text>
            <View className="flex-row items-center justify-center">
              <Text className="text-light-text dark:text-dark-text">
                Incoming{' '}
              </Text>
              <View className="">
                <PhoneIncoming size={12} color="#34d399" />
              </View>
            </View>
          </View>
          <View className="w-[47%] items-center py-3 mb-3 rounded-xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
            <Text className="text-blue-400 text-xl font-bold">
              {counts.outgoing}
            </Text>
            <View className="flex-row items-center justify-center">
              <Text className="text-light-text dark:text-dark-text">
                Outgoing{' '}
              </Text>
              <View className="">
                <PhoneOutgoing size={12} color="#60a5fa" />
              </View>
            </View>
          </View>
          <View className="w-[47%] items-center py-3 mb-3 rounded-xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
            <Text className="text-purple-400 text-xl font-bold">
              {counts.rejected}
            </Text>
            <View className="flex-row items-center justify-center">
              <Text className="text-light-text dark:text-dark-text">
                Rejected{' '}
              </Text>
              <View className="">
                <PhoneOff size={12} color="#a855f7" />
              </View>
            </View>
          </View>
        </View>
        <FlatList
          data={call_logs}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ContactDetails', { contact_id: item.contact_id })
              }
              className="mb-3"
            >
              <View className="flex-row justify-between items-center bg-light-card dark:bg-dark-card border border-[#E0E0E0] dark:border-[#4A5568] rounded-xl px-4 py-3 mb-3">
                <View className="flex-1">
                  <Text className="text-light-text dark:text-dark-text font-semibold">
                    {item.contact_name ? item.contact_name : 'Unkown'}
                  </Text>
                  <View className="flex-row gap-2">
                    <Text className="text-gray-400">{item.contact_number}</Text>
                    <Text className="text-gray-400 text-xs mt-1">
                      {item.created_at}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-4">
                  {getCallIcon(item.type)}
                  <TouchableOpacity onPress={() => openWhatsApp(item.contact_number)}>
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
