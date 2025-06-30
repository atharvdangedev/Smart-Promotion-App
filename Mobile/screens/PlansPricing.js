import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { CheckCircle } from 'lucide-react-native';

export default function PlansPricingScreen() {
    const plans = [
        {
            name: 'Free',
            price: '₹0',
            features: ['Basic Templates', 'Limited Calls', 'Community Support'],
            buttonText: 'Get Started',
            theme: 'default',
        },
        {
            name: 'Basic',
            price: '₹149',
            features: ['All Free Features', 'More Templates', 'Email Support'],
            buttonText: 'Choose Basic',
            theme: 'silver',
        },
        {
            name: 'Premium',
            price: '₹299',
            features: ['All Basic Features', 'Unlimited Templates', 'Dedicated Support'],
            buttonText: 'Go Premium',
            theme: 'gold',
        },
        {
            name: 'Add-on',
            price: '₹99',
            features: ['Voice Enhancer', 'Call Templates', 'Priority Queue'],
            buttonText: 'Add This',
            theme: 'addon',
        },
    ];

    const getPlanStyles = (theme) => {
        switch (theme) {
            case 'silver':
                return {
                    container: 'bg-gray-200 border border-gray-400 shadow-md',
                    text: 'text-gray-900',
                    icon: '#374151',
                };
            case 'gold':
                return {
                    container: 'bg-yellow-100 border border-yellow-400 shadow-md',
                    text: 'text-yellow-800',
                    icon: '#ca8a04',
                };
            case 'addon':
                return {
                    container: 'bg-sky-100 border border-sky-400 shadow-md',
                    text: 'text-sky-800',
                    icon: '#0ea5e9',
                };
            default:
                return {
                    container: 'bg-white border border-gray-200 shadow-sm',
                    text: 'text-gray-800',
                    icon: '#6b7280',
                };
        }
    };

    return (
        <ScrollView className="flex-1 bg-gray-100 px-4 py-6">
            <Text className="text-3xl font-bold text-center text-black mb-6">Plans & Pricing</Text>

            {plans.map((plan, index) => {
                const style = getPlanStyles(plan.theme);
                return (
                    <View
                        key={index}
                        className={`rounded-2xl p-5 mb-6 ${style.container}`}
                    >
                        <Text className={`text-2xl font-bold mb-2 ${style.text}`}>{plan.name}</Text>
                        <Text className={`text-xl mb-4 ${style.text}`}>{plan.price}</Text>

                        {plan.features.map((feature, i) => (
                            <View key={i} className="flex-row items-center mb-2">
                                <CheckCircle size={18} color={style.icon} />
                                <Text className={`ml-2 ${style.text}`}>{feature}</Text>
                            </View>
                        ))}

                        <TouchableOpacity className="mt-4 bg-sky-500 rounded-xl py-3">
                            <Text className="text-center text-white font-semibold">{plan.buttonText}</Text>
                        </TouchableOpacity>
                    </View>
                );
            })}
        </ScrollView>
    );
}
