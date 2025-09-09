import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import SubHeader from '../components/SubHeader';
import useThemeColors from '../hooks/useThemeColor';
import { useMonitoringStore } from '../store/useMonitoringStore';
import { Trash2 } from 'lucide-react-native';

export default function BlacklistScreen() {
  const colors = useThemeColors();
  const { blacklist, removeFromBlacklist } = useMonitoringStore();

  const handleRemove = number => {
    Alert.alert(
      'Remove Number',
      `Are you sure you want to remove ${number} from the blacklist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', onPress: () => removeFromBlacklist(number), style: 'destructive' },
      ],
    );
  };

  return (
    <SafeAreaWrapper style={{ backgroundColor: colors.background }}>
      <SubHeader title="Blacklist" />
      <View className="mx-6 my-4 flex-1">
        {blacklist.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <Text style={{ color: colors.text, fontSize: 16 }}>
              Your blacklist is empty.
            </Text>
            <Text style={{ color: colors.text, marginTop: 8 }}>
              Dismiss a call notification to add a number here.
            </Text>
          </View>
        ) : (
          <FlatList
            data={blacklist}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <View
                className="flex-row justify-between items-center p-4 rounded-xl mb-3"
                style={{ backgroundColor: colors.inputBg }}
              >
                <Text className="text-black font-semibold text-lg">{item}</Text>
                <TouchableOpacity onPress={() => handleRemove(item)}>
                  <Trash2 size={22} color={colors.danger} />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaWrapper>
  );
}
