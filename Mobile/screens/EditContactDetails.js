import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import useThemeColors from '../hooks/useThemeColor';
import { User } from 'lucide-react-native';
import { API_CONTACT } from '@env';
import { useRoute } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useForm, Controller } from 'react-hook-form';
import { updateContact } from '../apis/ContactsApi';
import { useMutation } from '@tanstack/react-query';
import SubHeader from '../components/SubHeader';
import { handleApiSuccess } from '../utils/handleApiSuccess';
import { handleApiError } from '../utils/handleApiError';
import { useAuthStore } from '../store/useAuthStore';

export default function EditContactDetails({ navigation }) {
  const colors = useThemeColors();
  const route = useRoute();
  const user = useAuthStore(state => state.rolename);
  const contact = route.params?.contact;

  const [profilePicPreview, setProfilePicPreview] = useState(
    contact?.image ? `${API_CONTACT}/${contact.image}` : null,
  );
  const [dates, setDates] = useState(contact?.dates || []);

  const firstLetter =
    contact?.contact_name && contact.contact_name.charAt(0).toUpperCase();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      contact_name: contact?.contact_name || '',
      contact_number: contact?.contact_number || '',
      tag: contact?.tag || '',
      email: contact?.email || '',
      label: contact?.label || '',
      note: contact?.note || '',
      image: contact?.image || null,
    },
  });

  const mutation = useMutation({
    mutationFn: data => updateContact(contact.id, data, user),
    onSuccess: data => {
      handleApiSuccess(data.message, 'Status Updated');
      navigation.goBack();
    },
    onError: error => {
      handleApiError(error, 'updating status');
    },
  });

  const handleProfilePic = async () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.8,
    };

    try {
      const result = await launchImageLibrary(options);
      if (result.didCancel) return;
      if (result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setProfilePicPreview(selectedImage.uri);
        setValue('image', selectedImage);
        console.log('Selected img', selectedImage);
      }
    } catch (e) {
      console.error('Error picking image', e);
    }
  };

  const onSubmit = formData => {
    const payload = new FormData();

    payload.append('contact_name', formData.contact_name);
    payload.append('contact_number', formData.contact_number);
    payload.append('email', formData.email);
    payload.append('label', formData.label);
    payload.append('note', formData.note);

    dates.forEach((d, idx) => {
      if (d.id) payload.append(`dates[${idx}][id]`, d.id);
      payload.append(`dates[${idx}][date_title]`, d.date_title);
      payload.append(`dates[${idx}][date]`, d.date);
    });

    if (formData.image && formData.image.uri) {
      payload.append('image', {
        uri: formData.image.uri,
        name: formData.image.fileName || `photo_${Date.now()}.jpg`,
        type: formData.image.type || 'image/jpeg',
      });
    }

    mutation.mutate(payload);
  };

  return (
    <SafeAreaWrapper style={{ backgroundColor: colors.background }}>
      <SubHeader title="Edit Contact" />
      <ScrollView className="pb-10">
        <View className="mx-4">
          <View className="flex-row justify-center items-center">
            <View className="mt-4 w-24 h-24 rounded-full bg-gray-700 mb-3 border-4 border-sky-500 overflow-hidden">
              <TouchableOpacity onPress={handleProfilePic}>
                {profilePicPreview ? (
                  <Image
                    source={{ uri: profilePicPreview }}
                    className="w-full h-full rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    className="w-full h-full rounded-full justify-center items-center"
                    style={{ backgroundColor: '#0ea5e9' }}
                  >
                    {firstLetter ? (
                      <Text className="text-white text-4xl font-bold">
                        {firstLetter}
                      </Text>
                    ) : (
                      <User size={30} color="white" />
                    )}
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View className="mx-2">
            {[
              { name: 'contact_name', label: 'Name' },
              { name: 'contact_number', label: 'Contact Number' },
              { name: 'email', label: 'Email' },
              { name: 'label', label: 'Label' },
              { name: 'note', label: 'Note' },
            ].map((field, idx) => (
              <View key={idx} className="mb-2">
                <Text className="mb-1 text-lg" style={{ color: colors.text }}>
                  {field.label}
                </Text>
                <Controller
                  control={control}
                  name={field.name}
                  rules={{ required: field.name === 'contact_name' }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      className="text-black rounded-xl px-3 py-2"
                      style={{ backgroundColor: colors.inputBg }}
                    />
                  )}
                />
                {errors[field.name] && (
                  <Text className="text-red-500 text-xs">
                    {field.label} is required
                  </Text>
                )}
              </View>
            ))}
          </View>

          <Text
            className="text-lg font-semibold mb-2"
            style={{ color: colors.text }}
          >
            Dates
          </Text>
          {dates.map((d, index) => (
            <View
              key={index}
              style={{ backgroundColor: colors.background }}
              className="flex-row justify-between gap-2 mb-3"
            >
              <TextInput
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                style={{ color: colors.text }}
                placeholder="Date Title"
                value={d.date_title}
                onChangeText={text => {
                  const newDates = [...dates];
                  newDates[index].date_title = text;
                  setDates(newDates);
                }}
              />
              <TextInput
                className="flex-1 text-black dark:text-white border border-gray-300 rounded-lg px-3 py-2"
                placeholder="YYYY-MM-DD"
                value={d.date}
                onChangeText={text => {
                  const newDates = [...dates];
                  newDates[index].date = text;
                  setDates(newDates);
                }}
              />
            </View>
          ))}
          <TouchableOpacity
            className="bg-sky-500 rounded-lg py-2 px-4 mb-4"
            onPress={() =>
              setDates([...dates, { date_title: 'Custom Date', date: '' }])
            }
          >
            <Text className="text-white text-center">+ Add Date</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="rounded-lg py-3 mt-2 mb-4"
            style={{ backgroundColor: colors.orange }}
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="text-white text-center text-lg font-semibold">
              Save Contact
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
}
