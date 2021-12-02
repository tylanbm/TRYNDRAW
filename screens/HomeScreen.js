import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { getAuth, signOut } from "firebase/auth";




function HomeScreen({route, navigation }) {
    
    const auth = getAuth();

 const signOutUser = () => {
     signOut(auth).then(() => {
        // Sign-out successful.
        console.log("Signed Out")
    }).catch((error) => {
        // An error happened.
    });
}
    const { user } = route.params;
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>
            <Text>Hi there {user.email}!</Text>
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