import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WelcomePage = () => {
    const navigation = useNavigation();

    const handleLoginPress = () => {
      navigation.navigate('Login');
    };
  
    const handleRegisterPress = () => {
      navigation.navigate('Register');
    };
    
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to ProgressPal</Text>
      <Text style={styles.subtitle}>
        Please select one of the options below to continue:
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleRegisterPress}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    width: 200,
    borderRadius: 300,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 2,
    backgroundColor: '#00b3ff',
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
});

export default WelcomePage;
