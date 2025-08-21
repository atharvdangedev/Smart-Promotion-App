import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { CheckCircle } from 'lucide-react-native';
import Header from '../components/Header';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { API_URL } from '@env';
import { useAuthStore } from '../store/useAuthStore';

export default function PlansPricingScreen() {
  const [profilePic, setProfilePic] = useState('');
  const profile_pic = useAuthStore(state => state.profilePic);

  useEffect(() => {
    const init = async () => {
      if (profile_pic) {
        const url = `${API_URL}/${profile_pic}`;
        setProfilePic(url);
      } else {
        setProfilePic(null);
      }
    };
    init();
  }, []);

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
      features: [
        'All Basic Features',
        'Unlimited Templates',
        'Dedicated Support',
      ],
      buttonText: 'Go Premium',
      theme: 'gold',
      isRecommended: true,
    },

    {
      name: 'Add-on',
      price: '₹99',
      features: ['Voice Enhancer', 'Call Templates', 'Priority Queue'],
      buttonText: 'Add This',
      theme: 'addon',
    },
  ];

  const getPlanStyles = theme => {
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
          text: 'text-slate-900',
          icon: 'black',
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
    <SafeAreaWrapper className="flex-1 bg-light-background dark:bg-dark-background">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4 py-0"
      >
        <Header title="Plans & Pricing " profilePic={profilePic} />
        {/* <Text className="text-2xl font-bold text-[#333333] dark:text-[#E0E0E0] mb-4">Explore our plans</Text> */}

        {plans.map((plan, index) => {
          const style = getPlanStyles(plan.theme);
          return (
            <View
              key={index}
              className={`relative rounded-2xl p-5 mb-6 ${style.container}`}
            >
              {plan.isRecommended && (
                <View className="absolute top-2 right-2 bg-yellow-500 px-3 py-1 rounded-full shadow">
                  <Text className="text-xs font-bold text-white">
                    Most Recommended
                  </Text>
                </View>
              )}

              <Text className={`text-2xl font-bold mb-2 ${style.text}`}>
                {plan.name}
              </Text>
              <Text className={`text-xl mb-4 ${style.text}`}>{plan.price}</Text>

              {plan.features.map((feature, i) => (
                <View key={i} className="flex-row items-center mb-2">
                  <CheckCircle size={18} color={style.icon} />
                  <Text className={`ml-2 ${style.text}`}>{feature}</Text>
                </View>
              ))}

              <TouchableOpacity className="mt-4 bg-slate-800 rounded-xl py-3">
                <Text className="text-center text-white font-semibold">
                  {plan.buttonText}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaWrapper>
  );
}
