import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import SafeAreaWrapper from '../components/SafeAreaWrapper'
import SubHeader from '../components/SubHeader'
import useThemeColors from '../hooks/useThemeColor'

export default function MonitoringSettings() {
    const colors = useThemeColors();
  return (
    <SafeAreaWrapper style={{backgroundColor: colors.background}}>
        <SubHeader title='Call Monitoring'/>
        <View className='mx-6 my-4'>
            <View className='p-4 rounded-xl' style={{backgroundColor: colors.inputBg}}>
                <Text className='text-lg font-bold text-black'>System Status</Text>
                <View className='flex-row justify-between mt-3'>
                    <Text className='text-black font-semibold'>Permission Status</Text>
                    <Text className='text-green-500'>Permissions Granted</Text>
                </View>
                <View className='flex-row justify-between my-3'>
                    <Text className='font-semibold text-black'>Monitoring </Text>
                    <Text className='text-green-500 font-semibold'>Active </Text>
                </View>
            </View>

            <Text className='font-bold text-lg mt-4' style={{color: colors.text}}> Controls</Text>
            <TouchableOpacity className='py-4 px-4 mt-2 rounded-xl' style={{backgroundColor: colors.orange}}>
              <Text className='text-center font-semibold text-white'>Start Monitoring</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaWrapper>
  )
}