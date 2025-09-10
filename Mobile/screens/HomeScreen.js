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
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import Header from '../components/Header';
import { useColorScheme } from 'react-native';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { useAuthStore } from '../store/useAuthStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { fetchCall_log } from '../apis/Call_LogApi';
import { useQuery } from '@tanstack/react-query';
import { subDays, format, isToday, eachDayOfInterval } from 'date-fns';
import useThemeColors from '../hooks/useThemeColor';
import { useMonitoringStore } from '../store/useMonitoringStore';
import { fetchStats } from '../apis/DashboardStatsApi';

const screenWidth = Dimensions.get('window').width;

let popupChecked = false;

export default function DashboardScreen({ navigation }) {
  const [showPopup, setShowPopup] = useState(false);
  // const [selectedChart, setSelectedChart] = useState('line');
  const colors = useThemeColors();
  const { monitoring, permission } = useMonitoringStore();
  const username = useAuthStore(state => state.username);
  const userType = useAuthStore(state => state.rolename);

  const {
    data: StatsData = [],
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['Stats', userType],
    queryFn: () => fetchStats(userType),
  });

  const graphs = StatsData?.data?.graphs;
  const dates = StatsData?.data?.contacts?.upcoming_dates;

  const callsByTypeData = Object.entries(graphs?.calls_by_type_chart || {}).map(
    ([key, value], index) => ({
      name: key,
      population: Number(value),
      color: ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b'][index % 4],
      legendFontColor: '#333',
      legendFontSize: 12,
    }),
  );

  const buildCallTrendData = (apiTrend = []) => {
    const today = new Date();
    const weekAgo = subDays(today, 6);

    const last7Days = eachDayOfInterval({ start: weekAgo, end: today }).map(
      date => ({
        date: format(date, 'yyyy-MM-dd'),
        label: format(date, 'EEE'),
        count: 0,
      }),
    );

    last7Days.forEach(day => {
      const match = apiTrend.find(item => item.date === day.date);
      console.log('date', dates);
      if (match) {
        day.count = Number(match.count);
      }
    });

    return {
      labels: last7Days.map(d => d.label),
      values: last7Days.map(d => d.count),
    };
  };

  const apiTrend = StatsData?.data?.graphs?.call_trend || [];
  const { labels: callTrendLabels, values: callTrendValues } =
    buildCallTrendData(apiTrend);

  const callTypes = ['incoming', 'outgoing', 'missed', 'rejected'];

  const agentLabels = graphs?.agent_call_distribution?.map(
    agent => agent.first_name,
  );

  const agentDatasets = callTypes.map((type, index) => ({
    data: graphs?.agent_call_distribution?.map(agent => Number(agent[type])),
    color: () => ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b'][index % 4],
  }));

  useEffect(() => {
    const checkPopupStatus = async () => {
      if (popupChecked) return;
      popupChecked = true;
      console.log('stats are: ', StatsData.data.contacts.upcoming_dates);
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

        {StatsData ? (
          <>
            <View
              className="p-4 rounded-xl"
              style={{ backgroundColor: colors.inputBg }}
            >
              {userType === 'vendor' ? (
                <Text className="text-black font-bold">
                  Average Call Duration: {StatsData.data.cards.avg_duration}
                </Text>
              ) : (
                <Text className="text-black font-bold">
                  Total calls: {StatsData.data.cards.my_total_calls}
                </Text>
              )}
            </View>
            <Text
              className="text-lg font-bold mb-2 mt-4"
              style={{ color: colors.text }}
            >
              Call Distribution
            </Text>
            {callsByTypeData.length > 0 ? (
              <View
                className="rounded-xl"
                style={{ backgroundColor: colors.inputBg }}
              >
                <PieChart
                  data={callsByTypeData}
                  width={screenWidth - 40}
                  height={180}
                  chartConfig={{ color: () => '#000' }}
                  accessor={'population'}
                  backgroundColor={'transparent'}
                  paddingLeft={'15'}
                />
              </View>
            ) : (
              <Text className="text-black font-semibold text-center">
                No data available
              </Text>
            )}

            <Text
              className="text-lg font-bold mb-2 mt-4"
              style={{ color: colors.text }}
            >
              Call Trend
            </Text>
            {callTrendValues.length > 0 ? (
              <View
                className="rounded-xl"
                style={{ backgroundColor: colors.inputBg }}
              >
                <LineChart
                  data={{
                    labels: callTrendLabels,
                    datasets: [{ data: callTrendValues }],
                  }}
                  width={screenWidth - 40}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#f3f4f6',
                    backgroundGradientFrom: '#e5e7eb',
                    backgroundGradientTo: '#e5e7eb',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  bezier
                  style={{ borderRadius: 16 }}
                />
              </View>
            ) : (
              <Text className="text-lg text-center">No data available</Text>
            )}

            {userType === 'vendor' && (
              <>
                <Text
                  className="text-lg font-bold mt-4 mb-2"
                  style={{ color: colors.text }}
                >
                  Agent Call Distribution
                </Text>
                <BarChart
                  data={{
                    labels: agentLabels,
                    datasets: agentDatasets,
                  }}
                  width={screenWidth - 40}
                  height={250}
                  chartConfig={{
                    backgroundColor: '#f3f4f6',
                    backgroundGradientFrom: '#e5e7eb',
                    backgroundGradientTo: '#e5e7eb',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  }}
                  fromZero
                  verticalLabelRotation={30}
                />
              </>
            )}
            {/* <Text className="text-lg font-bold mt-4" style={{color:colors.text}}>Upcoming Dates: </Text>
            
            {dates?.map((item, index) => (
              <View
                key={index}
                className="p-4 rounded-xl my-2"
                style={{ backgroundColor: colors.inputBg }}
              >
                <Text className="text-black">{item.contact_name}</Text>
                <View className="flex-row justify-between">
                  <Text style={{ color: colors.text }}>{item.label}</Text>
                  <Text style={{ color: colors.text }}>{item.date}</Text>
                </View>
              </View>
            ))} */}
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
