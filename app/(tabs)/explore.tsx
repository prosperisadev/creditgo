import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, SlidersHorizontal, X } from 'lucide-react-native';
import { useAppStore } from '../../src/store';
import { FINANCING_OPTIONS } from '../../src/constants';
import { AssetCard, CategoryFilter } from '../../src/components';
import { AssetCategory, FinancingOption } from '../../src/types';

export default function ExploreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const financialProfile = useAppStore((state) => state.financialProfile);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory | 'all'>(
    (params.category as AssetCategory) || 'all'
  );
  const [showAffordableOnly, setShowAffordableOnly] = useState(false);

  const safeAmount = financialProfile?.safeMonthlyRepayment || 0;

  // Update category when params change
  useEffect(() => {
    if (params.category) {
      setSelectedCategory(params.category as AssetCategory);
    }
  }, [params.category]);

  // Filter assets
  const filteredAssets = FINANCING_OPTIONS.filter((asset) => {
    // Category filter
    if (selectedCategory !== 'all' && asset.category !== selectedCategory) {
      return false;
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = asset.name.toLowerCase().includes(query);
      const matchesProvider = asset.provider.toLowerCase().includes(query);
      const matchesDescription = asset.description.toLowerCase().includes(query);
      if (!matchesName && !matchesProvider && !matchesDescription) {
        return false;
      }
    }
    
    // Affordable filter
    if (showAffordableOnly && asset.monthlyPayment > safeAmount) {
      return false;
    }
    
    return true;
  });

  // Sort: affordable first
  const sortedAssets = [...filteredAssets].sort((a, b) => {
    const aAffordable = a.monthlyPayment <= safeAmount;
    const bAffordable = b.monthlyPayment <= safeAmount;
    if (aAffordable && !bAffordable) return -1;
    if (!aAffordable && bAffordable) return 1;
    return a.monthlyPayment - b.monthlyPayment;
  });

  const affordableCount = filteredAssets.filter(a => a.monthlyPayment <= safeAmount).length;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-6 py-4">
        <Text className="text-2xl font-bold text-dark-800 mb-4">
          Explore Financing
        </Text>
        
        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 border border-gray-200">
          <Search size={20} color="#94a3b8" />
          <TextInput
            className="flex-1 ml-3 text-base text-dark-800"
            placeholder="Search devices, solar, rent..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color="#94a3b8" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Category Filter */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Filter Options */}
      <View className="px-6 py-3 flex-row items-center justify-between">
        <Text className="text-dark-500 text-sm">
          {sortedAssets.length} options • {affordableCount} affordable
        </Text>
        <TouchableOpacity
          onPress={() => setShowAffordableOnly(!showAffordableOnly)}
          className={`
            flex-row items-center px-3 py-1.5 rounded-full
            ${showAffordableOnly ? 'bg-primary-500' : 'bg-white border border-gray-200'}
          `}
        >
          <SlidersHorizontal 
            size={14} 
            color={showAffordableOnly ? '#fff' : '#64748b'} 
          />
          <Text 
            className={`text-xs font-medium ml-1 ${showAffordableOnly ? 'text-white' : 'text-dark-600'}`}
          >
            Affordable Only
          </Text>
        </TouchableOpacity>
      </View>

      {/* Asset List */}
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {sortedAssets.length > 0 ? (
          sortedAssets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              safeAmount={safeAmount}
              onPress={() => router.push(`/asset/${asset.id}`)}
            />
          ))
        ) : (
          <View className="py-12 items-center">
            <Text className="text-dark-400 text-center">
              No financing options found.
              {searchQuery && '\nTry a different search term.'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
