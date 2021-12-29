import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { getAuth, signOut,onAuthStateChanged } from "firebase/auth";

function HomeScreen({navigation }) {
    
    const auth = getAuth();
    const user = auth.currentUser;

    const signOutUser = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            console.log("Signed Out")
            global.signedIn = false;
        }).catch((error) => {
            // An error happened.
        });
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>
            <Text>Hi there {user.email}!</Text>
            <Button
                title="Start Drawing"
                onPress={() => navigation.navigate('Canvas')}
            />
            <Text> </Text>
        </View>
    );
}

export default HomeScreen

const styles = StyleSheet.create({})
