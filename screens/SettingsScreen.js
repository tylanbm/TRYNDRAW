// import React, initialized variable state, run async functions
import React, { useState, useEffect, } from 'react';

// import styles, text, view, buttons
import { StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity } from 'react-native';

// import authentication
import { getAuth,
    signOut,
    onAuthStateChanged } from 'firebase/auth';

// import firebase storage
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

// import icon libraries
import { Ionicons } from '@expo/vector-icons';

// make sure fonts are loaded
import AppLoading from 'expo-app-loading';

// Google Fonts
import { useFonts, WorkSans_700Bold } from '@expo-google-fonts/work-sans';


const SettingsScreen = () => {

    const auth = getAuth();
    const user = auth.currentUser;

    // set what the text says at the bottom of the screen
    const [textInfo, setTextInfo] = useState('');

    // set colours to button clicks
    const [iconColour1, setIconColour1] = useState('grey');
    const [iconColour2, setIconColour2] = useState('grey');
    const [iconColour3, setIconColour3] = useState('grey');
    const [buttonColour1, setButtonColour1] = useState('grey');
    const [buttonColour2, setButtonColour2] = useState('grey');
    const [buttonColour3, setButtonColour3] = useState('grey');

    // icons
    const exitIcon = <Ionicons name='exit-outline' size={35} color='deepskyblue' />;
    const heart1 = <Ionicons name='heart' size={20} color={iconColour1} />;
    const heart2 = <Ionicons name='heart' size={20} color={iconColour2} />;
    const heart3 = <Ionicons name='heart' size={20} color={iconColour3} />;

    // set up variables for image get
    const storage = getStorage();
    const [pic, setPic] = useState('');

    // get and set profile pic from firebase storage
    useEffect(() => {
        const getPic = async() => {
            let temp = await getDownloadURL(ref(storage, 'images/profilePic.jpg'));
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

    // check if imported Google Fonts were loaded
    let [fontsLoaded] = useFonts({
        WorkSans_700Bold,
    });
    if (!fontsLoaded) return <AppLoading />;
    
    return (
        <View style={styles.container}>
            <Image
                source={{uri: pic}}
                style={styles.img}
            />
            <Text style={styles.title}>
                Signed in as{'\n'}
                {'"'}{user.displayName}{'"'}
            </Text>
            <TouchableOpacity
                onPress={() => signOutUser()}
                style={styles.signout}
            >
                <Text style={styles.signoutText}>Sign Out {exitIcon}</Text>
            </TouchableOpacity>

            <View style={{marginTop: 50}}>

                <TouchableOpacity
                    onPress={() => {
                        setTextInfo('Edit your avatar.');
                        setButtonColour1('green');
                        setButtonColour2('grey');
                        setButtonColour3('grey');
                        setIconColour1('green');
                        setIconColour2('grey');
                        setIconColour3('grey');
                    }}
                    style={styles.button}
                    >
                    <Text style={[styles.menu, {color: buttonColour1}]}>Edit Avatar</Text>
                    <Text style={styles.icon}>{heart1}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    onPress={() => {
                        setTextInfo('This is an app where you can draw things.');
                        setButtonColour1('grey');
                        setButtonColour2('green');
                        setButtonColour3('grey');
                        setIconColour1('grey');
                        setIconColour2('green');
                        setIconColour3('grey');
                    }}
                    style={styles.button}
                    >
                    <Text style={[styles.menu, {color: buttonColour2}]}>App Info</Text>
                    <Text style={styles.icon}>{heart2}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        setTextInfo('Where is the bug?');
                        setButtonColour1('grey');
                        setButtonColour2('grey');
                        setButtonColour3('green');
                        setIconColour1('grey');
                        setIconColour2('grey');
                        setIconColour3('green');
                    }}
                    style={styles.button}
                    >
                    <Text style={[styles.menu, {color: buttonColour3}]}>Report a Bug</Text>
                    <Text style={styles.icon}>{heart3}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.info}>
                <Text>{textInfo}</Text>
            </View>

            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.2)" />
        </View>
    )
}

export default SettingsScreen;


// global padding
let padOut = 10;

const styles = StyleSheet.create({

    // entire screen
    container: {
        flex: 1,
        alignItems: 'center'
    },

    // 'Welcome back'
    title: {
        fontSize: 35,
        fontFamily: 'WorkSans_700Bold',
        textAlign: 'center',
        marginBottom: 20,
    },

    // 'Sign Out' button
    signout: {
        marginTop: 10,
        borderColor: 'deepskyblue',
        borderRadius: 20,
        borderWidth: 2,
        paddingLeft: padOut,
        paddingRight: padOut,
    },

    // 'Sign Out'
    signoutText: {
        fontSize: 35,
        fontFamily: 'WorkSans_700Bold',
        color: 'deepskyblue',
    },

    // menu buttons
    button: {
        flexDirection: 'row',
        width: '95%',
    },

    menu: {
        fontSize: 20,
        fontFamily: 'WorkSans_700Bold',
        marginBottom: 10,
    },

    // heart icon
    icon: {
        flex: 1,
        textAlign: 'right',
    },

    // info from button clicks
    info: {
        marginTop: 50,
        alignItems: 'center',
    },

    // profile image
    img: {
        width: 100,
        aspectRatio: 1,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'grey',
        marginTop: 25,
    },

    // light/dark mode
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});