import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import SubHeader from '../components/SubHeader';
import useThemeColors from '../hooks/useThemeColor';
import { useMonitoringStore } from '../store/useMonitoringStore';
import { usePermissions } from '../hooks/usePermissions';

export default function MonitoringSettings() {
  const colors = useThemeColors();
  const { monitoring, permission, startMonitoring, stopMonitoring } =
    useMonitoringStore();
  const { request } = usePermissions();

  const handleToggleMonitoring = () => {
    if (monitoring.isMonitoring) {
      stopMonitoring();
    } else {
      startMonitoring(request);
    }
  };

  return (
    <SafeAreaWrapper style={{ backgroundColor: colors.background }}>
      <SubHeader title="Call Monitoring" />
      <View className="mx-6 my-4">
        <View
          className="p-4 rounded-xl"
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

        <Text className="font-bold text-lg mt-4" style={{ color: colors.text }}>
          {' '}
          Controls
        </Text>
        <TouchableOpacity
          className="py-4 px-4 mt-2 rounded-xl"
          style={{
            backgroundColor: monitoring.isMonitoring
              ? colors.danger
              : colors.orange,
          }}
          onPress={handleToggleMonitoring}
          disabled={monitoring.isStarting || monitoring.isStopping}
        >
          <Text className="text-center font-semibold text-white">
            {monitoring.isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaWrapper>
  );
}
