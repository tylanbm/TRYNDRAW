// import react itself
import React from 'react';

// import styles and features
import { StyleSheet, Text, View } from 'react-native';


const DetailsScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Vote on this drawing!</Text>
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
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
  },
});