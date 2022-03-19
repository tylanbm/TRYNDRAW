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
    writeBatch,
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

// button and image styles
import IonButton from '../components/IonButton';
import ImageButton from '../components/ImageButton';


// get Database and Storage
const db = getFirestore();
const storage = getStorage();

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
    const getURLs = async(queryArray) => {
        for (const item of queryArray) {

            // iterate through all testImages images
            const itemId = item.id;
            const itemRef = ref(storage, 'testImages/' + itemId + '.jpg');
            
            // get data for img
            let itemData = item.data();
            let img = {
                id: itemId,
                name: itemData.imageTitle,
                time: itemData.timestamp,
                url: await getDownloadURL(itemRef),
            }

            // append all images to end of list
            setImgs(getImgs => [...getImgs, img]);
        }
    }

    // delete an image from the FlatList
    const onDeleteObject = async(itemId) => {
        const itemRef = ref(storage, 'testImages/' + itemId + '.jpg');
        const docRef = doc(db, 'uniqueImageNames', itemId);

        // delete image from FlatList
        const tempImgs = [...getImgs];
        tempImgs.splice(itemId, 1);
        setImgs(tempImgs);

        // delete image data from database
        await deleteDoc(docRef);
        console.log('Deleted doc ' + itemId);

        // delete image from storage
        await deleteObject(itemRef);
        console.log('Deleted image ' + itemId);
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
        await getURLs(querySnapshot.docs);
        loading = false;
    }

    const renderImg = ({ item }) => {
        const itemId = item.id;

        return (
            <ImageButton
                navigation={navigation}
                url={item.url}
                id={itemId}
                name={item.name}
                touchable={styles.touchable}
                overlay={styles.overlay}
                imgText={styles.imgText}
                icon={<IonButton
                        name='trash-bin'
                        onPress={async() => await onDeleteObject(itemId)}
                        color='rgba(255,156,156,1)'
                        size={22}
                        style={styles.delete}
                    />
                }
            />
        );
    };

    // check if imported Google Fonts were loaded
    let [fontsLoaded] = useFonts({
        'Bold': WorkSans_700Bold,
        'Medium': WorkSans_500Medium,
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


const styles = StyleSheet.create({

    // entire page
    container: {
        flex: 1,
    },

    // title for Database
    titleStyle: {
        fontSize: 12,
    },

    // delete icon
    delete: {
        padding: 4,
        backgroundColor: 'white',
        borderRadius: 50,
        borderColor: 'rgba(255,156,156,1)',
        borderWidth: 1,
    },

    // image button
    touchable: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 5,
    },

    // view style of text overlayed on img
    overlay: {
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
        fontFamily: 'Medium',
        textAlign: 'left',
        color: 'white',
        paddingLeft: '2%',
        paddingTop: '1%',
    },
});