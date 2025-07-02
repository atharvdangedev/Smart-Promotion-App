import React from 'react';
import { TextInput, View } from 'react-native';
import { User, Lock } from 'lucide-react-native';

export default function InputField({ icon, placeholder, secureTextEntry = false, value, onChangeText }) {
    const Icon = icon === 'user' ? User : Lock;

    return (
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 mb-4">
            <Icon size={20} color="#888" />
            <TextInput
                className="flex-1 ml-2 py-3 text-black"
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                placeholderTextColor="#aaa"
                value={value}
                onChangeText={onChangeText}
            />
        </View>
    );
}
