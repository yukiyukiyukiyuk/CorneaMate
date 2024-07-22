import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';

const History = () => {
  const [savedResults, setSavedResults] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadSavedResults = async () => {
      try {
        const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        const loadedResults = await Promise.all(
          jsonFiles.map(file => FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}${file}`).then(JSON.parse))
        );
        setSavedResults(loadedResults);
      } catch (error) {
        console.error('読み込みエラー:', error);
      }
    };

    loadSavedResults();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {savedResults.map((result, index) => (
        <TouchableOpacity key={index} style={styles.resultItem} onPress={() => navigation.navigate('Result', { ...result, resultText: result.resultText })}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: result.imageUri }} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.imageText}>Definitive Diagnosis: {result.definitiveDiagnosis}</Text>
              <Text style={styles.imageText}>AI Diagnosis: {result.predictedLabel}</Text>
              <Text style={styles.dateText}>Posted on {result.diagnosisDate}</Text>
              {result.updateDate && <Text style={styles.dateText}>Updated on {result.updateDate}</Text>}
            </View>
            <View style={styles.iconContainer}>
              {result.definitiveDiagnosis === 'Pending' ? (
                <Text style={styles.pendingIcon}>❗</Text>
              ) : (
                <Text style={styles.confirmedIcon}>✔️</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  resultItem: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  imageText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 12,
    color: '#808080',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingIcon: {
    fontSize: 24,
    color: 'red',
  },
  confirmedIcon: {
    fontSize: 24,
    color: 'green',
  },
});

export default History;