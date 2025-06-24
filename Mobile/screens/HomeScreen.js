import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { LineChart, StackedBarChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

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

export default function DashboardScreen() {
    const [refreshing, setRefreshing] = useState(false);
    const [dataIndex, setDataIndex] = useState(0);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setDataIndex((prev) => (prev === 0 ? 1 : 0));
            setRefreshing(false);
        }, 1500);
    }, []);

    const { lineChart, stacked, agent } = dummyData[dataIndex];

    return (
        <SafeAreaView className="flex-1 bg-black">
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
                    <Text className="text-4xl font-extrabold text-sky-600 tracking-tight">SmartPromotion</Text>
                    <Text className="text-lg text-white mt-1">Welcome back, Sangram 👋</Text>
                    <Text className="text-sm text-white">Here’s an overview of your team's performance.</Text>
                </View>

                {/* Line Chart */}
                <Text className="text-lg font-semibold text-white mb-2">Call Progress (Weekly)</Text>
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
                            r: "5",
                            strokeWidth: "2",
                            stroke: "#0284c7",
                        },
                    }}
                    bezier
                    style={{ borderRadius: 16, marginBottom: 20 }}
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
                    style={{ borderRadius: 16, marginBottom: 24 }}
                />

                {/* Agent Summary */}
                <Text className="text-lg font-semibold text-white mb-2">Agent Call Summary</Text>
                <View className="bg-gray-100 p-4 rounded-xl shadow-sm">
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
                <Text className='border border-b-hairline'></Text>
            </ScrollView>
        </SafeAreaView>
    );
}
