import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';


const LoginPage = () => {

  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  // const [passwordError, setPasswordError] = useState('');

  const handleLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Login successful
        // Add code here to handle the user credential or navigate to the homepage
        console.log('Login successful', userCredential);
        // Navigate to the homepage
        navigation.navigate('HomePage');
      })
      .catch((error) => {
        // Handle login error
        console.log('Login failed', error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoFocus
          maxLength={255}
          onChangeText={setEmail}
        />
        {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          minLength={8}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log in</Text>
      </TouchableOpacity>
      <View style={styles.copy}>
        <Text>Copyright &copy; 2023</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 120,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    marginVertical: 8,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#00b3ff',
    color: '#000',
    borderRadius: 300,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 16,
    width: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  copy: {
    color: 'grey',
  },
});

export default LoginPage;
