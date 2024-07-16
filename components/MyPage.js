import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {Picker} from '@react-native-picker/picker';

const MyPage = () => {
  const [name, setName] = useState('Yuki ');
  const [country, setCountry] = useState('Japan');
  const [affiliation, setAffiliation] = useState('Doshisha');
  const [occupation, setOccupation] = useState('Ophthalmologist');
  const [experience, setExperience] = useState('0 ~ 5');
  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.uri);
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage}>
          <Image source={image ? { uri: image } : require('../assets/avatar.png')} style={styles.avatar} />
        </TouchableOpacity>
        <Text style={styles.username}>Yuki</Text>
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name</Text>
          {isEditing ? (
            <TextInput style={styles.input} value={name} onChangeText={setName} />
          ) : (
            <Text style={styles.value} onPress={handleEdit}>{name}</Text>
          )}
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Country</Text>
          {isEditing ? (
            <Picker
              selectedValue={country}
              style={styles.picker}
              onValueChange={(itemValue) => setCountry(itemValue)}
            >
              <Picker.Item label="Select Country" value="" />
              <Picker.Item label="Japan" value="Japan" />
              <Picker.Item label="USA" value="USA" />
              <Picker.Item label="UK" value="UK" />
            </Picker>
          ) : (
            <Text style={styles.value} onPress={handleEdit}>{country}</Text>
          )}
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Affiliation</Text>
          {isEditing ? (
            <TextInput style={styles.input} value={affiliation} onChangeText={setAffiliation} />
          ) : (
            <Text style={styles.value} onPress={handleEdit}>{affiliation}</Text>
          )}
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Occupation</Text>
          {isEditing ? (
            <Picker
              selectedValue={occupation}
              style={styles.picker}
              onValueChange={(itemValue) => setOccupation(itemValue)}
            >
              <Picker.Item label="Select Occupation" value="" />
              <Picker.Item label="A" value="A" />
              <Picker.Item label="B" value="B" />
              <Picker.Item label="C" value="C" />
              <Picker.Item label="D" value="D" />
              <Picker.Item label="E" value="E" />
            </Picker>
          ) : (
            <Text style={styles.value} onPress={handleEdit}>{occupation}</Text>
          )}
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Experience</Text>
          {isEditing ? (
            <Picker
              selectedValue={experience}
              style={styles.picker}
              onValueChange={(itemValue) => setExperience(itemValue)}
            >
              <Picker.Item label="Select Experience" value="" />
              <Picker.Item label="Occupation" value="Occupation" />
              <Picker.Item label="Ophthalmologist" value="Ophthalmologist" />
              <Picker.Item label="Non-ophthalmologist (medical doctor)" value="Non-ophthalmologist (medical doctor)" />
              <Picker.Item label="Nurse" value="Nurse" />
              <Picker.Item label="Others" value="Others" />
            </Picker>
          ) : (
            <Text style={styles.value} onPress={handleEdit}>{experience}</Text>
          )}
        </View>
        <TouchableOpacity onPress={handleEdit}>
          <Text style={styles.editButton}>{isEditing ? 'Save' : 'Change'}</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.logoutButton}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#87CEEB',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  infoContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    marginTop: -20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  picker: {
    height: 50,
    width: 150,
  },
  editButton: {
    color: 'blue',
    textAlign: 'right',
    marginTop: 10,
  },
  logoutButton: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MyPage;