import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const Home = () => {
  const navigation = useNavigation();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // APIからデータを取得
    const fetchHistoryData = async () => {
      try {
        // ダミーAPI呼び出し
        // const response = await axios.get('https://api.example.com/history'); // APIのURLを指定
        // setHistoryData(response.data);
        // ダミーデータを空にする
        setHistoryData([]);
      } catch (error) {
        console.error('Error fetching history data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Unlock Corneal Health with AI</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
          <Image source={require('../assets/bell.png')} style={styles.bellIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.uploadSection}>
        <View style={styles.uploadTextContainer}>
          <Text style={styles.uploadText}>Upload Corneal Image to AI for Diagnostic Prediction</Text>
          <TouchableOpacity style={styles.diagnosisButton} onPress={() => navigation.navigate('Diagnosis')}>
            <Text style={styles.diagnosisButtonText}>Diagnosis</Text>
          </TouchableOpacity>
        </View>
        <Image source={require('../assets/doctor.png')} style={styles.doctorImage} />
      </View>
      <View style={styles.historySection}>
        <Text style={styles.historyTitle}>Your History</Text>
        <TouchableOpacity onPress={() => navigation.navigate('History')}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>
      {historyData.length === 0 ? (
        <Text style={styles.noDataText}>No history data available.</Text>
      ) : (
        <FlatList
          data={historyData}
          horizontal
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <Image source={{ uri: item.image }} style={styles.historyImage} />
              <Text style={styles.historyStatus}>Definitive Diagnosis {item.status}</Text>
              <Text style={styles.historyDiagnosis}>AI Diagnosis: {item.diagnosis}</Text>
            </View>
          )}
          keyExtractor={item => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  bellIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  uploadSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4dd0e1', // 濃い水色
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  uploadTextContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  doctorImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginLeft: 16,
  },
  uploadText: {
    textAlign: 'left',
    marginBottom: 8,
    fontSize: 16,
  },
  diagnosisButton: {
    backgroundColor: '#1e90ff', // 薄い青色
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  diagnosisButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  historySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 16,
    color: '#007bff',
  },
  historyItem: {
    marginRight: 16,
  },
  historyImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  historyStatus: {
    fontWeight: 'bold',
  },
  historyDiagnosis: {
    color: '#555',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});

export default Home;