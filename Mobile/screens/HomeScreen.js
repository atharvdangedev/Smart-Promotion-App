import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { LineChart, StackedBarChart, PieChart } from 'react-native-chart-kit';
import Header from '../components/Header';
import { useColorScheme } from 'react-native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { useAuthStore } from '../store/useAuthStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchCall_log } from '../apis/Call_LogApi';
import { useQuery } from '@tanstack/react-query';
import { subDays, format, isToday } from 'date-fns';
import useThemeColors from '../hooks/useThemeColor';
import { useMonitoringStore } from '../store/useMonitoringStore';

const screenWidth = Dimensions.get('window').width;

// Helper to get the last N days
const getLastNDays = n => {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    days.push(format(subDays(new Date(), i), 'EEE'));
  }
  return days;
};

const processDashboardData = logs => {
  if (!logs) return null;

  const today = new Date();
  const last7Days = subDays(today, 7);
  const recentLogs = logs.filter(log => new Date(log.created_at) > last7Days);

  const todaysLogs = logs.filter(log => isToday(new Date(log.created_at)));
  const messagesSentToday = todaysLogs.length;

  const weeklyLabels = getLastNDays(7);
  const weeklyData = weeklyLabels.map(day => {
    return recentLogs.filter(
      log => format(new Date(log.created_at), 'EEE') === day,
    ).length;
  });

  const dailyLabels = getLastNDays(7);

  const myCalls = {
    incoming: recentLogs.filter(log => log.type === 'incoming').length,
    outgoing: recentLogs.filter(log => log.type === 'outgoing').length,
    missed: recentLogs.filter(log => log.type === 'missed').length,
    rejected: recentLogs.filter(log => log.type === 'rejected').length,
  };

  const dailyData = dailyLabels.map(day => {
    const dayLogs = recentLogs.filter(
      log => format(new Date(log.created_at), 'EEE') === day,
    );
    return [
      dayLogs.filter(l => l.type === 'incoming').length,
      dayLogs.filter(l => l.type === 'outgoing').length,
      dayLogs.filter(l => l.type === 'missed').length,
      dayLogs.filter(l => l.type === 'rejected').length,
    ];
  });

  const pieData = [
    {
      name: 'Incoming',
      population: myCalls.incoming,
      color: '#34d399',
      legendFontColor: '#333',
      legendFontSize: 13,
    },
    {
      name: 'Outgoing',
      population: myCalls.outgoing,
      color: '#60a5fa',
      legendFontColor: '#333',
      legendFontSize: 13,
    },
    {
      name: 'Missed',
      population: myCalls.missed,
      color: '#f87171',
      legendFontColor: '#333',
      legendFontSize: 13,
    },
    {
      name: 'Rejected',
      population: myCalls.rejected,
      color: '#a855f7',
      legendFontColor: '#333',
      legendFontSize: 13,
    },
  ];

  const totalCalls = Object.values(myCalls).reduce((a, b) => a + b, 0);
  const callEfficiency =
    totalCalls > 0
      ? (((myCalls.incoming + myCalls.outgoing) / totalCalls) * 100).toFixed(1)
      : 0;

  const firstHalf = weeklyData.slice(0, 3).reduce((a, b) => a + b, 0);
  const secondHalf = weeklyData.slice(4, 7).reduce((a, b) => a + b, 0);
  const weeklyTrend =
    secondHalf > firstHalf ? 'up' : secondHalf < firstHalf ? 'down' : 'stable';

  return {
    messagesSentToday,
    myCalls,
    totalCalls,
    callEfficiency,
    weeklyTrend,
    weeklyProgress: {
      labels: weeklyLabels,
      data: weeklyData,
    },
    dailyCallTypes: {
      labels: dailyLabels,
      data: dailyData,
    },
    pieData: pieData.filter(item => item.population > 0),
  };
};

let popupChecked = false;

