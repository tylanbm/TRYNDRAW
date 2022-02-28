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
    WorkSans_600Medium,
} from '@expo-google-fonts/work-sans';


// get Firebase database and storage
const db = getFirestore();
const storage = getStorage();
const docsRef = collection(db, "uniqueImageNames");

// global variables (set once per app reload)
const imgsToLoad = 10;
let q = query(docsRef, limit(1));
let querySnapshot = getDocs(q);
let last = 0;
let dragging = false;
let loading = false;

const HomeScreen = ({ navigation }) => {

    console.log('Hi');
    
    // user auth
    const user = auth.currentUser;
    const username = user.displayName;

    // icons
    const buttonIcon = <Ionicons name='arrow-forward' size={35} color='deepskyblue' />;

    // set up variables for image get
    const storage = getStorage();
    const [pic, setPic] = useState('');

    // array for FlatList of images
    const [getImgs, setImgs] = useState([]);

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
            const itemRef = ref(storage, 'testImages/' + item.id + '.jpg');
            
            // get data for img
            let img = {
                id: item.id,
                name: item.data().imageTitle,
                time: item.data().timestamp,
                url: await getDownloadURL(itemRef),
            }

            // append all images to end of list
            setImgs(getImgs => [...getImgs, img]);
        })

        let output = querySnapshot.docs[querySnapshot.docs.length-1];
        return output;
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
        q = query(docsRef,
            orderBy('timestamp', 'desc'),
            where('imageAuthorUsername', '==', username),
            limit(imgsToLoad));
        querySnapshot = await getDocs(q);
        last = await getURLs(querySnapshot);
        loading = false;
    }

    // load new imgs when halfway through FlatList
    const getMoreDownload = async() => {
        console.log('Loading more...');

        loading = true;

        q = query(docsRef,
            orderBy('timestamp', 'desc'),
            where('imageAuthorUsername', '==', username),
            startAfter(last),
            limit(imgsToLoad));
        querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            last = await getURLs(querySnapshot);
        }
        else if (querySnapshot.empty) {
            setIsEmpty(true);
        }

        loading = false;
    }

    const renderImg = ({ item }) => {
        const itemUrl = item.url;
        const id = item.id;

        return (
            <TouchableOpacity
                onPress={() => openPhoto(itemUrl,id)}
                style={styles.touchable}
            >
                <ImageBackground
                    source={{uri: item.url}}
                    style={styles.imgDimensions}
                    imageStyle={styles.imgStyle}
                    key={id}
                >
                    <View style={styles.textOverlay}>
                        <Text style={styles.imgText}>{item.name}</Text>
                    </View>
                </ImageBackground>
            </TouchableOpacity>
        );
    };

    // load more imgs when near end of list
    const handleOnEndReached = async() => {
        if (dragging && !isEmpty) {
            await getMoreDownload();
        }
    }

    // check if imported Google Fonts were loaded
    let [fontsLoaded] = useFonts({
       WorkSans_700Bold,
       WorkSans_600Medium,
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
                Welcome back{'\n'}
                {username}!
            </Text>

            <View style={{flexDirection: 'row', marginTop: 20}}>
                <Text style={styles.subtitle}>My Drawings</Text>
                <Text style={styles.viewAll}>View all</Text>
            </View>

            <SafeAreaView style={{maxHeight: 200}}>
                <FlatList
                    data={getImgs}
                    renderItem={renderImg}
                    horizontal={true}
                    onEndReached={async() => await handleOnEndReached()}
                    onEndReachedThreshold={0.5}
                    onScrollBeginDrag={() => {
                        dragging = true;
                    }}
                />
            </SafeAreaView>

            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Challenges')}>
                <Text style={styles.buttonText}>Start Drawing! {buttonIcon}</Text>
            </TouchableOpacity>
            
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

    // 'Welcome back'
    title: {
        fontFamily: 'WorkSans_600Medium',
        textAlign: 'center',
        fontSize: 24,
        marginBottom: 20,
        color: 'rgba(43,43,40,1)',
    },

    // 'My Drawings'
    subtitle: {
        fontSize: 35,
        flex: 2,
        fontFamily: 'WorkSans_600Medium',
        paddingLeft: padGo,
        paddingRight: padGo,
        textAlign: 'left',
    },

    // 'View all' link
    viewAll: {
        fontSize: 20,
        flex: 1,
        color: 'rgba(60,177,182,1)',
        fontFamily: 'WorkSans_700Bold',
        textAlign: 'right',
        position: 'absolute',
        bottom: 10,
        right: 0,
    },

    // 'Let's Go!' button
    button: {
        marginTop: 10,
        borderColor: 'deepskyblue',
        borderRadius: 20,
        borderWidth: 2,
        paddingLeft: padGo,
        paddingRight: padGo,
    },

    // 'Start Drawing!'
    buttonText: {
        fontSize: 35,
        fontFamily: 'WorkSans_700Bold',
        color: 'deepskyblue',
    },

    // profile image
    profile: {
        width: 94,
        aspectRatio: 1,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.25)',
        marginTop: 25,
        alignItems: 'center',
    },

    // image button
    touchable: {
        height: '100%',
        aspectRatio: 1,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 10,
    },

    // dimensions of images in FlatList
    imgDimensions: {
        width: '100%',
        aspectRatio: 1,
    },

    // images in FlatList
    imgStyle: {
        borderRadius: 10,
        borderColor: 'grey',
        borderWidth: 2,
    },

    // view style of text overlayed on img
    textOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(95,175,178,0.8)',
        borderRadius: 10,
    },

    // text style of text overlayed on img
    imgText: {
        fontSize: 20,
        fontFamily: 'WorkSans_700Bold',
        textAlign: 'center',
        color: 'white',
    }
});