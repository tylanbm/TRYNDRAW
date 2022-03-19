import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ThicknessModal = () => {
  return (
    <View style={styles.container}>
      <View>
          <Text>Brush Thickness</Text>
      </View>
      <View>
          <Text>Circle</Text>
      </View>
      <View>
          <Text>Slider</Text>
      </View>
      
    </View>
  )
}

export default ThicknessModal

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: "#ffffff",
        borderRadius: 5,
        borderColor: '#60B1B6',
        borderWidth: 1
    },
    
})