import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import useThemeColors from '../hooks/useThemeColor';

export default function ({ title }) {
  const navigation = useNavigation();
  const colors = useThemeColors();

  return (
    <View
      className="flex-row p-4 py-5 items-center"
      style={{ backgroundColor: colors.headerBg }}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <ArrowLeft size={25} color={colors.icon} />
      </TouchableOpacity>
      <Text className="text-2xl font-bold text-white text-center mx-6">
        {title}
      </Text>
    </View>
  );
}
