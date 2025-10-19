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
  List,
  LucideSettings,
  MessageSquareMore,
  ScanText,
  ShoppingCart,
  User,
} from 'lucide-react-native';
import CustomDrawerContent from '../screens/CustomDrawerContent';
import AgentsScreen from '../screens/AgentsScreen';
import ContactList from '../screens/ContactList';
import Settings from '../screens/Settings';
import All_Logs from '../screens/All_Logs';
import { useAuthStore } from '../store/useAuthStore';
import RequestReview from '../screens/ReviewRequest';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const user = useAuthStore(state => state.rolename);
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
        name="Contact Log"
        component={ContactLogScreen}
        options={{
          drawerLabel: 'Log Stats',
          drawerLabelStyle: {
            color: 'black',
            fontSize: 16,
          },
          drawerIcon: () => <Contact color="black" size={20} />,
        }}
      />
      <Drawer.Screen
        name="All Logs"
        component={All_Logs}
        options={{
          drawerLabel: 'All Logs',
          drawerLabelStyle: {
            color: 'black',
            fontSize: 16,
          },
          drawerIcon: () => <List color="black" size={20} />,
        }}
      />
      <Drawer.Screen
        name="Contact List"
        component={ContactList}
        options={{
          drawerLabel: 'Contact List',
          drawerLabelStyle: {
            color: 'black',
            fontSize: 16,
          },
          drawerIcon: () => <List color="black" size={20} />,
        }}
      />
      {user === 'agent' ? null : (
        <Drawer.Screen
          name="Agents"
          component={AgentsScreen}
          options={{
            drawerLabel: 'Agents',
            drawerLabelStyle: {
              color: 'black',
              fontSize: 16,
            },
            drawerIcon: () => <User color="black" size={20} />,
          }}
        />
      )}
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
        name="Request Review"
        component={RequestReview}
        options={{
          drawerLabel: 'Request Review',
          drawerLabelStyle: {
            color: 'black',
            fontSize: 16,
          },
          drawerIcon: () => <ShoppingCart color="black" size={20} />,
        }}
      />

      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          drawerLabel: 'Settings',
          drawerLabelStyle: {
            color: 'black',
            fontSize: 16,
          },
          drawerIcon: () => <LucideSettings color="black" size={20} />,
        }}
      />
    </Drawer.Navigator>
  );
}
