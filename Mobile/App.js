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
import linking from './linking';
import Toast from 'react-native-toast-message';
import BootSplash from 'react-native-bootsplash';
import ShowTemplate from './screens/ShowTemplate';
import Header from './components/Header';
import ContactDetails from './screens/ContactDetails';
import CardResultScreen from './screens/CardResultScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SelectContacts from './screens/SelectContacts';
import { useAuthStore } from './store/useAuthStore';

const Stack = createNativeStackNavigator();

export default function App() {
  const token = useAuthStore((state) => state.token);
  const [isRehydrated, setIsRehydrated] = useState(false);

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setIsRehydrated(true);
    });
    return () => unsub();
  }, []);

  if (!isRehydrated) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer
        linking={linking}
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
              <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            </>
          )}

          {token && (
            <>
              <Stack.Screen name="HomeScreen" component={DrawerNavigator} />
              <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
              <Stack.Screen name="TemplateDetails" component={TemplateDetailScreen} />
              <Stack.Screen name="ShowTemplate" component={ShowTemplate} />
              <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
              <Stack.Screen name="Header" component={Header} />
              <Stack.Screen name="ContactDetails" component={ContactDetails} />
              <Stack.Screen name="CardResultScreen" component={CardResultScreen} />
              <Stack.Screen name="SelectContacts" component={SelectContacts} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </SafeAreaProvider>
  );
}
