import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import SubHeader from '../components/SubHeader';
import { LockIcon, Monitor } from 'lucide-react-native';
import useThemeColors from '../hooks/useThemeColor';

export default function Settings() {
  const colors = useThemeColors();

  return (
    <SafeAreaWrapper style={{ backgroundColor: colors.background }}>
      <SubHeader title="Settings" />
      <View className="mx-6 my-3">
        <Text className="text-lg my-2" style={{ color: colors.text }}>
          {' '}
          User
        </Text>
        <View
          className="p-4 pt-4 border border-[#CBCBCB] rounded-xl mb-4"
          style={{ backgroundColor: colors.inputBg }}
        >
          <Text className="text-black font-bold mb-1">Name</Text>
          <Text className="text-lg text-black mb-2 border-b-hairline">
            Vendor User
          </Text>
          <Text className="text-black font-bold mb-1">Email</Text>
          <Text className="text-lg text-black">example123@gmail.com</Text>
        </View>

        <Text className="text-lg my-2" style={{ color: colors.text }}>
          {' '}
          General
        </Text>
        <View
          className="p-4 border border-[#CBCBCB] rounded-xl mb-4"
          style={{ backgroundColor: colors.inputBg }}
        >
          <TouchableOpacity className="flex-row items-center pb-1 border-b-hairline mb-3">
            <Monitor size={18} color="black" />
            <Text className="text-lg text-black"> Call Monitoring</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center pb-1 border-b-hairline mb-2">
            <LockIcon size={20} color="black" />
            <Text className="text-lg text-black"> Privacy & Security</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaWrapper>
  );
}
