import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { auth } from '../firebaseConfig'
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from "react-native";
import { TextInput } from 'react-native';
import { Button, View, Text } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';

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

const db = getFirestore();

const setUsernameInDatabase = async (userUID, usernameInput) => {
    await setDoc(doc(db, "users", userUID), {
        userName: usernameInput,
    });
}

const isUsernameAvailable = async (userNameInput) => {
    // Create a reference to the users collection
    const usersRef = collection(db, "users");
    // Create a query against the collection.
    const q = query(usersRef, where("userName", "==", userNameInput));

    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
        console.log(`${userNameInput} is available!`);
        return true
    } else {
        console.log(`${userNameInput} is already taken, please try something else.`);
        return false
    }
}


const SignUpScreen = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
        })
        return unsubscribe
    }, [])

    

    const register = async () => {
        try {
            
            if(await isUsernameAvailable(username)) {
            const user = await createUserWithEmailAndPassword(auth, email, password);
            
            
            
                updateProfile(auth.currentUser, {
                    displayName: username,
                }).then(() => {
                    // Profile updated!
                    console.log("Display name is " + username);
                }).catch((error) => {
                    // An error occurred
                    // ...
                });
            
            

            await setUsernameInDatabase(auth.currentUser.uid, username);
            console.log(user);
            console.log(email);
            console.log(username)
            } else {
                console.log("Username was not available")
            }

        } catch (error) {
            console.log(error.message);
            console.log(email);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.title1, styles.spacing]}>TRYNDRAW</Text>

            <Text style={[styles.title2, styles.spacing, styles.leftside]}>SIGN UP</Text>

            <View style={[styles.inputContainer]}>
                <TextInput
                    style={styles.input}
                    onChangeText={text => setUsername(text)}
                    placeholder="Username"
                />
            </View>

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
                title="Confirm signup"
                onPress={() => register()}
            />
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.2)" />
            
        </View>
    )
}

export default SignUpScreen;


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
    },
});