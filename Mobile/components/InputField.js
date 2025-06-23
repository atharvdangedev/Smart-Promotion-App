import React from 'react';
import { View, TextInput } from 'react-native';
import { User, Lock, Mail, Phone } from 'lucide-react-native';

const iconMap = {
    user: User,
    lock: Lock,
    mail: Mail,
    Phone: Phone,

};

export default function InputField({ icon, placeholder, secureTextEntry }) {
    const IconComponent = iconMap[icon] || User;

    return (
        <View className="flex-row items-center border border-gray-300 px-4 py-3 rounded-xl mb-4 bg-white">
            <IconComponent size={20} color="#aaa" className="mr-2" />
            <TextInput
                placeholder={placeholder}
                secureTextEntry={secureTextEntry}
                placeholderTextColor="#aaa"
                className="flex-1 text-black"
            />
        </View>
    );
}
