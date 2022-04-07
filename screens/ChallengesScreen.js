// import React and initialized variable state
import React, { useState } from "react";

// import random word slug generator
import { generateSlug } from "random-word-slugs";

// import styles, custom buttons, text box
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";

// import Ionicons icon library
import { Ionicons } from "@expo/vector-icons";

// make sure fonts are loaded
import AppLoading from "expo-app-loading";

// Google Fonts
import {
  useFonts,
  WorkSans_700Bold,
  WorkSans_500Medium,
} from "@expo-google-fonts/work-sans";

import FullButton from "../components/FullButton";

// slug generation format
const slugOptions = {
  format: "sentence",
  partsOfSpeech: ["adjective", "adjective", "noun"],
};

// icons
const emptybox = <Ionicons name="square-outline" size={20} color="#9AAAAC" />;
const checkbox = <Ionicons name="checkbox" size={20} color="#60B1B6" />;


const ChallengesScreen = ({ navigation }) => {
  // which challenge to be selected
  const [selectedId, setSelectedId] = useState(0);

  // challenge data
  const [data, setData] = useState([
    {
      id: 0,
      slug: generateSlug(3, slugOptions),
    },
    {
      id: 1,
      slug: generateSlug(3, slugOptions),
    },
    {
      id: 2,
      slug: generateSlug(3, slugOptions),
    },
  ]);

  const reroll = () => {
    let temp_data = [...data];

    for (let i = 0; i < 3; i++) {
      let temp_elt = { ...temp_data[i] };
      temp_elt.slug = generateSlug(3, slugOptions);
      temp_data[i] = temp_elt;
    }

    setData(temp_data);
  };

  const renderItem = ({ item }) => {
    const borderColor = item.id == selectedId ? "#60B1B6" : "transparent";
    const textColor = item.id == selectedId ? "#60B1B6" : "#9AAAAC";
    const textWeight = item.id == selectedId ? "bold" : "normal";
    const icon = item.id == selectedId ? checkbox : emptybox;

    return (
      <TouchableOpacity
        onPress={() => setSelectedId(item.id)}
        style={[
          styles.challenge,
          { borderColor: borderColor, flexDirection: "row" },
        ]}
      >
        <Text>{icon}</Text>
        <Text
          style={[
            styles.challengeText,
            { color: textColor, fontWeight: textWeight },
          ]}
        >
          {item.slug}
        </Text>
      </TouchableOpacity>
    );
  };

  // check if imported Google Fonts were loaded
  let [fontsLoaded] = useFonts({
    Bold: WorkSans_700Bold,
    Medium: WorkSans_500Medium,
  });
  if (!fontsLoaded) return <AppLoading />;

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>What do you want to draw?</Text>

        <SafeAreaView>
          <FlatList
            data={data}
            renderItem={renderItem}
          />
        </SafeAreaView>

        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => {
              let temp_data = [...data];

              for (let i = 0; i < 3; i++) {
                let temp_elt = { ...temp_data[i] };
                temp_elt.slug = generateSlug(3, slugOptions);
                temp_data[i] = temp_elt;
              }

              setData(temp_data);
            }}
          />
        </View>

        <View style={styles.reroll}>
          <FullButton
            onPress={() => reroll()}
            text={"Reroll selection"}
            backgroundColor={"white"}
            textColor={"#60B1B6"}
            borderColor={"#60B1B6"}
          />
        </View>

        <View style={{ marginTop: "20%" }} />
        <FullButton
          onPress={() => {
            navigation.navigate("Canvas", data[selectedId].slug);
          }}
          text={"Start drawing"}
          backgroundColor={"#60B1B6"}
          textColor={"white"}
          borderColor={"transparent"}
        />

        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.2)"
        />
      </View>
    </View>
  );
};

export default ChallengesScreen;


const styles = StyleSheet.create({

  // entire page
  container: {
    flex: 1,
    marginHorizontal: 24,
  },

  // page title
  title: {
    marginTop: "10%",
    marginBottom: "10%",
    fontSize: 40,
    textAlign: "center",
  },

  // individual challenge selection buttons
  challenge: {
    marginBottom: "2%",
    borderRadius: 5,
    borderWidth: 1,
    padding: "4%",
    alignItems: "center",
  },

  // challenge selection button text
  challengeText: {
    fontSize: 20,
    marginLeft: "2%",
  },

  // reroll button
  reroll: {
    marginTop: "7%",
    marginHorizontal: "9%",
  },

  // light/dark mode
  separator: {
    marginVertical: "10%",
    height: 1,
    width: "80%",
  },
});