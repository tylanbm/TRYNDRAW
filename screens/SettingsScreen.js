import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

const SettingsScreen = () => {
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
            <Text>The settings screen</Text>
            <Button
                title="Sign Out"
                onPress={() => signOutUser()}
                
            />
        </View>
        
    )
}

export default SettingsScreen

const styles = StyleSheet.create({})
