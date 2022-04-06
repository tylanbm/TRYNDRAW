// import React, initialized variable state, run async functions
import React,
    { useState,
    useEffect, } from 'react';

// import styles, text, view, buttons
import { StyleSheet,
    Text,
    View,
    SafeAreaView,
    Image,
    TouchableOpacity,
    FlatList,
    Dimensions,
 } from 'react-native';

// import authentication
import { signOut } from 'firebase/auth';

// import account authentication
import { auth } from "../firebaseConfig";

// import Firestore docs
import { collection,
    doc,
    getFirestore,
    query,
    orderBy,
    where,
    limit,
    onSnapshot,
} from 'firebase/firestore';

// import firebase storage
import { getStorage,
    ref,
    getDownloadURL }
from 'firebase/storage';

// Google Fonts
import { useFonts,
    WorkSans_700Bold,
    WorkSans_500Medium,
} from '@expo-google-fonts/work-sans';

// make sure fonts are loaded
import AppLoading from 'expo-app-loading';

// button style
import FullButton from '../components/FullButton';


// get Database and Storage
const storage = getStorage();
const db = getFirestore();

// get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');


const SettingsScreen = ({ navigation }) => {

    // user auth
    const user = auth.currentUser;
    const username = user.displayName;
    const userId = user.uid;

    // set up image get
    const [pic, setPic] = useState('');
    const userRef = doc(db, 'users', userId);

    // get and set profile pic from firebase storage
    useEffect(() => {

        // listen to profile image change
        onSnapshot(query(userRef),
            { includeMetadataChanges: true },
            async(profileSnapshot) => {
            
            // check if there are no more pending writes
            const writes = profileSnapshot.metadata.hasPendingWrites;
            console.log('User settings ' + writes);

            // if no pending writes, update Home screen profile image
            if (!writes) {
                console.log('Change profile settings');

                // if profile image does not exist, use default profile image
                if (profileSnapshot.data().profileImageSet) {
                    const temp = await getDownloadURL(ref(storage,
                        'userProfileImages/' + user.uid));
                    setPic(temp);
                }
                else {
                    const temp = await getDownloadURL(ref(storage,
                    'userProfileImages/profileImage.jpg'));
                    setPic(temp);
                }
            }
            else console.log('Do not change profile settings');
        });
    }, []);

    // sign out button
    const signOutUser = () => {
        signOut(auth).then(() => {
            // Sign out successful.
            console.log('Signed out');
            global.signedIn = false;
        }).catch((error) => {
            // An error happened.
            console.log('Sign out error!');
        });
    }


    // check if imported Google Fonts were loaded
    let [fontsLoaded] = useFonts({
        'Bold': WorkSans_700Bold,
        'Medium': WorkSans_500Medium,
    });
    if (!fontsLoaded) return <AppLoading />;
    
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: pic }}
                style={styles.img}
            />
            <Text style={styles.title}>
                Signed in as{'\n'}
                {username}
            </Text>

            <View style={styles.buttons}>
                <FullButton
                    onPress={() => navigation.navigate('ProfilePictureEditor')}
                    text={'Edit profile picture'}
                    backgroundColor={'white'}
                    textColor={'#60B1B6'}
                    borderColor={'#60B1B6'}
                />
                
                {/* <View style={{marginTop: '0%'}}>
                    <FullButton onPress={() => console.log('App Info')} text={'App info'} backgroundColor={'#60B1B6'} textColor={'white'} borderColor={'transparent'}></FullButton>
                </View> */}

                <View style={{marginTop: '5%'}}>
                    <FullButton
                        onPress={() => signOutUser()}
                        text={'Sign out'}
                        backgroundColor={'#60B1B6'}
                        textColor={'white'}
                        borderColor={'transparent'}
                    />
                </View>
            </View>
            

            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.2)" />
        </View>
    )
}

export default SettingsScreen;


const styles = StyleSheet.create({

    // entire screen
    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    // buttons
    buttons: {
        flex: 1,
        marginHorizontal: '5%',
    },

    // 'Signed in as'
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginVertical: '2%',
    },


    // profile image
    img: {
        width: screenWidth,
        aspectRatio: 1,
        borderWidth: 1,
        borderColor: 'grey',
    },

    // light/dark mode
    separator: {
        marginVertical: '10%',
        height: 1,
        width: '80%',
    },
});