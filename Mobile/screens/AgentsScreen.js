import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, { useState } from 'react';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import useThemeColors from '../hooks/useThemeColor';
import Header from '../components/Header';
import { useAuthStore } from '../store/useAuthStore';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchAgents, toggleStatus } from '../apis/AgentApi';
import { API_PROFILE } from '@env';
import { handleApiSuccess } from '../utils/handleApiSuccess';

export default function AgentsScreen() {
  const user = useAuthStore(state => state.rolename);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState({});
  const colors = useThemeColors();

  const {
    data: agents = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['agents', user],
    queryFn: fetchAgents,
    onError: error => handleApiError(error, 'fetching agents'),
    enabled: !!user,
  });

  const statusMutation = useMutation({
    mutationFn: id => toggleStatus(id),
    onSuccess: data => {
      console.log(data.message);
      handleApiSuccess(data.message, 'Status Updated');
      setShowStatusModal(false);
      refetch();
    },
    onError: error => {
      handleApiError(error, 'updating status');
      setShowStatusModal(false);
    },
  });

  const confirmToggleStatus = agent => {
    setSelectedAgent(agent);
    setShowStatusModal(true);
  };

  return (
    <SafeAreaWrapper
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <Header title="Agents" />
      <View className="flex-1 m-4">
        {isLoading ? (
          <ActivityIndicator size="large" color="#0ea5e9" className="mt-10" />
        ) : agents.length === 0 ? (
          <View className="flex-1 justify-center items-center mt-20">
            <Text className="text-light-text dark:text-dark-text text-base">
              No Templates Found.
            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            className="flex-1 px-2"
            keyboardShouldPersistTaps="handled"
          >
            <Text
              className="text-2xl font-bold mb-2"
              style={{ color: colors.headingText }}
            >
              Agents List
            </Text>
            {agents.map(agent => (
              <View
                key={agent.id}
                className="rounded-xl p-3 mb-4 flex-row justify-between"
                style={{ backgroundColor: colors.inputBg }}
              >
                <View className="border border-gray-700 rounded-full ">
                  {agent.profile_pic ? (
                    <Image
                      source={{ uri: `${API_PROFILE}/${agent.profile_pic}` }}
                      className="w-14 h-14 rounded-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <Image
                      source={require('../assets/avatar-placeholder.jpg')}
                      className="w-14 h-14 rounded-full"
                      resizeMode="cover"
                    />
                  )}
                </View>
                <View className="flex-col ">
                  <Text className="text-lg font-bold text-black">
                    {agent.first_name} {agent.last_name}
                  </Text>
                  <Text className="text-sm font-semibold text-black">
                    {agent.contact_no}
                  </Text>
                </View>
                <View >
                  <TouchableOpacity onPress={() => confirmToggleStatus(agent)}>
                    <Text
                      className={`text-center text-white rounded-xl px-3 py-2 ${agent.status === '1' ? 'bg-[#26AC4E]' : 'bg-[#DC3545]'}`}
                    >
                      {agent.status === '0' ? 'Inactive' : 'Active'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
      <Modal
        visible={showStatusModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowStatusModal(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="bg-light-background dark:bg-dark-background w-full rounded-xl p-4">
            <Text className="text-xl text-center font-semibold text-light-text dark:text-dark-text mb-2">
              Confirm Status Change
            </Text>
            <Text className="text-base text-center text-light-text dark:text-dark-text mb-6">
              Are you sure you want to{' '}
              {selectedAgent?.status === '1' ? 'deactive' : 'active'} Agent{' '}
              {selectedAgent.first_name}?
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setShowStatusModal(false)}
                className="flex-1 py-3 rounded-md bg-gray-200 mr-2"
              >
                <Text className="text-black font-medium text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  statusMutation.mutate(selectedAgent.id);
                }}
                disabled={statusMutation.isLoading}
                className="flex-1 py-3 rounded-md bg-black"
              >
                <Text className="text-white font-medium text-center">Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaWrapper>
  );
}
