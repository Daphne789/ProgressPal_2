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
        // Navigate to the HomePage
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
          // Reset error messages
          setEmailError('');
          setPasswordError('');
          console.log('Login failed. Please try again.');
        }
      });
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    setEmailError(''); // Reset email error when email changes
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setPasswordError(''); // Reset password error when password changes
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
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 20,
    width: 213,
  },
  button: {
    backgroundColor: '#00b3ff',
    color: '#000',
    borderRadius: 300,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 16,
    width: 213,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  copy: {
    color: 'grey',
  },
  error: {
    color: 'red',
    marginTop: 8,
  },
  profilePic: {
    width: 100,
    height: 100,
  },
  profilePicContainer: {
    width: 100,
    height: 100,
  },
});

export default LoginPage;
