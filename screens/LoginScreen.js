import React, { useEffect, useState } from 'react';
import { StyleSheet,
    Dimensions,
    TextInput,
    View,
    Text,
    TouchableOpacity,
    Image } from 'react-native';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword,
    signInWithEmailAndPassword } from 'firebase/auth';

// make sure fonts are loaded
import AppLoading from 'expo-app-loading';

// Google Fonts
import { useFonts,
    WorkSans_700Bold,
} from '@expo-google-fonts/work-sans';
import FullButton from '../components/FullButton';


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
            <View style={{marginTop: 90}}/>
            <Text style={styles.title}>Log in</Text>
            <Text style={styles.subtitle}>Get back to drawing!</Text>
            <View style={{marginTop: 70}}/>
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

            <View style={{marginTop: 125}}/>

            <FullButton onPress={() => logInUser()} text={'Sign in'} backgroundColor={'#60B1B6'} textColor={'white'} borderColor={'transparent'}></FullButton>
            
            <View style={styles.subContainer}>
                <TouchableOpacity onPress={() =>navigation.navigate('SignUp')}>
                    <Text style={styles.textPoke1}>Don't have an account?</Text>
                    <Text style={styles.textPoke2}>Sign up today!</Text>
                </TouchableOpacity>
                
                
                <Image
                    style={styles.logo}
                    source={require('../assets/logo.png')}
                    />
            </View>

            
            
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.2)" />
            { /*<SignUpButton screenName={'Root'} /> */}
        </View>
    )
}

export default LoginScreen;


// full width of the window
let fullWidth = Dimensions.get('window').width;


const styles = StyleSheet.create({

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