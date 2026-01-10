import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Clock
} from 'lucide-react-native';
import { useAppStore } from '../../src/store';
import { formatNaira } from '../../src/constants';
import { Button } from '../../src/components';

export default function WalletScreen() {
  const financialProfile = useAppStore((state) => state.financialProfile);
  const transactions = useAppStore((state) => state.transactions);
  const applications = useAppStore((state) => state.applications);

  const safeAmount = financialProfile?.safeMonthlyRepayment || 0;

  // Calculate totals from transactions
  const totalCredits = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalDebits = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingApplications = applications.filter(a => a.status === 'pending');

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
            Wallet
          </Text>
        </View>

        {/* Balance Card */}
        <View className="mx-6 bg-primary-500 rounded-2xl p-6 mb-6">
          <View className="flex-row items-center mb-2">
            <Wallet size={20} color="#bbf7d0" />
            <Text className="text-primary-100 text-sm ml-2">
              Available Credit Limit
            </Text>
          </View>
          <Text className="text-4xl font-bold text-white mb-1">
            {formatNaira(safeAmount)}
          </Text>
          <Text className="text-primary-200 text-sm">
            per month
          </Text>

          {/* Quick Stats */}
          <View className="flex-row mt-6 pt-4 border-t border-primary-400/30">
            <View className="flex-1">
              <View className="flex-row items-center">
                <TrendingUp size={14} color="#bbf7d0" />
                <Text className="text-primary-100 text-xs ml-1">Income</Text>
              </View>
              <Text className="text-white font-semibold mt-1">
                {formatNaira(totalCredits)}
              </Text>
            </View>
            <View className="flex-1">
              <View className="flex-row items-center">
                <TrendingDown size={14} color="#fecaca" />
                <Text className="text-primary-100 text-xs ml-1">Expenses</Text>
              </View>
              <Text className="text-white font-semibold mt-1">
                {formatNaira(totalDebits)}
              </Text>
            </View>
          </View>
        </View>

        {/* Save to Repay Section */}
        <View className="mx-6 bg-secondary-50 rounded-xl p-4 mb-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-secondary-100 rounded-full items-center justify-center">
                <PiggyBank size={20} color="#ca8a04" />
              </View>
              <View className="ml-3">
                <Text className="text-secondary-800 font-medium">
                  Save-to-Repay
                </Text>
                <Text className="text-secondary-600 text-xs">
                  Coming soon
                </Text>
              </View>
            </View>
            <View className="bg-secondary-200 px-3 py-1 rounded-full">
              <Text className="text-secondary-800 text-xs font-medium">
                SOON
              </Text>
            </View>
          </View>
          <Text className="text-secondary-700 text-sm mt-3">
            Set aside money automatically for upcoming repayments. 
            Earn rewards for consistent saving!
          </Text>
        </View>

        {/* Pending Applications */}
        {pendingApplications.length > 0 && (
          <View className="mx-6 mb-6">
            <Text className="text-lg font-semibold text-dark-800 mb-3">
              Pending Applications
            </Text>
            {pendingApplications.map((app) => (
              <View 
                key={app.id}
                className="bg-white rounded-xl p-4 mb-2 flex-row items-center"
              >
                <View className="w-10 h-10 bg-yellow-100 rounded-full items-center justify-center">
                  <Clock size={18} color="#f59e0b" />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-dark-800 font-medium">
                    {app.assetId}
                  </Text>
                  <Text className="text-dark-500 text-xs">
                    Application pending review
                  </Text>
                </View>
                <View className="bg-yellow-100 px-2 py-1 rounded-full">
                  <Text className="text-yellow-700 text-xs font-medium">
                    Pending
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Recent Transactions */}
        <View className="mx-6 mb-6">
          <Text className="text-lg font-semibold text-dark-800 mb-3">
            Recent Transactions
          </Text>
          
          {transactions.length > 0 ? (
            transactions.slice(0, 5).map((txn) => (
              <View 
                key={txn.id}
                className="bg-white rounded-xl p-4 mb-2 flex-row items-center"
              >
                <View 
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    txn.type === 'credit' ? 'bg-primary-100' : 'bg-red-100'
                  }`}
                >
                  {txn.type === 'credit' ? (
                    <ArrowDownLeft size={18} color="#22c55e" />
                  ) : (
                    <ArrowUpRight size={18} color="#ef4444" />
                  )}
                </View>
                <View className="flex-1 ml-3">
                  <Text className="text-dark-800 font-medium">
                    {txn.source || txn.description}
                  </Text>
                  <Text className="text-dark-400 text-xs">
                    {new Date(txn.date).toLocaleDateString('en-NG', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </Text>
                </View>
                <Text 
                  className={`font-semibold ${
                    txn.type === 'credit' ? 'text-primary-600' : 'text-red-600'
                  }`}
                >
                  {txn.type === 'credit' ? '+' : '-'}{formatNaira(txn.amount)}
                </Text>
              </View>
            ))
          ) : (
            <View className="bg-white rounded-xl p-6 items-center">
              <Text className="text-dark-400 text-center">
                No transactions yet.
                {'\n'}Your SMS transaction history will appear here.
              </Text>
            </View>
          )}
        </View>

        {/* Empty State for New Users */}
        {transactions.length === 0 && applications.length === 0 && (
          <View className="mx-6 p-6 bg-gray-100 rounded-xl items-center">
            <Wallet size={40} color="#94a3b8" />
            <Text className="text-dark-600 font-medium mt-3 text-center">
              Your Financial Hub
            </Text>
            <Text className="text-dark-400 text-sm mt-1 text-center">
              Track your applications, transactions, and savings all in one place.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
