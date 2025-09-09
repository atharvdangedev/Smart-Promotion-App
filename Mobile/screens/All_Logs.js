import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  RefreshControl,
  TextInput,
  Modal,
} from 'react-native';
import React, { useState } from 'react';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import useThemeColors from '../hooks/useThemeColor';
import { useAuthStore } from '../store/useAuthStore';
import { useQuery } from '@tanstack/react-query';
import { fetchCall_log } from '../apis/Call_LogApi';
import { getCallIcon } from '../utils/constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SubHeader from '../components/SubHeader';
import { formatTimestamp } from '../utils/formatTimestamp';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function All_Logs() {
  const colors = useThemeColors();
  const navigation = useNavigation();
  const user = useAuthStore(state => state.rolename);

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    startDate: '',
    endDate: '',
  });

  const [modalVisible, setModalVisible] = useState(false);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const {
    data: call_logs = [],
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['call_logs', filters],
    queryFn: () => fetchCall_log(user, filters),
  });

  const openWhatsApp = phone => {
    const number = phone.replace(/\D/g, '');
    Linking.openURL(`https://wa.me/${number}`).catch(console.error);
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      type: '',
      startDate: '',
      endDate: '',
    });
    refetch();
  };

  return (
    <SafeAreaWrapper style={{ backgroundColor: colors.background }}>
      <SubHeader title="All Logs" />

      <View className="mx-4 mt-4">
        <TextInput
          placeholder="Search by name or number"
          placeholderTextColor="#999"
          value={filters.search}
          onChangeText={text => setFilters({ ...filters, search: text })}
          onSubmitEditing={refetch}
          className="text-black px-4 py-2 rounded-xl"
          style={{ backgroundColor: colors.inputBg }}
        />
      </View>

      <View className="flex-row justify-between items-center mx-4 mt-3">
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          className="px-3 py-2 rounded-lg"
          style={{ backgroundColor: colors.inputBg }}
        >
          <Text style={{ color: colors.text }}>
            {filters.type ? `Filters: ${filters.type}` : 'Filter Call Type'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowStartPicker(true)}
          className="px-3 py-2 rounded-lg"
          style={{ backgroundColor: colors.inputBg }}
        >
          <Text style={{ color: colors.text }}>
            {filters.startDate || 'Start Date'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowEndPicker(true)}
          className="px-3 py-2 rounded-lg"
          style={{ backgroundColor: colors.inputBg }}
        >
          <Text style={{ color: colors.text }}>
            {filters.endDate || 'End Date'}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="px-3 mb-2">
        <TouchableOpacity
          onPress={clearAllFilters}
          className="px-3 py-2 rounded-lg"
        >
          <Text
            style={{ color: colors.text }}
            className="border border-light-border dark:border-dark-border py-1 rounded-xl text-center font-bold"
          >
            Clear All
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 mx-4 mt-5">
        <FlatList
          data={call_logs}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ContactDetails', {
                  contact_id: item.contact_id,
                })
              }
              className="mb-2"
            >
              <View className="flex-row justify-between items-center bg-light-card dark:bg-dark-card border border-[#E0E0E0] dark:border-[#4A5568] rounded-xl px-4 py-3 mb-3">
                <View className="flex-1">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-light-text dark:text-dark-text font-semibold">
                      {item.contact_name ? item.contact_name : 'Unknown'}
                    </Text>
                    <Text className="text-light-text dark:text-dark-text font-semibold text-sm capitalize">
                      Type: {item.type}
                    </Text>
                  </View>

                  <View className="flex-row gap-4">
                    <Text className="text-gray-400">{item.number}</Text>
                    <Text className="text-gray-400 text-xs mt-1">
                      {formatTimestamp(Number(item.timestamp))}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-4 ml-4">
                  {getCallIcon(item.type)}
                  <TouchableOpacity onPress={() => openWhatsApp(item.number)}>
                    <FontAwesome name="whatsapp" size={22} color="#25D366" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
          }
          ListEmptyComponent={
            <Text className="text-center text-gray-400 mt-10">
              No call logs
            </Text>
          }
        />
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 justify-center items-center bg-black/40"
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View className="bg-white dark:bg-dark-card rounded-xl p-4 w-72">
            <Text className="text-lg font-bold text-light-text dark:text-dark-text mb-3">
              Select Call Type
            </Text>
            {['incoming', 'outgoing', 'missed', 'rejected'].map(type => (
              <TouchableOpacity
                key={type}
                onPress={() => {
                  setFilters({ ...filters, type });
                  setModalVisible(false);
                }}
                className="flex-row items-center gap-3 py-2"
              >
                {getCallIcon(type)}
                <Text className="text-light-text dark:text-dark-text capitalize">
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => {
                setFilters({ ...filters, type: '' });
                setModalVisible(false);
              }}
              className="mt-3 p-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
            >
              <Text className="text-red-500 text-center">Clear Filter</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {showStartPicker && (
        <DateTimePicker
          value={filters.startDate ? new Date(filters.startDate) : new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartPicker(false);
            if (selectedDate) {
              const dateStr = selectedDate.toISOString().split('T')[0];
              setFilters({ ...filters, startDate: dateStr });
            }
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={filters.endDate ? new Date(filters.endDate) : new Date()}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndPicker(false);
            if (selectedDate) {
              const dateStr = selectedDate.toISOString().split('T')[0];
              setFilters({ ...filters, endDate: dateStr });
            }
          }}
        />
      )}
    </SafeAreaWrapper>
  );
}
