import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';

const HomePage = () => {
  const navigation = useNavigation();

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Logout successful
        // Add code here to navigate back to the login page or perform any other desired actions
        console.log('Logout successful');
        // Navigate to the login page
        navigation.navigate('LoginPage');
      })
      .catch((error) => {
        // Handle logout error
        console.log('Logout failed', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Our App</Text>
      <Text>This is a simple homepage for testing purposes.</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  logoutButton: {
    marginTop: 16,
    backgroundColor: '#ff0000',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
};

export default HomePage;
