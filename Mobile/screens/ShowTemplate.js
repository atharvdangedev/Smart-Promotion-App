import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { api } from '../utils/api';
import { RichTextInput } from '../components/RichTextEditor';
import Toast from 'react-native-toast-message';
import SubHeader from '../components/SubHeader';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { useAuthStore } from '../store/useAuthStore';
import { callTypes } from '../utils/constants';
import useThemeColors from '../hooks/useThemeColor';
import { useQueryClient } from '@tanstack/react-query';

const ShowTemplate = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const template = route.params?.template;
  const isEdit = route.params?.isEdit;

  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errorTitle, setErrorTitle] = useState('');
  const [errorDesc, setErrorDesc] = useState('');
  const [callType, setCallType] = useState(callTypes[0]);
  const role = useAuthStore(state => state.rolename);

  const token = useAuthStore(state => state.token);
  const colors = useThemeColors();

  useEffect(() => {
    if (isEdit && template) {
      if (role === 'agent') {
        navigation.navigate('HomeScreen');
      }

      setTitle(template.title || '');
      setDescription(template.description || '');

      const matchedType = callTypes.find(
        type => type.toLowerCase() === template.template_type?.toLowerCase(),
      );
      if (matchedType) {
        setCallType(matchedType);
      }
    }
  }, [isEdit, template]);

  const validate = () => {
    let valid = true;

    if (!title.trim()) {
      setErrorTitle('Template Name is required');
      valid = false;
    } else if (title.length < 3 || title.length > 200) {
      setErrorTitle('Template name must be between 3 to 200 characters');
      valid = false;
    } else {
      setErrorTitle('');
    }

    if (!description.trim()) {
      setErrorDesc('Template Description is required');
      valid = false;
    } else if (description.length < 3 || description.length > 700) {
      setErrorDesc('Description must be between 3 to 700 characters');
      valid = false;
    } else {
      setErrorDesc('');
    }

    return valid;
  };

  const saveTemplate = async () => {
    if (!validate()) return;
    if (!token) return;

    const payload = {
      title,
      description,
      template_type: callType,
    };

    try {
      if (isEdit && template?.id) {
        await api.post(`vendor/templates/${template.id}`, payload);
      } else {
        await api.post(`vendor/templates`, payload);
      }

      Toast.show({
        type: 'success',
        text1: isEdit
          ? 'Template updated successfully'
          : 'Template saved successfully',
      });

      navigation.goBack();
    } catch (err) {
      console.log('Template save error:', err.response?.data || err.message);
      Toast.show({
        type: 'error',
        text1: 'Failed to save template',
        text2: err.response?.data?.message || 'Something went wrong',
      });
    } finally {
      queryClient.invalidateQueries(['templates']);
    }
  };

  return (
    <SafeAreaWrapper
      className="flex-1 py-4"
      style={{ backgroundColor: colors.background }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 "
      >
        <SubHeader title="Template" />
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <Text
            className=" font-semibold text-xl py-2 mt-4"
            style={{ color: colors.text }}
          >
            Title
          </Text>
          <TextInput
            placeholder="Template Title"
            placeholderTextColor="gray"
            value={title}
            onChangeText={text => {
              setTitle(text);
              if (errorTitle) setErrorTitle('');
            }}
            className="border border-gray-400 text-black rounded-lg p-3 text-base mb-3"
            style={{ backgroundColor: colors.inputBg }}
          />
          {errorTitle !== '' && (
            <Text className="text-light-danger dark:text-dark-danger mt-1 ml-1">
              {errorTitle}
            </Text>
          )}

          <Text
            className=" font-semibold text-xl py-2"
            style={{ color: colors.text }}
          >
            Description
          </Text>
          <RichTextInput
            value={description}
            onChange={text => {
              setDescription(text);
              if (errorDesc) setErrorDesc('');
            }}
            showPreview={true}
          />
          {errorDesc !== '' && (
            <Text className="text-light-danger dark:text-dark-danger mt-1 ml-1">
              {errorDesc}
            </Text>
          )}

          <Text
            className=" mb-1 text-lg font-semibold "
            style={{ color: colors.text }}
          >
            Call Type
          </Text>
          {callTypes.map(type => (
            <Pressable
              key={type}
              onPress={() => setCallType(type)}
              className={`px-3 py-2 mb-1 rounded-xl ${callType === type ? 'bg-sky-600' : 'bg-[#E6F0F5]'}`}
            >
              <Text
                className={callType === type ? 'text-white' : 'text-gray-800'}
              >
                {type}
              </Text>
            </Pressable>
          ))}

          <View className="flex-row justify-between my-4 px-4">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="border border-[#FF5604] px-10 py-3 rounded"
            >
              <Text style={{ color: colors.text }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={saveTemplate}
              className=" px-10 py-3 rounded"
              style={{ backgroundColor: colors.btnBackground }}
            >
              <Text className="text-white font-semibold">Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
};

export default ShowTemplate;
