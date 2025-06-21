import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './screens/WelcomeScreen';
import HomeScreen from './screens/HomeScreen';
import SignInScreen from './screens/SignInScreen';
import EnterpriseLoginScreen from './screens/EnterpriseLoginScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='SignIn' component={SignInScreen} />
        <Stack.Screen name='EnterpriseLogin' component={EnterpriseLoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
