import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { View, Text, Image } from 'react-native';
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from 'react-native-responsive-screen';
import useThemeColors from '../hooks/useThemeColor';

export default function CustomDrawerContent(props) {
  const colors = useThemeColors();
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        backgroundColor: 'white',
      }}
    >
      <View className="flex-1 mb-2" style={{ backgroundColor: colors.inputBg }}>
        <View className="flex-1 justify-center items-center py-16">
          <Image
            source={require('../assets/Website-logo.webp')}
            className=""
            style={{
              width: widthPercentageToDP('42%'),
              height: heightPercentageToDP('5%'),
              resizeMode: 'contain',
            }}
          />
          <Text className='font-semibold text-base'>Smart Promotion App</Text>
        </View>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}
