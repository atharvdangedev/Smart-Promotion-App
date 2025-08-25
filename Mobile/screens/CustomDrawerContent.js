import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { View, Text } from 'react-native';

export default function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        backgroundColor: 'white',
      }}
    >
      <View className="flex-1 bg-[#226B8F] dark:bg-[#26374C] mb-2">
        <Text className="px-10 py-20 font-bold text-2xl text-white">
          {' '}
          SmartPromotions
        </Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}
