import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Platform, StyleSheet } from 'react-native';
import { AppTabParamList } from '@/types/navigation';
import { HomeScreen } from '@/screens/home/HomeScreen';
import { DiscoverScreen } from '@/screens/discover/DiscoverScreen';
import { WardrobeScreen } from '@/screens/wardrobe/WardrobeScreen';
import { SavedScreen } from '@/screens/saved/SavedScreen';
import { ProfileStackNavigator } from './ProfileStackNavigator';
import Svg, { Path, Circle } from 'react-native-svg';

const Tab = createBottomTabNavigator<AppTabParamList>();

const ACTIVE_COLOR = '#8B7EF8';
const INACTIVE_COLOR = '#8E8E93';

export const AppTabsNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <Path
                d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={focused ? color : 'none'}
                fillOpacity={focused ? 0.18 : 0}
              />
              <Path
                d="M9 21V12h6v9"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          ),
        }}
      />
      <Tab.Screen
        name="Discover"
        component={DiscoverScreen}
        options={{
          tabBarLabel: 'Discover',
          tabBarIcon: ({ color }) => (
            <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <Path
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                stroke={color}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          ),
        }}
      />
      <Tab.Screen
        name="Wardrobe"
        component={WardrobeScreen}
        options={{
          tabBarLabel: 'Wardrobe',
          tabBarIcon: ({ color }) => (
            <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 4.5a2 2 0 012 2c0 1.1-.9 2-2 2.5V11"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <Path
                d="M12 11L3.2 15.6a1.5 1.5 0 00.7 2.8h16.2a1.5 1.5 0 00.7-2.8L12 11z"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          ),
        }}
      />
      <Tab.Screen
        name="Saved"
        component={SavedScreen}
        options={{
          tabBarLabel: 'Saved',
          tabBarIcon: ({ color, focused }) => (
            <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <Path
                d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={focused ? color : 'none'}
              />
            </Svg>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <Path
                d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Circle
                cx="12"
                cy="7"
                r="4"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#F0F0F0',
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
    paddingTop: 8,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  tabBarItem: {
    paddingVertical: 2,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
});
