import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'

const FullButton = (props) => {
  
  return (
    <TouchableOpacity onPress={props.onPress} style={[styles.container, {backgroundColor:props.backgroundColor},{borderColor:props.borderColor}]}>
      <Text style={[{color:props.textColor},{alignSelf: 'center'}]}>{props.text}</Text>
    </TouchableOpacity>
  );
};

export default FullButton;

const styles = StyleSheet.create({
  container: {
    borderColor: 'white',
    backgroundColor: 'white',
    borderRadius: 50,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
});