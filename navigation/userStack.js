import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './screens/HomeScreen';
import CreateScreen from './screens/CreateScreen';
import SyncEventsScreen from './screens/SyncEventsScreen';
import SettingsScreen from './screens/SettingsScreen';

import HomeIcon from '.././assets/icons/HomeIcon';
import AddIcon from '.././assets/icons/AddIcon';
import SyncIcon from '.././assets/icons/SyncIcon';
import SettingsIcon from '.././assets/icons/SettingsIcon';

// import LoginPage from '../components/LoginPage';
// import RegisterPage from '../components/RegisterPage';
// import WelcomePage from '../components/WelcomePage';

const homeName = 'Home';
const createName = 'Create';
const syncEventsName = 'Sync Events';
const settingsName = 'Settings';

const Tab = createBottomTabNavigator();

export default function UserStack() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let rn = route.name;

            if (rn === homeName) {
              return <HomeIcon color={color} size={size} />;
            } else if (rn === createName) {
              return <AddIcon color={color} size={size} />;
            } else if (rn === syncEventsName) {
              return <SyncIcon color={color} size={size} />;
            } else if (rn === settingsName) {
              return <SettingsIcon color={color} size={size} />;
            }
          },
          tabBarActiveTintColor: '#0091ff',
          tabBarInactiveTintColor: '#000000',
          tabBarLabelStyle: { paddingBottom: 10, fontSize: 12 },
          tabBarStyle: { height: 70, padding: 10 },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Create" component={CreateScreen} />
        <Tab.Screen name="Sync Events" component={SyncEventsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}