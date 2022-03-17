// import all of React
import React from 'react';

// import styles
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';

// make sure fonts are loaded
import AppLoading from 'expo-app-loading';

// Google Fonts
import { useFonts,
    WorkSans_700Bold,
    WorkSans_500Medium,
} from '@expo-google-fonts/work-sans';


/* props:
    navigation
    url
    id
    name
    touchable
    overlay
    imgText
*/
const ImageButton = (props) => {

    // get const values
    const navigation = props.navigation;
    const itemUrl = props.url;
    const itemId = props.id;
    const itemName = props.name;
    const icon = props.icon;

    // load imgs when gallery screen visited
    const openPhoto = (imageSource, imageId) => {
        console.log("Photo: " + imageSource);
        navigation.navigate('Image', {
            imageSourceToLoad: imageSource.toString(),
            imageId: imageId.toString(),
        });
    }

    // check if imported Google Fonts were loaded
    let [fontsLoaded] = useFonts({
        'Bold': WorkSans_700Bold,
        'Medium': WorkSans_500Medium,
    });
    if (!fontsLoaded) return <AppLoading />;


    return (
        <TouchableOpacity
            onPress={() => openPhoto(itemUrl, itemId)}
            style={props.touchable}
        >
            <ImageBackground
                source={{uri: itemUrl}}
                style={styles.imgDimensions}
                imageStyle={styles.imgStyle}
                key={itemId}
            >
                <View style={props.overlay}>
                    <Text
                        style={props.imgText}
                        numberOfLines={2}
                    >{itemName}</Text>
                    {icon!=null && (
                        <Text>{icon}</Text>
                    )}
                </View>
            </ImageBackground>
        </TouchableOpacity>
    );
};

export default ImageButton;


const styles = StyleSheet.create({

    // dimensions of images in FlatList
    imgDimensions: {
        width: '100%',
        aspectRatio: 1,
    },

    // images in FlatList
    imgStyle: {
        borderRadius: 5,
        borderColor: 'grey',
        borderWidth: 1,
    },

    // view style of text overlayed on img
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        backgroundColor: 'rgba(149,175,178,0.8)',
        borderRadius: 5,
    },

    // text style of text overlayed on img
    imgText: {
        fontSize: 22,
        fontFamily: 'Medium',
        textAlign: 'center',
        color: 'white',
        marginLeft: '3%',
        marginRight: '3%',
    },
});