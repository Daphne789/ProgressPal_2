import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Modal, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, addDoc, doc } from 'firebase/firestore';
import { firestore, auth } from '../../config/firebase';
import { format } from 'date-fns';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import * as Updates from 'expo-updates';
import CalendarIcon from '../../assets/icons/CalendarIcon';
import TagIcon from '../../assets/icons/TagIcon';

export default function CreateScreen() {
  const navigation = useNavigation();
  const color = '#000000';
  const db = firestore;
  const user = auth.currentUser;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [taskId, setTaskId] = useState('');

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
      if (title.trim() || description.trim()) {
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
        <View style={styles.topContainer}>
          <TouchableOpacity onPress={showDatePickerModal}>
            <CalendarIcon color={color} size={33}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowDropdown(true)}>
            <TagIcon color={color} size={40} style={styles.icon} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
            {selectedDate && (
              <Text style={styles.deadline}>{moment(selectedDate).format('MMM DD, YYYY HH:mm')}</Text>
            )}
            {selectedLabel && (
              <Text style={styles.selectedLabel}>{selectedLabel}</Text>
            )}
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
  scrollContainer: {
    flexGrow: 1,
  },
  topContainer: {
    marginBottom: 16,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  icon: {
    marginLeft: 90,
  },
  deadline: {
    fontSize: 16,
    marginLeft: 50,
  },
  selectedLabel: {
    fontSize: 16,
    marginLeft: 'auto',
    marginRight: 5,
    color: 'blue',
  },
  titleInput: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    backgroundColor: '#faebd7'
  },
  descriptionInput: {
    fontSize: 16,
    height: 160,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    textAlignVertical: 'top',
    backgroundColor: '#faebd7'
  },
  saveButton: {
    borderRadius: 20,
    padding: 10,
    marginBottom: Platform.OS === 'ios' ? 16 : 0,
    elevation: 5,
    alignItems: 'center',
    backgroundColor: '#0b8043',
  },
  saveButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 3,
    color: 'white',
  },
  dropdownModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownContent: {
    borderRadius: 8,
    padding: 16,
    backgroundColor: 'white',
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
});

