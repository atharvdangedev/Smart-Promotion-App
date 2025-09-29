import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { usePermissionStore } from '../store/usePermissions';
import {
  requestPermission,
  openAppSettings,
  checkAllPermissions,
} from '../utils/handlePermissions';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import useThemeColors from '../hooks/useThemeColor';
import SubHeader from '../components/SubHeader';

const PermissionItem = ({ label, type, showModal }) => {
  const { permissions, setPermission } = usePermissionStore();

  const togglePermission = async () => {
    if (!permissions[type]) {
      const granted = await requestPermission(type);
      setPermission(type, granted);
    } else {
      showModal();
    }
  };

  const colors = useThemeColors();

  return (
    <View
      className="flex-row items-center justify-between p-4 rounded-2xl shadow mb-3"
      style={{ backgroundColor: colors.inputBg }}
    >
      <Text className="text-base text-black">{label}</Text>
      <Switch
        value={permissions[type]}
        onValueChange={togglePermission}
        thumbColor={permissions[type] ? '#0ea5e9' : '#d1d5db'}
      />
    </View>
  );
};

export default function PermissionsScreen() {
  const { setPermission } = usePermissionStore();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadPermissions = async () => {
      const statuses = await checkAllPermissions();
      Object.entries(statuses).forEach(([key, value]) => {
        setPermission(key, value);
      });
    };
    loadPermissions();
  }, []);

  const colors = useThemeColors();

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  return (
    <SafeAreaWrapper
      className="flex-1 "
      style={{ backgroundColor: colors.background }}
    >
      <SubHeader title="Privacy & Security" />
      <View className="flex-1 p-6">
        <Text className="text-xl font-bold mb-4" style={{ color: colors.text }}>
          App Permissions
        </Text>
        <View className="px-3">
          <PermissionItem
            label="Phone Access"
            type="phone"
            showModal={openModal}
          />
          <PermissionItem
            label="Call Logs Access"
            type="callLogs"
            showModal={openModal}
          />
          <PermissionItem
            label="Contacts Access"
            type="contacts"
            showModal={openModal}
          />
          <PermissionItem
            label="Camera Access"
            type="camera"
            showModal={openModal}
          />
          <PermissionItem
            label="Notifications Access"
            type="notifications"
            showModal={openModal}
          />
        </View>
        <TouchableOpacity
          onPress={openAppSettings}
          className="mt-6 p-3 rounded-xl"
          style={{ backgroundColor: colors.orange }}
        >
          <Text className="text-white text-lg text-center">
            Open App Settings
          </Text>
        </TouchableOpacity>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View className="flex-1 justify-center items-center bg-black/50 px-6">
            <View className="bg-light-background dark:bg-dark-background w-full rounded-xl p-6">
              <Text className="text-xl font-semibold mb-4 text-light-text dark:text-dark-text text-center">
                Manage Permission
              </Text>
              <Text className="text-light-text dark:text-dark-text text-center mb-6">
                You can only disable this permission from system settings.
              </Text>
              <View className="flex-row justify-between">
                <TouchableOpacity
                  className="flex-1 bg-gray-200 rounded-xl py-3 mr-2"
                  onPress={closeModal}
                >
                  <Text className="text-center text-black font-semibold">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-black rounded-xl py-3 ml-2"
                  onPress={() => {
                    closeModal();
                    openAppSettings();
                  }}
                >
                  <Text className="text-center text-white font-semibold">
                    Open Settings
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaWrapper>
  );
}
