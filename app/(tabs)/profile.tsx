import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User,
  ShieldCheck,
  Building2,
  Wallet,
  Bell,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Settings,
  Star
} from 'lucide-react-native';
import { useAppStore } from '../../src/store';
import { formatNaira } from '../../src/constants';
import { CreditScoreGauge, BadgeRow, Button } from '../../src/components';

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const financialProfile = useAppStore((state) => state.financialProfile);
  const verificationStatus = useAppStore((state) => state.verificationStatus);
  const resetState = useAppStore((state) => state.resetState);

  const creditScore = financialProfile?.creditScore || 0;
  const badges = financialProfile?.badges || [];

  const handleLogout = () => {
    Alert.alert(
      'Reset App',
      'This will clear all your data and restart the onboarding. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: () => {
            resetState();
            router.replace('/');
          }
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: Settings,
      label: 'Account Settings',
      description: 'Manage your profile and preferences',
      onPress: () => {},
    },
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Configure alerts and reminders',
      onPress: () => {},
    },
    {
      icon: FileText,
      label: 'My Applications',
      description: 'View your financing applications',
      onPress: () => {},
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      description: 'FAQs and contact support',
      onPress: () => {},
    },
    {
      icon: Star,
      label: 'Rate CreditGo',
      description: 'Share your feedback',
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Header */}
        <View className="px-6 py-4">
          <Text className="text-2xl font-bold text-dark-800">
            Profile
          </Text>
        </View>

        {/* Profile Card */}
        <View className="mx-6 bg-white rounded-2xl p-5 shadow-sm mb-6">
          <View className="flex-row items-center mb-4">
            <View className="w-16 h-16 bg-primary-100 rounded-full items-center justify-center">
              <User size={32} color="#22c55e" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="text-xl font-bold text-dark-800">
                {user?.firstName || 'CreditGo User'}
              </Text>
              <Text className="text-dark-500 text-sm">
                {user?.email || user?.workEmail || 'Member since 2026'}
              </Text>
            </View>
          </View>

          {/* Score Summary */}
          <View className="flex-row items-center justify-between pt-4 border-t border-gray-100">
            <View className="items-center">
              <Text className="text-2xl font-bold text-primary-600">{creditScore}</Text>
              <Text className="text-xs text-dark-500">Credit Score</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-dark-800">
                {formatNaira(financialProfile?.safeMonthlyRepayment || 0)}
              </Text>
              <Text className="text-xs text-dark-500">Safe Amount</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-dark-800">
                {badges.length}
              </Text>
              <Text className="text-xs text-dark-500">Badges</Text>
            </View>
          </View>
        </View>

        {/* Verification Status */}
        <View className="mx-6 mb-6">
          <Text className="text-lg font-semibold text-dark-800 mb-3">
            Verification Status
          </Text>
          <View className="bg-white rounded-xl overflow-hidden">
            <View className="flex-row items-center p-4 border-b border-gray-100">
              <View className={`w-8 h-8 rounded-full items-center justify-center ${
                verificationStatus.identity ? 'bg-primary-100' : 'bg-gray-100'
              }`}>
                <ShieldCheck 
                  size={16} 
                  color={verificationStatus.identity ? '#22c55e' : '#94a3b8'} 
                />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-dark-800 font-medium">Identity (NIN)</Text>
              </View>
              <View className={`px-2 py-1 rounded-full ${
                verificationStatus.identity ? 'bg-primary-100' : 'bg-gray-100'
              }`}>
                <Text className={`text-xs font-medium ${
                  verificationStatus.identity ? 'text-primary-700' : 'text-gray-500'
                }`}>
                  {verificationStatus.identity ? 'Verified' : 'Pending'}
                </Text>
              </View>
            </View>
            
            <View className="flex-row items-center p-4 border-b border-gray-100">
              <View className={`w-8 h-8 rounded-full items-center justify-center ${
                verificationStatus.employment ? 'bg-primary-100' : 'bg-gray-100'
              }`}>
                <Building2 
                  size={16} 
                  color={verificationStatus.employment ? '#22c55e' : '#94a3b8'} 
                />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-dark-800 font-medium">Employment</Text>
                {user?.employmentType && (
                  <Text className="text-dark-500 text-xs capitalize">
                    {user.employmentType}
                  </Text>
                )}
              </View>
              <View className={`px-2 py-1 rounded-full ${
                verificationStatus.employment ? 'bg-primary-100' : 'bg-gray-100'
              }`}>
                <Text className={`text-xs font-medium ${
                  verificationStatus.employment ? 'text-primary-700' : 'text-gray-500'
                }`}>
                  {verificationStatus.employment ? 'Verified' : 'Pending'}
                </Text>
              </View>
            </View>
            
            <View className="flex-row items-center p-4">
              <View className={`w-8 h-8 rounded-full items-center justify-center ${
                verificationStatus.income ? 'bg-primary-100' : 'bg-gray-100'
              }`}>
                <Wallet 
                  size={16} 
                  color={verificationStatus.income ? '#22c55e' : '#94a3b8'} 
                />
              </View>
              <View className="flex-1 ml-3">
                <Text className="text-dark-800 font-medium">Income</Text>
                {user?.monthlyIncome && (
                  <Text className="text-dark-500 text-xs">
                    {formatNaira(user.monthlyIncome)}/month
                  </Text>
                )}
              </View>
              <View className={`px-2 py-1 rounded-full ${
                verificationStatus.income ? 'bg-primary-100' : 'bg-gray-100'
              }`}>
                <Text className={`text-xs font-medium ${
                  verificationStatus.income ? 'text-primary-700' : 'text-gray-500'
                }`}>
                  {verificationStatus.income ? 'Verified' : 'Pending'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Achievements */}
        {badges.length > 0 && (
          <View className="mx-6 mb-6">
            <Text className="text-lg font-semibold text-dark-800 mb-3">
              Your Badges
            </Text>
            <View className="bg-white rounded-xl p-4">
              <BadgeRow badges={badges} />
            </View>
          </View>
        )}

        {/* Menu Items */}
        <View className="mx-6 mb-6">
          <Text className="text-lg font-semibold text-dark-800 mb-3">
            Settings
          </Text>
          <View className="bg-white rounded-xl overflow-hidden">
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                onPress={item.onPress}
                className={`flex-row items-center p-4 ${
                  index < menuItems.length - 1 ? 'border-b border-gray-100' : ''
                }`}
                activeOpacity={0.7}
              >
                <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                  <item.icon size={18} color="#64748b" />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-dark-800 font-medium">{item.label}</Text>
                  <Text className="text-dark-500 text-xs">{item.description}</Text>
                </View>
                <ChevronRight size={18} color="#94a3b8" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <View className="mx-6 mb-6">
          <Button
            title="Reset App Data"
            onPress={handleLogout}
            variant="outline"
            icon={<LogOut size={18} color="#22c55e" />}
            iconPosition="left"
          />
        </View>

        {/* Version Info */}
        <View className="items-center pb-4">
          <Text className="text-dark-400 text-xs">
            CreditGo v1.0.0 (MVP)
          </Text>
          <Text className="text-dark-300 text-xs mt-1">
            Built with ❤️ for Nigeria's Missing Middle
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
