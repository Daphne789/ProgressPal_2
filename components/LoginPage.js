import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const LoginPage = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Login successful
        console.log('Login successful', userCredential);
        // Navigate to the Home Page
        navigation.navigate('HomePage');
      })
      .catch((error) => {
        // Handle login error
        console.log('Login failed', error.code, error.message);
        if (error.code === 'auth/user-not-found') {
          setEmailError('Incorrect email');
        } else if (error.code === 'auth/wrong-password') {
          setPasswordError('Incorrect password');
        } else {
          // Dismiss error messages
          setEmailError('');
          setPasswordError('');
          console.log('Login failed. Please try again!');
        }
      });
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    setEmailError(''); // Dismiss email error when the inputted email changes
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setPasswordError(''); // Dismiss password error when the inputted password changes
  };

  return (
    <View style={styles.container}>
      <View style={styles.profilePicContainer}>
        <Image
          source={require('../assets/progresspalLogo.png')}
          style={styles.profilePic}
          PlaceholderContent={<ActivityIndicator />}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoFocus
          maxLength={255}
          onChangeText={handleEmailChange}
        />
        {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          minLength={8}
          onChangeText={handlePasswordChange}
        />
        {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}
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
    padding: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  profilePicContainer: {
    width: 100,
    height: 100,
  },
  profilePic: {
    width: 100,
    height: 100,
  },
  inputContainer: {
    marginVertical: 8,
  },
  input: {
    width: 213,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#ccc',
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  error: {
    marginTop: 8,
    color: 'red',
  },
  button: {
    width: 213,
    borderRadius: 300,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 16,
    alignItems: 'center',
    backgroundColor: '#00b3ff',
    color: '#000',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#000',
  },
  copy: {
    color: 'grey',
  },
});

export default LoginPage;
