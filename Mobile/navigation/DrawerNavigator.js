import React from 'react';
import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';
import DashboardScreen from '../screens/HomeScreen';
import TemplateScreen from '../screens/Template';
import PlansPricingScreen from '../screens/PlansPricing';
import ContactLogScreen from '../screens/ContactLogScreen';
import CardScannerScreen from '../screens/CardScannerScreen';
import { Text, TouchableOpacity } from 'react-native';
import { Contact, LayoutDashboard, MessageSquareMore, ScanText, ShoppingCart, User } from 'lucide-react-native';
import CustomDrawerContent from '../screens/CustomDrawerContent';


const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    backgroundColor: '#ffffff',
                    width: 280,
                    padding: 0,
                },
                drawerActiveBackgroundColor: '#233140',
                drawerActiveTintColor: '#0088cc',
                drawerInactiveTintColor: '#fff',
                drawerLabelStyle: {
                    fontSize: 16,
                    marginLeft: 5,
                    padding: 0,
                },
            }}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
        >

            <Drawer.Screen name="Dashboard" component={DashboardScreen}
                options={{
                    drawerLabel: 'Dashboard',
                    drawerIcon: () => <LayoutDashboard color="white" size={20} />
                }} />
            <Drawer.Screen name="Card Scanner" component={CardScannerScreen}
                options={{
                    drawerLabel: "Card Scanner",
                    drawerIcon: () => <ScanText color="white" size={20} />
                }} />
            <Drawer.Screen name="Message Template" component={TemplateScreen}
                options={{
                    drawerLabel: "Message Template",
                    drawerIcon: () => <MessageSquareMore color="white" size={20} />
                }} />
            <Drawer.Screen name="Browse Plans" component={PlansPricingScreen}
                options={{
                    drawerLabel: "Browse Plans",
                    drawerIcon: () => <ShoppingCart color="white" size={20} />
                }} />
            <Drawer.Screen name="Contact Log" component={ContactLogScreen}
                options={{
                    drawerLabel: "Contact Log",
                    drawerIcon: () => <Contact color="white" size={20} />
                }} />
            {/* <Drawer.Screen name="Contact Details" component={ContactDetails}
                options={{
                    drawerLabel: "Contact Details",
                    drawerIcon: () => <Contact color="white" size={20} />
                }} /> */}
        </Drawer.Navigator>
    );
}
