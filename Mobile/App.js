import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import SignInScreen from './screens/SignInScreen';
import EnterpriseLoginScreen from './screens/EnterpriseLoginScreen';
import BootSplash from "react-native-bootsplash";
import { useEffect } from 'react';
import ForgotPassword from './screens/ForgotPassword';
import ResetPassword from './screens/ResetPassword';
import linking from './linking';
import TemplateScreen from './screens/Template';
import PlansPricingScreen from './screens/PlansPricing';
import ProfileScreen from './screens/ProfileScreen';
import ContactLogScreen from './screens/ContactLogScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import TemplateDetailScreen from './screens/TemplateDetails';
import Toast from 'react-native-toast-message';
import CardScannerScreen from './screens/CardScannerScreen';

const Stack = createNativeStackNavigator();

export default function App() {

  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      await BootSplash.hide({ fade: true });
      console.log("BootSplash has been hidden successfully");
    });
  }, []);

  return (
    <>
      <NavigationContainer linking={linking}>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name='HomeScreen' component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name='SignIn' component={SignInScreen} options={{ headerShown: false }} />
          <Stack.Screen name='EnterpriseLogin' component={EnterpriseLoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name='ForgotPassword' component={ForgotPassword} options={{ headerShown: false }} />
          <Stack.Screen name='ResetPassword' component={ResetPassword} options={{ headerShown: false }} />
          <Stack.Screen name='Template' component={TemplateScreen} options={{ headerShown: false }} />
          <Stack.Screen name='PlansPricing' component={PlansPricingScreen} options={{ headerShown: false }} />
          <Stack.Screen name='ProfileScreen' component={ProfileScreen} options={{ headerShown: false }} />
          <Stack.Screen name='ContactLogScreen' component={ContactLogScreen} options={{ headerShown: false }} />
          <Stack.Screen name='ChangePassword' component={ChangePasswordScreen} options={{ headerShown: false }} />
          <Stack.Screen name='TemplateDetails' component={TemplateDetailScreen} options={{ headerShown: false }} />
          <Stack.Screen name='CardScanner' component={CardScannerScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}
