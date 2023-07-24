import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { Checkbox, Snackbar, Menu } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import { SearchBar } from 'react-native-elements';
import LabelIcon from '../../assets/icons/LabelIcon';
import ReloadIcon from '../../assets/icons/ReloadIcon';
import MenuIcon from '../../assets/icons/MenuIcon';
import ShareIcon from '../../assets/icons/ShareIcon';
import * as Updates from 'expo-updates';
import { firestore, auth } from '../../config/firebase';
import { collection, query, getDocs, deleteDoc, doc, orderBy, updateDoc, getFirestore, getDoc, setDoc, where, createdBy } from 'firebase/firestore';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format } from 'date-fns';
import CalendarIcon from '../../assets/icons/CalendarIcon';
import TagIcon from '../../assets/icons/TagIcon';

const color = '#000000';
const size = 30;

const HomeScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [inviteCollaboratorModalVisible, setInviteCollaboratorModalVisible] = useState(false);
  const [collaboratorEmails, setCollaboratorEmails] = useState('');
  const [currentTaskTitle, setCurrentTaskTitle] = useState('');
  const [sharedTaskIds, setSharedTaskIds] = useState([]);
  const [collaborators, setCollaborators] = useState([]);
  const [collaboratorTasks, setCollaboratorTasks] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDescription, setEditTaskDescription] = useState('');
  const [editTaskSelectedDate, setEditTaskSelectedDate] = useState(selectedDate);
  const [editTaskSelectedLabel, setEditTaskSelectedLabel] = useState(selectedLabel);
  const db = firestore;
  const route = useRoute();

  useEffect(() => {
    const checkPendingInvitations = async () => {
      const pendingInvitations = await AsyncStorage.getItem('pendingInvitations');
      if (pendingInvitations) {
        const parsedPendingInvitations = JSON.parse(pendingInvitations);
        // Process the pending invitations and store the tasks in the collaborator's Firestore
        for (const pendingInvitation of parsedPendingInvitations) {
          const { taskId, collaboratorEmail, inviterUid } = pendingInvitation;
          // Check if the collaborator's email now exists in the Firestore users collection
          const usersQuery = query(collection(db, 'users'), where('email', '==', collaboratorEmail));
          const usersSnapshot = await getDocs(usersQuery);
          if (!usersSnapshot.empty) {
            // The collaborator's email exists, add the task document to their Firestore
            const collaboratorUserRef = usersSnapshot.docs[0].ref;
            const collaboratorTaskRef = doc(collection(collaboratorUserRef, 'tasks'), taskId);
            const inviterTaskRef = doc(collection(db, 'users', inviterUid, 'tasks'), taskId);
            const inviterTaskDoc = await getDoc(inviterTaskRef);
            if (inviterTaskDoc.exists()) {
              const taskData = inviterTaskDoc.data();
              // Add the task data along with the onlyEdit field
              await setDoc(collaboratorTaskRef, { ...taskData, onlyEdit: true });
              console.log('Collaborator added:', collaboratorEmail);

              // Remove the pending invitation from local storage
              const updatedPendingInvitations = parsedPendingInvitations.filter(
                (invitation) => invitation.taskId !== taskId && invitation.collaboratorEmail !== collaboratorEmail
              );
              await AsyncStorage.setItem('pendingInvitations', JSON.stringify(updatedPendingInvitations));
            } else {
              console.log('Inviter task not found:', taskId);
            }
          }
        }
        await fetchTasks();
      }
    };
    checkPendingInvitations();
  }, []);

  useEffect(() => {
    const getSharedTaskIds = async () => {
      try {
        const sharedTaskIds = await AsyncStorage.getItem('sharedTaskIds');
        if (sharedTaskIds) {
          const parsedSharedTaskIds = JSON.parse(sharedTaskIds);
          setSharedTaskIds(parsedSharedTaskIds);
        }
      } catch (error) {
        console.log('Error retrieving shared task IDs:', error);
      }
    };

    getSharedTaskIds();
  }, []);

  const fetchTasks = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userTasksRef = collection(db, 'users', user.uid, 'tasks');

        // Fetch the tasks created by the user
        const tasksQuery = query(userTasksRef, orderBy('timestamp', 'desc'));
        const tasksSnapshot = await getDocs(tasksQuery);
        const userTasksData = tasksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Fetch the tasks shared with other users
        const sharedTasksQuery = query(collection(db, 'tasks'), where('collaborators', 'array-contains', user.email));
        const sharedTasksSnapshot = await getDocs(sharedTasksQuery);
        const sharedTasksData = sharedTasksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const allTasksData = [...userTasksData, ...sharedTasksData];
        setTasks(allTasksData);
      }
    } catch (error) {
      console.log('Error retrieving tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (route.params && route.params.newTaskData) {
      const { newTaskData } = route.params;
      console.log(newTaskData);
      setTasks((prevTasks) => [newTaskData, ...prevTasks]);
    }
  }, [route.params]);

  const handleCheckboxToggle = async (taskId) => {
    try {
      const user = auth.currentUser;
      const userRef = doc(db, 'users', user.uid);
      const taskRef = doc(collection(userRef, 'tasks'), taskId);

      // Get the list of collaborators for the task
      const taskDoc = await getDoc(taskRef);
      if (taskDoc.exists()) {
        const taskData = taskDoc.data();
        const collaborators = taskData.collaborators || [];

        // Delete the task from the original user's Firestore
        await deleteDoc(taskRef);
        console.log('Task completed:', taskId);

        // Delete the reference task from the collaborators' Firestore
        for (const collaboratorEmail of collaborators) {
          const usersQuery = query(collection(db, 'users'), where('email', '==', collaboratorEmail));
          const usersSnapshot = await getDocs(usersQuery);

          if (!usersSnapshot.empty) {
            const collaboratorUserRef = usersSnapshot.docs[0].ref;
            const collaboratorTaskRef = doc(collection(collaboratorUserRef, 'tasks'), taskId);
            await deleteDoc(collaboratorTaskRef);
            console.log('Collaborator task completed:', taskId);
          }
        }
      }
      await fetchTasks();
      setShowSnackbar(true);
    } catch (error) {
      console.log('Error updating task:', error);
    }
  };

  const clearSearchBar = () => {
    fetchTasks();
    setSearchQuery("");
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleMenuToggle = (taskId) => {
    setSelectedTaskId(taskId);
    setMenuVisible(true);
  };

  const handleMenuClose = () => {
    setMenuVisible(false);
  };

  const handleEditTask = async (taskId) => {
    try {
      const user = auth.currentUser;
      const userTasksRef = collection(db, 'users', user.uid, 'tasks');
      const taskRef = doc(userTasksRef, taskId);
      const taskDoc = await getDoc(taskRef);

      if (taskDoc.exists()) {
        const taskData = taskDoc.data();
        setEditTask(taskData);
        setEditTaskTitle(taskData.title);
        setEditTaskDescription(taskData.description);
        setEditTaskSelectedDate(taskData.selectedDate ? new Date(taskData.selectedDate) : null);
        setEditTaskSelectedLabel(taskData.selectedLabel);
        setEditModalVisible(true);
        setMenuVisible(false);
      }
      console.log('Edit task:', taskId);
    } catch (error) {
      console.log('Error retrieving task details:', error);
    }
  };

  const handleDeleteTask = async (taskId, taskTitle) => {
    setMenuVisible(false);

    try {
      const confirmation = await new Promise((resolve) => {
        Alert.alert(
          'Confirm Deletion',
          `Are you sure you want to delete ${taskTitle}?`,
          [
            { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
            { text: 'Delete', style: 'destructive', onPress: () => resolve(true) },
          ]
        );
      });

      if (confirmation) {
        const user = auth.currentUser;
        const userRef = doc(db, 'users', user.uid);
        const taskRef = doc(collection(userRef, 'tasks'), taskId);

        // Get the list of collaborators for the task
        const taskDoc = await getDoc(taskRef);
        if (taskDoc.exists()) {
          const taskData = taskDoc.data();
          const collaborators = taskData.collaborators || [];

          // Delete the task from the owner
          await deleteDoc(taskRef);
          console.log('Task deleted:', taskId);

          // Delete the reference task from the collaborators
          for (const collaboratorEmail of collaborators) {
            const usersQuery = query(collection(db, 'users'), where('email', '==', collaboratorEmail));
            const usersSnapshot = await getDocs(usersQuery);

            if (!usersSnapshot.empty) {
              const collaboratorUserRef = usersSnapshot.docs[0].ref;
              const collaboratorTaskRef = doc(collection(collaboratorUserRef, 'tasks'), taskId);
              await deleteDoc(collaboratorTaskRef);
              console.log('Collaborator task deleted:', taskId);
            }
          }
        }

        await fetchTasks();
      }
    } catch (error) {
      console.log('Error deleting task:', error);
    }
  };

  const handleInviteCollaborator = async (taskId, taskTitle) => {
    setMenuVisible(false);
    console.log('Invite collaborator:', taskId);
    setCurrentTaskTitle(taskTitle);
    setSelectedTaskId(taskId);
    setInviteCollaboratorModalVisible(true);
    fetchCollaboratorsEmail(taskId); // Fetch the collaborators email list for the selected task
  };

  const handleShareTask = async () => {
    setInviteCollaboratorModalVisible(false);
    console.log('Collaborator emails:', collaboratorEmails);

    try {
      const user = auth.currentUser;
      const userRef = doc(db, 'users', user.uid);
      const taskRef = doc(collection(userRef, 'tasks'), selectedTaskId);
      const taskDoc = await getDoc(taskRef);

      if (taskDoc.exists()) {
        const taskData = taskDoc.data();
        const collaboratorEmailList = collaboratorEmails.split(',').map((email) => email.trim());

        for (const collaboratorEmail of collaboratorEmailList) {
          // Check if the collaborator's email exists in the Firestore users collection
          const usersQuery = query(collection(db, 'users'), where('email', '==', collaboratorEmail));
          const usersSnapshot = await getDocs(usersQuery);

          if (!usersSnapshot.empty) {
            // The collaborator's email exists, check if the task is already shared with them
            const collaboratorUserRef = usersSnapshot.docs[0].ref;
            const collaboratorTaskRef = doc(collection(collaboratorUserRef, 'tasks'), selectedTaskId);
            const collaboratorTaskDoc = await getDoc(collaboratorTaskRef);

            if (!collaboratorTaskDoc.exists()) {
              // The task is not already shared with the collaborator, add it to their Firestore
              // Add the task data along with the onlyEdit field
              await setDoc(collaboratorTaskRef, { ...taskData, onlyEdit: true });
              console.log('Collaborators added:', collaboratorEmail);
            } else {
              console.log('Task already shared with collaborators:', collaboratorEmail);
            }
          } else {
            console.log('Collaborators email does not exist:', collaboratorEmail);
            console.log('Pending');

            // Store the pending invitation using Async Storage
            const pendingInvitation = {
              taskId: selectedTaskId,
              collaboratorEmail,
              inviterUid: user.uid,
            };

            const pendingInvitations = await AsyncStorage.getItem('pendingInvitations');
            const updatedPendingInvitations = pendingInvitations ? JSON.parse(pendingInvitations) : [];
            updatedPendingInvitations.push(pendingInvitation);
            await AsyncStorage.setItem('pendingInvitations', JSON.stringify(updatedPendingInvitations));
          }
        }
        setCollaboratorEmails('');
        // Update the sharedTaskIds state
        setSharedTaskIds((prevSharedTaskIds) => [...prevSharedTaskIds, selectedTaskId]);
        // Store the shared task ID in Async Storage
        const sharedTaskIds = await AsyncStorage.getItem('sharedTaskIds');
        const updatedSharedTaskIds = sharedTaskIds ? JSON.parse(sharedTaskIds) : [];
        updatedSharedTaskIds.push(selectedTaskId);
        await AsyncStorage.setItem('sharedTaskIds', JSON.stringify(updatedSharedTaskIds));
        // Add collaborator emails to the task document's collaborators field
        const collaboratorsField = taskData.collaborators || [];
        const updatedCollaboratorsField = [...collaboratorsField, ...collaboratorEmailList];
        await updateDoc(taskRef, { collaborators: updatedCollaboratorsField });
        await fetchTasks();
        await fetchCollaboratorsEmail(selectedTaskId);
      } else {
        console.log('Task not found');
      }
    } catch (error) {
      console.log('Error inviting collaborators:', error);
    }
  };

  const fetchCollaboratorsEmail = async (taskId) => {
    try {
      const user = auth.currentUser;
      const taskRef = doc(collection(db, 'users', user.uid, 'tasks'), taskId);
      const taskDoc = await getDoc(taskRef);

      if (taskDoc.exists()) {
        const taskData = taskDoc.data();
        setCollaborators(taskData.collaborators || []);

        // Fetch all tasks shared with collaborators
        const tasksQuery = query(collection(db, 'users'), where('taskRef', '==', taskRef));
        const tasksSnapshot = await getDocs(tasksQuery);
        const tasksData = tasksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCollaboratorTasks(tasksData);
      } else {
        console.log('Task not found');
      }
    } catch (error) {
      console.log('Error fetching collaborators data:', error);
    }
  };

  const renderMenuIcon = (task) => {
    return (
      <TouchableOpacity onPress={() => handleMenuToggle(task.id)}>
        <MenuIcon size={size} color={color} />
      </TouchableOpacity>
    );
  };

  const renderDropdownMenu = (taskId, taskTitle, onlyEdit) => {
    if (onlyEdit === true && onlyEdit !== undefined) {
      return (
        <Menu
          visible={menuVisible && selectedTaskId === taskId}
          onDismiss={handleMenuClose}
          anchor={renderMenuIcon({ id: taskId })}
        >
          <Menu.Item onPress={() => handleEditTask(taskId)} title="Edit" />
        </Menu>
      );
    } else {
      return (
        <Menu
          visible={menuVisible && selectedTaskId === taskId}
          onDismiss={handleMenuClose}
          anchor={renderMenuIcon({ id: taskId })}
        >
          <Menu.Item onPress={() => handleEditTask(taskId)} title="Edit" />
          <Menu.Item onPress={() => handleDeleteTask(taskId, taskTitle)} title="Delete" />
          <Menu.Item onPress={() => handleInviteCollaborator(taskId, taskTitle)} title="Invite Collaborator" />
        </Menu>
      );
    }
  };

  const handleCancelUpdate = () => {
    setEditModalVisible(false);
  };

  const handleUpdateTask = async (taskId) => {
    try {
      if (taskId) {

        if (!editTaskTitle.trim() && !editTaskDescription.trim()) {
          alert('Please fill in either Title or Description)');
          return;
        }

        const user = auth.currentUser;
        const userTasksRef = collection(db, 'users', user.uid, 'tasks');
        const taskRef = doc(userTasksRef, taskId);
        const timestamp = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");

        await updateDoc(taskRef, {
          title: editTaskTitle.trim(),
          description: editTaskDescription.trim(),
          selectedDate: editTaskSelectedDate ? editTaskSelectedDate.toISOString() : null,
          selectedLabel: editTaskSelectedLabel,
          timestamp,
        });

        console.log('Task updated for current user:', taskId);

        // Check if the task is shared 
        const taskDoc = await getDoc(taskRef);
        if (taskDoc.exists()) {
          const taskData = taskDoc.data();
          const collaborators = taskData.collaborators || [];

          // If the task is shared, update the tasks for other users
          const updateTasksPromises = collaborators.map(async (collaboratorEmail) => {
            const usersQuery = query(collection(db, 'users'), where('email', '==', collaboratorEmail));
            const usersSnapshot = await getDocs(usersQuery);

            if (!usersSnapshot.empty) {
              const collaboratorUserRef = usersSnapshot.docs[0].ref;
              const collaboratorTaskRef = doc(collection(collaboratorUserRef, 'tasks'), taskId);
              await updateDoc(collaboratorTaskRef, {
                title: editTaskTitle.trim(),
                description: editTaskDescription.trim(),
                selectedDate: editTaskSelectedDate ? editTaskSelectedDate.toISOString() : null,
                selectedLabel: editTaskSelectedLabel,
                timestamp
              });
              console.log('Task updated for collaborator:', collaboratorEmail);
            }
          });
          await Promise.all(updateTasksPromises);
        }

        setEditModalVisible(false);
        await fetchTasks();
      }
    } catch (error) {
      console.log('Error updating task:', error);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (date) => {
    if (date > new Date()) {
      setEditTaskSelectedDate(date);
    } else {
      alert('Selected time has already passed.');
    }
    setShowDatePicker(false);
  };

  const handleOptionSelect = (option) => {
    setEditTaskSelectedLabel(option);
    setShowDropdown(false);
  };

  const renderEditModal = (taskId) => {
    return (
      <Modal visible={editModalVisible} animationType="slide">
        <View style={styles.editModalContainer}>
          <View style={styles.topContainer}>
            <TouchableOpacity onPress={showDatePickerModal}>
              <CalendarIcon color={color} size={33} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowDropdown(true)}>
              <TagIcon color={color} size={40} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
              {editTaskSelectedDate ? (
                <Text style={styles.deadline}>{moment(editTaskSelectedDate).format('MMM DD, YYYY HH:mm')}</Text>
              ) : (
                null
              )}
              {editTaskSelectedLabel ? (
                <Text style={styles.selectedLabel}>{editTaskSelectedLabel}</Text>
              ) : (
                null
              )}
            </View>
          </View>
          <TextInput
            style={styles.titleInput}
            onChangeText={(text) => setEditTaskTitle(text)}
            value={editTaskTitle}
            placeholder={editTaskTitle ? '' : 'Title'}
            placeholderTextColor="grey"
            maxLength={100}
          />
          <TextInput
            style={styles.descriptionInput}
            onChangeText={(text) => setEditTaskDescription(text)}
            value={editTaskDescription}
            placeholder={editTaskDescription ? '' : 'Description'}
            placeholderTextColor="grey"
            maxLength={500}
            multiline={true}
          />
          <TouchableOpacity style={styles.updateButton} onPress={() => handleUpdateTask(selectedTaskId)}>
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelUpdate}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
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
        </View>
      </Modal>
    );
  };

  const renderCollaboratorsModal = () => {
    return (
      <Modal
        visible={inviteCollaboratorModalVisible}
        onRequestClose={() => setInviteCollaboratorModalVisible(false)}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.inviteCollaboratorModal}>
          <View style={styles.inviteCollaboratorModalContent}>
            <Text style={styles.inviteCollaboratorModalTitle}>{currentTaskTitle}</Text>
            <Text style={styles.collaboratorsTitle}>Collaborators</Text>
            {collaborators.map((collaborator, index) => (
              <Text key={index} style={styles.collaboratorEmail}>{collaborator}</Text>
            ))}
            <Text style={styles.collaboratorsTitle}>Add Collaborators</Text>
            <TextInput
              style={styles.collaboratorInput}
              placeholder="example1@ex.com,example2@ex.com,..."
              onChangeText={setCollaboratorEmails}
              value={collaboratorEmails}
              multiline={true}
            />
            <TouchableOpacity
              style={styles.inviteCollaboratorButton}
              onPress={handleShareTask}
            >
              <Text style={styles.inviteCollaboratorButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal >
    );
  };

  const handleSearchTask = () => {
    if (searchQuery === "") return;
    const resultTasks = tasks.filter((task) => task.title === searchQuery);
    if (!resultTasks) {
      console.log("No matched task found.");
    }
    setTasks(resultTasks);
  };

  const handleClearSearchBar = () => {
    fetchTasks();
    setSearchQuery("");
  };

  const reload = () => {
    Updates.reloadAsync();
  };

  return (
    <View style={styles.container}>
      <View style={styles.menu}>
        <TouchableOpacity onPress={() => reload()}>
          <ReloadIcon color="#4340ce" size={size} />
        </TouchableOpacity>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search..."
          onChangeText={handleSearch}
          value={searchQuery}
          containerStyle={{
            backgroundColor: '#f2f2f2',
            borderBottomWidth: 0,
            borderTopWidth: 0,
            marginLeft: 8,
          }}
          inputContainerStyle={{
            backgroundColor: '#fff',
            borderRadius: 25,
            paddingLeft: 4,
            width: 290,
          }}
          searchIcon={<Icon name="search" size={16} onPress={() => handleSearchTask()} color={'#0b8043'} />}
          clearIcon={<Icon name="times-circle" size={18} onPress={() => handleClearSearchBar()} color={'#d60000'} />}
        />
      </View>
      <ScrollView>
        {tasks.map((task) => (
          <View key={task.id} style={styles.itemContainer}>
            <View style={styles.rowContainer}>
              <View style={styles.leftContainer}>
                <Checkbox
                  status={task.completed ? 'checked' : 'unchecked'}
                  onPress={() => handleCheckboxToggle(task.id)}
                />
                <Text style={styles.title}>{task.title}</Text>
              </View>
              {renderDropdownMenu(task.id, task.title, task.onlyEdit)}
            </View>
            {task.description && (
              <Text style={styles.description}>{task.description}</Text>
            )}
            <View style={styles.selectedContainer}>
              {task.selectedDate && (
                <Text style={styles.dataText}>
                  {moment(task.selectedDate).format('MMM DD, YYYY HH:mm')}
                </Text>
              )}
              {task.selectedLabel && (
                <View style={styles.labelContainer}>
                  <LabelIcon color={color} size={size} />
                  <Text style={styles.labelText}>{task.selectedLabel}</Text>
                </View>
              )}
              {sharedTaskIds.includes(task.id) || collaborators.some((collaborator) => sharedTaskIds.includes(collaborator)) ? (
                <ShareIcon style={styles.shareIconContainer} size={size} color={color} />
              ) : null}
            </View>
          </View>
        ))}
      </ScrollView>

      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={1000}
      >
        Task completed
      </Snackbar>

      {renderCollaboratorsModal()}
      {renderEditModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  collaboratorEmail: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'left',
  },
  collaboratorInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    minHeight: 100,
    marginTop: 16,
  },
  collaboratorsModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  collaboratorsModalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    minWidth: 300,
  },
  collaboratorsModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  collaboratorsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    color: 'blue',
  },
  closeCollaboratorsModalButton: {
    backgroundColor: '#0b8043',
    padding: 12,
    borderRadius: 4,
    marginTop: 16,
    alignItems: 'center',
  },
  closeCollaboratorsModalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
  },
  dataText: {
    fontSize: 15,
    color: 'black',
    marginRight: 15,
  },
  description: {
    fontSize: 17,
    fontWeight: '500',
    marginTop: 5,
    marginBottom: 10,
  },
  dropdown: {
    height: 80,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    paddingTop: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    borderRadius: 12,
  },
  inviteCollaboratorModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  inviteCollaboratorModalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    minWidth: 300,
  },
  inviteCollaboratorModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  inviteCollaboratorButton: {
    backgroundColor: '#FF6F00',
    padding: 12,
    borderRadius: 25,
    marginTop: 16,
    alignItems: 'center',
  },
  inviteCollaboratorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemContainer: {
    marginBottom: 16,
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -2,
  },
  labelText: {
    fontSize: 15,
    color: 'black',
    marginLeft: 3,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  menu: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: 20,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  selectedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    marginTop: 10,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 2,
    shadowRadius: 1.9,
    elevation: 2,
  },
  selectedTextStyle: {
    fontSize: 20,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    marginTop: 35,
  },
  deadline: {
    fontSize: 16,
    alignItems: 'flex-end'
  },
  selectedLabel: {
    fontSize: 16,
    alignItems: 'flex-end',
    color: 'blue',

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
  editModalContainer: {
    flex: 1,
    paddingHorizontal: 35,
  },
  updateButton: {
    backgroundColor: 'blue',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 16,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#999999',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dropdownContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  dropdownModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
  },
  option: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
  },
});

export default HomeScreen;