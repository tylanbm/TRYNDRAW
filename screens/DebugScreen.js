import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { generateSlug } from "random-word-slugs";

const options = {
  format: "title",
  partsOfSpeech: ["adjective", "adjective", "noun"],
};
const slug = generateSlug(3, options);
console.log(slug);

const DebugScreen = () => {
  return (
    <View>
      <Text>{slug}</Text>
    </View>
  );
};

export default DebugScreen;

const styles = StyleSheet.create({});