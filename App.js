import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
<<<<<<< HEAD
=======
import { useState } from 'react';
>>>>>>> origin/main


//Screen Imports
import HomeScreen from './screens/HomeScreen';
import ChallengesScreen from './screens/ChallengesScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import ErrorScreen from './screens/ErrorScreen';

//Other
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const auth = getAuth();


<<<<<<< HEAD
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



const isSignedIn = () => {
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
}

const AppWithTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home2" component={HomeScreen} />
    <Tab.Screen name="Challenges" component={ChallengesScreen} />
  </Tab.Navigator>
);

function App() {
  //TRY USING STATE VARIABLE FOR SIGNEDIN
  return (
    <NavigationContainer>
      <Stack.Navigator>
      {global.signedIn ? (
=======
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
>>>>>>> origin/main
        <>
          <Stack.Screen name="Home" component={AppWithTabs} />
        </>
  ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
  )}
<<<<<<< HEAD
      </Stack.Navigator>
    </NavigationContainer>
  
    
  );
}


/*
<NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} options={{
          title: 'DART - HOME',
          headerTitleAlign: "center",
        }} />
        
        <Stack.Screen name="Challenges" component={ChallengesScreen} />
        
        
        }} />        
      </Stack.Navigator>
    </NavigationContainer>
*/

=======
      </Stack.Navigator>
    </NavigationContainer>
  
  );
}
>>>>>>> origin/main


export default App;