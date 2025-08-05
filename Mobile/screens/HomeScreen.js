import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart, StackedBarChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import img from '../assets/image.png';
import { useColorScheme } from 'react-native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';

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

    const theme = useColorScheme();


    const isDark = theme === 'dark';

    const chartConfig = {
        backgroundGradientFrom: theme === 'dark' ? '#2C3E50' : '#FFFFFF',
        backgroundGradientTo: theme === 'dark' ? '#2C3E50' : '#FFFFFF',
        color: (opacity = 1) => theme === 'dark'
            ? `rgba(94, 234, 212, ${opacity})`
            : `rgba(2, 132, 199, ${opacity})`,
        labelColor: () => (theme === 'dark' ? '#E0E0E0' : '#333333'),
        propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: theme === 'dark' ? '#5eead4' : '#0284c7',
        },
    };

    return (
        <SafeAreaWrapper className="flex-1 bg-light-background dark:bg-dark-background py-2">
            <ScrollView
                className="px-4 py-0"
                showsVerticalScrollIndicator={false}
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

                    <Text className="text-lg text-light-text dark:text-dark-text mt-2">Welcome back, {name} 👋</Text>
                    <Text className="text-sm text-light-subtext dark:text-dark-subtext">Here’s an overview of your team's performance.</Text>
                </View>

                {/* Line Chart */}
                <Text className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">Call Progress (Weekly)</Text>

                <LineChart
                    data={{
                        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                        datasets: [{ data: lineChart }],
                    }}
                    width={screenWidth - 32}
                    height={220}
                    yAxisLabel=""
                    chartConfig={chartConfig}
                    bezier
                    style={{
                        borderRadius: 16,
                        marginBottom: 20,
                        borderWidth: 1,
                        borderColor: theme === 'dark' ? '#4A5568' : '#E0E0E0',
                    }}
                />


                {/* Stacked Bar Chart */}
                <Text className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">Call Types by Day</Text>
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
                        backgroundGradientFrom: isDark ? "#2C3E50" : "#fff",
                        backgroundGradientTo: isDark ? "#2C3E50" : "#fff",
                        color: (opacity = 1) => isDark
                            ? `rgba(255, 255, 255, ${opacity})`
                            : `rgba(0, 0, 0, ${opacity})`,
                        labelColor: () => isDark ? "#E0E0E0" : "#333333",
                        propsForBackgroundLines: {
                            strokeWidth: "0.3",
                            stroke: isDark ? "#5eead4" : "#0284c7",
                        },
                        barPercentage: 0.8,
                        decimalPlaces: 0,
                    }}
                    style={{
                        borderRadius: 16,
                        marginBottom: 24,
                        borderWidth: 1,
                        borderColor: isDark ? '#475569' : '#E0E0E0',
                        paddingVertical: 5,
                    }}
                />

                {/* Agent Summary */}
                <Text className="text-lg font-semibold text-light-text dark:text-dark-text mb-2">Agent Call Summary</Text>
                <View className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border p-4 rounded-xl shadow-sm ">
                    <Text className="text-base font-bold text-light-text dark:text-dark-text mb-2">{agent.name}</Text>
                    <View className="flex-row justify-between mb-1">
                        <Text className="text-light-subtext dark:text-dark-subtext">Inbound</Text>
                        <Text className="text-light-text dark:text-dark-text font-semibold">{agent.inbound}</Text>
                    </View>
                    <View className="flex-row justify-between mb-1">
                        <Text className="text-light-subtext dark:text-dark-subtext">Outbound</Text>
                        <Text className="text-light-text dark:text-dark-text font-semibold">{agent.outbound}</Text>
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="text-light-subtext dark:text-dark-subtext">Missed</Text>
                        <Text className="text-light-text dark:text-dark-text font-semibold">{agent.missed}</Text>
                    </View>
                </View>

                <Text className='m-1 border-gray-400 border-b-hairline'></Text>
            </ScrollView>
        </SafeAreaWrapper>
    );
}
