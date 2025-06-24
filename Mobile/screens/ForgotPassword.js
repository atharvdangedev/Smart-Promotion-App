import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import InputField from '../components/InputField'

export default function ForgotPassword({ navigation }) {
    return (
        <SafeAreaView className='flex-1 justify-center px-6 bg-white'>
            <Text className="text-2xl font-semibold mb-8 text-black"> Enter Your Email here,</Text>
            <InputField icon='user' placeholder="Email" />

            <TouchableOpacity
                className="bg-black py-3 rounded-xl mb-4 mt-4">
                <Text className="text-center text-white font-semibold">Submit</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}