import * as React from 'react';
import { Button, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useState } from 'react';


//Screen Imports
import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import ErrorScreen from './screens/ErrorScreen';

//Other
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const auth = getAuth();


const AppWithTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home2" component={HomeScreen} />
    <Tab.Screen name="Details" component={DetailsScreen} />
  </Tab.Navigator>

);

function App() {
  //Keeps state of whether user is signed in or not
  const [isSignedIn, setIsSignedIn] = useState('')
  
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      setIsSignedIn(true);
      console.log("User currently signed in")

      return true;
      // ...
    } else {
      console.log("User not signed in")
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
          <Stack.Screen name="Home" component={AppWithTabs} />
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