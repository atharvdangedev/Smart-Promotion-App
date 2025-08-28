import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  PhoneIncoming,
  PhoneMissed,
  PhoneOff,
  PhoneOutgoing,
} from 'lucide-react-native';
import SubHeader from '../components/SubHeader';
import SafeAreaWrapper from '../components/SafeAreaWrapper';

export default function ContactDetails() {
  const route = useRoute();
  const { contact } = route.params;

  const openWhatsApp = phone => {
    const number = phone.replace(/\D/g, '');
    Linking.openURL(`https://wa.me/${number}`).catch(console.error);
  };

  const handleCall = () => {
    const number = contact.phone.replace(/\D/g, '');
    Linking.openURL(`tel:${number}`).catch(error =>
      console.error('Failed to open dialer', error),
    );
  };

  const getCallIcon = type => {
    switch (type) {
      case 'missed':
        return <PhoneMissed size={20} color="#f87171" />;
      case 'received':
        return <PhoneIncoming size={20} color="#34d399" />;
      case 'outgoing':
        return <PhoneOutgoing size={20} color="#60a5fa" />;
      case 'rejected':
        return <PhoneOff size={20} color="#a855f7" />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaWrapper className="flex-1 bg-light-background dark:bg-dark-background ">
        <SubHeader title="Contact Details" />
      <ScrollView 
        className='px-4 pt-4'
        showsVerticalScrollIndicator={false}>

        <View className="items-center mt-4 ">
          <View className="w-24 h-24 rounded-full bg-gray-700 mb-3 border-4 border-sky-500 overflow-hidden">
            <Image
              source={require('../assets/avatar-placeholder.jpg')}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <Text className="text-light-text dark:text-dark-text text-2xl font-bold">
            {contact.first_name} {contact.last_name}
          </Text>
          <Text className="text-gray-400 text-base mt-1">{contact.phone}</Text>
          <Text className="bg-purple-600 text-white px-3 py-1 rounded-full mt-2 text-xs">
            VIP Customer
          </Text>
        </View>

        <View className="flex-row justify-center gap-4 mt-5">
          <TouchableOpacity
            onPress={() => handleCall()}
            className="bg-green-500 px-4 items-center justify-center py-2 rounded-xl"
          >
            <Text className="text-white font-semibold">Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openWhatsApp(contact.phone)}
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
          <Text className="text-white mb-2">
            <Text className="text-light-text dark:text-dark-text">
              Birthday:{' '}
            </Text>
            <Text className="text-green-400 font-semibold">August 15th</Text>
          </Text>
          <Text className="text-white">
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
            Met at the 2025 Pune tech conference. Interested in the premium plan
            for his real estate business. Follow up next week regarding API
            access.
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
            <View className="flex-row justify-between items-center bg-[#FFFFFF] dark:bg-[#3A506B] border border-[#E0E0E0] dark:border-[#4A5568] rounded-xl px-4 py-3 mb-3">
              <View className="flex-1">
                <Text className="text-light-text dark:text-dark-text font-semibold">
                  {contact.first_name} {contact.last_name}
                </Text>
                <View className="flex-row gap-2">
                  <Text className="text-light-subtext dark:text-dark-subtext">
                    {contact.phone}
                  </Text>
                  <Text className="text-light-text dark:text-dark-text text-xs mt-1">
                    {contact.date}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-4">
                {getCallIcon(contact.type)}
              </View>
            </View>
            <Text className="text-light-text dark:text-dark-text font-medium mb-2">
              Message Sent{' '}
            </Text>
            <View className="p-4 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl">
              <Text className="text-light-text dark:text-dark-text font-semibold">
                Sent 'First-Time User Offer'
              </Text>
              <Text className="text-light-text dark:text-dark-text text-xs mt-1">
                Jul 21, 2025
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}
