// import React, initialized variable state
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


const HomeScreen = ({ navigation }) => {
    
    // user auth
    const auth = getAuth();
    const user = auth.currentUser;

    // icons
    const buttonIcon = <Ionicons name='arrow-forward' size={35} color='deepskyblue' />;

    // get username
    let fullUser = user.email;
    const username = fullUser.substring(0, fullUser.indexOf('@'));

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

    return (
        <View style={styles.container}>
            <Image
                source={{uri: pic}}
                style={styles.img}
            />
            <Text style={styles.title}>
                Welcome back,{'\n'}
                {username}!
            </Text>
            <Text style={styles.subtitle}>Start Drawing!</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Challenges')}>
                <Text style={styles.buttonText}>Let's Go! {buttonIcon}</Text>
            </TouchableOpacity>
        </View>
    );
}

export default HomeScreen;


// global padding
let padGo = 10;

const styles = StyleSheet.create({

    // entire page
    container: {
        flex: 1,
        alignItems: 'center',
    },

    // welcome back
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },

    // 'Start Drawing!'
    subtitle: {
        fontSize: 35,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 70,
    },

    button: {
        marginTop: 10,
        borderColor: 'deepskyblue',
        borderRadius: 20,
        borderWidth: 2,
        paddingLeft: padGo,
        paddingRight: padGo,
    },

    buttonText: {
        fontSize: 35,
        fontWeight: 'bold',
        color: 'deepskyblue',
    },

    img: {
        width: 150,
        height: 150,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: 'grey',
        marginTop: 25,
    },
});