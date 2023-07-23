import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Switch, SafeAreaView, Modal, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import EditProfile from '../../components/EditProfile';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../config/firebase';

export default function AccountScreen() {
  const navigation = useNavigation();
  const [switchValue, setSwitchValue] = useState(false);
  const [showError, setShowError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');
  const [usernameModalVisible, setUsernameModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [tempUsername, setTempUsername] = useState('');

  useEffect(() => {
    // Fetch the username from Firestore
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      getDoc(userDocRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            // If the document exists, update the username
            const userData = docSnapshot.data();
            setCurrentUsername(userData.username);
            console.log('Current username:', userData.username);
          } else {
            // Handle the case where the user document doesn't exist (optional)
            console.log('User document does not exist');
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
        // Navigate to the welcome page or any desired page after logout
        navigation.navigate('WelcomePage');
      })
      .catch((error) => {
        console.log('Logout failed', error.message);
      });
  };

  const toggleSwitch = () => {
    setSwitchValue((prevValue) => !prevValue);
  };

  const handleEditProfilePicture = () => {
    setModalVisible(true);
  };

  const dismissErrorMessage = () => {
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
      // Update the new username of the user in Firestore
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userDocRef = doc(firestore, 'users', currentUser.uid);
        await updateDoc(userDocRef, { username: tempUsername });
        setUsernameModalVisible(false);
        setCurrentUsername(tempUsername);
      }
    } catch (error) {
      console.log('Error updating username:', error);
    }
  };

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    setModalVisible(false); 
  };

  const handleOpenChangeUsername = () => {
    setTempUsername(currentUsername);
    setUsernameModalVisible(true);
  };

  const handleCancelChangeUsername = () => {
    setUsernameModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View>
        {/* Display the default profile picture */}
        <View style={styles.profilePicContainer}>
          <Image
            source={require('../../assets/profiles/hello.png')}
            style={styles.profilePic}
            PlaceholderContent={<ActivityIndicator />}
          />
        </View>
        <Text style={styles.username}>{currentUsername}</Text>
      </View>
      <Text style={styles.title}>Profile</Text>
      <TouchableOpacity onPress={handleEditProfilePicture}>
        <Text style={styles.functionality}>Edit profile picture</Text>
      </TouchableOpacity>
      <View style={styles.lineStyle} />
      <Text style={styles.functionality} onPress={handleOpenChangeUsername}>Change username</Text>
      <Text style={styles.title}>Push Notifications</Text>
      <Text style={styles.functionality}>Receive reminders notifications</Text>
      <View style={styles.lineStyle} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.switch}>
          <Text>{switchValue ? 'Switch is ON' : 'Switch is OFF'}</Text>
          {/* Setting the default value of state
          On change of switch onValueChange will be triggered */}
          <Switch
            style={{ marginTop: -67 }}
            onValueChange={toggleSwitch}
            value={switchValue}
          />
        </View>
      </SafeAreaView>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <EditProfile onClose={() => setModalVisible(false)} onSelectImage={handleImageSelect} />
      </Modal>

      <Modal
        visible={usernameModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setUsernameModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {renderUsernameError()}
            <TextInput
              style={styles.textInput}
              placeholder="Please type in new username"
              autoFocus
              maxLength={10}
              onChangeText={setTempUsername}
              onFocus={dismissErrorMessage}
              value={tempUsername}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleChangeUsername}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelChangeUsername}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ff0000',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 60,
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 15,
  },
  error: {
    color: 'red',
    marginTop: 5,
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
  profilePic: {
    width: '100%',
    height: '100%',
  },
  switch: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196f3',
    padding: 10,
  },
  username: {
    fontSize: 22,
    fontWeight: '450',
    textAlign: 'center',
    marginTop: 10,
    marginHorizontal: 10,
  },
  profilePicContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'hidden',
    marginLeft: 85,
    marginTop: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Modal at the bottom
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
    borderRadius: 8,
  },
  submitButton: {
    borderWidth: 2,
    borderColor: '#800080', // Purple color
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#800080',
    fontWeight: 'bold',
    fontSize: 16,
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
    color: '#ff0000', // Red color
    fontWeight: 'bold',
    fontSize: 16,
  },
});