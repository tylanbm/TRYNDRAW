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
    Image,
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
    startAt, } from 'firebase/firestore';

// make sure fonts are loaded
import AppLoading from 'expo-app-loading';

// Google Fonts
import { useFonts,
    WorkSans_700Bold,
} from '@expo-google-fonts/work-sans';


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

const uploadImg = async() => {
    // to be fixed
    const marioRef = ref(storage, 'gallery');
    const marioImgRef = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64, 0x21]);
    const metadata = { contentType: 'image/jpg' };
    uploadBytes(marioRef, marioImgRef, metadata).then(() => {
        console.log("Uploaded gallery file!");
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

//const q = query(messagesRef, orderBy('createdAt'), limit(5));
//const [messages] = useCollectionData(q);

const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
        <Text style={[styles.titleStyle, textColor]}>{item.specialAttack}</Text>
    </TouchableOpacity>
);



const GalleryScreen = ({navigation}) => {

    // array for FlatList of images
    const [getImgs, setImgs] = useState([]);

    const docsRef = collection(db, "uniqueImageNames");
    const imgsToLoad = 3;
    let q = query(docsRef, orderBy('timestamp', 'desc'));
    let querySnapshot = getDocs(q);
    let last = 0;

    const getURLs = async(querySnapshot, refresh) => {
        for await (const item of querySnapshot.docs) {
            // iterate through all testImages images
            const itemRef = ref(storage, 'testImages/' + item.id + '.jpg');
            
            // get data for img
            let img = {
                id: item.id,
                time: item.data().timestamp,
                url: await getDownloadURL(itemRef),
            }

            //console.log(item.id + ': ' + item.data().timestamp);

            if (!getImgs.some(obj => obj.id === img.id)) {

                // if first time loading gallery, append to end of list
                if (refresh) setImgs(getImgs => [img, ...getImgs]);

                // else, append to front of list
                else setImgs(getImgs => [...getImgs, img]);
            }
        }
        return querySnapshot.docs[querySnapshot.docs.length];
    }
                
     

    const sortImgs = async() => {
        
        const temp = getImgs;

        temp.sort((a,b) => {
            const timeA = a.time;
            const timeB = b.time;
            const dateTimeA = timeA.indexOf('T');
            const dateTimeB = timeB.indexOf('T');
    
            const dateA = new Date(timeA).valueOf();
            const dateB = new Date(timeB).valueOf();
            
            if (dateA > dateB) {
                return 1; // return -1 here for DESC order
            }
            return -1 // return 1 here for DESC Order
        });

        return temp;
    }

    // useEffect(() => {
    //     const getGetData = async() => {
    //         setData(await getData());
    //     }
    //     getGetData();
    // })

/*
    useEffect(() => {
        const getUpload = async() => {
            await uploadImg();
        }
        getUpload();
    }, [])*/

    // useEffect(() => {
    //     const getGetAll = async() => {
    //         setFireData(await getAllData());
    //     }
    //     getGetAll();
    // }, []);

    // load imgs when gallery screen visited
    const openPhoto = (imageSource, imageId) => {
        console.log("Yay!" + imageSource);
        navigation.navigate('Image', {
            imageSourceToLoad: imageSource.toString(),
            imageId: imageId.toString(),
        });
    }

    useEffect(() => {
        getDownload();
    }, []);

    // await async calls for getting img urls
    const getDownload = async() => {
        querySnapshot = await getDocs(q);
        last = await getURLs(querySnapshot, false);
    }

    // await async calls for getting img urls
    const getRefresh = async() => {
        q = query(docsRef, orderBy('timestamp', 'asc'));
        querySnapshot = await getDocs(q);
        last = await getURLs(querySnapshot, true);
    }

    const getMoreDownload = async() => {
        console.log(last);

        q = query(docsRef, orderBy('timestamp', 'desc'),
            startAt(last), limit(imgsToLoad));
        querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            last = await getURLs(querySnapshot);
        }
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
                <Image
                    source={{uri: item.url}}
                    style={styles.imgStyle}
                    key={id}
                />
            </TouchableOpacity>
        );
    };

    // refresh boolean state
    const [refreshing, setRefreshing] = useState(false);

    // when refreshing, get imgs from Firebase Storage
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getDownload();
        setRefreshing(false);
    }, []);

    const onViewRef = useRef((viewableItems) => {
        console.log('Half');
        //getMoreDownload();
    })
    //const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 })

    // check if imported Google Fonts were loaded
    let [fontsLoaded] = useFonts({
        WorkSans_700Bold,
    });
    if (!fontsLoaded) return <AppLoading />;

    return (
        <View style={{marginTop: 20}}>
            <SafeAreaView>
                <FlatList
                    data={getImgs}
                    renderItem={renderImg}
                    horizontal={false}
                    numColumns={2}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => getRefresh()}
                        />
                    }
                    onViewableItemsChanged={onViewRef.current}
                    viewabilityConfig={{
                        itemVisiblePercentThreshold: 50,
                    }}
                />
            </SafeAreaView>

            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.2)" />
        </View>
    )
}

export default GalleryScreen;


// global padding
let padGo = 10;

const styles = StyleSheet.create({

    // Database FlatList
    container1: {
        flexDirection: 'column',
        backgroundColor: "white",
    },

    // items in FlatList
    item: {
        padding: 8.5,
        marginVertical: 8,
        marginHorizontal: 2,
    },

    // title for Database
    titleStyle: {
        fontSize: 12,
    },

    // image button
    touchable: {
        width: '50%',
        aspectRatio: 1,
    },

    // images in FlatList
    imgStyle: {
        width: '100%',
        aspectRatio: 1,
    },
});