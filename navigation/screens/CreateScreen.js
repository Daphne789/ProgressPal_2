import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Modal, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { firestore, auth } from '../../config/firebase';
import * as Updates from 'expo-updates';
import { format } from 'date-fns';

export default function CreateScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [checkboxTexts, setCheckboxTexts] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [checkboxes, setCheckboxes] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const navigation = useNavigation();
  const [taskId, setTaskId] = useState('');
  const color = '#000000';
  const db = firestore;
  const user = auth.currentUser;

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowDropdown(false);
    setSelectedLabel(option);
  };

  const handleDateChange = (date) => {
    if (date > new Date()) {
      setSelectedDate(date);
    } else {
      alert('Selected time has already passed.');
    }
    setShowDatePicker(false);
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setSelectedDate(null);
      setSelectedLabel(null);
      setTitle('');
      setDescription('');
    });

    return unsubscribe;
  }, [navigation]);


  const saveTask = async () => {
    try {
      if (title.trim() || description.trim() || checkboxes.some((checkbox) => checkbox.text.trim())) {
        const userDocRef = doc(db, 'users', user.uid);
        const tasksRef = collection(userDocRef, 'tasks');
        const newTaskRef = doc(tasksRef);
        const newTaskId = newTaskRef.id;
        const timestamp = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

        const newTask = {
          taskId: newTaskId,
          userId: user.uid,
          createdBy: user.email, 
          title: title.trim(),
          description: description.trim(),
          selectedDate: selectedDate ? selectedDate.toISOString() : null,
          selectedLabel,
          timestamp
        };

        const newTaskDocRef = await addDoc(tasksRef, newTask);

        setTaskId(newTaskId);
        setSelectedDate(null);
        setSelectedLabel(null);
        setTitle('');
        setDescription('');

        // Reload the app
        Updates.reloadAsync();

        // console.log(newTaskDocRef.id);
        navigation.navigate('Home', { newTaskData: { ...newTask, taskId: newTaskDocRef.id } });

      } else {
        alert('Please fill in at least one field');
      }
    } catch (error) {
      console.log('Error saving data:', error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={showDatePickerModal}>
            <Ionicons name="md-calendar" size={33} color="black" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowDropdown(true)}>
            <Ionicons name="ios-pricetag" size={33} color="black" style={styles.icon} />
          </TouchableOpacity>
          <View style={styles.deadlineContainer}>
            <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
              {selectedDate && (
                <Text style={styles.deadline}>{moment(selectedDate).format('MMM DD, YYYY HH:mm')}</Text>
              )}
              {selectedLabel && (
                <Text style={styles.selectedLabel}>{selectedLabel}</Text>
              )}
            </View>
          </View>
        </View>
        <TextInput
          style={styles.titleInput}
          onChangeText={(text) => setTitle(text)}
          value={title}
          placeholder="Title"
          placeholderTextColor="grey"
          maxLength={100}
        />
        <TextInput
          style={styles.descriptionInput}
          onChangeText={(text) => setDescription(text)}
          value={description}
          placeholder="Description"
          placeholderTextColor="grey"
          maxLength={500}
          multiline={true}
        />
        <TouchableOpacity style={styles.saveButton} onPress={saveTask}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="save-outline" size={24} color="white" style={{ marginRight: 5 }} />
            <Text style={styles.saveButtonText}>Save</Text>
          </View>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="datetime"
          onConfirm={handleDateChange}
          onCancel={() => setShowDatePicker(false)}
          minimumDate={new Date()}
        />

        <Modal visible={showDropdown} transparent={true} animationType="fade">
          <TouchableOpacity
            style={styles.dropdownModal}
            onPress={() => setShowDropdown(false)}
            activeOpacity={1}
          >
            <View style={styles.dropdownContent}>
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleOptionSelect('Lecture')}
              >
                <Text style={styles.optionText}>Lecture</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleOptionSelect('Assignment')}
              >
                <Text style={styles.optionText}>Assignment</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.option}
                onPress={() => handleOptionSelect('Project')}
              >
                <Text style={styles.optionText}>Project</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  icon: {
    marginRight: 16,
  },
  deadline: {
    fontSize: 16,
    marginLeft: 'auto',
    marginRight: 8,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#faebd7'
  },
  descriptionInput: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    fontSize: 16,
    height: 160,
    textAlignVertical: 'top',
    backgroundColor: '#faebd7'
  },
  saveButton: {
    backgroundColor: '#0b8043',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 16 : 0,
    elevation: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 3,
  },
  dropdownModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  option: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
  optionText: {
    fontSize: 16,
  },
  selectedDate: {
    fontSize: 16,
    marginTop: 8,
    color: 'black',
  },
  deadlineContainer: {
    marginBottom: 2,
  },
  selectedLabel: {
    fontSize: 16,
    marginLeft: 'auto',
    marginRight: 5,
    color: 'blue',
  },
});

