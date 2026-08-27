import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, Platform } from 'react-native';
import { AppTabParamList } from '@/types/navigation';
import { HomeScreen } from '@/screens/home/HomeScreen';
import { DiscoverScreen } from '@/screens/discover/DiscoverScreen';
import { UploadOutfitScreen } from '@/screens/upload/UploadOutfitScreen';
import { ProfileStackNavigator } from './ProfileStackNavigator';
import { FotpuColors } from '@/theme/colors';

const Tab = createBottomTabNavigator<AppTabParamList>();

// Dummy Messages Screen for tab completeness
const MessagesPlaceholder = () => (
  <HomeScreen />
);

export const AppTabsNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: FotpuColors.primary,
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          backgroundColor: '#FCFCFC',
          borderTopColor: '#E5E7EB',
          height: Platform.OS === 'ios' ? 88 : 65,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>,
        }}
      />
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🔍</Text>,
        }}
      />
      <Tab.Screen
        name="Upload"
        component={UploadOutfitScreen}
        options={{
          tabBarLabel: 'Upload',
          tabBarIcon: () => (
            <Text style={{ fontSize: 26, color: FotpuColors.primary, marginTop: -4 }}>
              ➕
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesPlaceholder}
        options={{
          tabBarLabel: 'Closet',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👗</Text>,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};
