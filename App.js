//General imports
import * as React from "react";
import {
  Button,
  View,
  Text,
  ImageBackground,
  Settings,
  Platform,
  StyleSheet,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

//Ignore warnings
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ...", "Setting", "AsyncStorage"]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

//Screen Imports
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import GalleryScreen from "./screens/GalleryScreen";
import DrawingsScreen from "./screens/DrawingsScreen";
import ChallengesScreen from "./screens/ChallengesScreen";
import SettingsScreen from "./screens/SettingsScreen";
import CanvasScreen from "./screens/CanvasScreen";
import ImageScreen from "./screens/ImageScreen";
import ProfilePictureEditor from "./screens/ProfilePictureEditor";
import { SafeAreaProvider } from "react-native-safe-area-context";
import OnboardingScreen from "./screens/OnboardingScreen";

//Height detection
//Android
import { NativeModules } from "react-native";
const { StatusBarManager } = NativeModules;
//const height = StatusBarManager.HEIGHT;
const height = 33;

//IOS
let iosHeight = 44;
const majorVersionIOS = parseInt(Platform.Version, 10);
if (majorVersionIOS <= 9) {
  iosHeight = 20;
}

//Other
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const auth = getAuth();

const AppWithTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === "Home") {
          iconName = focused ? "home" : "home-outline";
        } else if (route.name === "Gallery") {
          iconName = focused ? "images" : "images-outline";
        } else if (route.name === "Details") {
          iconName = focused ? "heart" : "heart-outline";
        } else if (route.name === "Challenges") {
          iconName = focused ? "trophy" : "trophy-outline";
        } else if (route.name === "Account") {
          iconName = focused ? "person" : "person-outline";
        } else {
          iconName = focused ? "bug" : "bug-outline";
        }

        // You can return any component that you like here!
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#60B1B6",
      tabBarInactiveTintColor: "#828299",
    })}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Gallery"
      component={GalleryScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Account"
      component={SettingsScreen}
      options={{ headerShown: false }}
    />
  </Tab.Navigator>
);

function App() {
  //Keeps state of whether user is signed in or not
  const [isSignedIn, setIsSignedIn] = useState("");

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
    <SafeAreaProvider style={styles.heightOffset}>
      <NavigationContainer>
        <Stack.Navigator>
          {isSignedIn ? (
            <>
              <Stack.Screen
                name="HomeTabs"
                component={AppWithTabs}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Canvas"
                component={CanvasScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Drawing Selection"
                component={ChallengesScreen}
              />
              <Stack.Screen
                name="Image"
                component={ImageScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="My Drawings" component={DrawingsScreen} />
              <Stack.Screen
                name="ProfilePictureEditor"
                component={ProfilePictureEditor}
                options={{ headerShown: false }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Onboarding"
                component={OnboardingScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SignUp"
                component={SignUpScreen}
                options={{ headerShown: false }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  heightOffset: {
    ...Platform.select({
      ios: {
        marginTop: iosHeight,
      },
      android: {
        marginTop: height,
      },
      default: {
        // other platforms, web for example
        //backgroundColor: 'blue'
      },
    }),
  },
});

export default App;
