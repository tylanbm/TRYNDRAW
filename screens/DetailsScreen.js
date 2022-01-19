// import react itself
import React from 'react';

// import styles and features
import { StyleSheet, Text, View } from 'react-native';

// make sure fonts are loaded
import AppLoading from 'expo-app-loading';

// Google Fonts
import { useFonts, WorkSans_700Bold } from '@expo-google-fonts/work-sans';


const DetailsScreen = ({ route }) => {

    // check if imported Google Fonts were loaded
    let [fontsLoaded] = useFonts({
        WorkSans_700Bold,
    });
    if (!fontsLoaded) return <AppLoading />;

    // slug from ChallengesScreen
    const paramKey = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Vote on this drawing! {paramKey}</Text>
        </View>
    );
}

export default DetailsScreen;


const styles = StyleSheet.create({

    // entire page
    container: {
        flex: 1,
        alignItems: 'center',
    },

    // page title
    title: {
        marginTop: 20,
        marginBottom: 20,
        fontSize: 35,
        fontFamily: 'WorkSans_700Bold',
        textAlign: 'center',
  },
});