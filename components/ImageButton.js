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
    screen
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
    const screen = props.screen;
    const itemUrl = props.url;
    const itemId = props.id;
    const itemName = props.name;
    const icon = props.icon;

    // navigate to image's Image Screen
    const openPhoto = (imageSource, imageId, screen) => {
        console.log("Photo: " + imageSource);
        navigation.navigate('Image', {
            imageSourceToLoad: imageSource.toString(),
            imageId: imageId.toString(),
            screen: screen,
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
            onPress={() => openPhoto(itemUrl, itemId, screen)}
            style={props.touchable}
        >
            <ImageBackground
                source={{ uri: itemUrl }}
                style={styles.imgDimensions}
                imageStyle={styles.imgStyle}
                key={itemId}
            >
                <View style={{flex: 2,}}/>
                <View style={props.overlay}>
                    <Text
                        style={props.imgText}
                        numberOfLines={2}
                    >{itemName}</Text>
                    {icon!=null && (
                        <Text style={styles.icon}>{icon}</Text>
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
        flex: 1,
        borderRadius: 5,
        borderColor: 'grey',
        borderWidth: 1,
    },

    // delete icon
    icon: {
        marginTop: '1%',
        marginRight: '2%',
    },
});