import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'

export default function ({ title }) {
    const navigation = useNavigation();
    return (
        <SafeAreaView>
            <View className='flex-row p-3 items-center border border-[#E0E0E0] dark:border-[#4A5568] rounded-xl my-4'>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft size={25} color="white" />
                </TouchableOpacity>
                <Text className='text-2xl font-bold text-sky-500 text-center mx-6'>{title}</Text>
            </View>
        </SafeAreaView>
    )
}