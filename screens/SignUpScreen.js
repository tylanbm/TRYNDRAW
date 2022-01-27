import React, { useEffect, useState } from 'react';
import { StyleSheet,
    Dimensions,
    TextInput,
    TouchableOpacity,
    View,
    Text } from 'react-native';
import { auth } from '../firebaseConfig';
import { getAuth, updateProfile,
    createUserWithEmailAndPassword } from 'firebase/auth';

// import Firestore docs
import {
    collection,
    query,
    where,
    doc,
    setDoc,
    getFirestore,
    getDoc,
    getDocs,
} from 'firebase/firestore';

// make sure fonts are loaded
import AppLoading from 'expo-app-loading';

// Google Fonts
import { useFonts,
    WorkSans_700Bold,
} from '@expo-google-fonts/work-sans';


const db = getFirestore();

const setUsernameInDatabase = async (userUID, usernameInput) => {
    await setDoc(doc(db, "users", userUID), {
        userName: usernameInput,
    });
}


const SignUpScreen = () => {

    // username, email, password
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // username, email, password entry border colours
    const [borderUsername, setBorderUsername] = useState('black');
    const [borderEmail, setBorderEmail] = useState('black');
    const [borderPassword, setBorderPassword] = useState('black');

    // error message
    const [errorMessage, setErrorMessage] = useState('');
    

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {});
        return unsubscribe;
    }, [])

    const isUsernameAvailable = async(userNameInput) => {

        // edge case: username is a nonempty string
        if (userNameInput == '') {
            setBorderUsername('red');
            setBorderEmail('black');
            setBorderPassword('black');
            setErrorMessage('Please enter a username.');
            return false;
        }
    
        // Create a reference to the users collection
        const usersRef = collection(db, "users");
        // Create a query against the collection.
        const q = query(usersRef, where("userName", "==", userNameInput));
    
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            console.log(userNameInput + ' is available!');
            return true;
        
        } else {
            setBorderUsername('red');
            setBorderEmail('black');
            setBorderPassword('black');
            setErrorMessage('"' + userNameInput + '" is already taken, please try another username.');
            return false;
        }
    }

    const register = async() => {
        try {
            if (await isUsernameAvailable(username)) {
                
                // check is password is nonempty
                if (password == '') {
                    setBorderUsername('black');
                    setBorderEmail('black');
                    setBorderPassword('red');
                    setErrorMessage('Please enter a password.');
                } else {
                    const user = await createUserWithEmailAndPassword(auth, email, password);
            
                    updateProfile(auth.currentUser, {
                        displayName: username,
                    }).then(() => {
                        // Profile updated!
                        console.log("Display name is " + username);
                    }).catch((error) => {
                        console.log('updateProfile error: ' + error.code);
                    });
    
                    await setUsernameInDatabase(auth.currentUser.uid, username);
                    console.log(user);
                    console.log(email);
                    console.log(username);
                }
            }

        } catch (error) {
            const errorCode = error.code;
            console.log('register error: ' + errorCode);
            
            // all the possible different error codes
            switch(errorCode) {

                case 'auth/email-already-in-use':
                    setBorderUsername('black');
                    setBorderEmail('red');
                    setBorderPassword('black');
                    setErrorMessage('Email already in use, please try another one.');
                    break;

                case 'auth/internal-error':
                    setBorderUsername('red');
                    setBorderEmail('red');
                    setBorderPassword('red');
                    setErrorMessage('Internal error, please make sure you entered your information correctly.');
                    break;
                
                case 'auth/invalid-email':
                    setBorderUsername('black');
                    setBorderEmail('red');
                    setBorderPassword('black');
                    setErrorMessage('Invalid email, please enter a valid email address.');
                    break;

                case 'auth/missing-email':
                    setBorderUsername('black');
                    setBorderEmail('red');
                    setBorderPassword('black');
                    setErrorMessage('Missing email, please enter a valid email address.');
                    break;

                case 'auth/weak-password':
                    setBorderUsername('black');
                    setBorderEmail('black');
                    setBorderPassword('red');
                    setErrorMessage('Weak password, please use a stronger one.');
                    break;

                default:
                    setBorderUsername('black');
                    setBorderEmail('black');
                    setBorderPassword('black');
                    setErrorMessage('Unknown error, please make sure you entered your information correctly.');
                    break;
            }   
        }
    }

    // check if imported Google Fonts were loaded
    let [fontsLoaded] = useFonts({
        WorkSans_700Bold,
    });
    if (!fontsLoaded) return <AppLoading />;


    return (
        <View style={styles.container}>
            <Text style={styles.title}>TRYNDRAW</Text>

            <Text style={styles.subtitle}>JOIN</Text>

            <View style={[styles.inputContainer,
                {borderColor: borderUsername}]}>
                <TextInput
                    style={styles.inputText}
                    onChangeText={text => setUsername(text)}
                    placeholder="Username"
                />
            </View>

            <View style={[styles.inputContainer,
                {borderColor: borderEmail}]}>
                <TextInput
                    style={styles.inputText}
                    onChangeText={text => setEmail(text)}
                    placeholder="Email"
                />
            </View>
            <View style={[styles.inputContainer,
                {borderColor: borderPassword}]}>
                <TextInput
                    style={styles.inputText}
                    onChangeText={text => setPassword(text)}
                    placeholder="Password"
                    secureTextEntry
                />
            </View>

            <View>
                <Text style={styles.error}>{errorMessage}</Text>
            </View>

            <TouchableOpacity
                style={[styles.button, {backgroundColor: 'blueviolet'}]}
                onPress={() => register()}
            >
                <Text style={styles.buttonText}>SIGN UP</Text>
            </TouchableOpacity>

            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.2)" />
        </View>
    )
}

export default SignUpScreen;


// full width of screen
let fullWidth = Dimensions.get('window').width;

// global padding
let pad = 10;

const styles = StyleSheet.create({

    // entire screen
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // 'TRYNDRAW'
    title: {
        fontSize: 50,
        fontFamily: 'WorkSans_700Bold',
        marginTop: '10%',
    },

    // 'JOIN'
    subtitle: {
        fontSize: 30,
        fontFamily: 'WorkSans_700Bold',
        paddingTop: '10%',
        alignSelf: 'flex-start',
        paddingLeft: '5%',
    },

    // light/dark mode
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },

    // text input
    inputContainer: {
        marginTop: 20,
        maxWidth: fullWidth * 0.9,
        width: fullWidth * 0.9,
        backgroundColor: '#E5E5E5',
        borderRadius: 3.16,
        borderWidth: 2,
    },

    // text within text input
    inputText: {
        height: 40,
        padding: 10,
        width: '100%',
    },

    // error message
    error: {
        color: 'red',
        fontFamily: 'WorkSans_700Bold',
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'center',
    },

    // 'SIGN UP' button
    button: {
        backgroundColor: 'grey',
        borderColor: 'black',
        borderRadius: 10,
        borderWidth: 2,
        paddingLeft: pad,
        paddingRight: pad,
    },

    // 'SIGN UP'
    buttonText: {
        fontSize: 30,
        fontFamily: 'WorkSans_700Bold',
        color: 'white',
    },
});