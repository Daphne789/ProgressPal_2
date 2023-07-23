import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';


const EditProfile = ({ onClose, onSelectImage }) => {
  const [defaultPictures] = useState([
    require('.././assets/profiles/mountain.png'),
    require('.././assets/profiles/plant.png'),
    require('.././assets/profiles/sea.png'),
    // Add more default pictures here
  ]);

  const handleSelectPicture = (picture) => {
    console.log('Selected picture:', picture);
    // Pass the selected picture back to the parent component
    onSelectImage(picture);
  };

  return (
    <View style={styles.container}>
      <View style={styles.modalContainer}>
        {defaultPictures.map((picture, index) => (
          <TouchableOpacity
            key={index}
            style={styles.pictureContainer}
            onPress={() => handleSelectPicture(picture)}
          >
            <View style={styles.profilePictureContainer}>
              <Image source={picture} style={styles.picture} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePictureContainer: {
    width: 100,
    height: 100,
    borderRadius: 50, // Half of width and height to make it circular
    overflow: 'hidden', // This is important to clip the image inside the circle
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicture: {
    width: 100,
    height: 100,
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
  },
  pictureContainer: {
    width: 100,
    height: 100,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  picture: {
    width: 100,
    height: 100,
  },
  profilePictureContainer: {
    width: 100,
    height: 100,
    borderRadius: 50, // Half of width and height to make it circular
    overflow: 'hidden', // This is important to clip the image inside the circle
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditProfile;