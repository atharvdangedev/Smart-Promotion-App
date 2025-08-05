import { View, Text, TouchableOpacity, useColorScheme } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'

export default function ({ title }) {
    const navigation = useNavigation();
    const theme = useColorScheme();
    let iconcolor = '';
    if (theme === 'light') {
        iconcolor = '#333333'
    } else {
        iconcolor = '#E0E0E0'
    }

    return (

        <View className='flex-row p-3 items-center border border-[#E0E0E0] dark:border-[#4A5568] rounded-xl '>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <ArrowLeft size={25} color={iconcolor} />
            </TouchableOpacity>
            <Text className='text-2xl font-bold text-sky-500 text-center mx-6'>{title}</Text>
        </View>

    )
}