import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Diagnosis = () => {
  return (
    <View style={styles.container}>
      <Text>Diagnosis Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Diagnosis;