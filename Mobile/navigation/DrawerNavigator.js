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
        drawerActiveTintColor: 'white',
        drawerLabelStyle: {
          fontSize: 16,
          marginLeft: 0,
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
          drawerLabelStyle: {
            color: 'black',
            fontSize: 16,
          },
          drawerIcon: () => <LayoutDashboard color="black" size={20} />,
        }}
      />
      <Drawer.Screen
        name="Card Scanner"
        component={CardScannerScreen}
        options={{
          drawerLabel: 'Card Scanner',
          drawerLabelStyle: {
            color: 'black',
            fontSize: 16,
          },
          drawerIcon: () => <ScanText color="black" size={20} />,
        }}
      />
      <Drawer.Screen
        name="Message Template"
        component={TemplateScreen}
        options={{
          drawerLabel: 'Message Template',
          drawerLabelStyle: {
            color: 'black',
            fontSize: 16,
          },
          drawerIcon: () => <MessageSquareMore color="black" size={20} />,
        }}
      />
      <Drawer.Screen
        name="Browse Plans"
        component={PlansPricingScreen}
        options={{
          drawerLabel: 'Browse Plans',
          drawerLabelStyle: {
            color: 'black',
            fontSize: 16,
          },
          drawerIcon: () => <ShoppingCart color="black" size={20} />,
        }}
      />
      <Drawer.Screen
        name="Contact Log"
        component={ContactLogScreen}
        options={{
          drawerLabel: 'Contact Log',
          drawerLabelStyle: {
            color: 'black',
            fontSize: 16,
          },
          drawerIcon: () => <Contact color="black" size={20} />,
        }}
      />
    </Drawer.Navigator>
  );
}
