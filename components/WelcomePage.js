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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
    backgroundColor: '#00b3ff',
    borderRadius: 300,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 2,
    width: 200,
  },
  buttonText: {
    color: '#000',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default WelcomePage;
