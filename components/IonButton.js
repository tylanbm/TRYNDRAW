import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

const IonButton = (props) => {
  return (
      
      <TouchableOpacity onPress={props.onPress} style={props.style}>
          <Ionicons name={props.name} size={24} color={props.color} />
      </TouchableOpacity>
  );
};

export default IonButton;

const styles = StyleSheet.create({
  container:{
    backgroundColor: 'white',
    borderRadius: 300,
    borderWidth: 0,
  }
});
