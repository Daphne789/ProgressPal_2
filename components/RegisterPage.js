import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';

const auth = getAuth();

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailInUseError, setEmailInUseError] = useState(false);

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
                console.log('Registration successful', userCredential);
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
          // Error occurred while validating email
          console.log('Email validation error:', error);
          setIsLoading(false);
        }
      }
    } else {
      // Display error message for incomplete fields
      setShowError(true);
    }
  };

  const validateUserEmail = async (email) => {
    try {
      const encodedEmail = encodeURIComponent(email);
      const apiKey = 'f706be8fae1162996f6bde50b9242a59';
      const url = `http://apilayer.net/api/check?access_key=${apiKey}&email=${encodedEmail}`;
      const response = await axios.get(url);

      const { format_valid, smtp_check } = response.data;

      if (format_valid && smtp_check) {
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
      <Text style={styles.title}>Register</Text>
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
        <ActivityIndicator style={styles.loadingIndicator} size="small" color="#00b3ff" />
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
  error: {
    color: 'red',
    marginTop: 5,
  },
  loadingIndicator: {
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});

export default RegisterPage;
