import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Button, Modal, Alert, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';

const Result = ({ route }) => {
  const { data, resultText, imageUri } = route.params;
  const [probabilities, setProbabilities] = useState([]);
  const [labels, setLabels] = useState([]);
  const [predictedLabel, setPredictedLabel] = useState('');
  const [definitiveDiagnosis, setDefinitiveDiagnosis] = useState('Pending');
  const [diagnosisDate, setDiagnosisDate] = useState(new Date().toLocaleDateString());
  const [updateDate, setUpdateDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    try {
      const parsedResult = JSON.parse(resultText);
      setProbabilities(parsedResult.probabilities);
      setLabels(parsedResult.labels);
      setPredictedLabel(parsedResult.predicted_label);
    } catch (error) {
      console.error('結果のパースエラー:', error);
      Alert.alert('エラー', '結果の解析中にエラーが発生しました。デフォルトの結果を表示します。');
      setProbabilities([0.3834105432033539, 0.22888469696044922, 0.07231508940458298, 0.2709923982620239, 0.04439729079604149]);
      setLabels(["Acanthamoeba", "Bacterial", "Others", "Fungal", "Viral"]);
      setPredictedLabel("Acanthamoeba");
    }
  }, [resultText]);

  const sortedResults = labels.map((label, index) => ({
    label,
    probability: probabilities[index]
  })).sort((a, b) => b.probability - a.probability);

  // 'Others'を最後に移動
  const othersIndex = sortedResults.findIndex(item => item.label === 'Others');
  if (othersIndex !== -1) {
    const others = sortedResults.splice(othersIndex, 1)[0];
    sortedResults.push(others);
  }

  const maxProbability = Math.max(...probabilities);

  const handleDiagnosisChange = (value) => {
    setDefinitiveDiagnosis(value);
    if (value !== 'Pending') {
      setUpdateDate(new Date().toLocaleDateString());
    } else {
      setUpdateDate(null);
    }
    setModalVisible(false);
  };

  const saveResult = async () => {
    try {
      const newResult = { data, resultText, definitiveDiagnosis, diagnosisDate, updateDate, imageUri };
      const directory = `${FileSystem.documentDirectory}data/results/`;
      const fileName = `${directory}${Date.now()}.json`;

      // ディレクトリが存在しない場合は作成
      const dirInfo = await FileSystem.getInfoAsync(directory);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
      }

      await FileSystem.writeAsStringAsync(fileName, JSON.stringify(newResult));
      Alert.alert('保存成功', '結果が保存されました。');
      navigation.navigate('History');
    } catch (error) {
      console.error('保存エラー:', error);
      Alert.alert('エラー', '結果の保存中にエラーが発生しました。');
    }
  };

  const deleteResult = async () => {
    try {
      const directory = `${FileSystem.documentDirectory}data/results/`;
      const files = await FileSystem.readDirectoryAsync(directory);
      const jsonFiles = files.filter(file => file.endsWith('.json'));

      const fileToDelete = await Promise.all(
        jsonFiles.map(async (file) => {
          const content = await FileSystem.readAsStringAsync(`${directory}${file}`);
          const result = JSON.parse(content);
          return result.resultText === resultText ? `${directory}${file}` : null;
        })
      ).then(paths => paths.find(path => path !== null));

      if (fileToDelete) {
        await FileSystem.deleteAsync(fileToDelete);
        Alert.alert('削除成功', '結果が削除されました。');
        navigation.navigate('History');
      } else {
        Alert.alert('エラー', '削除対象の結果が見つかりませんでした。');
      }
    } catch (error) {
      console.error('削除エラー:', error);
      Alert.alert('エラー', '結果の削除中にエラーが発生しました。');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: data.image }} style={styles.uploadedImage} />
          <View style={styles.imageTextContainer}>
            <Text style={styles.imageText}>Definitive Diagnosis</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.diagnosisText}>{definitiveDiagnosis}</Text>
            </TouchableOpacity>
            <Text style={styles.imageText}>AI Diagnosis</Text>
            <Text style={styles.diagnosisText}>{predictedLabel}</Text>
            <Text style={styles.dateText}>Posted on {diagnosisDate}</Text>
            {updateDate && <Text style={styles.dateText}>Update on {updateDate}</Text>}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Predicted Diagnosis by AI</Text>
        <View style={styles.resultsContainer}>
          {sortedResults.map((item, index) => (
            <View key={index} style={styles.resultItem}>
              <View style={styles.labelContainer}>
                <Text style={styles.labelText}>{item.label}:</Text>
                <Text style={styles.probabilityText}>{(item.probability * 100).toFixed(0)}%</Text>
              </View>
              <View style={styles.barContainer}>
                <View
                  style={{
                    width: `${(item.probability / maxProbability) * 100}%`,
                    height: 20,
                    backgroundColor: 'lightblue',
                  }}
                />
              </View>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Patient</Text>
        <View style={styles.patientInfo}>
          <Image style={styles.icon} source={require('../assets/Patient.png')} />
          <View style={styles.infoContainer}>
            <View style={styles.inlineContainer}>
              <Text style={styles.label}>Age:</Text>
              <Text style={styles.inlineInput}>{data.age}</Text>
              <Text style={styles.label}>| Sex:</Text>
              <Text style={styles.inlineInput}>{data.sex}</Text>
              <Text style={styles.label}>| Ethnicity:</Text>
              <Text style={styles.inlineInput}>{data.ethnicity}</Text>
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
              {data.chiefComplaints.map((complaint, index) => (
                <View key={index} style={styles.historyInputContainer}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.complaintText}>{complaint}</Text>
               </View>
              ))}
              
              <Text style={styles.subTitle}>History of Present Illness:</Text>
              {data.history.map((item, index) => (
                <View key={index} style={styles.historyInputContainer}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.complaintText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.trashButton} onPress={deleteResult}>
          <Icon name="trash" size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={saveResult}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Picker
              selectedValue={definitiveDiagnosis}
              onValueChange={(itemValue) => handleDiagnosisChange(itemValue)}
            >
              <Picker.Item label="Pending" value="Pending" />
              <Picker.Item label="Acanthamoeba" value="Acanthamoeba" />
              <Picker.Item label="Bacterial" value="Bacterial" />
              <Picker.Item label="Fungal" value="Fungal" />
              <Picker.Item label="Viral" value="Viral" />
              <Picker.Item label="Others" value="Others" />
            </Picker>
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
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
        height: 15,
        paddingLeft: 8,
        marginRight: 3,
        minWidth: 40,
        fontSize: 13,
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
      complaintText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 16,
        paddingTop: 4,
        paddingLeft: 8,
        paddingVertical: 4,
      },      
      bulletPoint: {
        fontSize: 24,
        marginRight: 0,
        marginTop: -4,
      },
      input: {
        flex: 1,
        height: 18,
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 8,
        paddingTop: 8,
        paddingLeft: 8,
        outlineStyle: 'none',
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
      imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 10,
      },
      imageTextContainer: {
        flex: 1,
      },
      imageText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 0,
      },
      diagnosisText: {
        fontSize: 16,
        marginBottom: 8,
      },
      dateText: {
        fontSize: 12,
        marginBottom: 0,
        color: '#808080'
      },
      picker: {
        height: 50,
        width: 200,
      },
      uploadedImage: {
        width: 128,
        height: 128,
        borderRadius: 10,
        marginRight: 10,
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
      section: {
        marginBottom: 24,
      },
      sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
      },
      resultItem: {
        marginBottom: 10,
      },
      resultsContainer: {
        alignItems: 'center',
        width: '100%',
      },
      resultItem: {
        width: '80%',
        marginBottom: 10,
      },
      labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
      },
      labelText: {
        fontSize: 14,
      },
      probabilityText: {
        fontSize: 14,
        fontWeight: 'bold',
      },
      barContainer: {
        width: '100%',
        height: 20,
        backgroundColor: '#f0f0f0',
      },
      predictedLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
      },
      saveButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
      },
      saveButton: {
        backgroundColor: '#1e90ff',
        padding: 10,
        borderRadius: 20,
        width: 200,
        marginLeft: 10,
      },
      saveButtonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
      },
      trashButton: {
        backgroundColor: '#f0f0f0',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
      },
    });

export default Result;