import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Button, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';

const Diagnosis = () => {
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('Male');
  const [ethnicity, setEthnicity] = useState('Asian');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [history, setHistory] = useState(['']);
  const [image, setImage] = useState(null);
  const [showSexPicker, setShowSexPicker] = useState(false);
  const [showEthnicityPicker, setShowEthnicityPicker] = useState(false);

  const addHistory = () => {
    setHistory([...history, '']);
  };

  const handleHistoryChange = (text, index) => {
    const newHistory = [...history];
    newHistory[index] = text;
    setHistory(newHistory);
  };

  const handleDeleteHistory = (indexToDelete) => {
    setHistory(history.filter((_, index) => index !== indexToDelete));
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      const resizedUri = await resizeImage(result.uri);
      setImage(resizedUri);
    }
  };

  const resizeImage = async (uri) => {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 256, height: 256 } }],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );
    return manipResult.uri;
  };

  const saveData = async () => {
    const data = {
      age,
      sex,
      ethnicity,
      chiefComplaint,
      history,
      image,
    };

    // ダミーAPIへの送信
    await fetch('https://dummyapi.io/data/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // アプリ内保存
    const fileUri = `${FileSystem.documentDirectory}patient_data.json`;
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data));
    alert('Data saved successfully!');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient</Text>
        <View style={styles.patientInfo}>
          <Image style={styles.icon} source={{ uri: 'https://via.placeholder.com/50' }} />
          <View style={styles.infoContainer}>
            <View style={styles.inlineContainer}>
              <Text style={styles.label}>Age:</Text>
              <TextInput
                style={styles.inlineInput}
                placeholder="Age"
                placeholderTextColor="#ccc"
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
              />
              <Text style={styles.label}>| Sex:</Text>
              <TouchableOpacity onPress={() => setShowSexPicker(true)} style={styles.pickerButton}>
                <Text style={styles.pickerButtonText}>{sex}</Text>
              </TouchableOpacity>
              <Text style={styles.label}>| Ethnicity:</Text>
              <TouchableOpacity onPress={() => setShowEthnicityPicker(true)} style={styles.pickerButton}>
                <Text style={styles.pickerButtonText}>{ethnicity}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Brief Note of the Medical History</Text>
        <View style={styles.medicalHistory}>
          <View style={styles.patientInfo}>
            <View style={styles.icon2Container}>
              <Image style={styles.icon2} source={{ uri: 'https://via.placeholder.com/50' }} />
            </View>
            <View style={styles.infoContainer2}>
              <Text style={styles.subTitle}>Chief Complaint:</Text>
              <TextInput
                style={styles.input}
                placeholder="Right eye pain and significant vision loss."
                placeholderTextColor="#ccc"
                value={chiefComplaint}
                onChangeText={setChiefComplaint}
              />
              <Text style={styles.subTitle}>History of Present Illness:</Text>
              {history.map((item, index) => (
                <View key={index} style={styles.historyInputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="The patient has been using soft contact lenses."
                    placeholderTextColor="#ccc"
                    value={item}
                    onChangeText={(text) => handleHistoryChange(text, index)}
                  />
                  {history.length > 1 && (
                    <TouchableOpacity onPress={() => handleDeleteHistory(index)} style={styles.deleteButton}>
                      <Text style={styles.deleteButtonText}>×</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              <TouchableOpacity onPress={addHistory}>
                <Text style={styles.addButton}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.uploadSection}>
        <View style={styles.uploadContainer}>
          <Icon name="camera" size={20} color="#888" style={styles.uploadIcon} />
          <TouchableOpacity onPress={pickImage} style={styles.uploadTouchable}>
            <TextInput
              style={styles.uploadInput}
              placeholder="Upload corneal image"
              editable={false}
              value={image ? "Image selected" : ""}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Button title="Save Data" onPress={saveData} />

      <Modal visible={showSexPicker} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Picker
              selectedValue={sex}
              onValueChange={(itemValue) => {
                setSex(itemValue);
                setShowSexPicker(false);
              }}
            >
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>
            <Button title="Cancel" onPress={() => setShowSexPicker(false)} />
          </View>
        </View>
      </Modal>

      <Modal visible={showEthnicityPicker} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Picker
              selectedValue={ethnicity}
              onValueChange={(itemValue) => {
                setEthnicity(itemValue);
                setShowEthnicityPicker(false);
              }}
            >
              <Picker.Item label="Asian" value="Asian" />
              <Picker.Item label="White" value="White" />
              <Picker.Item label="Black" value="Black" />
              <Picker.Item label="Hispanic" value="Hispanic" />
              <Picker.Item label="Native American" value="Native American" />
              <Picker.Item label="Pacific Islander" value="Pacific Islander" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
            <Button title="Cancel" onPress={() => setShowEthnicityPicker(false)} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  icon2Container: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  icon2: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 0,
  },
  infoContainer2: {
    flex: 1,
    marginLeft: 60,
  },
  inlineContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
  },
  label: {
    marginRight: 0,
    fontWeight: 'bold',
    fontSize: 12,
  },
  inlineInput: {
    height: 40,
    paddingLeft: 8,
    marginRight: 10,
    minWidth: 50,
    fontSize: 12,
  },
  pickerButton: {
    height: 40,
    justifyContent: 'center',
    marginRight: 10,
    minWidth: 0,
  },
  pickerButtonText: {
    color: 'black',
    fontSize: 12,
  },
  medicalHistory: {
    paddingLeft: 0,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  historyInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 8,
  },
  deleteButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: '#ff6b6b',
    borderRadius: 20,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    fontSize: 24,
    color: '#007BFF',
    textAlign: 'center',
    marginTop: 8,
  },
  uploadSection: {
    marginTop: 16,
  },
  uploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  uploadIcon: {
    padding: 10,
  },
  uploadTouchable: {
    flex: 1,
  },
  uploadInput: {
    height: 40,
    paddingLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default Diagnosis;