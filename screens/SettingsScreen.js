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
 } from 'react-native';

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


const SettingsScreen = ({ navigation }) => {

    // authorization
    const auth = getAuth();
    const user = auth.currentUser;

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

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    switch(item.id) {

                        case 0: 
                            signOutUser();
                            break;

                        case 1:
                            navigation.navigate('CanvasUserImageScreen');
                            break;

                        case 2:
                            console.log('Settings');
                            break;

                        case 3:
                            console.log('App Info');
                            break;

                        case 4:
                            console.log('Report a Bug');
                            break;
                    }
                }}
                style={styles.menu}
            >
              <Text style={styles.menuText}>{item.text} {item.icon}</Text>
            </TouchableOpacity>
        );
    };

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

            <SafeAreaView style={{maxHeight: 400}}>
                <FlatList
                    data={menu}
                    renderItem={renderItem}
                />
            </SafeAreaView>

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
        alignItems: 'center',
    },

    // 'Signed in as [username]'
    title: {
        fontSize: 35,
        fontFamily: 'WorkSans_700Bold',
        textAlign: 'center',
        marginBottom: 20,
    },

    // menu buttons
    menu: {
        marginTop: 10,
        marginBottom: 10,
        borderColor: 'deepskyblue',
        borderRadius: 20,
        borderWidth: 2,
        paddingLeft: padOut,
        paddingRight: padOut,
    },

    // menu button text
    menuText: {
        fontSize: 30,
        fontFamily: 'WorkSans_700Bold',
        color: 'deepskyblue',
        textAlign: 'center',
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