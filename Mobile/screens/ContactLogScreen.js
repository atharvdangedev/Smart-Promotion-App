import React, { useEffect, useState } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, Linking, ActivityIndicator
} from 'react-native';
import {
    PhoneMissed, PhoneIncoming, PhoneOutgoing, PhoneOff,
    Navigation,
} from 'lucide-react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CallLogScreen({ navigation }) {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profilePic, setProfilePic] = useState('');


    useEffect(() => {
        const init = async () => {
            const filename = await AsyncStorage.getItem('profile_pic');
            if (filename) {
                const url = `https://swp.smarttesting.in/public/uploads/profile/${filename}`;
                setProfilePic(url);
            } else {
                setProfilePic(null); // fallback
            }
        }
        init();
        const dummyContacts = [
            {
                id: 1,
                first_name: 'John',
                last_name: 'Doe',
                phone: '+919876543210',
                date: '27 Jul',
                type: 'missed',
            },
            {
                id: 2,
                first_name: 'Jane',
                last_name: 'Smith',
                phone: '+918123456789',
                date: '27 Jul',
                type: 'received',
            },
            {
                id: 3,
                first_name: 'Mike',
                last_name: 'Johnson',
                phone: '+917654321098',
                date: '26 Jul',
                type: 'outgoing',
            },
            {
                id: 4,
                first_name: 'Emily',
                last_name: 'Brown',
                phone: '+916543210987',
                date: '25 Jul',
                type: 'rejected',
            },
        ];
        setContacts(dummyContacts);
        setLoading(false);
    }, []);

    const getCallIcon = (type) => {
        switch (type) {
            case 'missed': return <PhoneMissed size={20} color="#f87171" />;
            case 'received': return <PhoneIncoming size={20} color="#34d399" />;
            case 'outgoing': return <PhoneOutgoing size={20} color="#60a5fa" />;
            case 'rejected': return <PhoneOff size={20} color="#a855f7" />;
            default: return null;
        }
    };

    const openWhatsApp = (phone) => {
        const number = phone.replace(/\D/g, '');
        Linking.openURL(`https://wa.me/${number}`).catch(console.error);
    };

    const counts = {
        missed: contacts.filter(c => c.type === 'missed').length,
        received: contacts.filter(c => c.type === 'received').length,
        outgoing: contacts.filter(c => c.type === 'outgoing').length,
        rejected: contacts.filter(c => c.type === 'rejected').length,
    };

    return (
        <SafeAreaView className='flex-1 bg-[#FDFDFD] dark:bg-[#2C3E50]'>
            <View className="px-4 pt-6">
                <Header title='Contact Log' profilePic={profilePic} />
                {/* <Text className="text-[#333333] dark:text-[#E0E0E0] text-2xl font-bold mb-4">Call Logs</Text> */}

                {/* Counters */}
                <View className="flex-row flex-wrap justify-between mb-5">
                    <View className="w-[47%] items-center py-3 mb-3 rounded-xl bg-zinc-800">
                        <Text className="text-red-400 text-xl font-bold">{counts.missed}</Text>
                        <View className='flex-row'>
                            <Text className="text-white">Missed  </Text>
                            <View className='p-1'>
                                <PhoneMissed size={13} color="#f87171" />
                            </View>
                        </View>
                    </View>
                    <View className="w-[47%] items-center py-3 mb-3 rounded-xl bg-zinc-800">
                        <Text className="text-green-400 text-xl font-bold">{counts.received}</Text>
                        <View className='flex-row'>
                            <Text className="text-white">Received  </Text>
                            <View className='p-1'>
                                <PhoneIncoming size={13} color="#34d399" />
                            </View>
                        </View>
                    </View>
                    <View className="w-[47%] items-center py-3 mb-3 rounded-xl bg-zinc-800">
                        <Text className="text-blue-400 text-xl font-bold">{counts.outgoing}</Text>
                        <View className='flex-row'>
                            <Text className="text-white">Outgoing  </Text>
                            <View className='p-1'>
                                <PhoneOutgoing size={13} color="#60a5fa" />
                            </View>
                        </View>
                    </View>
                    <View className="w-[47%] items-center py-3 mb-3 rounded-xl bg-zinc-800">
                        <Text className="text-purple-400 text-xl font-bold">{counts.rejected}</Text>
                        <View className='flex-row'>
                            <Text className="text-white">Rejected  </Text>
                            <View className='p-1'>
                                <PhoneOff size={13} color="#a855f7" />
                            </View>
                        </View>
                    </View>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#0ea5e9" className="mt-10" />
                ) : (

                    <FlatList
                        data={contacts}
                        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => navigation.navigate('ContactDetails', { contact: item })}
                                className='mb-3'
                            >
                                <View className="flex-row justify-between items-center bg-[#FFFFFF] dark:bg-[#3A506B] border border-[#E0E0E0] dark:border-[#4A5568] rounded-xl px-4 py-3 mb-3">
                                    <View className="flex-1">
                                        <Text className="text-[#333333] dark:text-[#E0E0E0] font-semibold">
                                            {item.first_name} {item.last_name}
                                        </Text>
                                        <View className='flex-row gap-2'>
                                            <Text className="text-gray-400">{item.phone}</Text>
                                            <Text className="text-gray-500 text-xs mt-1">{item.date}</Text>
                                        </View>
                                        {/* <Text className="text-sm text-gray-400 mt-1 capitalize">{item.type} call</Text> */}
                                    </View>
                                    <View className="flex-row items-center gap-4">
                                        {getCallIcon(item.type)}
                                        <TouchableOpacity onPress={() => openWhatsApp(item.phone)}>
                                            <FontAwesome name="whatsapp" size={22} color="#25D366" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                        ListEmptyComponent={<Text className="text-center text-gray-400 mt-10">No call logs</Text>}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
