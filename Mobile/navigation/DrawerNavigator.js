import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DashboardScreen from '../screens/HomeScreen';
import TemplateScreen from '../screens/Template';
import PlansPricingScreen from '../screens/PlansPricing';
import ContactLogScreen from '../screens/ContactLogScreen';
import CardScannerScreen from '../screens/CardScannerScreen';
import {
  Contact,
  LayoutDashboard,
  MessageSquareMore,
  ScanText,
  ShoppingCart,
} from 'lucide-react-native';
import CustomDrawerContent from '../screens/CustomDrawerContent';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: 'white',
          width: 280,
          padding: 0,
        },
        drawerActiveTintColor: '#7C7C7C',
        drawerLabelStyle: {
          fontSize: 16,
          marginLeft: -3,
          padding: 0,
        },
      }}
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          drawerLabel: 'Dashboard',
          drawerIcon: () => <LayoutDashboard color="#7C7C7C" size={20} />,
        }}
      />
      <Drawer.Screen
        name="Card Scanner"
        component={CardScannerScreen}
        options={{
          drawerLabel: 'Card Scanner',
          drawerIcon: () => <ScanText color="#7C7C7C" size={20} />,
        }}
      />
      <Drawer.Screen
        name="Message Template"
        component={TemplateScreen}
        options={{
          drawerLabel: 'Message Template',
          drawerIcon: () => <MessageSquareMore color="#7C7C7C" size={20} />,
        }}
      />
      <Drawer.Screen
        name="Browse Plans"
        component={PlansPricingScreen}
        options={{
          drawerLabel: 'Browse Plans',
          drawerIcon: () => <ShoppingCart color="#7C7C7C" size={20} />,
        }}
      />
      <Drawer.Screen
        name="Contact Log"
        component={ContactLogScreen}
        options={{
          drawerLabel: 'Contact Log',
          drawerIcon: () => <Contact color="#7C7C7C" size={20} />,
        }}
      />
    </Drawer.Navigator>
  );
}
