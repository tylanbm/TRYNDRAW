import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { auth } from '../firebaseConfig'
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from "react-native";
import { TextInput } from 'react-native';
import { Button, View, Text } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const SignUpScreen = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
        })
        return unsubscribe
    }, [])

    const register = async () => {
        try {
            const user = await createUserWithEmailAndPassword(auth, email, password);
            console.log(user);
            console.log(email);

        } catch (error) {
            console.log(error.message);
            console.log(email);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.title1, styles.spacing]}>DART</Text>

            <Text style={[styles.title2, styles.spacing, styles.leftside]}>SIGN UP</Text>

            <View style={[styles.inputContainer]}>
                <TextInput
                    style={styles.input}
                    onChangeText={text => setEmail(text)}
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

export default SignUpScreen

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
