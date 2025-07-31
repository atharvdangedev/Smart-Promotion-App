import { Menu, Scan, User } from 'lucide-react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart, StackedBarChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import img from '../assets/image.png';

const screenWidth = Dimensions.get('window').width;

const dummyData = [
    {
        lineChart: [20, 45, 28, 80, 99, 43],
        stacked: [
            [20, 15, 5],
            [15, 10, 10],
            [30, 10, 8],
            [25, 20, 5],
            [40, 10, 7],
        ],
        agent: { name: "John Doe", inbound: 58, outbound: 34, missed: 8 },
    },
    {
        lineChart: [10, 35, 22, 70, 88, 31],
        stacked: [
            [15, 10, 5],
            [18, 14, 6],
            [28, 12, 1],
            [20, 25, 3],
            [38, 12, 5],
        ],
        agent: { name: "Priya Sharma", inbound: 65, outbound: 28, missed: 5 },
    },
];

export default function DashboardScreen({ navigation }) {

    const [refreshing, setRefreshing] = useState(false);
    const [dataIndex, setDataIndex] = useState(0);
    const [name, setName] = useState('');
    const [profilePic, setProfilePic] = useState('');

    useEffect(() => {
        const init = async () => {
            const username = await AsyncStorage.getItem('username');
            setName(username);

            const filename = await AsyncStorage.getItem('profile_pic');
            if (filename) {
                const url = `https://swp.smarttesting.in/public/uploads/profile/${filename}`;
                setProfilePic(url);
            } else {
                setProfilePic(null); // fallback
            }
        };
        init();
    }, []);


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setDataIndex((prev) => (prev === 0 ? 1 : 0));
            setRefreshing(false);
        }, 1500);
    }, []);

    const { lineChart, stacked, agent } = dummyData[dataIndex];
    const drawerNav = useNavigation();
    return (
        <SafeAreaView className="flex-1 bg-[#FDFDFD] dark:bg-[#2C3E50]">
            <ScrollView
                className="px-4 py-6"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#0ea5e9']}
                        tintColor="#0ea5e9"
                    />
                }
            >
                {/*  Welcome Section */}
                <View className="mb-6">
                    <Header title='Dashboard' profilePic={profilePic} />

                    <Text className="text-lg text-[#333333] dark:text-[#E0E0E0] mt-2">Welcome back, {name} 👋</Text>
                    <Text className="text-sm text-[#888888] dark:text-[#A0A0A0]">Here’s an overview of your team's performance.</Text>
                </View>

                {/* Line Chart */}
                <Text className="text-lg font-semibold text-[#333333] dark:text-[#E0E0E0] mb-2">Call Progress (Weekly)</Text>
                <LineChart
                    data={{
                        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                        datasets: [{ data: lineChart }],
                    }}
                    width={screenWidth - 32}
                    height={220}
                    yAxisLabel=""
                    chartConfig={{
                        backgroundGradientFrom: "#fff",
                        backgroundGradientTo: "#fff",
                        color: (opacity = 1) => `rgba(2, 132, 199, ${opacity})`,
                        labelColor: () => "#000",
                        propsForDots: {
                            r: "4",
                            strokeWidth: "2",
                            stroke: "#0284c7",
                        },
                    }}
                    bezier
                    style={{ borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#4A5568' }}
                    className="border-spacing- border-[#E0E0E0] dark:border-[#4A5568]"
                />

                {/* Stacked Bar Chart */}
                <Text className="text-lg font-semibold text-white mb-2">Call Types by Day</Text>
                <StackedBarChart
                    data={{
                        labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
                        legend: ["Inbound", "Outbound", "Missed"],
                        data: stacked,
                        barColors: ["#0ea5e9", "#38bdf8", "#94a3b8"],
                    }}
                    width={screenWidth - 32}
                    height={250}
                    chartConfig={{
                        backgroundGradientFrom: "#fff",
                        backgroundGradientTo: "#fff",
                        color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                        labelColor: () => "#000",
                    }}
                    style={{ borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#4A5568' }}
                />

                {/* Agent Summary */}
                <Text className="text-lg font-semibold text-white mb-2">Agent Call Summary</Text>
                <View className="bg-gray-100 p-4 rounded-xl shadow-sm ">
                    <Text className="text-base font-bold text-black mb-2">{agent.name}</Text>
                    <View className="flex-row justify-between mb-1">
                        <Text className="text-gray-700">Inbound</Text>
                        <Text className="text-black font-semibold">{agent.inbound}</Text>
                    </View>
                    <View className="flex-row justify-between mb-1">
                        <Text className="text-gray-700">Outbound</Text>
                        <Text className="text-black font-semibold">{agent.outbound}</Text>
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="text-gray-700">Missed</Text>
                        <Text className="text-black font-semibold">{agent.missed}</Text>
                    </View>
                </View>

                <Text className='m-1 border-gray-400 border-b-hairline'></Text>
            </ScrollView>
        </SafeAreaView>
    );
}
