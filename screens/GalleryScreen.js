// import React itself, change const state, use async methods
import React, { useState,
    useEffect,
    useCallback,
    useRef, } from 'react';

// import Firebase storage
import { getStorage,
    ref,
    getDownloadURL,
    listAll,
    getMetadata, } from 'firebase/storage';

// import React styles and features
import { StyleSheet,
    Text,
    View,
    ImageBackground,
    FlatList,
    SafeAreaView,
    TouchableOpacity,
    RefreshControl, } from 'react-native';

// import Firestore docs
import { collection,
    doc,
    setDoc,
    getFirestore,
    getDoc,
    getDocs,
    query,
    orderBy,
    limit,
    startAt,
    startAfter } from 'firebase/firestore';

// make sure fonts are loaded
import AppLoading from 'expo-app-loading';

// Google Fonts
import { useFonts,
    WorkSans_700Bold,
    WorkSans_500Medium,
} from '@expo-google-fonts/work-sans';

// standardized button style
import FullButton from '../components/FullButton';


const db = getFirestore();
const storage = getStorage();
const galleryRef = collection(db,"gallery");
const docRef = doc(db, "gallery", "hello");

const setDataInDatabase = async() => {
    await setDoc(doc(db, "characters", "mario2"), {
        employment: "plumber",
        outfitColor: "red",
        specialAttack: "fireball",
    });
}

const getData = async() => {

    const docRef = doc(db, "characters", "mario");
    const docSnap = await getDoc(docRef);
    let returnVal = '';

    if (docSnap.exists()) {
        returnVal = String(docSnap.data().specialAttack.toString());
    } else {
        // doc.data() will be undefined in this case
        returnVal = "No document found!";
        console.log("No such document!");
    }
    return returnVal;
}

const getAllData = async() => {
    const docsRef = collection(db, "characters");
    const querySnapshot = await getDocs(docsRef);
    const tempData = [];
    
    if (querySnapshot != null) {
        querySnapshot.forEach((doc) => {
            let temp = {
                id: doc.data().id,
                specialAttack: doc.data().specialAttack,
            }
            tempData.push(temp);
        });
    } else {
        console.log("No such query snapshot!");
    }
    
    return tempData;
}

const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
        <Text style={[styles.titleStyle, textColor]}>{item.specialAttack}</Text>
    </TouchableOpacity>
);


// global variables (set once per app reload)
const docsRef = collection(db, "uniqueImageNames");
const imgsToLoad = 20;
let q = query(docsRef,
    orderBy('timestamp', 'desc'),
    limit(imgsToLoad));
let querySnapshot = getDocs(q);
let last = 0;
let dragging = false;
let loading = false;
let refreshing = false;

const GalleryScreen = ({ navigation }) => {

    // array for FlatList of images
    const [getImgs, setImgs] = useState([]);

    // check if the current snapshot is empty
    const [isEmpty, setIsEmpty] = useState(false);
// querySnapshot.forEach(async(item) => {
    // initial load of gallery screen
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

        let output = querySnapshot.docs;
        return output[output.length-1];
    }

    // const sortImgs = async() => {
        
    //     const temp = getImgs;

    //     temp.sort((a,b) => {
    //         const dateA = new Date(a.time).valueOf();
    //         const dateB = new Date(b.time).valueOf();
            
    //         if (dateA > dateB) {
    //             return 1; // return -1 here for DESC order
    //         }
    //         return -1 // return 1 here for DESC Order
    //     });

    //     return temp;
    // }

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
        querySnapshot = await getDocs(q);
        last = await getURLs(querySnapshot);
        loading = false;
    }

    // await async calls for getting img urls
    const getRefresh = async() => {
        if (!loading) {
            console.log('Refreshing...');

            dragging = false;
            loading = true;
            setIsEmpty(false);
            setImgs([]);

            q = query(docsRef,
                orderBy('timestamp', 'desc'),
                limit(imgsToLoad));
            querySnapshot = await getDocs(q);
            last = await getURLs(querySnapshot);

            loading = false;
        }
        else console.log('Cannot refresh at this time.');
    }

    // load new imgs when halfway through FlatList
    const getMoreDownload = async() => {
        console.log('Loading more...');

        loading = true;

        q = query(docsRef,
            orderBy('timestamp', 'desc'),
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

    const [selectedId, setSelectedId] = useState(null);

    const renderItem = ({ item }) => {
        const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#f9c2ff";
        const color = item.id === selectedId ? 'white' : 'black';

        return (
            <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
                <Text style={[styles.titleStyle, textColor]}>{item.specialAttack}</Text>
            </TouchableOpacity>
        );
    };

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

    // // when refreshing, get imgs from Firebase Storage
    // const onRefresh = useCallback(() => {
    //     refreshing = true;
    //     await getDownload();
    //     refreshing = false;
    // }, []);

    const handleOnEndReached = async() => {
        if (dragging && !isEmpty) {
            console.log('Load new');
            await getMoreDownload();
        }
        //console.log(isEmpty);
    }

    // check if imported Google Fonts were loaded
    let [fontsLoaded] = useFonts({
        WorkSans_700Bold,
        WorkSans_500Medium,
    });
    if (!fontsLoaded) return <AppLoading />;

    // when images are still loading
    const LoadingComponent = () => (
        <Text style={styles.footer}>Loading...</Text>
    );

    // reached the end of the list
    const EndOfListComponent = () => (
        <FullButton
            onPress={async() => await getRefresh()}
            text={'End of gallery, tap to refresh!'}
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
                    horizontal={false}
                    numColumns={2}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={async() => await getRefresh()}
                        />
                    }
                    onEndReached={async() => await handleOnEndReached()}
                    onEndReachedThreshold={0.5}
                    onScrollBeginDrag={() => {
                        dragging = true;
                    }}
                    ListFooterComponent={() => {
                        if (!isEmpty) return <LoadingComponent />
                        else return <EndOfListComponent />
                    }}
                />
            </SafeAreaView>

            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.2)" />
        </View>
    )
}

export default GalleryScreen;


// global padding
let padChal = 10;

const styles = StyleSheet.create({

    // entire page
    container: {
        flex: 1,
    },

    // Database FlatList
    // container1: {
    //     flexDirection: 'column',
    //     backgroundColor: "white",
    // },

    // items in old FlatList
    // item: {
    //     padding: 8.5,
    //     marginVertical: 8,
    //     marginHorizontal: 2,
    // },

    // title for Database
    titleStyle: {
        fontSize: 12,
    },

    // image button
    touchable: {
        width: '50%',
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
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '28%',
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