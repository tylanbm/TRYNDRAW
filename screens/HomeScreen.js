// import React, initialized variable state, run async functions
import React, { useState, useEffect, } from 'react';

// import styles
import { StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity } from 'react-native';

// import auth and account
import { getAuth,
    onAuthStateChanged } from 'firebase/auth';

// import firebase storage
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

// import Ionicons icon library
import { Ionicons } from '@expo/vector-icons';

// make sure fonts are loaded
import AppLoading from 'expo-app-loading';

// Google Fonts
import { useFonts,
    WorkSans_700Bold,
} from '@expo-google-fonts/work-sans';


const HomeScreen = ({ navigation }) => {
    
    // user auth
    const auth = getAuth();
    const user = auth.currentUser;

    // icons
    const buttonIcon = <Ionicons name='arrow-forward' size={35} color='deepskyblue' />;

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
                Welcome back,{'\n'}
                {user.displayName}!
            </Text>
            <Text style={styles.subtitle}>Start Drawing!</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Challenges')}>
                <Text style={styles.buttonText}>Let's Go! {buttonIcon}</Text>
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
        alignItems: 'center',
    },

    // welcome back
    title: {
        fontFamily: 'WorkSans_700Bold',
        textAlign: 'center',
        fontSize: 35,
        marginBottom: 20,
    },

    // 'Start Drawing!'
    subtitle: {
        fontSize: 35,
        fontFamily: 'WorkSans_700Bold',
        textAlign: 'center',
        marginTop: 70,
    },

    // 'Let's Go!' button
    button: {
        marginTop: 10,
        borderColor: 'deepskyblue',
        borderRadius: 20,
        borderWidth: 2,
        paddingLeft: padGo,
        paddingRight: padGo,
    },

    // 'Let's Go!'
    buttonText: {
        fontSize: 35,
        fontFamily: 'WorkSans_700Bold',
        color: 'deepskyblue',
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
});