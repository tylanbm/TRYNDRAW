import { StyleSheet, Text, View, TouchableOpacity,Image, Dimensions } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import IonButton from '../components/IonButton';


const likeImage = () => {
    console.log("You liked the image");
}

const dislikeImage = () => {
    console.log("You disliked the image");
}

const reportImage = () => {
    console.log("You reported the image");
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ImageScreen = ({route, navigation}) => {
  
    //Url of image to load
  const {imageSourceToLoad} = route.params;
  
  return (
    <View>
        <View style={styles.imageHeaderContainer}>
            <Image
                source={{ uri: imageSourceToLoad }} style={styles.authorProfilePhoto}
            />
            <Text style={styles.authorNameText}>Username of Author</Text>
        </View>
        
        <View style={styles.imageContainer}>
            <TouchableOpacity onPress={() => console.log("Touched photo")}>
                <Image
                    source={{ uri: imageSourceToLoad }} style={styles.image}
                />
            </TouchableOpacity>
        </View>

        <View style={styles.imageFooterContainer}>
              <View style={styles.buttonContainer}>
                <IonButton name="heart" onPress={() => likeImage()} color="gray" style={styles.buttonContainer} />
              </View>
              <View style={styles.buttonContainer}>
                  <IonButton name="thumbs-down" onPress={() => dislikeImage()} color="gray" />
              </View>
              <View style={styles.reportButtonContainer}>
                  <IonButton name="flag" onPress={() => reportImage()} color="red" />
              </View>
        </View>

        <Text>Comments</Text>
    </View>
  );
};

export default ImageScreen;

const styles = StyleSheet.create({
    imageContainer: {
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderTopColor: 'gray',
        borderBottomColor: "gray",
    },
    image: {

        width:screenWidth,
        height:screenWidth+2,
    },
    imageHeaderContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
    },
    authorProfilePhoto: {
        marginLeft: 4,
        marginVertical: 4,
        borderRadius: 30,
        width: 36,
        height: 36,
        borderWidth: 1,
        borderColor: 'black',
    },
    authorNameText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: 'bold',
    },
    imageFooterContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
    },
    buttonContainer: {
        padding: 4,
    },
    reportButtonContainer: {
        padding: 4,
        marginLeft: "auto"
    }

});
