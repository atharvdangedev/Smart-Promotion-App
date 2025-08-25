import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { API_PROFILE, BASE_URL } from '@env';
import { useAuthStore } from '../store/useAuthStore';
import { launchImageLibrary } from 'react-native-image-picker';
import { APP_PERMISSIONS, ROLE_PERMISSIONS } from '../utils/permissions';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import SubHeader from '../components/SubHeader';
import { Camera } from 'lucide-react-native';
import { handleApiError } from '../utils/handleApiError';
import { handleApiSuccess } from '../utils/handleApiSuccess';
import { agentSchema, baseSchema, vendorSchema } from '../utils/schemas';
import { businessTypes } from '../utils/constants';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const schemaMap = {
    base: baseSchema,
    vendor: baseSchema.concat(vendorSchema),
    agent: baseSchema.concat(agentSchema),
  };

  const navigation = useNavigation();

  const userData = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const token = useAuthStore(state => state.token);
  const rolename = useAuthStore(state => state.rolename);
  const setProfilePic = useAuthStore(state => state.setProfilePic);
  const setUsername = useAuthStore(state => state.setUsername);

  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [businessTypeModal, setBusinessTypeModal] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [updated, setUpdated] = useState(false);

  const selectedSchema = useMemo(() => {
    const role = rolename?.toLowerCase();
    return schemaMap[role] ?? baseSchema;
  }, [rolename]);

  const { control, handleSubmit, setValue } = useForm({
    resolver: yupResolver(selectedSchema),
    mode: 'onBlur',
  });

  const hasPermission = useCallback(
    permission => {
      if (!userData || !userData.role) {
        return false;
      }
      const userRoleIds = userData.role
        .split(',')
        .map(id => parseInt(id.trim(), 10));
      for (const roleId of userRoleIds) {
        const permissionsForRole = ROLE_PERMISSIONS[roleId];
        if (permissionsForRole && permissionsForRole.includes(permission)) {
          return true;
        }
      }
      return false;
    },
    [userData],
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/${userData?.rolename}/${userData?.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.status === 200) {
          const user = res.data[rolename];
          setValue('firstname', user.first_name);
          setValue('lastname', user.last_name);
          setValue('email', user.email);
          setValue('contact_no', user.contact_no);
          setValue('address', user.address);
          setValue('old_profile_pic', user.profile_pic);
          if (user.profile_pic) {
            setProfilePic(user?.profile_pic);
            setUsername(user?.first_name);
            setValue('profile_pic', user.profile_pic);
            setProfilePicPreview(`${API_PROFILE}/${user.profile_pic}`);
          }
          if (rolename === 'vendor') {
            setValue('business_name', user.business_name);
            setValue('business_email', user.business_email);
            setValue('business_contact', user.business_contact);
            setValue('website_url', user.website);
            setValue('business_address', user.business_address);
            setValue('business_type', user.business_type);
            setValue('gst_number', user.gst_number);
          }
        }
      } catch (error) {
        handleApiError(error, 'fetching', `${userData?.rolename} details`);
      }
    };
    if (userData?.id) {
      fetchUser();
    }
  }, [token, updated, setValue, rolename, userData, setProfilePic]);

  const handleProfilePic = async () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 500,
      maxHeight: 500,
      quality: 0.8,
    };

    try {
      const result = await launchImageLibrary(options);
      if (result.didCancel) {
        console.log('User cancelled image picker');
        return;
      }
      if (result.errorCode) {
        handleApiError(result.errorMessage, 'error', `picking an image`);
        return;
      }
      if (result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setProfilePicPreview(selectedImage.uri);
        setValue('profile_pic', selectedImage);
      }
    } catch (e) {
      handleApiError(error, 'error', `picking an image`);
    }
  };

  const onSubmit = async data => {
    const formData = new FormData();
    formData.append('first_name', data.firstname);
    formData.append('last_name', data.lastname);
    formData.append('email', userData.email);
    formData.append('contact_no', data.contact_no);
    formData.append('address', data.address);

    if (data.profile_pic && data.profile_pic.uri) {
      formData.append('profile_pic', {
        uri: data.profile_pic.uri,
        name: data.profile_pic.fileName || 'profile_pic.jpg',
        type: data.profile_pic.type || 'image/jpeg',
      });
    }

    if (data.old_profile_pic) {
      formData.append('old_profile_pic', data.old_profile_pic);
    }

    if (hasPermission(APP_PERMISSIONS.AGENTS_VIEW)) {
      if (data.gst_number) formData.append('gst_number', data.gst_number);
      if (data.business_name)
        formData.append('business_name', data.business_name);
      if (data.website_url) formData.append('website', data.website_url);
      if (data.business_email)
        formData.append('business_email', data.business_email);
      if (data.business_contact)
        formData.append('business_contact', data.business_contact);
      formData.append('business_address', data.business_address);
      formData.append('business_type', data.business_type);
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/${rolename}/${userData?.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      if (res.status === 200) {
        handleApiSuccess(res.data.message, 'Profile');
        setUpdated(prev => !prev);
      }
    } catch (error) {
      handleApiError(error, 'updating', `${userData?.rolename} details`);
    }
  };

  return (
    <SafeAreaWrapper className="flex-1 bg-light-background dark:bg-dark-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <SubHeader title={`Profile`} />
        <ScrollView
          className="px-5"
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          <View className="mt-4 mb-4">
            <View className="left-1/2 -ml-12">
              <TouchableOpacity
                onPress={handleProfilePic}
                className="w-24 h-24 rounded-full bg-gray-700 border-4 border-black justify-center items-center overflow-hidden"
              >
                {profilePicPreview ? (
                  <Image
                    source={{ uri: profilePicPreview }}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <Text className="text-gray-400 text-sm mb-2">Upload</Text>
                )}
                <View className="absolute bottom-2 right-3 bg-white p-1 rounded-full border border-black">
                  <Camera size={16} color="black" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <Controller
            control={control}
            name="firstname"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <View className="mb-4 mx-3">
                <Text className="text-light-text dark:text-dark-text mb-1">
                  First Name
                </Text>
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter first name"
                  placeholderTextColor="#9ca3af"
                  className={`px-4 py-2 rounded-xl border-light-border dark:border-dark-border text-light-subtext dark:text-dark-subtext border ${error ? 'border-red-500' : 'border-gray-700'} bg-[#e6ebf0] dark:bg-[#233140]`}
                />
                {error && (
                  <Text className="text-light-danger dark:text-dark-danger text-xs mt-1">
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="lastname"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <View className="mb-4 mx-3">
                <Text className="text-light-text dark:text-dark-text mb-1">
                  Last Name
                </Text>
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter last name"
                  placeholderTextColor="#9ca3af"
                  className={`px-4 py-2 rounded-xl border-light-border dark:border-dark-border text-light-subtext dark:text-dark-subtext border ${error ? 'border-red-500' : 'border-gray-700'} bg-[#e6ebf0] dark:bg-[#233140]`}
                />
                {error && (
                  <Text className="text-light-danger dark:text-dark-danger text-xs mt-1">
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <View className="mb-4 mx-3">
                <Text className="text-light-text dark:text-dark-text mb-1">
                  Email
                </Text>
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter email"
                  placeholderTextColor="#9ca3af"
                  editable={false}
                  selectTextOnFocus={false}
                  className={`px-4 py-2 rounded-xl border-light-border dark:border-dark-border text-light-subtext dark:text-dark-subtext border ${error ? 'border-red-500' : 'border-gray-700'} bg-[#e6ebf0] dark:bg-[#233140]`}
                />
                {error && (
                  <Text className="text-light-danger dark:text-dark-danger text-xs mt-1">
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="contact_no"
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <View className="mb-4 mx-3">
                <Text className="text-light-text dark:text-dark-text mb-1">
                  Contact No
                </Text>
                <TextInput
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Enter contact no"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                  maxLength={10}
                  className={`px-4 py-2 rounded-xl border-light-border dark:border-dark-border text-light-subtext dark:text-dark-subtext border ${error ? 'border-red-500' : 'border-gray-700'} bg-[#e6ebf0] dark:bg-[#233140]`}
                />
                {error && (
                  <Text className="text-light-danger dark:text-dark-danger text-xs mt-1">
                    {error.message}
                  </Text>
                )}
              </View>
            )}
          />

          {rolename === 'agent' && (
            <Controller
              control={control}
              name="address"
              render={({
                field: { onChange, onBlur, value },
                fieldState: { error },
              }) => (
                <View className="mb-4 mx-3">
                  <Text className="text-light-text dark:text-dark-text mb-1">
                    Address
                  </Text>
                  <TextInput
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder="Enter address"
                    placeholderTextColor="#9ca3af"
                    multiline={true}
                    numberOfLines={4}
                    textAlignVertical="top"
                    className={`px-4 py-2 rounded-xl border-light-border dark:border-dark-border text-light-subtext dark:text-dark-subtext border ${error ? 'border-red-500' : 'border-gray-700'} bg-[#e6ebf0] dark:bg-[#233140]`}
                  />
                  {error && (
                    <Text className="text-light-danger dark:text-dark-danger text-xs mt-1">
                      {error.message}
                    </Text>
                  )}
                </View>
              )}
            />
          )}

          {hasPermission(APP_PERMISSIONS.AGENTS_VIEW) && (
            <>
              <Controller
                control={control}
                name="business_name"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <View className="mb-4 mx-3">
                    <Text className="text-light-text dark:text-dark-text mb-1">
                      Business Name
                    </Text>
                    <TextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Enter business name"
                      placeholderTextColor="#9ca3af"
                      className={`px-4 py-2 rounded-xl border-light-border dark:border-dark-border text-light-subtext dark:text-dark-subtext border ${error ? 'border-red-500' : 'border-gray-700'} bg-[#e6ebf0] dark:bg-[#233140]`}
                    />
                    {error && (
                      <Text className="text-light-danger dark:text-dark-danger text-xs mt-1">
                        {error.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="business_type"
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <View className="mb-4 mx-3">
                    <Text className="text-light-text dark:text-dark-text mb-1">
                      Business Type
                    </Text>
                    <TouchableOpacity
                      onPress={() => setBusinessTypeModal(true)}
                      className={`px-4 py-2 rounded-xl border ${error ? 'border-red-500' : 'border-gray-700'} bg-light-background dark:bg-dark-background`}
                    >
                      <Text
                        className={`text-light-subtext dark:text-dark-subtext ${!value ? 'text-gray-400' : ''}`}
                      >
                        {value
                          ? businessTypes.find(b => b.value === value)?.label
                          : 'Select business type'}
                      </Text>
                    </TouchableOpacity>

                    <Modal
                      transparent
                      visible={businessTypeModal}
                      animationType="fade"
                      onRequestClose={() => setBusinessTypeModal(false)}
                    >
                      <View className="flex-1 justify-center items-center bg-black/50">
                        <View className="bg-light-background dark:bg-dark-background w-80 rounded-xl p-4">
                          {businessTypes.map(item => (
                            <TouchableOpacity
                              key={item.value}
                              onPress={() => {
                                onChange(item.value);
                                setBusinessTypeModal(false);
                              }}
                              className="py-3 border-b border-gray-300"
                            >
                              <Text className="text-light-text dark:text-dark-text">
                                {item.label}
                              </Text>
                            </TouchableOpacity>
                          ))}
                          <TouchableOpacity
                            onPress={() => setBusinessTypeModal(false)}
                            className="mt-3 py-3 bg-gray-200 rounded-xl"
                          >
                            <Text className="text-center text-black font-semibold">
                              Cancel
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Modal>
                    {error && (
                      <Text className="text-light-danger dark:text-dark-danger text-xs mt-1">
                        {error.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="business_email"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <View className="mb-4 mx-3">
                    <Text className="text-light-text dark:text-dark-text mb-1">
                      Business Email
                    </Text>
                    <TextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Enter business email"
                      placeholderTextColor="#9ca3af"
                      keyboardType="email-address"
                      className={`px-4 py-2 rounded-xl border-light-border dark:border-dark-border text-light-subtext dark:text-dark-subtext border ${error ? 'border-red-500' : 'border-gray-700'} bg-[#e6ebf0] dark:bg-[#233140]`}
                    />
                    {error && (
                      <Text className="text-light-danger dark:text-dark-danger text-xs mt-1">
                        {error.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="business_contact"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <View className="mb-4 mx-3">
                    <Text className="text-light-text dark:text-dark-text mb-1">
                      Business Contact
                    </Text>
                    <TextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Enter business contact"
                      placeholderTextColor="#9ca3af"
                      keyboardType="numeric"
                      maxLength={10}
                      className={`px-4 py-2 rounded-xl border-light-border dark:border-dark-border text-light-subtext dark:text-dark-subtext border ${error ? 'border-red-500' : 'border-gray-700'} bg-[#e6ebf0] dark:bg-[#233140]`}
                    />
                    {error && (
                      <Text className="text-light-danger dark:text-dark-danger text-xs mt-1">
                        {error.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="business_address"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <View className="mb-4 mx-3">
                    <Text className="text-light-text dark:text-dark-text mb-1">
                      Business Address
                    </Text>
                    <TextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Enter business address"
                      placeholderTextColor="#9ca3af"
                      multiline={true}
                      numberOfLines={4}
                      textAlignVertical="top"
                      className={`px-4 py-2 rounded-xl border-light-border dark:border-dark-border text-light-subtext dark:text-dark-subtext border ${error ? 'border-red-500' : 'border-gray-700'} bg-[#e6ebf0] dark:bg-[#233140]`}
                    />
                    {error && (
                      <Text className="text-light-danger dark:text-dark-danger text-xs mt-1">
                        {error.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="gst_number"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <View className="mb-4 mx-3">
                    <Text className="text-light-text dark:text-dark-text mb-1">
                      GST Number
                    </Text>
                    <TextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Enter GST number"
                      placeholderTextColor="#9ca3af"
                      className={`px-4 py-2 rounded-xl border-light-border dark:border-dark-border text-light-subtext dark:text-dark-subtext border ${error ? 'border-red-500' : 'border-gray-700'} bg-[#e6ebf0] dark:bg-[#233140]`}
                    />
                    {error && (
                      <Text className="text-light-danger dark:text-dark-danger text-xs mt-1">
                        {error.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="website_url"
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error },
                }) => (
                  <View className="mb-4 mx-3">
                    <Text className="text-light-text dark:text-dark-text mb-1">
                      Website
                    </Text>
                    <TextInput
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder="Enter website URL"
                      placeholderTextColor="#9ca3af"
                      keyboardType="url"
                      className={`px-4 py-2 rounded-xl border-light-border dark:border-dark-border text-light-subtext dark:text-dark-subtext border ${error ? 'border-red-500' : 'border-gray-700'} bg-[#e6ebf0] dark:bg-[#233140]`}
                    />
                    {error && (
                      <Text className="text-light-danger dark:text-dark-danger text-xs mt-1">
                        {error.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </>
          )}

          {/* Action buttons */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            className="mt-6 bg-white border border-black rounded-xl py-3 mb-4"
          >
            <Text className="text-black text-center font-semibold">
              Save Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ChangePassword')}
            className="bg-white border border-black rounded-xl py-3 mb-4"
          >
            <Text className="text-black text-center font-semibold">
              Change Password
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('SelectContacts')}
            className="bg-white border border-black rounded-xl py-3 mb-4"
          >
            <Text className="text-black text-center font-semibold">
              Export Contacts
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setLogoutModalVisible(true)}
            className="bg-black border border-light-border dark:border-dark-border rounded-xl py-3 mb-4"
          >
            <Text className="text-white text-center font-semibold">Logout</Text>
          </TouchableOpacity>

          <Modal
            animationType="fade"
            transparent={true}
            visible={logoutModalVisible}
            onRequestClose={() => setLogoutModalVisible(false)}
          >
            <View className="flex-1 justify-center items-center bg-black/50 px-6">
              <View className="bg-light-background dark:bg-dark-background w-full rounded-xl p-6">
                <Text className="text-xl font-semibold mb-4 text-light-text dark:text-dark-text text-center">
                  Confirm Logout
                </Text>
                <Text className="text-light-text dark:text-dark-text text-center mb-6">
                  Are you sure you want to logout?
                </Text>
                <View className="flex-row justify-between">
                  <TouchableOpacity
                    className="flex-1 bg-gray-200 rounded-xl py-3 mr-2"
                    onPress={() => setLogoutModalVisible(false)}
                  >
                    <Text className="text-center text-black font-semibold">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 bg-black rounded-xl py-3 ml-2"
                    onPress={async () => {
                      setLogoutModalVisible(false);
                      await logout();
                    }}
                  >
                    <Text className="text-center text-white font-semibold">
                      Logout
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
};
export default ProfileScreen;
