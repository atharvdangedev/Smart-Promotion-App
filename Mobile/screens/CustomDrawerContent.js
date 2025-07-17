// components/CustomDrawerContent.js
import React from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { User, LogOut } from 'lucide-react-native';

export default function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView {...props} style={{ backgroundColor: 'black' }}>
            {/* Profile Section */}
            <View style={{ padding: 20, alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#334155' }}>
                <User color="white" size={30} />
                <Text style={{ color: '#fff', fontSize: 18, marginTop: 8 }}>Welcome, User 👋</Text>
            </View>

            {/* Menu List */}
            <DrawerItemList {...props} />

            {/* Logout Option */}
            {/* <TouchableOpacity
                onPress={() => alert('Logout')}
                style={{ padding: 20, flexDirection: 'row', alignItems: 'center' }}
            >
                <LogOut color="#fff" />
                <Text style={{ color: '#fff', marginLeft: 10 }}>Logout</Text>
            </TouchableOpacity> */}
        </DrawerContentScrollView>
    );
}
