import React, { useEffect, useState } from 'react';
import { StyleSheet,
    Dimensions,
    TextInput,
    TouchableOpacity,
    Image,
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
import FullButton from '../components/FullButton';


const db = getFirestore();

const setUsernameInDatabase = async (userUID, usernameInput) => {
    await setDoc(doc(db, "users", userUID), {
        userName: usernameInput,
    });
}


const SignUpScreen = ({navigation}) => {

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
            <View style={{marginTop: 90}}/>
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subtitle}>Get drawing right away!</Text>
            <View style={{marginTop: 70}}/>
            <Text style={styles.inputTitle}>Username</Text>
            <View style={[styles.inputContainer,{borderColor: borderUsername}]}>
                <TextInput
                    style={styles.inputText}
                    onChangeText={text => setUsername(text)}
                />
            </View>
            
            <Text style={styles.inputTitle}>Email</Text>
            <View style={[styles.inputContainer,
                {borderColor: borderEmail}]}>
                <TextInput
                    style={styles.inputText}
                    onChangeText={text => setEmail(text)}
                />
            </View>
            <Text style={styles.inputTitle}>Password</Text>
            <View style={[styles.inputContainer,
                {borderColor: borderPassword}]}>
                <TextInput
                    style={styles.inputText}
                    onChangeText={text => setPassword(text)}
                    secureTextEntry
                />
            </View>

            <View>
                <Text style={styles.error}>{errorMessage}</Text>
            </View>

            <View style={{marginTop: 50}}/>

            <FullButton onPress={() => register()} text={'Create account'} backgroundColor={'#60B1B6'} textColor={'white'} borderColor={'transparent'}></FullButton>
            
            <View style={styles.subContainer}>
                <TouchableOpacity onPress={() =>navigation.navigate('Login')}>
                    <Text style={styles.textPoke1}>Already have an account?</Text>
                    <Text style={styles.textPoke2}> Sign in</Text>
                </TouchableOpacity>
                
                
                <Image
                    style={styles.logo}
                    source={require('../assets/logo.png')}
                    />
            </View>
            
            

            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.2)" />
        </View>
    )
}

export default SignUpScreen;


// full width of screen
let fullWidth = Dimensions.get('window').width;


const styles = StyleSheet.create({

    // entire screen
    container: {
        flex:1,
        marginHorizontal: 24,
    },
    subContainer:{
        justifyContent: "center",
        alignContent:'center',
        alignItems: "center",
        marginTop: 20,
    },
    title: {
        fontSize: 32,
    },
    subtitle: {
        fontSize: 20, 
    },
    inputTitle: {
        fontSize: 14,
        color: "#4F4E4C",
        fontWeight: "bold",
        marginTop: 8,
        marginBottom: 2,
    },

    // light/dark mode
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },

    // text input
    inputContainer: {
        backgroundColor: '#ECECEC',
        borderRadius: 7,
        borderWidth: 1,
        padding: 0,
    },
    textPoke1: {
        fontSize: 14,
        color: "#7C8B8C",
    },
    textPoke2: {
        fontSize: 14,
        color: "#33999F",
        fontWeight: "bold",
        alignSelf: "center",
        marginBottom: 20,
    },

    // text within text input
    inputText: {
        width: '100%',
        paddingLeft: 8,
        height: 48,
    },
    logo: {
        width: 20,
        height: 20,
        
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
    },

    // 'SIGN UP'
    buttonText: {
        fontSize: 30,
        fontFamily: 'WorkSans_700Bold',
        color: 'white',
    },
});