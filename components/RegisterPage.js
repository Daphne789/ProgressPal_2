import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore, collection } from '../config/firebase';
import axios from 'axios';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailInUseError, setEmailInUseError] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = () => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (emailRegex.test(email)) {
      setEmailError('');
      return true;
    } else {
      setEmailError('Invalid email address');
      return false;
    }
  };

  const handleRegister = async () => {
    if (username && email && password) {
      const isEmailValid = validateEmail();

      if (isEmailValid && password.length >= 8) {
        try {
          setIsLoading(true);
          const isValidEmail = await validateUserEmail(email);

          if (isValidEmail) {
            createUserWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                const user = userCredential.user;
                console.log('Registration successful', userCredential);

                // Create a new doc for the user in Firebase Firestore
                const userDocRef = doc(firestore, 'users', user.uid);
                setDoc(userDocRef, { username, email });

                // Create a new collection called tasks for a new user
                const tasksCollectionRef = collection(firestore, 'tasks');

                setIsLoading(false);
              })
              .catch((error) => {
                if (error.code === 'auth/email-already-in-use') {
                  setEmailInUseError(true);
                } else {
                  console.log('Registration failed:', error.message);
                }
                setIsLoading(false);
              });
          } else {
            setIsLoading(false);
          }
        } catch (error) {
          // Error while validating email
          console.log('Email validation error:', error);
          setIsLoading(false);
        }
      }
    } else {
      setShowError(true);
    }
  };

  const validateUserEmail = async (email) => {
    try {
      const apiKey = '1G7IVQXVEEG3NE5LSLSG'; // MailboxValidator API key
      const url = `https://api.mailboxvalidator.com/v1/validation/single?email=${encodeURIComponent(
        email
      )}&key=${apiKey}`;

      const response = await axios.get(url);
      const data = response.data;

      if (data.error) {
        console.log('Email validation error:', data.error_message);
        return false;
      }
      console.log('Validation result:', data);

      if (data.status === 'True') {
        setEmailError('');
        return true;
      } else {
        setEmailError('Invalid email address');
        return false;
      }
    } catch (error) {
      console.log('Email validation error:', error);
      throw error;
    }
  };

  const renderUsernameError = () => {
    if (username.length >= 10) {
      return <Text style={styles.error}>Username can't be longer than 10 characters</Text>;
    }
    return null;
  };

  const renderPasswordError = () => {
    if (password.length < 8) {
      return <Text style={styles.error}>Password must be at least 8 characters</Text>;
    }
    return null;
  };

  const dismissErrorMessage = () => {
    setShowError(false);
    setEmailInUseError(false);
  };

  const handleEmailFocus = () => {
    if (showError) {
      setShowError(false);
    } else if (emailError) {
      setEmailError('');
    }
    if (emailInUseError) {
      setEmailInUseError(false);
    }
  };

  const handleEmailChange = (text) => {
    if (emailError) {
      setEmailError('');
    }
    setEmail(text);
    setEmailInUseError(false);
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
      {emailInUseError && <Text style={styles.error}>Email address is already in use</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          autoFocus
          maxLength={10}
          onChangeText={setUsername}
          onFocus={dismissErrorMessage}
        />
        {renderUsernameError()}
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={handleEmailChange}
          onFocus={handleEmailFocus}
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
          onFocus={dismissErrorMessage}
        />
        {renderPasswordError()}
      </View>
      {isLoading ? (
        <ActivityIndicator style={styles.loading} size="small" color="#00b3ff" />
      ) : (
        <TouchableOpacity
          style={[styles.button, password.length < 8 && styles.disabledButton]}
          onPress={handleRegister}
          disabled={password.length < 8}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      )}
      {showError && <Text style={styles.error}>Please fill in all fields</Text>}
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
  error: {
    marginTop: 5,
    color: 'red',
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
  loading: {
    marginTop: 10,
  },
  button: {
    width: 215,
    borderRadius: 300,
    backgroundColor: '#00b3ff',
    color: '#000',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#000',
  },
  copy: {
    color: 'grey',
  },
});

export default RegisterPage;
