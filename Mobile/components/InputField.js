import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { User, Lock, Eye, EyeOff } from 'lucide-react-native';

export default function InputField({
    icon,
    placeholder,
    secureTextEntry = false,
    value,
    onChangeText,
    isPassword = false,
    passwordVisible,
    keyboardType,
    autoCapitalize,
    togglePasswordVisibility,
}) {
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
                autoCapitalize={autoCapitalize}
                keyboardType={keyboardType}
                onChangeText={onChangeText}
            />
            {isPassword && (
                <TouchableOpacity onPress={togglePasswordVisibility}>
                    {secureTextEntry ? (
                        <EyeOff size={16} color="#888" />
                    ) : (
                        <Eye size={16} color="#888" />
                    )}
                </TouchableOpacity>
            )}
        </View>
    );
}
