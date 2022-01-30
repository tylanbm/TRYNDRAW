//General imports
import * as React from 'react';
import { Button, View, Text, ImageBackground, Settings } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';


//Ignore warnings
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...', "Setting", "AsyncStorage"]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications


//Screen Imports
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import ErrorScreen from './screens/ErrorScreen';
import GalleryScreen from './screens/GalleryScreen';
import ChallengesScreen from './screens/ChallengesScreen';
import SettingsScreen from './screens/SettingsScreen';
import CanvasScreen from './screens/CanvasScreen';
import DebugScreen from './screens/DebugScreen';
import TestCanvasScreen from './screens/TestCanvasScreen';
import ImageScreen from './screens/ImageScreen';
import CanvasUserImageScreen from './screens/CanvasUserImageScreen';



//Other
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const auth = getAuth();

const AppWithTabs = () => (
  <Tab.Navigator 
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = focused
            ? 'home'
            : 'home-outline';
        } else if (route.name === 'Gallery') {
          iconName = focused ? 'images' : 'images-outline';
        } else if (route.name === 'Details') {
          iconName = focused ? 'heart' : 'heart-outline';
        } else if (route.name === 'Challenges') {
          iconName = focused ? 'trophy' : 'trophy-outline';
        }
         else if (route.name === 'Settings') {
          iconName = focused ? 'settings' : 'settings-outline';
        } else {
          iconName = focused ? 'bug' : 'bug-outline';
        }

        // You can return any component that you like here!
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#05a6f8',
      tabBarInactiveTintColor: 'gray',
    })}>
    <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Details" component={DetailsScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Gallery" component={GalleryScreen} options={{ headerShown: false }} />
    <Tab.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
  </Tab.Navigator>

);

/*
function SplashScreenHome({navigation}) {
  setTimeout(() => {
    navigation.navigate('Home')
  }, 1000)
  return (
    imgBack
  )
}
*/

//<Stack.Screen name='SplashScreen' component={SplashScreenHome} options={{headerShown: false}}/>
//<Stack.Screen name='SplashScreenHome' component={SplashScreenHome} options={{headerShown: false}} />


function App() {
  
  //Keeps state of whether user is signed in or not
  const [isSignedIn, setIsSignedIn] = useState('');

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      setIsSignedIn(true);
      console.log("User currently signed in.");

      return true;
      // ...
    } else {
      console.log("User not signed in.");
      setIsSignedIn(false);
      return false;

      
    }
  });

 //If user is signed in then render the app with tabs, otherwise send user to log in screen
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isSignedIn ? (
          <>
            <Stack.Screen name="HomeTabs" component={AppWithTabs} options={{headerShown: false}}/>
            <Stack.Screen name="Canvas" component={CanvasScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Challenges' component={ChallengesScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Image' component={ImageScreen} options={{ headerShown: true }} />
            <Stack.Screen name="CanvasUserImageScreen" component={CanvasUserImageScreen} options={{ headerShown: false }} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  
  );
}


export default App;