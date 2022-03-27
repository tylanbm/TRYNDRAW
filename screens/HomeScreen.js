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
    TouchableOpacity
} from 'react-native';

// import account authentication
import { auth } from "../firebaseConfig";

// import firebase storage
import { getStorage,
    ref,
    getDownloadURL
} from 'firebase/storage';

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
    onSnapshot,
} from 'firebase/firestore';

// Google Fonts
import { useFonts,
    WorkSans_700Bold,
    WorkSans_500Medium,
} from '@expo-google-fonts/work-sans';

// make sure fonts are loaded
import AppLoading from 'expo-app-loading';

// button and image styles
import FullButton from '../components/FullButton';
import ImageButton from '../components/ImageButton';
import ProfileImage from '../components/ProfileImage';


// get Firebase database and storage
const db = getFirestore();
const storage = getStorage();
const docsRef = collection(db, "uniqueImageNames");

// profile image size
const size = '20%';


const HomeScreen = ({ navigation }) => {

    // user auth
    const user = auth.currentUser;
    const username = user.displayName;

    // set up image get
    const [pic, setPic] = useState('');

    // array for FlatList of images
    const [getImgs, setImgs] = useState([]);

    // length of FlatList of images
    const getLength = getImgs.length;

    // get and set profile pic from Firebase Storage
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

    // load images
    useEffect(() => {
        onSnapshot(query(docsRef,
            orderBy('timestamp', 'desc'),
            where('imageAuthorUsername', '==', username),
            limit(2)),
            { includeMetadataChanges: false },
            async(querySnapshot) => {
            
            // check if writes and type are both false
            const writes = querySnapshot.metadata.hasPendingWrites;
            let changeType = false;
            querySnapshot.docChanges().forEach((change) => {
                if (change.type == 'removed') {
                    changeType = true;
                }
            })
            console.log(writes + ' ' + changeType);

            // if both are false, refresh the images
            if (!writes && !changeType) {
                console.log('Change ' + new Date().getSeconds());
                setImgs([]);
                await getURLs(querySnapshot);
            }
            else console.log('Do not change ' + new Date().getSeconds());
        });
    }, []);

    const renderImg = ({ item }) => {
        return (
            <ImageButton
                navigation={navigation}
                screen={'Home'}
                url={item.url}
                id={item.id}
                name={item.name}
                touchable={styles.touchable}
                overlay={styles.overlay}
                imgText={styles.imgText}
                icon={null}
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
        <View style={{backgroundColor: 'white', flex:1}}>
            <View style={styles.container}>
                <View style={{alignItems: 'center'}}>
                    <ProfileImage
                        url={pic}
                        size={size}
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

                {getLength==0 && (
                    <View style={styles.flatPlace}>
                        <Text style={styles.textPlace}>
                            Loading your drawings...
                        </Text>
                    </View>
                )}

                {getLength>0 && (
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
        </View>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({

    // entire screen
    container: {
        flex: 1,
        marginHorizontal: '5%',
    },

    // 'Welcome back'
    title: {
        fontFamily: 'Medium',
        textAlign: 'center',
        fontSize: 22,
        marginBottom: '10%',
        color: '#2B2B28',
    },

    // view style for the subtitle
    subView: {
        flexDirection: 'row',
        marginVertical: '4%',
    },

    // 'My Drawings'
    subtitle: {
        fontSize: 32,
        flex: 2,
        fontFamily: 'Medium',
        alignSelf: 'flex-start',
        color: '#2B2B28',
    },

    // 'View all' button
    viewDrawings: {
        flex: 1,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        marginBottom: '2%',
    },

    // 'View all'
    viewAll: {
        fontSize: 20,
        color: '#60B1B6',
        fontFamily: 'Medium',
        textAlign: 'right',
    },

    // FlatList placeholder view
    flatPlace: {
        height: '31%',
        marginLeft: '3%',
    },

    // FlatList placeholder text
    textPlace: {
        marginTop: '20%',
        fontFamily: 'Medium',
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

    // view style of text overlayed on img
    overlay: {
        backgroundColor: 'rgba(149,175,178,0.8)',
        borderRadius: 5,
    },

    // text style of text overlayed on img
    imgText: {
        fontSize: 22,
        fontFamily: 'Medium',
        textAlign: 'center',
        color: 'white',
        marginHorizontal: '2%',
    },
});