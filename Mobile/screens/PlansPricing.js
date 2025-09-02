import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import Header from '../components/Header';
import SafeAreaWrapper from '../components/SafeAreaWrapper';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import { fetchPlans } from '../apis/PlansApi';
import SanitizedHtml from '../utils/sanatizeHTML';

export default function PlansPricingScreen() {
  const user = useAuthStore(state => state.rolename);

  const {
    data: plans = [],
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['plans'],
    queryFn: () => fetchPlans(),
    enabled: !!user,
  });

  const getPlanStyles = theme => {
    switch (theme) {
      case 'Basic Plan':
        return {
          container: 'bg-gray-200 border border-gray-400 shadow-md',
          text: 'text-gray-900',
          icon: '#374151',
        };
      case 'Premium Plan':
        return {
          container: 'bg-yellow-100 border border-yellow-400 shadow-md',
          text: 'text-yellow-800',
          icon: '#ca8a04',
        };
      case 'Addon Plan':
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
      <Header title="Plans & Pricing" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-4 py-0"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {plans.map((plan, index) => {
          const style = getPlanStyles(plan.title);
          return (
            <View
              key={index}
              className={`relative rounded-2xl p-5 mb-6 ${style.container}`}
            >
              {plan.title === 'Premium Plan' && (
                <View className="absolute top-2 right-2 bg-yellow-500 px-3 py-1 rounded-full shadow">
                  <Text className="text-xs font-bold text-white">
                    Most Recommended
                  </Text>
                </View>
              )}

              <Text className={`text-2xl font-bold mb-2 ${style.text}`}>
                {plan.title}
              </Text>
              <Text className={`text-xl mb-2 ${style.text}`}>
                Price: ₹{Math.round(plan.final_price)}
              </Text>
              <Text className={`text-xl mb-4 ${style.text}`}>
                Validity: {plan.validity} Months
              </Text>

              <View className="flex-row mb-2">
                <Text className={`ml-2 text-black`}>Description: </Text>
                <SanitizedHtml color="black" htmlString={plan.description} />
              </View>

              <TouchableOpacity className="mt-4 bg-slate-800 rounded-xl py-3">
                <Text className="text-center text-white font-semibold">
                  Buy Now
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaWrapper>
  );
}
