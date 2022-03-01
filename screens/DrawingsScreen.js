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
} from 'firebase/storage';

// import Firestore docs
import { collection,
    getFirestore,
    getDocs,
    query,
    orderBy,
    where,
    limit,
} from 'firebase/firestore';

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


// global variables (set once per app reload)
const docsRef = collection(db, 'uniqueImageNames');
let q = query(docsRef, limit(1));
let querySnapshot = getDocs(q);
let last = 0;
let dragging = false;
let loading = false;


const DrawingsScreen = ({ navigation }) => {

    // authorization
    const user = auth.currentUser;
    const username = user.displayName;

    // array for FlatList of images
    const [getImgs, setImgs] = useState([]);

    // check if the current snapshot is empty
    const [isEmpty, setIsEmpty] = useState(false);

    // initial load of gallery screen
    const getURLs = async(querySnapshot) => {
        for await (const item of querySnapshot.docs) {

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
        }

        let output = querySnapshot.docs;
        return output[output.length-1];
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
            where('imageAuthorUsername', '==', username));
        querySnapshot = await getDocs(q);
        last = await getURLs(querySnapshot);
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

    const LoadingComponent = () => (
        <Text style={styles.footer}>Loading...</Text>
    );

    const EndOfListComponent = () => (
        <FullButton
            onPress={() => console.log('Scroll to top')}
            text={'End of gallery, tap to scroll to top!'}
            backgroundColor={'#60B1B6'}
            textColor={'white'}
            borderColor={'transparent'}>
        </FullButton>
    );


    return (
        <View style={styles.container}>
            <SafeAreaView>
                <FlatList
                    data={getImgs}
                    renderItem={renderImg}
                    ListFooterComponent={() => {
                        if (!isEmpty) return <LoadingComponent />
                        else return <EndOfListComponent />;
                    }}
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

    // refresh button
    refresh: {
        marginTop: 20,
        marginBottom: 10,
        borderColor: 'deepskyblue',
        borderRadius: 20,
        borderWidth: 2,
        paddingLeft: padChal,
        paddingRight: padChal,
    },

    // footer of FlatList
    footer: {
        fontSize: 20,
        fontFamily: 'WorkSans_500Medium',
        textAlign: 'center',
    },

    // view style of text overlayed on img
    textOverlay: {
        flex: 2,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '10%',
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