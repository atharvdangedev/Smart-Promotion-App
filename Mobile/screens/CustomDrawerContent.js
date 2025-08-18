import React from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, } from 'react-native';


export default function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView {...props} style={{ backgroundColor: 'black' }}>

            <View style={{ padding: 20, alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#334155' }}>
                <Text className='text-2xl font-bold text-white'> SmartPromotions</Text>
            </View>

            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
}
