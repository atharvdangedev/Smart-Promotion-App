import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { Menu, User } from 'lucide-react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';

export default function Header({ title = 'SmartPromotions', profilePic }) {
    const navigation = useNavigation();

    return (
        <View>
            <View className='flex-row justify-between items-center border border-white/30 rounded-xl p-4 mb-6'>
                {/* Drawer button */}
                <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                    <Menu size={26} color="#fff" />
                </TouchableOpacity>

                {/* App Title */}
                <Text className="text-2xl font-extrabold text-sky-500">{title}</Text>

                {/* Profile icon */}
                {profilePic ? (<TouchableOpacity
                    className='border border-gray-700 rounded-full p-1'
                    onPress={() => navigation.navigate('ProfileScreen')}
                >
                    <Image
                        // source={{ uri: profilePic }}
                        source={require('../assets/image.png')}
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
