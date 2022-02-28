import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { generateSlug } from 'random-word-slugs';

// import account authentication
import { auth } from "../firebaseConfig";

const options = {
    format: 'title',
    partsOfSpeech: ['adjective', 'adjective', 'noun'],
}
const slug = generateSlug(3, options);
console.log(slug);

const DebugScreen = () => {
    
    const user = auth.currentUser;
    const username = user.displayName;
    console.log('Username: ' + username);

    return (
        <View>
            <Text>{slug}</Text>
        </View>
    )
}

export default DebugScreen;


const styles = StyleSheet.create({});