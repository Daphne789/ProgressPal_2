import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Checkbox = ({ id, text: initialText, onDeleteCheckbox }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [text, setText] = useState(initialText || '');

  const handleCheckboxPress = () => {
    setIsChecked(!isChecked);
  };

  const handleDeleteKeyPress = () => {
    onDeleteCheckbox(id);
  };

  const handleBlur = () => {
    if (text === '') {
      handleDeleteKeyPress();
    }
  };

  const handleKeyPress = (event) => {
    if (event.nativeEvent.key === 'Backspace' && text === '') {
      handleDeleteKeyPress();
    }
  };

  const handleTextChange = (newText) => {
    setText(newText);
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={handleCheckboxPress}>
        <View
          style={{
            width: 24,
            height: 24,
            borderWidth: 2,
            borderRadius: 4,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: isChecked ? 'green' : 'gray',
          }}
        >
          {isChecked && <View style={{ backgroundColor: 'green', width: 12, height: 12, borderRadius: 2 }} />}
        </View>
      </TouchableOpacity>
      <TextInput
        style={{ marginLeft: 10, flex: 1, padding: 5 }}
        multiline
        value={text}
        placeholder="Enter text"
        onBlur={handleBlur}
        onKeyPress={handleKeyPress}
        onChangeText={handleTextChange}
      />
    </View>
  );
};

const AddCheckBoxText = ({ onCheckboxChange }) => {
  const [checkboxes, setCheckboxes] = useState([]);

  const handleAddCheckbox = (text = '') => {
    setCheckboxes([...checkboxes, { id: Date.now().toString(), text }]);
  };

  const handleDeleteCheckbox = (id) => {
    setCheckboxes((prevCheckboxes) =>
      prevCheckboxes.filter((checkbox) => checkbox.id !== id)
    );
  };

  const handleCheckboxTextChange = (id, newText) => {
    setCheckboxes((prevCheckboxes) => {
      const updatedCheckboxes = prevCheckboxes.map((checkbox) => {
        if (checkbox.id === id) {
          return { ...checkbox, text: newText };
        }
        return checkbox;
      });
      return updatedCheckboxes;
    });
    onCheckboxChange(updatedCheckboxes);
  };


  return (
    <View style={{ flex: 1, padding: 5 }}>
      {checkboxes.map((checkbox) => (
        <Checkbox
          key={checkbox.id}
          id={checkbox.id}
          text={checkbox.text}
          onDeleteCheckbox={handleDeleteCheckbox}
          onChangeText={(newText) => handleCheckboxTextChange(checkbox.id, newText)}
        />
      ))}
        <TouchableOpacity
          onPress={() => handleAddCheckbox()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'blue',
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderRadius: 25,
            marginLeft: 10,
            marginTop: 10,
            alignSelf: 'flex-start',


          }}
        >
          <Ionicons name="checkbox-outline" size={24} color="white" style={{ marginRight: 5 }} />
          <Text style={{ color: 'white', fontSize: 16, fontWeight: "bold", alignSelf: 'center' }}>Add Checkbox</Text>
        </TouchableOpacity>
      </View>
  )};

export default AddCheckBoxText;

