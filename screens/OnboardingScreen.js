import { StyleSheet, Text, View, Image,Dimensions, ImageBackground,TouchableOpacity } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { NativeModules } from 'react-native';
import {  } from '@expo-google-fonts/work-sans';

import AppLoading from 'expo-app-loading';
import { useFonts, WorkSans_700Bold,WorkSans_100Thin, WorkSans_300Light } from '@expo-google-fonts/work-sans';
import FullButton from '../components/FullButton';
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');



const { StatusBarManager } = NativeModules;
const height = StatusBarManager.HEIGHT;

const OnboardingScreen = ({navigation}) => {
    
    const TestButton = () => {
        console.log('Yay!'); 
    }

    let [fontsLoaded] = useFonts({
        WorkSans_700Bold,
        WorkSans_100Thin,
        WorkSans_300Light
    });
    if (!fontsLoaded) return <AppLoading />;
  
    return (
      <View style={styles.container2}>
        <View style={styles.container}>
            <View style={styles.container_row}>
                <Image
                style={styles.logo}
                source={require('../assets/logo.png')}
                />
                <Text style={styles.logoText}>TRYNDRAW</Text>
            </View>  
            
            <Text style={styles.bigText}>Billions of hilarious scenarios to draw.</Text>
            <Text style={styles.smallText}>Down to try?</Text> 
        </View>
        
        <ImageBackground
              style={styles.vector}
              source={require('../assets/vector.png')}
        >
            <View style={styles.buttonContainer}>
                <FullButton onPress={() =>navigation.navigate('SignUp')} text={'Sign up'} backgroundColor={'white'} textColor={'black'} borderColor={'transparent'}></FullButton>
                <View style={styles.spacing8}></View>
                <FullButton onPress={() =>navigation.navigate('Login')} text={'Log in'} backgroundColor={'transparent'} textColor={'white'} borderColor={'transparent'}></FullButton>
            </View>
            
        </ImageBackground>
    </View>
  )
}

export default OnboardingScreen

const styles = StyleSheet.create({
    
    container: {
        flex:1,
        marginTop: height,
        marginLeft: 24,
        zIndex: 0,
    },
    container2: {
        flex:1,
        backgroundColor: "white",
        zIndex: 0,
    },
    buttonContainer: {
        marginTop: 170,
    },
    spacing8: {
        marginTop: 8,
    },
    logo: {
        width: 20,
        height: 20,
    },
    vector: {
        width: screenWidth,
        height: 331,
        alignSelf: 'flex-end'
    },
    container_row: {
        marginTop: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 32,
        fontFamily: 'WorkSans_300Light',
    },
    bigText: {
        marginTop: 140,
        fontSize: 32,
    },
    smallText: {
        fontSize: 20,
        marginTop: 16,
    } 
})