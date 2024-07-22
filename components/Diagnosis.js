import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Button, Modal, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const Diagnosis = () => {
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('Male');
  const [ethnicity, setEthnicity] = useState('Asian');
  const [chiefComplaints, setChiefComplaints] = useState(['']);
  const [history, setHistory] = useState(['']);
  const [image, setImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSexPicker, setShowSexPicker] = useState(false);
  const [showEthnicityPicker, setShowEthnicityPicker] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Camera permissions are required to use this feature.');
      }
    })();
  }, []);
  
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
      setShowModal(false);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const resizedUri = await resizeImage(result.assets[0].uri);
      setImage(result.assets[0].uri);
      setShowModal(false);
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

  const handleImageUpload = () => {
    setShowModal(true);
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

    // ダミーAPIへの送信
    let resultText;
    try {
      const response = await fetch('https://your-api-endpoint.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      resultText = await response.text();
      console.log('API Response:', resultText); // レスポンスを確認するためにログ出力

      // JSONとしてパースを試みる
      try {
        JSON.parse(resultText);
      } catch (parseError) {
        console.log('Response is not JSON, using default data');
        resultText = JSON.stringify({
          probabilities: [0.3834105432033539, 0.22888469696044922, 0.07231508940458298, 0.2709923982620239, 0.04439729079604149],
          labels: ["Acanthamoeba", "Bacterial", "Others", "Fungal", "Viral"],
          predicted_label: "Acanthamoeba"
        });
      }
    } catch (error) {
      console.error('APIエラー:', error);
      resultText = JSON.stringify({
        probabilities: [0.3834105432033539, 0.22888469696044922, 0.07231508940458298, 0.2709923982620239, 0.04439729079604149],
        labels: ["Acanthamoeba", "Bacterial", "Others", "Fungal", "Viral"],
        predicted_label: "Acanthamoeba"
      });
      Alert.alert('エラー', 'データの送信中にエラーが発生しました。デフォルトの結果を表示します。');
    }

    navigation.navigate('Result', { data, resultText });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient</Text>
        <View style={styles.patientInfo}>
          <Image style={styles.icon} source={require('../assets/Patient.png')} />
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
              <Image style={styles.icon2} source={require('../assets/Brief.png')} />
            </View>
            <View style={styles.infoContainer2}>
            <Text style={styles.subTitle}>Chief Complaint:</Text>
            {chiefComplaints.map((item, index) => (
              <View key={index} style={styles.historyInputContainer}>
                <Text style={styles.bulletPoint}>•</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Right eye pain and significant vision loss."
                  placeholderTextColor="#ccc"
                  value={item}
                  onChangeText={(text) => handleChiefComplaintChange(text, index)}
                  multiline={true}
                  numberOfLines={3}
                  returnKeyType="done"
                  blurOnSubmit={true}
                  textAlignVertical="top"
                  onContentSizeChange={(e) => {
                    const height = e.nativeEvent.contentSize.height;
                    if (height > 100) {
                      e.target.style.height = `${height}px`;
                    }
                  }}
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
                  <Text style={styles.bulletPoint}>•</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="The patient has been using soft contact lenses."
                    placeholderTextColor="#ccc"
                    value={item}
                    onChangeText={(text) => handleHistoryChange(text, index)}
                    multiline={true}
                    numberOfLines={3}
                    returnKeyType="done"
                    blurOnSubmit={true}
                    textAlignVertical="top"
                    onContentSizeChange={(e) => {
                      const height = e.nativeEvent.contentSize.height;
                      if (height > 100) {
                        e.target.style.height = `${height}px`;
                      }
                    }}
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
          <Image style={styles.icon3} source={require('../assets/Camera.png')} />
        </View>
        <View style={styles.uploadSection}>
          <TouchableOpacity onPress={handleImageUpload} style={styles.uploadContainer}>
            <Icon name="search" size={24} color="#000000" style={styles.uploadIcon} />
            <View style={styles.uploadTouchable}>
              <Text style={styles.uploadInput}>Upload corneal image</Text>
            </View>
          </TouchableOpacity>
          {image && (
            <Image source={{ uri: image }} style={styles.uploadedImage} />
          )}
          <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            onRequestClose={() => setShowModal(false)}
          >
            <View style={styles.modalContainer2}>
              <View style={styles.modalContent2}>
                <TouchableOpacity style={styles.modalButton} onPress={takePhoto}>
                  <Text style={styles.modalButtonText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={pickImage}>
                  <Text style={styles.modalButtonText}>Choose from Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={() => setShowModal(false)}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity onPress={saveData} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Diagnosis</Text>
        </TouchableOpacity>
      </View>

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
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  icon2Container: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  icon2: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  icon3Container: {
    position: 'absolute',
    top: 30,
    left: 0,
  },
  icon3: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    marginLeft: 10,
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
    marginTop: 0,
  },
  historyInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 0,
  },
  bulletPoint: {
    fontSize: 24,
    marginRight: 0,
    marginTop: 0,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingBottom: 0,
    borderRadius: 4,
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 8,
    paddingTop: 8,
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
    marginTop: 5,
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
  modalContainer2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent2: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    width: 250,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
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