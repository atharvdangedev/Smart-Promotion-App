import { create } from 'zustand';
import { Alert, Linking, Platform } from 'react-native';
import {
  startMonitoring as nativeStart,
  stopMonitoring as nativeStop,
} from '../CallLogModule';
import { createNotificationChannel } from '../utils/Notification';

// (DO NOT MESS WITH THIS FILE)

export const useMonitoringStore = create((set, get) => ({
  permission: {
    status: 'checking',
    message: 'Checking permissions...',
  },

  monitoring: {
    isMonitoring: false,
    isStarting: false,
    isStopping: false,
  },

  setPermissionState: (status, message) =>
    set(state => ({
      permission: { ...state.permission, status, message },
    })),

  requestPermissions: async requestFn => {
    set(state => ({
      permission: {
        ...state.permission,
        status: 'checking',
        message: 'Requesting permissions...',
      },
    }));

    const granted = await requestFn();

    if (granted) {
      set({
        permission: {
          status: 'granted',
          message: 'Permissions granted. Ready to monitor calls.',
        },
      });

      if (Platform.OS === 'android') {
        await createNotificationChannel();
      }
      return true;
    } else {
      set({
        permission: {
          status: 'denied',
          message:
            'Required permissions denied. Please enable them in settings.',
        },
      });

      Alert.alert(
        'Permissions Required',
        'Please grant all necessary permissions in app settings to use this feature.',
        [{ text: 'Go to Settings', onPress: () => Linking.openSettings() }],
      );
      return false;
    }
  },

  startMonitoring: async requestFn => {
    const { monitoring } = get();
    if (monitoring.isStarting) return;

    set(state => ({
      monitoring: { ...state.monitoring, isStarting: true },
    }));

    const granted = await get().requestPermissions(requestFn);

    if (granted) {
      try {
        nativeStart();
        set({
          monitoring: {
            isMonitoring: true,
            isStarting: false,
            isStopping: false,
          },
        });
      } catch (err) {
        console.error('Failed to start monitoring:', err);
        Alert.alert('Error', 'Could not start monitoring.');
        set({
          monitoring: {
            isMonitoring: false,
            isStarting: false,
            isStopping: false,
          },
        });
      }
    } else {
      set(state => ({
        monitoring: {
          ...state.monitoring,
          isMonitoring: false,
          isStarting: false,
        },
      }));
    }
  },

  stopMonitoring: async () => {
    const { monitoring } = get();
    if (monitoring.isStopping) return;

    set(state => ({
      monitoring: { ...state.monitoring, isStopping: true },
    }));

    try {
      nativeStop();
      set({
        monitoring: {
          isMonitoring: false,
          isStarting: false,
          isStopping: false,
        },
      });
    } catch (err) {
      console.error('Failed to stop monitoring:', err);
      Alert.alert('Error', 'Could not stop monitoring.');
      set(state => ({
        monitoring: { ...state.monitoring, isStopping: false },
      }));
    }
  },

  setMonitoringStopped: () => {
    set({
      monitoring: {
        isMonitoring: false,
        isStarting: false,
        isStopping: false,
      },
    });
  },
}));
