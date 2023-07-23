import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomePage from '../components/WelcomePage';
import RegisterPage from '../components/RegisterPage';
import LoginPage from '../components/LoginPage';

const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Hello!" component={WelcomePage} />
      <Stack.Screen name="Register" component={RegisterPage} />
      <Stack.Screen name="Login" component={LoginPage} />
    </Stack.Navigator>
  );
}
