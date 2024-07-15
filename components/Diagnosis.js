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
  const [chiefComplaints, setChiefComplaints] = useState(['']);
  const [history, setHistory] = useState(['']);
  const [image, setImage] = useState(null);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [showSexPicker, setShowSexPicker] = useState(false);
  const [showEthnicityPicker, setShowEthnicityPicker] = useState(false);

  const addChiefComplaint = () => {
    setChiefComplaints([...chiefComplaints, '']);
  };

  const handleChiefComplaintChange = (text, index) => {
    const newChiefComplaints = [...chiefComplaints];
    newChiefComplaints[index] = text;
    setChiefComplaints(newChiefComplaints);
  };

  const handleDeleteChiefComplaint = (indexToDelete) => {
    setChiefComplaints(chiefComplaints.filter((_, index) => index !== indexToDelete));
  };

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
      const resizedUri = await resizeImage(result.assets[0].uri);
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

  const diagnose = async () => {
    const data = {
      age,
      sex,
      ethnicity,
      chiefComplaints,
      history,
      image,
    };

    // ダミーAPIへの送信
    const response = await fetch('https://dummyapi.io/data/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    setDiagnosisResult(result);
  };

  const saveData = async () => {
    const data = {
      age,
      sex,
      ethnicity,
      chiefComplaints,
      history,
      image,
    };

    // アプリ内保存
    const fileUri = `${FileSystem.documentDirectory}patient_data.json`;
    await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data));
    alert('Data saved successfully!');
  };

  return (
    <ScrollView style={styles.container}>
      {diagnosisResult ? (
        <>
          <View style={styles.section}>
            <Image source={{ uri: image }} style={styles.uploadedImage} />
            <View style={styles.diagnosisContainer}>
              <Text style={styles.diagnosisText}>Definitive Diagnosis: {diagnosisResult.definitiveDiagnosis || 'Pending'}</Text>
              <Text style={styles.diagnosisText}>AI Diagnosis: {diagnosisResult.aiDiagnosis}</Text>
              <Text style={styles.diagnosisText}>Posted on: {diagnosisResult.postedOn}</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Predicted Diagnosis by AI</Text>
            {diagnosisResult.predictedDiagnosis.map((item, index) => (
              <View key={index} style={styles.predictionContainer}>
                <Text style={styles.predictionText}>{item.type}: {item.percentage}%</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progress, { width: `${item.percentage}%` }]} />
                </View>
              </View>
            ))}
          </View>
        </>
      ) : (
        <>
          <View style={styles.section}>
		        <Text style={styles.sectionTitle}>Patient</Text>
		        <View style={styles.patientInfo}>
		          <Image style={styles.icon} source={require('../assets/doctor.png')} />
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
		              <Image style={styles.icon2} source={require('../assets/doctor.png')} />
		            </View>
		            <View style={styles.infoContainer2}>
		            <Text style={styles.subTitle}>Chief Complaint:</Text>
		            {chiefComplaints.map((item, index) => (
		              <View key={index} style={styles.historyInputContainer}>
		                <TextInput
		                  style={styles.input}
		                  placeholder="Right eye pain and significant vision loss."
		                  placeholderTextColor="#ccc"
		                  value={item}
		                  onChangeText={(text) => handleChiefComplaintChange(text, index)}
		                />
		                {chiefComplaints.length > 1 && (
		                  <TouchableOpacity onPress={() => handleDeleteChiefComplaint(index)} style={styles.deleteButton}>
		                    <Text style={styles.deleteButtonText}>×</Text>
		                  </TouchableOpacity>
		                )}
		              </View>
		            ))}
		            <TouchableOpacity onPress={addChiefComplaint}>
		              <Text style={styles.addButton}>+</Text>
		            </TouchableOpacity>
		              
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

          <View style={styles.section}>
		        <Text style={styles.sectionTitle}>Image</Text>
		        <View style={styles.icon3Container}>
		          <Image style={styles.icon3} source={require('../assets/doctor.png')} />
		        </View>
		        <View style={styles.uploadSection}>
		          <TouchableOpacity onPress={pickImage} style={styles.uploadContainer}>
		            <Icon name="search" size={24} color="#000000" style={styles.uploadIcon} />
		            <View style={styles.uploadTouchable}>
		              <Text style={styles.uploadInput}>Upload corneal image</Text>
		            </View>
		          </TouchableOpacity>
		          {image && (
		            <Image source={{ uri: image }} style={styles.uploadedImage} />
		          )}
		        </View>
		      </View>

          <View style={styles.saveButtonContainer}>
            <TouchableOpacity onPress={diagnose} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Diagnosis</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      <View style={styles.saveButtonContainer}>
        <TouchableOpacity onPress={saveData} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showSexPicker} transparent={true} animationType="slide">
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
            <Button title="Close" onPress={() => setShowSexPicker(false)} />
          </View>
        </View>
      </Modal>

      <Modal visible={showEthnicityPicker} transparent={true} animationType="slide">
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
              <Picker.Item label="Caucasian" value="Caucasian" />
              <Picker.Item label="African" value="African" />
              <Picker.Item label="Hispanic" value="Hispanic" />
            </Picker>
            <Button title="Close" onPress={() => setShowEthnicityPicker(false)} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
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
  icon3Container: {
    position: 'absolute',
    top: 30,
    left: 0,
  },
  icon3: {
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
  inlineInput: {
    height: 40,
    paddingLeft: 8,
    marginRight: 0,
    minWidth: 40,
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
    color: '#1e90ff',
    textAlign: 'center',
    marginTop: 8,
  },
  uploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  uploadIcon: {
    marginRight: 8,
  },
  uploadSection: {
    marginTop: 5,
    marginLeft: 0,
    alignItems: 'center',
  },
  uploadInput: {
    fontSize: 16,
  },
  uploadedImage: {
    width: 256,
    height: 256,
    resizeMode: 'contain',
    marginTop: 16,
  },
  saveButtonContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  saveButton: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 20,
    width: 200,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  diagnosisContainer: {
    marginBottom: 16,
  },
  diagnosisText: {
    fontSize: 16,
    marginBottom: 4,
  },
  predictionContainer: {
    marginBottom: 8,
  },
  predictionText: {
    fontSize: 14,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#1e90ff',
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
  icon3Container: {
    position: 'absolute',
    top: 30,
    left: 0,
  },
  icon3: {
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
    marginRight: 0,
    minWidth: 40,
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
    color: '#1e90ff',
    textAlign: 'center',
    marginTop: 8,
  },
  uploadSection: {
    marginTop: 5,
    marginLeft: 60,
    alignItems: 'center',
  },
  uploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  uploadIcon: {
    marginRight: 8,
  },
  uploadTouchable: {
    flex: 1,
  },
  uploadInput: {
    fontSize: 16,
  },
  uploadedImage: {
    width: 256,
    height: 256,
    resizeMode: 'contain',
    marginTop: 16,
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
  saveButtonContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  saveButton: {
    backgroundColor: '#1e90ff',
    padding: 10,
    borderRadius: 20,
    width: 200, // ボタンの幅を指定
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18, // 文字サイズを大きく
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default Diagnosis;