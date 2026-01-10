import { Tabs } from 'expo-router';
import { View, Text, Platform } from 'react-native';
import { 
  Home, 
  Search, 
  Wallet, 
  User,
  LucideIcon
} from 'lucide-react-native';

interface TabIconProps {
  Icon: LucideIcon;
  label: string;
  focused: boolean;
}

const TabIcon = ({ Icon, label, focused }: TabIconProps) => (
  <View className="items-center justify-center pt-2">
    <Icon 
      size={22} 
      color={focused ? '#22c55e' : '#94a3b8'} 
      strokeWidth={focused ? 2.5 : 2}
    />
    <Text 
      className={`text-xs mt-1 ${focused ? 'text-primary-500 font-medium' : 'text-gray-400'}`}
    >
      {label}
    </Text>
  </View>
);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 5,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={Home} label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={Search} label="Explore" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={Wallet} label="Wallet" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={User} label="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
