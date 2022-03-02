// import React, initialized variable state, run async functions
import React, { useState, useEffect, } from 'react';

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

// import firebase storage
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

// import icon libraries
import { Ionicons } from '@expo/vector-icons';

// make sure fonts are loaded
import AppLoading from 'expo-app-loading';

// Google Fonts
import { useFonts, WorkSans_700Bold } from '@expo-google-fonts/work-sans';
import FullButton from '../components/FullButton';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');


const SettingsScreen = ({ navigation }) => {

    // authorization
    const user = auth.currentUser;
    const username = user.displayName;

    // icons
    const signoutIcon = <Ionicons name='exit-outline' size={30} color='deepskyblue' />;
    const editIcon = <Ionicons name='pencil' size={30} color='deepskyblue' />;
    const settingsIcon = <Ionicons name='settings' size={30} color='deepskyblue' />;
    const infoIcon = <Ionicons name='document-text' size={30} color='deepskyblue' />;
    const reportIcon = <Ionicons name='flag' size={30} color='deepskyblue' />;

    // set up variables for image get
    const storage = getStorage();
    const [pic, setPic] = useState('');

    // get and set profile pic from firebase storage
    useEffect(() => {
        const getPic = async() => {
            let temp = await getDownloadURL(ref(storage, 'userProfileImages/' + auth.currentUser.uid));
            setPic(temp.toString());
        }
        getPic();
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

    const menu = [
        {
            id: 0,
            text: 'Sign Out',
            icon: signoutIcon,
        },
        {
            id: 1,
            text: 'Edit Avatar',
            icon: editIcon,
        },
        {
            id: 2,
            text: 'Settings',
            icon: settingsIcon,
        },
        {
            id: 3,
            text: 'App Info',
            icon: infoIcon,
        },
        {
            id: 4,
            text: 'Report a Bug',
            icon: reportIcon,
        },
    ];


    // check if imported Google Fonts were loaded
    let [fontsLoaded] = useFonts({
        WorkSans_700Bold,
    });
    if (!fontsLoaded) return <AppLoading />;
    
    return (
        <View>
            <Image
                source={{uri: pic}}
                style={styles.img}
            />
            <Text style={styles.title}>
                Signed in as{'\n'}
                {username}
            </Text>

            <View style={styles.container}>
                <FullButton onPress={() => navigation.navigate('CanvasUserImageScreen')} text={'Edit profile picture'} backgroundColor={'white'} textColor={'#60B1B6'} borderColor={'#60B1B6'}></FullButton>
                <View style={{marginTop: 16}}/>

                <FullButton onPress={() => console.log('App Info')} text={'App info'} backgroundColor={'#60B1B6'} textColor={'white'} borderColor={'transparent'}></FullButton>
                <View style={{marginTop: 36}}/>
                
                <FullButton onPress={() => signOutUser()} text={'Sign out'} backgroundColor={'#60B1B6'} textColor={'white'} borderColor={'transparent'}></FullButton>
            
            </View>
            

            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.2)" />
        </View>
    )
}

export default SettingsScreen;

const styles = StyleSheet.create({

    container: {
        flex:1,
        marginHorizontal: 24,
    },

    // 'Signed in as [username]'
    title: {
        fontSize: 24,
     //   fontFamily: 'WorkSans_700Bold',
        textAlign: 'center',
        marginBottom: 12,
        marginTop: 12,
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
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});