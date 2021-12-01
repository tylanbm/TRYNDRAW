import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { auth } from '../firebaseConfig'
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from "react-native";
import { TextInput } from 'react-native';
import { Button, View, Text } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation();

    
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.navigate("Home", { user })
            }
        })
        return unsubscribe
    }, [])
    
    
        const register = async () => {
        try {
            const user = await createUserWithEmailAndPassword(auth, email,password);
            console.log(user);
            console.log(email);
    
        } catch (error) {
            console.log(error.message);
            console.log(email);
        }  
    }

    const logInUser = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }
    

    return (
        <View style={styles.container}>
            <Text style={[styles.title1, styles.spacing]}>Art App</Text>

            <Text style={[styles.title2, styles.spacing, styles.leftside]}>LOG IN</Text>

            <View style={[styles.inputContainer]}>
                <TextInput
                    style={styles.input}
                    onChangeText={text => setEmail(text)}
                    placeholder="Email"
                />
            </View>
            <View style={[styles.inputContainer]}>
                <TextInput
                    style={styles.input}
                    onChangeText={text => setPassword(text)}
                    placeholder="Password"
                    secureTextEntry
                />
            </View>

            <View style={styles.spacing} />
            <Button
                title="Login"
                onPress={() => logInUser()}
            />
            <Text style={{ marginTop: 20, marginBottom: 20,}}>----- or -----</Text>
            <Button
                title="Sign Up"
                onPress={() => navigation.navigate('SignUp')}
            />
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.2)" />
            { /*<SignUpButton screenName={'Root'} /> */}
        </View>
    )
}

export default LoginScreen

let fullWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    title1: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    title2: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    spacing: {
        paddingTop: '10%',
    },
    leftside: {
        alignSelf: 'flex-start',
        paddingLeft: '5%'
    },
    spacing5: {
        paddingTop: '5%',
    }, input: {
        height: 40,
        padding: 10,
        width: '100%'

    },
    inputContainer: {
        marginTop: 20,
        maxWidth: fullWidth * 0.9,
        width: fullWidth * 0.9,
        backgroundColor: '#E5E5E5',
        borderRadius: 3.16,

    }


});
