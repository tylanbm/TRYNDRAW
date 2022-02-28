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


    // user auth
    const user = auth.currentUser;
    const username = user.displayName;

    // icons
    const buttonIcon = <Ionicons
        name='arrow-forward'
        size={30}
        color='deepskyblue' />;

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
                    onPress={() => console.log('My Drawings')}
                >
                    <Text style={styles.viewAll}>View all</Text>
                </TouchableOpacity>
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
        paddingRight: padGo,
        textAlign: 'left',
        color: 'rgba(43,43,40,1)',
    },

    // 'View all' button
    viewDrawings: {
        flex: 1,
        position: 'absolute',
        bottom: 10,
        right: 0,
    },

    // 'View all'
    viewAll: {
        fontSize: 20,
        color: 'rgba(96,177,182,1)',
        fontFamily: 'WorkSans_500Medium',
        textAlign: 'right',
    },

    // 'Start Drawing!' button
    button: {
        marginTop: 90,
        borderColor: 'deepskyblue',
        borderRadius: 20,
        borderWidth: 2,
        paddingLeft: padGo,
        paddingRight: padGo,
    },

    // 'Start Drawing!'
    buttonText: {
        fontSize: 30,
        fontFamily: 'WorkSans_700Bold',
        color: 'deepskyblue',
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

    // image button
    touchable: {
        height: '100%',
        aspectRatio: 1,
        marginLeft: 10,
        marginRight: 10,
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
        alignItems: 'center',
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