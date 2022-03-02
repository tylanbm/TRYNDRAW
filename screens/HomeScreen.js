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
    startAfter }
from 'firebase/firestore';

// import Ionicons icon library
import { Ionicons } from '@expo/vector-icons';

// make sure fonts are loaded
import AppLoading from 'expo-app-loading';

// Google Fonts
import { useFonts,
    WorkSans_700Bold,
    WorkSans_500Medium,
} from '@expo-google-fonts/work-sans';

// standardized button style
import FullButton from '../components/FullButton';


// get Firebase database and storage
const db = getFirestore();
const storage = getStorage();
const docsRef = collection(db, "uniqueImageNames");

// global variables
let last = 0;
let dragging = false;
let loading = false;

const HomeScreen = ({ navigation }) => {


    // user auth
    const user = auth.currentUser;
    const username = user.displayName;

    // icons
    const buttonIcon = <Ionicons
        name='arrow-forward'
        size={30}
        color='deepskyblue'
    />;

    // set up variables for image get
    const storage = getStorage();
    const [pic, setPic] = useState('');

    // array for FlatList of images
    const [getImgs, setImgs] = useState([]);

    // length of FlatList of images
    const getLength = getImgs.length;

    // check if the current snapshot is empty
    const [isEmpty, setIsEmpty] = useState(false);

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
        querySnapshot.forEach(async(item) => {

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
        })
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
        getDownload();
    }, []);

    // await async calls for getting img urls
    const getDownload = async() => {
        loading = true;
        let q = query(docsRef,
            orderBy('timestamp', 'desc'),
            where('imageAuthorUsername', '==', username),
            limit(2));
        let querySnapshot = await getDocs(q);
        last = await getURLs(querySnapshot);
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
                    onPress={() => navigation.navigate('Challenges')}
                    text={'Start drawing!'}
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


// global padding
let padGo = 10;

const styles = StyleSheet.create({

    // entire screen
    container: {
        flex: 1,
    },

    // profile image
    profile: {
        width: 80,
        aspectRatio: 1,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.25)',
        marginTop: 25,
        alignItems: 'center',
    },

    // 'Welcome back'
    title: {
        fontFamily: 'WorkSans_500Medium',
        textAlign: 'center',
        fontSize: 22,
        marginBottom: 20,
        color: 'rgba(43,43,40,1)',
    },

    // view style for the subtitle
    subView: {
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 8,
    },

    // 'My Drawings'
    subtitle: {
        fontSize: 32,
        flex: 2,
        fontFamily: 'WorkSans_500Medium',
        paddingLeft: padGo,
        textAlign: 'left',
        color: 'rgba(43,43,40,1)',
    },

    // 'View all' button
    viewDrawings: {
        flex: 1,
        paddingRight: padGo,
        position: 'absolute',
        bottom: 8,
        right: 0,
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
        marginLeft: '3%',
    },

    // image button
    touchable: {
        height: '99%',
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
        height: '30%',
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
    },
});