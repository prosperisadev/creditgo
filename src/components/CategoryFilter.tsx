 import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { 
  Laptop, 
  Sun, 
  Home, 
  GraduationCap, 
  HeartPulse, 
  Briefcase,
  LucideIcon 
} from 'lucide-react-native';
import { AssetCategory, AssetCategoryInfo } from '../types';
import { ASSET_CATEGORIES } from '../constants';

const iconMap: Record<string, LucideIcon> = {
  'laptop': Laptop,
  'sun': Sun,
  'home': Home,
  'graduation-cap': GraduationCap,
  'heart-pulse': HeartPulse,
  'briefcase': Briefcase,
};

interface CategoryFilterProps {
  selectedCategory: AssetCategory | 'all';
  onSelectCategory: (category: AssetCategory | 'all') => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const allCategories: (AssetCategoryInfo | { id: 'all'; name: string; icon: string; color: string })[] = [
    { id: 'all', name: 'All', icon: 'grid', color: '#64748b' },
    ...ASSET_CATEGORIES,
  ];

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="py-2"
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      {allCategories.map((category) => {
        const isSelected = selectedCategory === category.id;
        const Icon = iconMap[category.icon];
        
        return (
          <TouchableOpacity
            key={category.id}
            onPress={() => onSelectCategory(category.id as AssetCategory | 'all')}
            className={`
              flex-row items-center px-4 py-2.5 rounded-full mr-2
              ${isSelected ? 'bg-primary-500' : 'bg-white border border-gray-200'}
            `}
            activeOpacity={0.7}
          >
            {Icon && (
              <Icon 
                size={16} 
                color={isSelected ? '#ffffff' : category.color} 
                style={{ marginRight: 6 }}
              />
            )}
            <Text 
              className={`
                font-medium text-sm
                ${isSelected ? 'text-white' : 'text-dark-600'}
              `}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};
