import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Modal,
  RefreshControl,
} from 'react-native';
import React, { useState } from 'react';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import Header from '../components/Header';
import {
  deleteTemplate,
  fetchTemplate,
  toggleStatus,
} from '../apis/TemplateApi';
import { useMutation, useQuery } from '@tanstack/react-query';
import { handleApiError } from '../utils/handleApiError';
import { useAuthStore } from '../store/useAuthStore';
import { Pencil, Plus, Trash2 } from 'lucide-react-native';
import { callTypeColors } from '../utils/constants';
import { renderFormattedText } from '../utils/renderFormattedText';
import { handleApiSuccess } from '../utils/handleApiSuccess';
import { useNavigation } from '@react-navigation/native';

const Template = () => {
  const user = useAuthStore(state => state.rolename);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedTemp, setSelectedTemp] = useState({});
  const navigation = useNavigation();

  const {
    data: templates = [],
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['templates'],
    queryFn: () => fetchTemplate(user),
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: id => deleteTemplate(id),
    onSuccess: data => {
      handleApiSuccess(data.message, 'Delete');
      setShowDeleteModal(false);
      refetch();
    },
    onError: error => {
      handleApiError(error, 'deleting template');
      setShowDeleteModal(false);
    },
  });

  const statusMutation = useMutation({
    mutationFn: id => toggleStatus(id),
    onSuccess: data => {
      handleApiSuccess(data.message, 'Status Updated');
      setShowStatusModal(false);
      refetch();
    },
    onError: error => {
      handleApiError(error, 'updating status');
      setShowStatusModal(false);
    },
  });

  const theme = useColorScheme();
  let editcolor = '';
  theme === 'light' ? (editcolor = '#333333') : (editcolor = '#E0E0E0');

  const confirmToggleStatus = template => {
    setSelectedTemp(template);
    setShowStatusModal(true);
  };

  const handleDelete = template => {
    setSelectedTemp(template);
    setShowDeleteModal(true);
  };

  return (
    <SafeAreaWrapper className="flex-1 bg-white dark:bg-dark-background">
      <Header title="Message Templates" />
      {isLoading ? (
        <ActivityIndicator size="large" color="#0ea5e9" className="mt-10" />
      ) : templates.length === 0 ? (
        <View className="flex-1 justify-center items-center mt-20">
          <Text className="text-light-text dark:text-dark-text text-base">
            No Templates Found.
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="flex-1 mx-4 mb-4"
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
        >
          {templates.map(template => (
            <View
              key={template.id}
              className={`bg-light-listItem dark:bg-dark-listItem rounded-xl p-4 mb-4 border-l-2 ${template.status === '1' ? 'border-l-green-500' : 'border-l-red-500'} `}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('TemplateDetails', {
                    templateId: template.id,
                  });
                }}
              >
                <View className="flex-row justify-between">
                  <Text className="text-[#206689] dark:text-white text-xl font-bold mb-2">
                    {template.title}
                  </Text>
                  {template.is_primary === '1' ? (
                    <Text className="text-[#206689] text-base mr-2 mb-2 bg-white p-1 px-3 rounded-full">
                      Primary
                    </Text>
                  ) : null}
                </View>
                <View className="bg-white p-2 rounded-xl">
                  <Text numberOfLines={3} className="text-xl">
                    {renderFormattedText(template.description)}
                  </Text>
                </View>
                {user === 'agent' ? null : (
                  <View className="flex-row justify-between items-center mt-3">
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={() => {
                          confirmToggleStatus(template);
                        }}
                      >
                        <Text
                          className={`text-xs px-2 py-1 rounded ${template.status === '1' ? 'bg-[#26AC4E]' : 'bg-[#FF0000]'} text-white`}
                        >
                          {template.status === '0' ? 'Inactive' : 'Active'}
                        </Text>
                      </TouchableOpacity>

                      <Text
                        className="text-xs px-2 py-1 text-white rounded"
                        style={{
                          backgroundColor:
                            callTypeColors[
                              template.template_type?.toLowerCase()
                            ] || callTypeColors.default,
                        }}
                      >
                        {template.template_type.toUpperCase()}
                      </Text>
                    </View>
                    <View className="flex-row gap-5">
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('ShowTemplate', {
                            template: template,
                            isEdit: true,
                          })
                        }
                      >
                        <Pencil color={editcolor} size={20} />
                      </TouchableOpacity>

                      <TouchableOpacity onPress={() => handleDelete(template)}>
                        <Trash2 color="red" size={20} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {user === 'agent' ? null : (
        <TouchableOpacity
          onPress={() => navigation.navigate('ShowTemplate')}
          className="absolute bottom-6 right-6 bg-sky-500 p-4 rounded-full"
        >
          <Plus color="white" size={24} />
        </TouchableOpacity>
      )}

      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="bg-light-background dark:bg-dark-background w-full rounded-xl p-4">
            <Text className="text-xl font-semibold text-light-text dark:text-dark-text mb-2 text-center">
              Confirm Delete
            </Text>
            <Text className="text-base text-light-text dark:text-dark-text mb-6 text-center">
              Are you sure you want to delete template {selectedTemp.title}?
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-md bg-gray-200 mr-2"
              >
                <Text className="text-black font-medium text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  deleteMutation.mutate(selectedTemp.id);
                }}
                disabled={deleteMutation.isLoading}
                className="flex-1 py-3 mr-2 rounded-md bg-black"
              >
                <Text className="text-white font-medium text-center">
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
              {selectedTemp?.status === '1' ? 'deactive' : 'active'} template{' '}
              {selectedTemp.title}?
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
                  statusMutation.mutate(selectedTemp.id);
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
};

export default Template;
