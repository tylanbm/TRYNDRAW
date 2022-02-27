import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react'

const FullButton = (props) => {
  
  return (
    <TouchableOpacity onPress={props.onPress} style={[styles.container, {backgroundColor:props.backgroundColor},{borderColor:props.borderColor}]}>
      <Text style={{color:props.textColor}}>{props.text}</Text>
    </TouchableOpacity>
  )
}

export default FullButton

const styles = StyleSheet.create({
  container: {
    padding:8,
    borderColor: 'white',
    backgroundColor: 'white',
    marginRight: 24,
    marginLeft: 24,
    borderRadius: 50,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  }
})