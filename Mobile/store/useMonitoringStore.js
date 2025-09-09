import { create } from 'zustand';
import { Alert, Linking, Platform } from 'react-native';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  startMonitoring as nativeStart,
  stopMonitoring as nativeStop,
} from '../CallLogModule';
import { createNotificationChannel } from '../utils/Notification';

export const useMonitoringStore = create(
  persist(
    (set, get) => ({
      // SETTINGS
      blacklist: [],
      messageCooldownDays: 7,
      minCallDuration: 0, // in seconds

      // STATE
      sentMessageTimestamps: {}, // e.g., { '1234567890': 1678886400000 }
      permission: {
        status: 'checking',
        message: 'Checking permissions...',
      },
      monitoring: {
        isMonitoring: false,
        isStarting: false,
        isStopping: false,
      },

      // ACTIONS
      addToBlacklist: contactNumber => {
        if (!get().blacklist.includes(contactNumber)) {
          set(state => ({
            blacklist: [...state.blacklist, contactNumber],
          }));
        }
      },
      removeFromBlacklist: contactNumber => {
        set(state => ({
          blacklist: state.blacklist.filter(num => num !== contactNumber),
        }));
      },
      setCooldownDays: days => {
        const parsedDays = parseInt(days, 10);
        if (!isNaN(parsedDays) && parsedDays >= 0) {
          set({ messageCooldownDays: parsedDays });
        }
      },
      setMinCallDuration: duration => {
        const parsedDuration = parseInt(duration, 10);
        if (!isNaN(parsedDuration) && parsedDuration >= 0) {
          set({ minCallDuration: parsedDuration });
        }
      },
      logSentMessage: contactNumber => {
        set(state => ({
          sentMessageTimestamps: {
            ...state.sentMessageTimestamps,
            [contactNumber]: Date.now(),
          },
        }));
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
    }),
    {
      name: 'monitoring-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the settings part of the store
      partialize: state => ({
        blacklist: state.blacklist,
        messageCooldownDays: state.messageCooldownDays,
        minCallDuration: state.minCallDuration,
        sentMessageTimestamps: state.sentMessageTimestamps,
      }),
    },
  ),
);