import { View, Text, TouchableOpacity, Image, useColorScheme } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Menu, User } from 'lucide-react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';

export default function Header({ title = 'SmartPromotions', profilePic }) {
    const navigation = useNavigation();
    const theme = useColorScheme();
    let sidebarcolor = '';
    if (theme === 'light') {
        sidebarcolor = '#333333'
    } else {
        sidebarcolor = '#E0E0E0'
    }

    // useEffect(() => {
    //     const init = async () => {
    //         const filename = await AsyncStorage.getItem('profile_pic');
    //         if (filename) {
    //             const url = `https://swp.smarttesting.in/public/uploads/profile/${filename}`;
    //             setProfilePic(url);
    //         } else {
    //             setProfilePic(null); // fallback
    //         }
    //     };
    //     init();
    // }, []);

    return (
        <View>
            <View className='flex-row justify-between items-center border border-[#E0E0E0] dark:border-[#4A5568] rounded-xl p-4 mb-6'>
                {/* Drawer button */}
                <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                    <Menu size={26} color={sidebarcolor} />
                </TouchableOpacity>

                {/* App Title */}
                <Text className="text-2xl font-extrabold text-sky-500">{title}</Text>

                {/* Profile icon */}
                {profilePic ? (<TouchableOpacity
                    className='border border-gray-700 rounded-full p-1'
                    onPress={() => navigation.navigate('ProfileScreen')}
                >
                    <Image
                        source={{ uri: profilePic }}
                        // source={require('../assets/image.png')}
                        className='w-8 h-8 rounded-full'
                        resizeMode='cover'
                    />
                </TouchableOpacity>) : (<TouchableOpacity
                    className='border border-gray-700 rounded-full p-1'
                    onPress={() => navigation.navigate('ProfileScreen')}
                >
                    <User size={24} color="white" />
                </TouchableOpacity>)}
            </View>
        </View>
    );
}
