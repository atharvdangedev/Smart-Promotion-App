import React, { useEffect, useState } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, Linking, ActivityIndicator
} from 'react-native';
import {
    PhoneMissed, PhoneIncoming, PhoneOutgoing, PhoneOff,
} from 'lucide-react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../utils/api';
import Header from '../components/Header';

export default function CallLogScreen() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchContacts = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const res = await api.get('vendor/contacts', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data?.status && Array.isArray(res.data.contacts)) {
                // Add dummy call type, phone, and date for now
                const contactsWithDummy = res.data.contacts.map((c, index) => ({
                    ...c,
                    type: ['missed', 'received', 'outgoing', 'rejected'][index % 4],
                    phone: '+91XXXXXXXXXX',
                    date: '2025-07-07',
                }));
                setContacts(contactsWithDummy);
            }
        } catch (err) {
            console.error('Failed to fetch contacts:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
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
        <View className="flex-1 bg-black px-4 pt-6">
            <Header title='Contact Log' profilePic={true} />
            <Text className="text-white text-2xl font-bold mb-4">Call Logs</Text>

            {/* Counters */}
            <View className="flex-row flex-wrap justify-between mb-5">
                <View className="w-[47%] items-center py-3 mb-3 rounded-xl bg-zinc-800">
                    <Text className="text-red-400 text-xl font-bold">{counts.missed}</Text>
                    <Text className="text-white">Missed</Text>
                </View>
                <View className="w-[47%] items-center py-3 mb-3 rounded-xl bg-zinc-800">
                    <Text className="text-green-400 text-xl font-bold">{counts.received}</Text>
                    <Text className="text-white">Received</Text>
                </View>
                <View className="w-[47%] items-center py-3 mb-3 rounded-xl bg-zinc-800">
                    <Text className="text-blue-400 text-xl font-bold">{counts.outgoing}</Text>
                    <Text className="text-white">Outgoing</Text>
                </View>
                <View className="w-[47%] items-center py-3 mb-3 rounded-xl bg-zinc-800">
                    <Text className="text-purple-400 text-xl font-bold">{counts.rejected}</Text>
                    <Text className="text-white">Rejected</Text>
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0ea5e9" className="mt-10" />
            ) : (
                <FlatList
                    data={contacts}
                    keyExtractor={(item) => item.id?.toString()}
                    renderItem={({ item }) => (
                        <View className="flex-row justify-between items-center bg-zinc-900 rounded-xl px-4 py-3 mb-3">
                            <View className="flex-1">
                                <Text className="text-white font-semibold">
                                    {item.first_name} {item.last_name}
                                </Text>
                                <Text className="text-gray-400">{item.phone}</Text>
                                <Text className="text-gray-500 text-xs mt-1">{item.date}</Text>
                            </View>
                            <View className="flex-row items-center gap-4">
                                {getCallIcon(item.type)}
                                <TouchableOpacity onPress={() => openWhatsApp(item.phone)}>
                                    <FontAwesome name="whatsapp" size={22} color="#25D366" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={<Text className="text-center text-gray-400 mt-10">No call logs</Text>}
                />
            )}
        </View>
    );
}