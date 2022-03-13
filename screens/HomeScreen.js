// import React, initialized variable state, run async functions
import React, { useState, useEffect, } from 'react';

// import styles
import { StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    ImageBackground,
    FlatList,
    TouchableOpacity } from 'react-native';

// import account authentication
import { auth } from "../firebaseConfig";

// import firebase storage
import { getStorage,
    ref,
    getDownloadURL }
from 'firebase/storage';

// import Firestore docs
import { collection,
    doc,
    setDoc,
    getFirestore,
    getDoc,
    getDocs,
    query,
    orderBy,
    where,
    limit,
    onSnapshot, }
from 'firebase/firestore';

// make sure fonts are loaded
import AppLoading from 'expo-app-loading';

// Google Fonts
import { useFonts,
    WorkSans_700Bold,
    WorkSans_500Medium,
} from '@expo-google-fonts/work-sans';
import FullButton from '../components/FullButton';

// get Firebase database and storage
const db = getFirestore();
const storage = getStorage();
const docsRef = collection(db, "uniqueImageNames");


const HomeScreen = ({ navigation }) => {

    // user auth
    const user = auth.currentUser;
    const username = user.displayName;

    // set up variables for image get
    const storage = getStorage();
    const [pic, setPic] = useState('');

    // array for FlatList of images
    const [getImgs, setImgs] = useState([]);

    // length of FlatList of images
    const getLength = getImgs.length;

    // get and set profile pic from firebase storage
    useEffect(() => {
        const getPic = async() => {
            let temp = await getDownloadURL(ref(storage, 'userProfileImages/' + user.uid));
            setPic(temp.toString());
        }
        getPic();
    }, []);

    // initial load of My Drawings
    const getURLs = async(querySnapshot) => {
        for await (const item of querySnapshot.docs) {

            // iterate through all testImages images
            const itemId = item.id;
            const itemRef = ref(storage, 'testImages/' + itemId + '.jpg');
            
            // get data for img
            const itemData = item.data();
            const img = {
                id: itemId,
                name: itemData.imageTitle,
                time: itemData.timestamp,
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

    // initial load
    useEffect(() => {
        // const q = query(docsRef,
        //     orderBy('timestamp', 'desc'),
        //     where('imageAuthorUsername', '==', username),
        //     limit(2));
        
        const updateQuery = onSnapshot(query(docsRef,
            orderBy('timestamp', 'desc'),
            where('imageAuthorUsername', '==', username),
            limit(2)),
            { includeMetadataChanges: true },
            async(querySnapshot) => {
            const source = querySnapshot.metadata.hasPendingWrites ? "Local" : "Server";
            if (source == 'Server') {
                console.log(source + ' Update ' + new Date().getSeconds());
                setImgs([]);
                await getURLs(querySnapshot);
            }
            
        });
    }, []);

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
            <View style={{alignItems: 'center'}}>
                <Image
                    source={{uri: pic}}
                    style={styles.profile}
                />
            </View>

            <Text style={styles.title}>
                Welcome back,{'\n'}
                {username}!
            </Text>

            <View style={styles.subView}>
                <Text style={styles.subtitle}>My Drawings</Text>
                <TouchableOpacity
                    style={styles.viewDrawings}
                    onPress={() => navigation.navigate('My Drawings')}
                >
                    <Text style={styles.viewAll}>View all</Text>
                </TouchableOpacity>
            </View>

            {getLength == 0 && (
                <View style={styles.flatPlace}>
                    <Text style={styles.textPlace}>
                        Loading your drawings...
                    </Text>
                </View>
            )}

            {getLength > 0 && (
                <SafeAreaView style={styles.flatView}>
                    <FlatList
                        data={getImgs}
                        renderItem={renderImg}
                        horizontal={true}
                    />
                </SafeAreaView>
            )}
                
            <View style={{marginTop: '20%'}}>
                <FullButton
                    onPress={() => navigation.navigate('Drawing Selection')}
                    text={'Start drawing'}
                    backgroundColor={'#60B1B6'}
                    textColor={'white'}
                    borderColor={'transparent'}>
                </FullButton>
            </View>
            
            
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.2)" />
        </View>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({

    // entire screen
    container: {
        flex:1,
        marginHorizontal: '5%',
    },

    // profile image
    profile: {
        width: '20%',
        aspectRatio: 1,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.25)',
        marginTop: '5%',
        alignItems: 'center',
    },

    // 'Welcome back'
    title: {
        fontFamily: 'WorkSans_500Medium',
        textAlign: 'center',
        fontSize: 22,
        marginBottom: '10%',
        color: 'rgba(43,43,40,1)',
    },

    // view style for the subtitle
    subView: {
        flexDirection: 'row',
        marginTop: '5%',
        marginBottom: '4%',
    },

    // 'My Drawings'
    subtitle: {
        fontSize: 32,
        flex: 2,
        fontFamily: 'WorkSans_500Medium',
        textAlign: 'left',
        color: 'rgba(43,43,40,1)',
    },

    // 'View all' button
    viewDrawings: {
        flex: 1,
        position: 'absolute',
        bottom: 8,
        right: 5,
    },

    // 'View all'
    viewAll: {
        fontSize: 20,
        color: 'rgba(96,177,182,1)',
        fontFamily: 'WorkSans_500Medium',
        textAlign: 'right',
    },

    // FlatList placeholder view
    flatPlace: {
        height: '31.2%',
        marginLeft: '3%',
    },
    // 'Start Drawing!' button
    button: {
        borderColor: 'deepskyblue',
        borderRadius: 20,
        borderWidth: 2,
    },

    // FlatList placeholder text
    textPlace: {
        marginTop: '20%',
        fontFamily: 'WorkSans_500Medium',
        fontSize: 25,
        textAlign: 'center',
        justifyContent: 'center',
    },

    // FlatList view
    flatView: {
        maxHeight: '31.5%',
    },

    // image button
    touchable: {
        height: '98%',
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
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '35%',
        justifyContent: 'center',
        backgroundColor: 'rgba(149,175,178,0.8)',
        borderRadius: 5,
    },

    // text style of text overlayed on img
    imgText: {
        fontSize: 22,
        fontFamily: 'WorkSans_500Medium',
        textAlign: 'center',
        color: 'white',
        marginLeft: '3%',
        marginRight: '3%',
    },
});