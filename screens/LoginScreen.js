import React, { useEffect, useState } from 'react';
import { StyleSheet,
    Dimensions,
    TextInput,
    View,
    Text,
    TouchableOpacity } from 'react-native';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword,
    signInWithEmailAndPassword } from 'firebase/auth';

// make sure fonts are loaded
import AppLoading from 'expo-app-loading';

// Google Fonts
import { useFonts,
    WorkSans_700Bold,
} from '@expo-google-fonts/work-sans';


const LoginScreen = ({ navigation }) => {

    // email and password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // email and password entry border colours
    const [borderEmail, setBorderEmail] = useState('black');
    const [borderPassword, setBorderPassword] = useState('black');

    // error message
    const [errorMessage, setErrorMessage] = useState('');

    //Check if user is logged in and return state
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {});
        return unsubscribe;
    }, []);
    
    // Register a new user
    const register = async () => {
        try {
            const user = await createUserWithEmailAndPassword(auth, email, password);
            console.log(user);
            console.log(email);
    
        } catch (error) {
            console.log('register error: ' + error.code);
            console.log(email);
        }  
    }
    
    // log user into account
    const logInUser = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {

            // Signed in 
            const user = userCredential.user;
            console.log("User signed in successfully!");
            
        }).catch((error) => {
            const errorCode = error.code;
            console.log('logInUser error: ' + errorCode);

            // error codes for the user
            switch (errorCode) {

                case 'auth/invalid-email':
                    setBorderEmail('red');
                    setBorderPassword('black');
                    setErrorMessage('Invalid email, please try another one.');
                    break;

                case 'auth/too-many-requests':
                    setBorderEmail('red');
                    setBorderPassword('red');
                    setErrorMessage('Tried logging in too many times. Please try logging in at a later time.');
                    break;

                case 'auth/user-not-found':
                    setBorderEmail('red');
                    setBorderPassword('black');
                    setErrorMessage('This user cannot be found, please try again.');
                    break;

                case 'auth/wrong-password':
                    setBorderEmail('black');
                    setBorderPassword('red');
                    setErrorMessage('Wrong password, please try again.');
                    break;
                    
                default:
                    setBorderEmail('black');
                    setBorderPassword('black');
                    setErrorMessage('Unknown error, cannot log in. Please make sure you entered your information correctly.');
                    break;
            }
        })
    }
    
    // check if imported Google Fonts were loaded
    let [fontsLoaded] = useFonts({
        WorkSans_700Bold,
    });
    if (!fontsLoaded) return <AppLoading />;


    return (
        <View style={styles.container}>
            <Text style={styles.title}>TRYNDRAW</Text>
            <Text style={styles.subtitle}>LOG IN</Text>

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
                style={[styles.button, {backgroundColor: 'dimgrey'}]}
                onPress={() => logInUser()}
            >
                <Text style={styles.buttonText}>LOG IN</Text>
            </TouchableOpacity>
            
            <Text style={styles.or}>----- or -----</Text>

            <TouchableOpacity
                style={[styles.button, {backgroundColor: 'blueviolet'}]}
                onPress={() => navigation.navigate('SignUp')}
            >
                <Text style={styles.buttonText}>JOIN</Text>
            </TouchableOpacity>
            
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.2)" />
            { /*<SignUpButton screenName={'Root'} /> */}
        </View>
    )
}

export default LoginScreen;


// full width of the window
let fullWidth = Dimensions.get('window').width;

// global padding
let pad = 10;

const styles = StyleSheet.create({

    // whole screen
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

    // 'LOG IN'
    subtitle: {
        fontSize: 30,
        fontFamily: 'WorkSans_700Bold',
        paddingTop: '10%',
        alignSelf: 'flex-start',
        paddingLeft: '5%',
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

    // 'LOGIN' and 'SIGN UP' buttons
    button: {
        backgroundColor: 'grey',
        borderColor: 'black',
        borderRadius: 10,
        borderWidth: 2,
        paddingLeft: pad,
        paddingRight: pad,
    },

    // 'LOGIN' and 'SIGN UP'
    buttonText: {
        fontSize: 25,
        fontFamily: 'WorkSans_700Bold',
        color: 'white',
    },

    // 'or' separator
    or: {
        marginTop: 20,
        marginBottom: 20,
        fontFamily: 'WorkSans_700Bold',
        fontSize: 20,
    },

    // light/dark mode
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});