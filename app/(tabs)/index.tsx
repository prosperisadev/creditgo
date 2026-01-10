import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Bell, 
  ChevronRight,
  Laptop,
  Sun,
  Home,
  GraduationCap,
  Sparkles,
  TrendingUp
} from 'lucide-react-native';
import { useAppStore } from '../../src/store';
import { formatNaira, ASSET_CATEGORIES, FINANCING_OPTIONS } from '../../src/constants';
import { CreditScoreGauge, AssetCard, Button } from '../../src/components';

export default function HomeScreen() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const financialProfile = useAppStore((state) => state.financialProfile);
  const [refreshing, setRefreshing] = React.useState(false);

  const safeAmount = financialProfile?.safeMonthlyRepayment || 0;
  const creditScore = financialProfile?.creditScore || 0;

  // Get recommended assets (affordable ones)
  const recommendedAssets = FINANCING_OPTIONS
    .filter(a => a.monthlyPayment <= safeAmount)
    .slice(0, 3);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const quickCategories = [
    { icon: Laptop, label: 'Devices', category: 'devices', color: '#3b82f6' },
    { icon: Sun, label: 'Solar', category: 'solar', color: '#f59e0b' },
    { icon: Home, label: 'Rent', category: 'rent', color: '#8b5cf6' },
    { icon: GraduationCap, label: 'Education', category: 'education', color: '#06b6d4' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center justify-between">
          <View>
            <Text className="text-dark-500 text-sm">Welcome back,</Text>
            <Text className="text-dark-800 text-xl font-bold">
              {user?.firstName || 'Champion'} 👋
            </Text>
          </View>
          <TouchableOpacity className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm">
            <Bell size={20} color="#334155" />
          </TouchableOpacity>
        </View>

        {/* Credit Score Card */}
        <View className="mx-6 bg-white rounded-2xl p-5 shadow-sm mb-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-dark-500 text-sm mb-1">Your Safe Amount</Text>
              <Text className="text-3xl font-bold text-primary-600">
                {formatNaira(safeAmount)}
              </Text>
              <Text className="text-dark-400 text-xs mt-1">per month</Text>
              
              <View className="flex-row items-center mt-4 bg-primary-50 rounded-lg px-3 py-2 self-start">
                <TrendingUp size={14} color="#16a34a" />
                <Text className="text-primary-700 text-xs font-medium ml-1">
                  Score: {creditScore}/100
                </Text>
              </View>
            </View>
            
            <View className="ml-4">
              <CreditScoreGauge score={creditScore} size={100} strokeWidth={8} />
            </View>
          </View>
        </View>

        {/* Quick Categories */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-dark-800">
              What do you need?
            </Text>
            <TouchableOpacity 
              onPress={() => router.push('/(tabs)/explore')}
              className="flex-row items-center"
            >
              <Text className="text-primary-500 text-sm font-medium">See all</Text>
              <ChevronRight size={16} color="#22c55e" />
            </TouchableOpacity>
          </View>
          
          <View className="flex-row justify-between">
            {quickCategories.map((cat) => (
              <TouchableOpacity
                key={cat.category}
                onPress={() => router.push({
                  pathname: '/(tabs)/explore',
                  params: { category: cat.category }
                })}
                className="items-center"
              >
                <View 
                  className="w-14 h-14 rounded-xl items-center justify-center mb-2"
                  style={{ backgroundColor: `${cat.color}15` }}
                >
                  <cat.icon size={24} color={cat.color} />
                </View>
                <Text className="text-xs text-dark-600 font-medium">
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recommended Section */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Sparkles size={18} color="#f59e0b" />
              <Text className="text-lg font-semibold text-dark-800 ml-2">
                Recommended for You
              </Text>
            </View>
          </View>

          {recommendedAssets.length > 0 ? (
            recommendedAssets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                safeAmount={safeAmount}
                onPress={() => router.push(`/asset/${asset.id}`)}
              />
            ))
          ) : (
            <View className="bg-white rounded-xl p-6 items-center">
              <Text className="text-dark-500 text-center">
                Complete your profile to see personalized recommendations.
              </Text>
            </View>
          )}
        </View>

        {/* Tips Section */}
        <View className="mx-6 mb-8 p-4 bg-primary-50 rounded-xl">
          <Text className="text-primary-800 font-medium mb-2">
            💡 Pro Tip
          </Text>
          <Text className="text-primary-700 text-sm">
            Keeping your monthly repayments below your Safe Amount means 
            you'll never be stressed about payments. This also improves your 
            credit score for future financing!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
