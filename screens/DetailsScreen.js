// import react itself
import React from "react";

// import styles and features
import { StyleSheet, Text, View } from "react-native";

// make sure fonts are loaded
import AppLoading from "expo-app-loading";

// Google Fonts
import {
  useFonts,
  WorkSans_500Medium,
  WorkSans_700Bold
} from "@expo-google-fonts/work-sans";

const DetailsScreen = ({ route }) => {
  // check if imported Google Fonts were loaded
  let [fontsLoaded] = useFonts({
    'Bold': WorkSans_700Bold,
    'Medium': WorkSans_500Medium,
  });
  if (!fontsLoaded) return <AppLoading />;


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vote on this drawing!</Text>

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.2)"
      />
    </View>
  );
};

export default DetailsScreen;


const styles = StyleSheet.create({
  // entire page
  container: {
    flex: 1,
    alignItems: "center",
  },

  // page title
  title: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 35,
    fontFamily: 'Medium',
    textAlign: "center",
  },

  // light/dark mode
  separator: {
    marginVertical: "10%",
    height: 1,
    width: "80%",
  },
});