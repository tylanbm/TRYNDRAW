// import React itself, change const state, use async methods
import React,
    { useState,
    useEffect,
} from 'react';

// import React styles and features
import { StyleSheet,
    Text,
    View,
    ImageBackground,
    FlatList,
    SafeAreaView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';

// import Firebase storage
import { getStorage,
    ref,
    getDownloadURL,
    deleteObject,
} from 'firebase/storage';

// import Firestore docs
import { collection,
    getFirestore,
    getDocs,
    query,
    orderBy,
    where,
    limit,
    doc,
    deleteDoc,
} from 'firebase/firestore';

// import Ionicons icon library
import { Ionicons } from '@expo/vector-icons';

// import account authentication
import { auth } from "../firebaseConfig";

// make sure fonts are loaded
import AppLoading from 'expo-app-loading';

// Google Fonts
import { useFonts,
    WorkSans_700Bold,
    WorkSans_500Medium,
} from '@expo-google-fonts/work-sans';


// get Database and Storage
const db = getFirestore();
const storage = getStorage();

// icons
const deleteIcon = <Ionicons
    name='trash-bin'
    size={30}
    color='rgba(255,156,156,1)'
/>;


// global variables (set once per app reload)
const docsRef = collection(db, 'uniqueImageNames');
let q = query(docsRef, limit(1));
let querySnapshot = getDocs(q);
let loading = false;


const DrawingsScreen = ({ navigation }) => {

    // authorization
    const user = auth.currentUser;
    const username = user.displayName;

    // array for FlatList of images
    const [getImgs, setImgs] = useState([]);

    // initial load of gallery screen
    const getURLs = async(querySnapshot) => {
        for await (const item of querySnapshot.docs) {

            // iterate through all testImages images
            const itemId = item.id;
            const itemRef = ref(storage, 'testImages/' + itemId + '.jpg');
            
            // get data for img
            let img = {
                id: itemId,
                name: item.data().imageTitle,
                time: item.data().timestamp,
                url: await getDownloadURL(itemRef),
            }

            // append all images to end of list
            setImgs(getImgs => [...getImgs, img]);
        }
    }

    // load imgs when gallery screen visited
    const openPhoto = (imageSource, imageId) => {
        console.log("Yay!" + imageSource);
        navigation.navigate('Image', {
            imageSourceToLoad: imageSource.toString(),
            imageId: imageId.toString(),
        });
    }

    // delete an image from the FlatList
    const onDeleteObject = async(item, itemId) => {
        const itemRef = ref(storage, 'testImages/' + itemId + '.jpg');

        // delete image from FlatList
        let temp_imgs = [...getImgs];
        temp_imgs.splice(temp_imgs.indexOf(item), 1);
        setImgs(temp_imgs);

        // delete image data from database
        await deleteDoc(doc(db, 'uniqueImageNames', itemId.toString())).then(() => {
            console.log('Deleted doc ' + itemId);
        }).catch((error) => {
            console.log('Doc ' + itemId + ' error: ' + error.code);
        });

        // delete image from storage
        deleteObject(itemRef).then(() => {
            console.log('Deleted image ' + itemId);
        }).catch((error) => {
            console.log('Image ' + itemId + ' error: ' + error.code);
        });
    }

    // initial load
    useEffect(() => {
        getDownload();
    }, []);

    // await async calls for getting img urls
    const getDownload = async() => {
        loading = true;
        q = query(docsRef,
            orderBy('timestamp', 'desc'),
            where('imageAuthorUsername', '==', username));
        querySnapshot = await getDocs(q);
        await getURLs(querySnapshot);
        loading = false;
    }

    const renderImg = ({ item }) => {
        const itemUrl = item.url;
        const itemId = item.id;

        return (
            <TouchableOpacity
                onPress={() => openPhoto(itemUrl, itemId)}
                style={styles.touchable}
            >
                <ImageBackground
                    source={{uri: itemUrl}}
                    style={styles.imgDimensions}
                    imageStyle={styles.imgStyle}
                    key={itemId}
                >
                    <View style={styles.textOverlay}>
                        <Text
                            style={styles.imgText}
                            numberOfLines={2}
                        >{item.name}</Text>
                        <TouchableOpacity
                            onPress={async() => await onDeleteObject(item, itemId)}
                            style={styles.imgButton}
                        >
                            <Text
                                style={styles.deleteIcon}
                                numberOfLines={1}
                            >{deleteIcon}</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        );
    };

    // check if imported Google Fonts were loaded
    let [fontsLoaded] = useFonts({
        WorkSans_700Bold,
        WorkSans_500Medium,
    });
    if (!fontsLoaded) return <AppLoading />;


    return (
        <View style={styles.container}>
            <SafeAreaView>
                <FlatList
                    data={getImgs}
                    renderItem={renderImg}
                />
            </SafeAreaView>

            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.2)" />
        </View>
    )
}

export default DrawingsScreen;


// global padding
let padChal = 10;

const styles = StyleSheet.create({

    // entire page
    container: {
        flex: 1,
        marginTop: 20,
    },

    // title for Database
    titleStyle: {
        fontSize: 12,
    },

    // image button
    touchable: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 5,
    },

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
    textOverlay: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '10%',
        backgroundColor: 'rgba(149,175,178,0.8)',
        borderRadius: 5,
    },

    // text style of text overlayed on img
    imgText: {
        flex: 2,
        fontSize: 22,
        fontFamily: 'WorkSans_500Medium',
        textAlign: 'left',
        color: 'white',
        paddingLeft: 10,
        paddingTop: 5,
    },

    imgDelete: {
        flex: 1,
    },

    deleteIcon: {
        paddingRight: 5,
        paddingTop: 5,
        textAlign: 'right',
        justifyContent: 'center',
    },
});