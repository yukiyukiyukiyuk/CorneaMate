import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';

const countries = [
  { label: 'Japan', value: 'JP' },
  { label: 'United States', value: 'US' },
  { label: 'Canada', value: 'CA' },
  { label: 'United Kingdom', value: 'GB' },
  // 他の国も追加できます
];

const MyPageScreen = () => {
  const [username, setusername] = useState('kouta');
  const [name, setName] = useState('Kouta Ikeguchi');
  const [country, setCountry] = useState('JP');
  const [affiliation, setAffiliation] = useState('Doshisha');
  const [occupation, setOccupation] = useState('Ophthalmologist');
  const [experience, setExperience] = useState('0 ~ 5');
  const [image, setImage] = useState(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingCountry, setIsEditingCountry] = useState(false);
  const [isEditingAffiliation, setIsEditingAffiliation] = useState(false);
  const [isEditingOccupation, setIsEditingOccupation] = useState(false);
  const [isEditingExperience, setIsEditingExperience] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage}>
          <Image source={image ? { uri: image } : require('../assets/avatar.png')} style={styles.avatar} />
        </TouchableOpacity>
      
        {isEditingUsername ? (
          <TextInput
            style={[styles.username, styles.input]}
            value={username}
            onChangeText={setusername}
            onBlur={() => setIsEditingUsername(false)}
          />
        ) : (
          <TouchableOpacity onPress={() => setIsEditingUsername(true)}>
            <Text style={styles.username}>{username}</Text>
          </TouchableOpacity>
        )}
        
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name</Text>
          {isEditingName ? (
            <TextInput
              style={[styles.input, styles.textRight]}
              value={name}
              onChangeText={setName}
              onBlur={() => setIsEditingName(false)}
            />
          ) : (
            <TouchableOpacity onPress={() => setIsEditingName(true)} style={styles.touchable}>
              <Text style={[styles.value, styles.textRight]}>{name}</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Country</Text>
          {isEditingCountry ? (
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={(value) => {
                  setCountry(value);
                  setIsEditingCountry(false);
                }}
                items={countries}
                style={{
                  ...pickerSelectStyles,
                  inputIOS: [pickerSelectStyles.inputIOS, styles.textRight],
                  inputAndroid: [pickerSelectStyles.inputAndroid, styles.textRight],
                }}
                useNativeAndroidPickerStyle={false}
                placeholder={{}}
                value={country}
              />
            </View>
          ) : (
            <TouchableOpacity onPress={() => setIsEditingCountry(true)} style={styles.touchable}>
              <Text style={[styles.value, styles.textRight]}>{country}</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Affiliation</Text>
          {isEditingAffiliation ? (
            <TextInput
              style={[styles.input, styles.textRight]}
              value={affiliation}
              onChangeText={setAffiliation}
              onBlur={() => setIsEditingAffiliation(false)}
            />
          ) : (
            <TouchableOpacity onPress={() => setIsEditingAffiliation(true)} style={styles.touchable}>
              <Text style={[styles.value, styles.textRight]}>{affiliation}</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Occupation</Text>
          {isEditingOccupation ? (
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={(value) => {
                  setOccupation(value);
                  setIsEditingOccupation(false);
                }}
                items={[
                  { label: 'Ophthalmologist', value: 'Ophthalmologist' },
                  { label: 'Non-ophthalmologist (medical doctor)', value: 'Non-ophthalmologist (medical doctor)' },
                  { label: 'Nurse', value: 'Nurse' },
                  { label: 'Others', value: 'Others' },
                ]}
                style={{
                  ...pickerSelectStyles,
                  inputIOS: [pickerSelectStyles.inputIOS, styles.textRight],
                  inputAndroid: [pickerSelectStyles.inputAndroid, styles.textRight],
                }}
                useNativeAndroidPickerStyle={false}
                placeholder={{}}
                value={occupation}
              />
            </View>
          ) : (
            <TouchableOpacity onPress={() => setIsEditingOccupation(true)} style={styles.touchable}>
              <Text style={[styles.value, styles.textRight]}>{occupation}</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Experience</Text>
          {isEditingExperience ? (
            <View style={styles.pickerContainer}>
              <RNPickerSelect
                onValueChange={(value) => {
                  setExperience(value);
                  setIsEditingExperience(false);
                }}
                items={[
                  { label: '0 ~ 5', value: '0 ~ 5' },
                  { label: '5 ~ 10', value: '5 ~ 10' },
                  { label: '10 ~ 15', value: '10 ~ 15' },
                  { label: '15 ~ 20', value: '15 ~ 20' },
                  { label: '20+', value: '20+' },
                ]}
                style={{
                  ...pickerSelectStyles,
                  inputIOS: [pickerSelectStyles.inputIOS, styles.textRight],
                  inputAndroid: [pickerSelectStyles.inputAndroid, styles.textRight],
                }}
                useNativeAndroidPickerStyle={false}
                placeholder={{}}
                value={experience}
              />
            </View>
          ) : (
            <TouchableOpacity onPress={() => setIsEditingExperience(true)} style={styles.touchable}>
              <Text style={[styles.value, styles.textRight]}>{experience}</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity>
          <Text style={styles.logoutButton}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    alignItems: 'center',
    padding: 130,
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
    flex: 1, // 追加: コンテナを全体の高さに拡張
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    paddingRight: 0,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    width: '40%',
  },
  value: {
    fontSize: 16,
    width: '100%',
    textAlign: 'right',
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    width: '60%',
    textAlign: 'right',
  },
  textRight: {
    textAlign: 'right',
  },
  pickerContainer: {
    width: '60%',
    alignItems: 'flex-end',
  },
  touchable: {
    width: '60%',
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30,
    width: '100%',
    textAlign: 'right',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30,
    width: '100%',
    textAlign: 'right',
  },
});

export default MyPageScreen;