export default function DashboardScreen({ navigation }) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedChart, setSelectedChart] = useState('line');
  const colors = useThemeColors();
  const { monitoring, permission } = useMonitoringStore();
  const username = useAuthStore(state => state.username);
  const userType = useAuthStore(state => state.userType);

  const {
    data: stats = [],
    isRefetching,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ['dashboardStats', userType],
    queryFn: () => fetchCall_log(userType),
    select: processDashboardData,
  });

  useEffect(() => {
    const checkPopupStatus = async () => {
      if (popupChecked) return;
      popupChecked = true;

      try {
        const hasSeenPopup = await AsyncStorage.getItem('hasSeenPopup');
        if (!hasSeenPopup) {
          setShowPopup(true);
        }
      } catch (error) {
        console.log('Error checking popup status:', error);
      }
    };
    checkPopupStatus();
  }, []);

  const handleChoice = async () => {
    await AsyncStorage.setItem('hasSeenPopup', 'true');
    setShowPopup(false);
  };

  const theme = useColorScheme();
  const isDark = theme === 'dark';

  if (isLoading) {
    return (
      <SafeAreaWrapper className="flex-1 bg-white dark:bg-dark-background">
        <Header title="Dashboard" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator
            size="large"
            color={isDark ? '#5eead4' : '#0284c7'}
          />
          <Text className="mt-4 text-light-text dark:text-dark-text">
            Loading stats...
          </Text>
        </View>
      </SafeAreaWrapper>
    );
  }

  const getTrendIcon = trend => {
    switch (trend) {
      case 'up':
        return '📈';
      case 'down':
        return '📉';
      default:
        return '➡️';
    }
  };

  return (
    <SafeAreaWrapper className="flex-1 bg-white dark:bg-dark-background">
      <Header title="Dashboard" />
      <ScrollView
        className="px-4 py-0"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={['#0ea5e9']}
            tintColor="#0ea5e9"
          />
        }
      >
        <View className="mb-6">
          <Text className="text-lg text-light-text dark:text-dark-text mt-0">
            Welcome back, {username} 👋
          </Text>
          <Text className="text-sm text-light-subtext dark:text-dark-subtext">
            Here's an overview of your team's performance.
          </Text>
        </View>

        <View
          className="p-4 rounded-xl mb-4"
          style={{ backgroundColor: colors.inputBg }}
        >
          <Text className="text-lg font-bold text-black">System Status</Text>
          <View className="flex-row justify-between mt-3">
            <Text className="text-black font-semibold">Permission Status</Text>
            <Text
              className="font-semibold"
              style={{
                color: permission.status === 'granted' ? 'green' : 'red',
              }}
            >
              {permission.status}
            </Text>
          </View>
          <View className="flex-row justify-between my-3">
            <Text className="font-semibold text-black">Monitoring </Text>
            <Text
              className="font-semibold"
              style={{
                color: monitoring.isMonitoring ? 'green' : 'red',
              }}
            >
              {monitoring.isMonitoring ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>

        {stats ? (
          <>
            <View className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border p-4 rounded-xl shadow-sm mb-6">
              <Text className="text-base font-bold text-light-text dark:text-dark-text mb-3">
                Today's Snapshot
              </Text>
              <View className="flex-row justify-between mb-2">
                <Text className="text-light-subtext dark:text-dark-subtext">
                  Messages Sent Today
                </Text>
                <Text className="text-light-text dark:text-dark-text font-semibold">
                  {stats.messagesSentToday}
                </Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-light-subtext dark:text-dark-subtext">
                  Call Efficiency
                </Text>
                <Text className="text-green-600 dark:text-green-400 font-semibold">
                  {stats.callEfficiency}%
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-light-subtext dark:text-dark-subtext">
                  Weekly Trend
                </Text>
                <Text className="text-light-text dark:text-dark-text font-semibold">
                  {getTrendIcon(stats.weeklyTrend)} {stats.weeklyTrend}
                </Text>
              </View>
            </View>

            <View className="flex-row mb-4 bg-light-card dark:bg-dark-card rounded-xl p-1 border border-light-border dark:border-dark-border">
              <TouchableOpacity
                onPress={() => setSelectedChart('line')}
                className={`flex-1 py-2 rounded-lg ${selectedChart === 'line' ? 'bg-blue-500' : 'bg-transparent'}`}
              >
                <Text
                  className={`text-center font-medium ${selectedChart === 'line' ? 'text-white' : 'text-light-text dark:text-dark-text'}`}
                >
                  Trends
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedChart('pie')}
                className={`flex-1 py-2 rounded-lg ${selectedChart === 'pie' ? 'bg-blue-500' : 'bg-transparent'}`}
              >
                <Text
                  className={`text-center font-medium ${selectedChart === 'pie' ? 'text-white' : 'text-light-text dark:text-dark-text'}`}
                >
                  Distribution
                </Text>
              </TouchableOpacity>
            </View>

            {selectedChart === 'line' ? (
              <>
                <Text className="text-lg font-semibold text-light-text dark:text-dark-text mb-3">
                  Call Progress (Last 7 Days)
                </Text>
                <LineChart
                  data={{
                    labels: stats.weeklyProgress.labels,
                    datasets: [
                      { data: stats.weeklyProgress.data, strokeWidth: 3 },
                    ],
                  }}
                  width={screenWidth - 32}
                  height={240}
                  yAxisInterval={1}
                  formatYLabel={y => `${Math.round(parseFloat(y))}`}
                  chartConfig={{
                    backgroundGradientFrom: isDark ? '#1E293B' : '#F9FAFB',
                    backgroundGradientTo: isDark ? '#1E293B' : '#F9FAFB',
                    decimalPlaces: 0,
                    color: (opacity = 1) =>
                      isDark
                        ? `rgba(94, 234, 212, ${opacity})`
                        : `rgba(14, 165, 233, ${opacity})`,
                    labelColor: () => (isDark ? '#E2E8F0' : '#475569'),
                    propsForDots: {
                      r: '6',
                      strokeWidth: '2.5',
                      stroke: isDark ? '#5eead4' : '#0284c7',
                      fill: isDark ? '#1E293B' : '#fff',
                    },
                    propsForBackgroundLines: {
                      strokeDasharray: '4,6',
                      stroke: isDark ? '#334155' : '#CBD5E1',
                    },
                    fillShadowGradient: isDark ? '#5eead4' : '#0284c7',
                    fillShadowGradientOpacity: 0.15,
                  }}
                  bezier
                  style={{
                    borderRadius: 16,
                    marginBottom: 24,
                    borderWidth: 1,
                    borderColor: isDark ? '#334155' : '#E2E8F0',
                    shadowColor: '#000',
                    shadowOpacity: 0.1,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 4,
                  }}
                />
              </>
            ) : (
              <>
                <Text className="text-lg font-semibold text-light-text dark:text-dark-text mb-3">
                  Call Distribution (Last 7 Days)
                </Text>
                <View className="items-center mb-6">
                  {stats.pieData.length > 0 ? (
                    <PieChart
                      data={stats.pieData.map(item => ({
                        ...item,
                        legendFontColor: isDark ? '#E2E8F0' : '#334155',
                        legendFontSize: 14,
                      }))}
                      width={screenWidth - 32}
                      height={220}
                      chartConfig={{
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      }}
                      accessor="population"
                      backgroundColor="transparent"
                      paddingLeft="20"
                      absolute
                      hasLegend={true}
                      style={{
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: isDark ? '#334155' : '#E2E8F0',
                        paddingVertical: 8,
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 4,
                      }}
                    />
                  ) : (
                    <View className="h-56 justify-center items-center bg-light-card dark:bg-dark-card rounded-xl border border-light-border dark:border-dark-border">
                      <Text className="text-light-subtext dark:text-dark-subtext">
                        No call data for distribution chart
                      </Text>
                    </View>
                  )}
                </View>
              </>
            )}

            <Text className="text-lg font-semibold text-light-text dark:text-dark-text mb-3">
              Daily Call Types (Last 7 Days)
            </Text>
            <StackedBarChart
              data={{
                labels: stats.dailyCallTypes.labels,
                data: stats.dailyCallTypes.data,
                barColors: ['#34d399', '#60a5fa', '#f87171', '#a855f7'],
              }}
              width={screenWidth - 36}
              height={260}
              chartConfig={{
                backgroundGradientFrom: isDark ? '#1E293B' : '#F9FAFB',
                backgroundGradientTo: isDark ? '#1E293B' : '#F9FAFB',
                decimalPlaces: 0,
                color: (opacity = 1) =>
                  isDark
                    ? `rgba(94, 234, 212, ${opacity})`
                    : `rgba(2, 132, 199, ${opacity})`,
                labelColor: () => (isDark ? '#E2E8F0' : '#475569'),
                barPercentage: 0.8,
                propsForBackgroundLines: {
                  strokeDasharray: '3,6',
                  stroke: isDark ? '#334155' : '#E2E8F0',
                },
              }}
              style={{
                borderRadius: 16,
                marginBottom: 24,
                borderWidth: 1,
                borderColor: isDark ? '#334155' : '#E2E8F0',
                padding: 4,
              }}
              withHorizontalLabels={true}
              segments={5}
            />

            <Text className="text-lg font-semibold text-light-text dark:text-dark-text mb-3">
              My Call Summary (Last 7 Days)
            </Text>
            <View className="bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border p-5 rounded-xl shadow-sm mb-2">
              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center">
                  <View className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                  <Text className="text-light-subtext dark:text-dark-subtext">
                    Inbound
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-light-text dark:text-dark-text font-semibold text-lg mr-2">
                    {stats.myCalls.incoming}
                  </Text>
                  <Text className="text-xs text-light-subtext dark:text-dark-subtext">
                    {stats.totalCalls > 0
                      ? `${((stats.myCalls.incoming / stats.totalCalls) * 100).toFixed(0)}%`
                      : '0%'}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center">
                  <View className="w-3 h-3 bg-sky-400 rounded-full mr-2" />
                  <Text className="text-light-subtext dark:text-dark-subtext">
                    Outgoing
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-light-text dark:text-dark-text font-semibold text-lg mr-2">
                    {stats.myCalls.outgoing}
                  </Text>
                  <Text className="text-xs text-light-subtext dark:text-dark-subtext">
                    {stats.totalCalls > 0
                      ? `${((stats.myCalls.outgoing / stats.totalCalls) * 100).toFixed(0)}%`
                      : '0%'}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <View className="w-3 h-3 bg-slate-400 rounded-full mr-2" />
                  <Text className="text-light-subtext dark:text-dark-subtext">
                    Missed
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-light-text dark:text-dark-text font-semibold text-lg mr-2">
                    {stats.myCalls.missed}
                  </Text>
                  <Text className="text-xs text-light-subtext dark:text-dark-subtext">
                    {stats.totalCalls > 0
                      ? `${((stats.myCalls.missed / stats.totalCalls) * 100).toFixed(0)}%`
                      : '0%'}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center">
                  <View className="w-3 h-3 bg-red-400 rounded-full mr-2" />
                  <Text className="text-light-subtext dark:text-dark-subtext">
                    Rejected
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-light-text dark:text-dark-text font-semibold text-lg mr-2">
                    {stats.myCalls.rejected}
                  </Text>
                  <Text className="text-xs text-light-subtext dark:text-dark-subtext">
                    {stats.totalCalls > 0
                      ? `${((stats.myCalls.rejected / stats.totalCalls) * 100).toFixed(0)}%`
                      : '0%'}
                  </Text>
                </View>
              </View>

              <View className="mt-4 pt-3 border-t border-light-border dark:border-dark-border">
                <View className="flex-row justify-between">
                  <Text className="text-light-subtext dark:text-dark-subtext font-medium">
                    Total Calls
                  </Text>
                  <Text className="text-light-text dark:text-dark-text font-bold text-lg">
                    {stats.totalCalls}
                  </Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          <View className="flex-1 justify-center items-center py-10">
            <Text className="text-light-text dark:text-dark-text">
              No call data available to display stats.
            </Text>
          </View>
        )}

        <Modal
          visible={showPopup}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPopup(false)}
        >
          <View className="flex-1 bg-black/60 justify-center items-center px-6">
            <View className="bg-light-background dark:bg-dark-background w-full rounded-xl p-4">
              <Text className="text-xl font-semibold text-light-text dark:text-dark-text mb-2 text-center">
                Get Started
              </Text>
              <Text className="text-base text-light-text dark:text-dark-text mb-6 text-center">
                Add Your Contacts to get started
              </Text>
              <View className="flex-row justify-between">
                <TouchableOpacity
                  onPress={handleChoice}
                  className="flex-1 py-3 rounded-md bg-gray-200 mr-2"
                >
                  <Text className="text-black font-medium text-center">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={async () => {
                    await handleChoice();
                    navigation.navigate('SelectContacts');
                  }}
                  className="flex-1 py-3 mr-2 rounded-md bg-black"
                >
                  <Text className="text-white font-medium text-center">
                    Import Contacts
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaWrapper>
  );
}
