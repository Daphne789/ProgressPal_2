import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import CreateScreen from './screens/CreateScreen';
import AccountScreen from './screens/AccountScreen';
import HomeIcon from '.././assets/icons/HomeIcon';
import AddIcon from '.././assets/icons/AddIcon';
import AccountIcon from '../assets/icons/AccountIcon';

const homeName = 'Home';
const createName = 'Create';
const accountName = 'Account';
const Tab = createBottomTabNavigator();

export default function UserStack() {
  return (
        <Tab.Navigator
          initialRouteName={homeName}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let rn = route.name;

              if (rn === homeName) {
                return <HomeIcon color={color} size={size} />;
              } else if (rn === createName) {
                return <AddIcon color={color} size={size} />;
              } else if (rn === accountName) {
                return <AccountIcon color={color} size={size} />;
              }
            },
            tabBarActiveTintColor: '#0091ff',
            tabBarInactiveTintColor: '#000000',
            tabBarLabelStyle: { paddingBottom: 10, fontSize: 12 },
            tabBarStyle: { height: 60, padding: 10 },
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Create" component={CreateScreen} />
          <Tab.Screen name="Account" component={AccountScreen} />
        </Tab.Navigator>
  );
}