import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigator from './navigation/DrawerNavigator';
import WelcomeScreen from './screens/WelcomeScreen';
import SignInScreen from './screens/SignInScreen';
import ForgotPassword from './screens/ForgotPassword';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import TemplateDetailScreen from './screens/TemplateDetails';
import ProfileScreen from './screens/ProfileScreen';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import BootSplash from 'react-native-bootsplash';
import ShowTemplate from './screens/ShowTemplate';
import Header from './components/Header';
import ContactDetails from './screens/ContactDetails';
import CardResultScreen from './screens/CardResultScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SelectContacts from './screens/SelectContacts';
import { useAuthStore } from './store/useAuthStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AgentsScreen from './screens/AgentsScreen';
import ContactList from './screens/ContactList';
import Settings from './screens/Settings';
import Contact_Logs from './screens/Contact_Logs';
import { useMonitoringStore } from './store/useMonitoringStore';
import { useCallMonitoringLifecycle } from './hooks/useCallMonitoringLifecycle';
import { useCallLogMonitor } from './hooks/useCallLogMonitor';
import { displayClientCheckNotification } from './utils/Notification';
import EditContactDetails from './screens/EditContactDetails';

const Stack = createNativeStackNavigator();

export default function App() {
  const token = useAuthStore(state => state.token);
  const [isRehydrated, setIsRehydrated] = useState(false);
  const { permission } = useMonitoringStore();

  const queryClient = new QueryClient();

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setIsRehydrated(true);
    });
    return () => unsub();
  }, []);

  useCallMonitoringLifecycle();

  useCallLogMonitor({
    onCallDetected: async event => {
      if (permission.status === 'granted' && token) {
        await displayClientCheckNotification(event);
      } else {
        console.warn(
          'Skipping notification display: Permissions not granted or user not logged in.',
        );
      }
    },
  });

  const SuccessToast = props => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#4CAF50' }}
      text1Style={{ fontSize: 16, fontWeight: 'bold' }}
      text2Style={{ fontSize: 14 }}
    />
  );

  const CustomErrorToast = props => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#F44336' }}
      text1Style={{ fontSize: 16, fontWeight: 'bold' }}
      text2Style={{ fontSize: 14 }}
    />
  );

  if (!isRehydrated) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer
          onReady={() => {
            BootSplash.hide({ fade: true });
          }}
        >
          <Stack.Navigator
            initialRouteName={token ? 'HomeScreen' : 'Welcome'}
            screenOptions={{ headerShown: false }}
          >
            {!token && (
              <>
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="SignIn" component={SignInScreen} />
                <Stack.Screen
                  name="ForgotPassword"
                  component={ForgotPassword}
                />
              </>
            )}

            {token && (
              <>
                <Stack.Screen name="HomeScreen" component={DrawerNavigator} />
                <Stack.Screen
                  name="ChangePassword"
                  component={ChangePasswordScreen}
                />
                <Stack.Screen
                  name="TemplateDetails"
                  component={TemplateDetailScreen}
                />
                <Stack.Screen name="ShowTemplate" component={ShowTemplate} />
                <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
                <Stack.Screen name="Header" component={Header} />
                <Stack.Screen
                  name="ContactDetails"
                  component={ContactDetails}
                />
                <Stack.Screen
                  name="CardResultScreen"
                  component={CardResultScreen}
                />
                <Stack.Screen
                  name="SelectContacts"
                  component={SelectContacts}
                />
                <Stack.Screen name="AgentsScreen" component={AgentsScreen} />
                <Stack.Screen name="ContactsList" component={ContactList} />
                <Stack.Screen name="Contact_Logs" component={Contact_Logs} />
                <Stack.Screen name="Settings" component={Settings} />
                <Stack.Screen name="EditContactDetails" component={EditContactDetails} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </QueryClientProvider>

      <Toast
        config={{
          success: SuccessToast,
          error: CustomErrorToast,
        }}
        position="top"
        topOffset={50}
        visibilityTime={3000}
        autoHide={true}
        swipeable={true}
      />
    </SafeAreaProvider>
  );
}
