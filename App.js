import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";


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
    <Tab.Screen name="Details" component={DetailsScreen} />
  </Tab.Navigator>

);

function App() {
  //TRY USING STATE VARIABLE FOR SIGNEDIN
  return (
    <NavigationContainer>
      <Stack.Navigator>
      {global.signedIn ? (
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


/*
<NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} options={{
          title: 'DART - HOME',
          headerTitleAlign: "center",
         />
        
        <Stack.Screen name="Challenges" component={ChallengesScreen} />
        
        
         />        
      </Stack.Navigator>
    </NavigationContainer>
*/


export default App;