import React from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, } from 'react-native';


export default function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView {...props} style={{ backgroundColor: '#17212b' }}>

            <View style={{ padding: 30, alignItems: 'center', marginVertical: 10, borderBottomWidth: 0.5, borderBottomColor: '#334155', backgroundColor: '#233140' }}>
                <Text className='text-2xl font-bold text-white'> SmartPromotions</Text>
            </View>

            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
}
