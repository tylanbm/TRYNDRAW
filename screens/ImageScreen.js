import { StyleSheet, Text, View, TouchableOpacity,Image, Dimensions } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ImageScreen = ({route, navigation}) => {
  
    //Url of image to load
  const {imageSourceToLoad} = route.params;
  
  return (
    <View>
        <Text>Username of Author</Text>
        
        <TouchableOpacity onPress={() => console.log("Touched photo")}>
            <Image
                source={{ uri: imageSourceToLoad }} style={styles.image}
            />
        </TouchableOpacity>
        <Text>Like Button</Text>
        <Text>Dislike Button</Text>

        <Text>Comments</Text>
    </View>
  );
};

export default ImageScreen;

const styles = StyleSheet.create({
    image: {
        width:screenWidth,
        height:screenWidth,
    }
});
