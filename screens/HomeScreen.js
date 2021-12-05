import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { getAuth, signOut,onAuthStateChanged } from "firebase/auth";




function HomeScreen({navigation }) {
    




 const signOutUser = () => {
     signOut(auth).then(() => {
        // Sign-out successful.
        console.log("Signed Out")
        global.signedIn = false;
    }).catch((error) => {
        // An error happened.
    });
}

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            const uid = user.uid;
            global.signedIn = true;
            console.log("User currently signed in")

            return true;
            // ...
        } else {
            console.log("User not signed in")
            global.signedIn = false;
            return false;

            // User is signed out
            // ...
        }
    });
    
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>
            <Text>Hi there!</Text>
            <Button
                title="Go to Challenges"
                onPress={() => navigation.navigate('Challenges')}
            />
            <Text> </Text>
            <Button
                title="Sign Out"
                onPress={() => signOutUser()}
            />
        </View>
    );
}

export default HomeScreen

const styles = StyleSheet.create({})