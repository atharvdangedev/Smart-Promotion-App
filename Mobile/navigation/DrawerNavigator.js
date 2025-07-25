import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DashboardScreen from '../screens/HomeScreen';
import TemplateScreen from '../screens/Template';
import PlansPricingScreen from '../screens/PlansPricing';
import ContactLogScreen from '../screens/ContactLogScreen';
import CardScannerScreen from '../screens/CardScannerScreen';
import { TouchableOpacity } from 'react-native';
import { User } from 'lucide-react-native';
import CustomDrawerContent from '../screens/CustomDrawerContent';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    backgroundColor: '#0f172a',
                    width: 280,
                    padding: 3,
                },
                drawerActiveBackgroundColor: '#0284c7',
                drawerActiveTintColor: '#fff',
                drawerInactiveTintColor: '#94a3b8',
                drawerLabelStyle: {
                    fontSize: 16,
                    marginLeft: 5,
                    padding: 0,
                    height: 20,
                },
            }}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
        >

            <Drawer.Screen name="Dashboard" component={DashboardScreen} />
            <Drawer.Screen name="Card Scanner" component={CardScannerScreen} />
            <Drawer.Screen name="Message Template" component={TemplateScreen} />
            <Drawer.Screen name="Browse Plans" component={PlansPricingScreen} />
            <Drawer.Screen name="Contact Log" component={ContactLogScreen} />
        </Drawer.Navigator>
    );
}
