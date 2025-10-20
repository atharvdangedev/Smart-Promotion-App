import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import SubHeader from '../components/SubHeader';
import { LockIcon, Monitor } from 'lucide-react-native';
import useThemeColors from '../hooks/useThemeColor';
import { useNavigation } from '@react-navigation/native';

export default function Settings() {
  const colors = useThemeColors();
  const navigation = useNavigation();

  return (
    <SafeAreaWrapper style={{ backgroundColor: colors.background }}>
      <SubHeader title="Settings" />
      <View className="mx-6 my-3">
        <Text className="text-lg my-2" style={{ color: colors.text }}>
          {' '}
          General
        </Text>
        <View
          className="p-4 border border-[#CBCBCB] rounded-xl mb-4"
          style={{ backgroundColor: colors.inputBg }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('MonitoringSettings')}
            className="flex-row items-center pb-1 border-b-hairline mb-3"
          >
            <Monitor size={18} color="black" />
            <Text className="text-lg text-black"> Call Monitoring</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('PermissionsScreen')}
            className="flex-row items-center pb-1 border-b-hairline mb-2"
          >
            <LockIcon size={20} color="black" />
            <Text className="text-lg text-black"> Permissions </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaWrapper>
  );
}
