// import all of React
import React from "react";

// import styles
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

// make sure fonts are loaded
import AppLoading from "expo-app-loading";

// Google Fonts
import {
  useFonts,
  WorkSans_700Bold,
  WorkSans_500Medium,
} from "@expo-google-fonts/work-sans";

/* props:
    navigation
    screen
    url
    id
    name
    touchable
    overlay
    imgText
*/
const ImageButtonWithDelete = (props) => {
  // get const values
  const navigation = props.navigation;
  const screen = props.screen;
  const itemUrl = props.url;
  const itemId = props.id;
  const itemName = props.name;
  const icon = props.icon;

  // navigate to image's Image Screen
  const openPhoto = (imageSource, imageId, screen) => {
    console.log("Photo: " + imageSource);
    navigation.navigate("Image", {
      imageSourceToLoad: imageSource.toString(),
      imageId: imageId.toString(),
      screen: screen,
    });
  };

  // check if imported Google Fonts were loaded
  let [fontsLoaded] = useFonts({
    Bold: WorkSans_700Bold,
    Medium: WorkSans_500Medium,
  });
  if (!fontsLoaded) return <AppLoading />;

  return (
    <TouchableOpacity
      onPress={() => openPhoto(itemUrl, itemId, screen)}
      style={[props.touchable, styles.container]}
    >
      <ImageBackground
        source={{ uri: itemUrl }}
        style={styles.imgDimensions}
        key={itemId}
      >
        <View style={{ flex: 2 }} />
        <View style={styles.overlay}>
          <Text style={styles.imgText} numberOfLines={2}>
            {itemName}
          </Text>
          {icon != null && <Text style={styles.icon}>{icon}</Text>}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default ImageButtonWithDelete;

const styles = StyleSheet.create({
  container: {
    borderRadius: 0,
    borderColor: "#E7E8E8",
    borderWidth: 0.5,
  },

  // dimensions of images in FlatList
  imgDimensions: {
    width: "100%",
    aspectRatio: 1,
  },

  // delete icon
  icon: {
    marginRight: "4%",
    alignSelf: "center",
    aspectRatio: 1,
  },

  // view style overlayed on img
  overlay: {
    flex: 0.6,
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
    justifyContent: "space-evenly",
    backgroundColor: "rgba(149,175,178,0.8)",
    borderRadius: 0,
  },

  // text style overlayed on img
  imgText: {
    flex: 7,
    fontSize: 22,
    fontFamily: "Medium",
    textAlign: "center",
    color: "white",
    marginHorizontal: "3%",
  },
});
