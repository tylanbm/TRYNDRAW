// React, initial run, set const
import React, { useEffect, useState } from "react";

// styling
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";

import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

// Google Fonts
import { useFonts, WorkSans_700Bold } from "@expo-google-fonts/work-sans";

// make sure fonts are loaded
import AppLoading from "expo-app-loading";

// custom button
import FullButton from "../components/FullButton";


const LoginScreen = ({ navigation }) => {
  // email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // email and password entry border colours
  const [borderEmail, setBorderEmail] = useState("#4F4E4C");
  const [borderPassword, setBorderPassword] = useState("#4F4E4C");

  // error message
  const [errorMessage, setErrorMessage] = useState("");

  //Check if user is logged in and return state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {});
    return unsubscribe;
  }, []);

  // log user into account
  const logInUser = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        // Signed in
        console.log("User signed in successfully!");
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log("logInUser error: " + errorCode);

        // error codes for the user
        switch (errorCode) {
          case "auth/invalid-email":
            setBorderEmail("red");
            setBorderPassword("#4F4E4C");
            setErrorMessage("Invalid email, please try another one.");
            break;

          case "auth/too-many-requests":
            setBorderEmail("red");
            setBorderPassword("red");
            setErrorMessage(
              "Tried logging in too many times. Please try logging in at a later time."
            );
            break;

          case "auth/user-not-found":
            setBorderEmail("red");
            setBorderPassword("#4F4E4C");
            setErrorMessage("This user cannot be found, please try again.");
            break;

          case "auth/wrong-password":
            setBorderEmail("#4F4E4C");
            setBorderPassword("red");
            setErrorMessage("Wrong password, please try again.");
            break;

          default:
            setBorderEmail("#4F4E4C");
            setBorderPassword("#4F4E4C");
            setErrorMessage(
              "Unknown error, cannot log in. Please make sure you entered your information correctly."
            );
            break;
        }
      });
  };

  // check if imported Google Fonts were loaded
  let [fontsLoaded] = useFonts({
    WorkSans_700Bold,
  });
  if (!fontsLoaded) return <AppLoading />;


  return (
    <View style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
      <View style={styles.container}>
        <View style={{ marginTop: 90 }} />
        <Text style={styles.title}>Log in</Text>
        <Text style={styles.subtitle}>Get back to drawing!</Text>
        <View style={{ marginTop: 70 }} />
        <Text style={styles.inputTitle}>Email</Text>
        <View style={[styles.inputContainer, { borderColor: borderEmail }]}>
          <TextInput
            style={styles.inputText}
            onChangeText={(text) => setEmail(text.replace(/\s+/g, ""))}
          />
        </View>
        <Text style={styles.inputTitle}>Password</Text>
        <View style={[styles.inputContainer, { borderColor: borderPassword }]}>
          <TextInput
            style={styles.inputText}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
          />
        </View>

        <Text
          style={{
            color: "#33999F",
            fontSize: 13,
            textAlign: "left",
            marginTop: 4,
          }}
        >
          Forgot password?
        </Text>

        <View>
          <Text style={styles.error}>{errorMessage}</Text>
        </View>

        <View style={{ marginTop: 125 }} />

        <FullButton
          onPress={() => logInUser()}
          text={"Sign in"}
          backgroundColor={"#60B1B6"}
          textColor={"white"}
          borderColor={"transparent"}
        ></FullButton>

        <View style={styles.subContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.textPoke1}>Don't have an account?</Text>
            <Text style={styles.textPoke2}>Sign up today!</Text>
          </TouchableOpacity>

          <Image style={styles.logo} source={require("../assets/logo.png")} />
        </View>

        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.2)"
        />
        {/*<SignUpButton screenName={'Root'} /> */}
      </View>
    </View>
  );
};

export default LoginScreen;


const styles = StyleSheet.create({

  // entire screen
  container: {
    flex: 1,
    marginHorizontal: 24,
  },

  // navigate to Sign Up
  subContainer: {
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  // 'Log in'
  title: {
    color: "#2B2B28",
    fontSize: 32,
  },

  // 'Get back to drawing!'
  subtitle: {
    color: "#2B2B28",
    fontSize: 20,
  },

  // titles above text inputs
  inputTitle: {
    fontSize: 14,
    color: "#4F4E4C",
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 2,
  },

  // text input
  inputContainer: {
    backgroundColor: "#F4F4F4",
    borderColor: "#A1A1A0",
    borderRadius: 7,
    borderWidth: 1,
    padding: 0,
  },

  // 'Dont have an account?'
  textPoke1: {
    fontSize: 14,
    color: "#7C8B8C",
  },

  // 'Sign up today!'
  textPoke2: {
    fontSize: 14,
    color: "#33999F",
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 20,
  },

  // text within text input
  inputText: {
    width: "100%",
    paddingLeft: 8,
    height: 48,
  },

  // logo image
  logo: {
    width: 20,
    height: 20,
  },

  // error message
  error: {
    color: "red",
    fontFamily: "WorkSans_700Bold",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
  },

  // light/dark mode
  separator: {
    marginVertical: "10%",
    height: 1,
    width: "80%",
  },
});