import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../config/firebase';

export default function AccountScreen() {
  const navigation = useNavigation();
  const [showError, setShowError] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');
  const [usernameModal, setUsernameModal] = useState(false);
  const [tempUsername, setTempUsername] = useState('');

  useEffect(() => {
    // Get the username from Firebase Firestore
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      getDoc(userDocRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            // If the doc exists, update the username
            const userData = docSnapshot.data();
            setCurrentUsername(userData.username);
            console.log('Current username:', userData.username);
          } else {
            console.log('User document can not be found');
          }
        })
        .catch((error) => {
          console.log('Error fetching user data:', error);
        });
    }
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log('Logout successful');
        // Navigate to the Welcome Page 
        navigation.navigate('WelcomePage');
      })
      .catch((error) => {
        console.log('Logout failed', error.message);
      });
  };

  const hideErrorMessage = () => {
    setShowError(false);
  };

  const renderUsernameError = () => {
    if (currentUsername.length >= 10) {
      return <Text style={styles.error}>Username can't be longer than 10 characters</Text>;
    }
    return null;
  };

  const handleChangeUsername = async () => {
    try {
      // Update the user's current username
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userDocRef = doc(firestore, 'users', currentUser.uid);
        await updateDoc(userDocRef, { username: tempUsername });
        setUsernameModal(false);
        setCurrentUsername(tempUsername);
      }
    } catch (error) {
      console.log('Error updating username:', error);
    }
  };

  const handleShowChangeUsername = () => {
    setTempUsername(currentUsername);
    setUsernameModal(true);
  };

  const handleDismissChangeUsername = () => {
    setUsernameModal(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.profilePicContainer}>
          <Image
            source={require('../../assets/hello.png')}
            style={styles.profilePic}
            PlaceholderContent={<ActivityIndicator />}
          />
        </View>
        <Text style={styles.username}>{currentUsername}</Text>
      </View>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.functionality} onPress={handleShowChangeUsername}>Change username</Text>
      <View style={styles.lineStyle} />
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <Modal
        visible={usernameModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setUsernameModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {renderUsernameError()}
            <TextInput
              style={styles.textInput}
              placeholder="Please fill in your new username"
              autoFocus
              maxLength={10}
              onChangeText={setTempUsername}
              onFocus={hideErrorMessage}
              value={tempUsername}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleChangeUsername}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleDismissChangeUsername}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    marginTop: 5,
    color: 'red',
  },
  container: {
    flex: 1,
  },
  topContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicContainer: {
    width: 160,
    height: 160,
    marginTop: 20,
    borderRadius: 80,
    overflow: 'hidden',
  },
  profilePic: {
    width: 160,
    height: 160,
  },
  username: {
    fontSize: 22,
    fontWeight: '450',
    marginTop: 10,
    marginHorizontal: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196f3',
    padding: 10,
  },
  functionality: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    paddingLeft: 10,
    marginBottom: 8,
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: 'black',
    margin: 10,
  },
  button: {
    backgroundColor: '#ff0000',
    paddingVertical: 12,
    paddingHorizontal: 7,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Modal at the bottom
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  submitButton: {
    borderWidth: 2,
    borderColor: '#800080', // Purple color
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#800080',
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: '#ff0000', // Red color
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff', // White color
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#ff0000',
  },
});