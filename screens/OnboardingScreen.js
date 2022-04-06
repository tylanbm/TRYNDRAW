import React from "react";

// styling
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ImageBackground,
} from "react-native";

// Google Fonts
import {
  useFonts,
  WorkSans_700Bold,
  WorkSans_100Thin,
  WorkSans_300Light,
} from "@expo-google-fonts/work-sans";

// fonts are still loading
import AppLoading from "expo-app-loading";

// custom button
import FullButton from "../components/FullButton";


// get screen dimensions
const { width: screenWidth } = Dimensions.get("window");


const OnboardingScreen = ({ navigation }) => {

  // check if fonts are loaded
  let [fontsLoaded] = useFonts({
    WorkSans_700Bold,
    WorkSans_100Thin,
    WorkSans_300Light,
  });
  if (!fontsLoaded) return <AppLoading />;


  return (
    <View style={styles.container2}>
      <View style={styles.container}>
        <View style={styles.container_row}>
          <Image style={styles.logo} source={require("../assets/logo.png")} />
          <Text style={styles.logoText}>TRYNDRAW</Text>
        </View>

        <Text style={styles.bigText}>
          Billions of hilarious scenarios to draw.
        </Text>
        <Text style={styles.smallText}>Down to try?</Text>
      </View>

      <ImageBackground
        style={styles.vector}
        source={require("../assets/vector.png")}
      >
        <View style={styles.buttonContainer}>
          <FullButton
            onPress={() => navigation.navigate("SignUp")}
            text={"Sign up"}
            backgroundColor={"white"}
            textColor={"black"}
            borderColor={"transparent"}
          ></FullButton>
          <View style={{marginTop: 8,}} />
          <FullButton
            onPress={() => navigation.navigate("Login")}
            text={"Log in"}
            backgroundColor={"transparent"}
            textColor={"white"}
            borderColor={"transparent"}
          ></FullButton>
        </View>
      </ImageBackground>
    </View>
  );
};

export default OnboardingScreen;


const styles = StyleSheet.create({

  // entire screen
  container2: {
    flex: 1,
    backgroundColor: "white",
    zIndex: 0,
  },

  // logo, title and subtitle
  container: {
    flex: 1,
    marginLeft: 24,
  },

  // TRYNDRAW logo
  logo: {
    width: 20,
    height: 20,
  },

  // logo and logo text
  container_row: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  // 'TRYNDRAW'
  logoText: {
    fontSize: 32,
    fontFamily: "WorkSans_300Light",
  },

  // background landscape vector
  vector: {
    width: screenWidth,
    height: 335,
    alignSelf: "flex-end",
  },

  // 'Billions of...'
  bigText: {
    fontSize: 32,
    marginTop: 160,
  },

  // 'Down to try?'
  smallText: {
    fontSize: 22,
    marginTop: 16,
  },

  // Sign up and Log in buttons
  buttonContainer: {
    marginTop: 170,
    marginHorizontal: 24,
  },
});
