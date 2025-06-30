import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking } from 'react-native';
import {
    PhoneMissed,
    PhoneIncoming,
    PhoneOutgoing,
    PhoneOff,
} from 'lucide-react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const callLogs = [
    { id: '1', name: 'WB Lead', phone: '+9175032199054', type: 'missed', date: '17/01/2025' },
    { id: '2', name: 'Anita Rao', phone: '+919535672338', type: 'received', date: '17/01/2025' },
    { id: '3', name: 'Pushpa', phone: '+917878129004', type: 'outgoing', date: '17/01/2025' },
    { id: '4', name: 'Kiran', phone: '+919172345635', type: 'rejected', date: '17/01/2025' },
    { id: '5', name: 'Veer', phone: '+919373980130', type: 'missed', date: '17/01/2025' },
    { id: '6', name: 'Rahul K', phone: '+919882345615', type: 'missed', date: '17/01/2025' },
    { id: '7', name: 'Ravi Gupta', phone: '+919179345645', type: 'received', date: '17/01/2025' },
];

export default function CallLogScreen() {
    const counts = {
        missed: callLogs.filter(c => c.type === 'missed').length,
        received: callLogs.filter(c => c.type === 'received').length,
        outgoing: callLogs.filter(c => c.type === 'outgoing').length,
        rejected: callLogs.filter(c => c.type === 'rejected').length,
    };

    const getCallIcon = (type) => {
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

    const openWhatsApp = (phone) => {
        const number = phone.replace(/\D/g, '');
        const url = `https://wa.me/${number}`;
        Linking.openURL(url).catch(err => console.error('WhatsApp Error:', err));
    };

    return (
        <View className="flex-1 bg-black px-4 pt-6">
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

            {/* Call Logs List */}
            <FlatList
                data={callLogs}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View className="flex-row justify-between items-center bg-zinc-900 rounded-xl px-4 py-3 mb-3">
                        <View className="flex-1">
                            <Text className="text-white font-semibold">{item.name}</Text>
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
        </View>
    );
}
