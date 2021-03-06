import React, { useState, useRef } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
  Pressable,
} from "react-native";
import {
  backgroundColor,
  borderColor,
  color,
} from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { Draw, DrawRef, ColorPicker } from "@benjeau/react-native-draw";
import {
  getStorage,
  ref,
  uploadString,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";

import {
  collection,
  doc,
  setDoc,
  getFirestore,
  getDoc,
  getDocs,
} from "firebase/firestore";

import Ionicons from "react-native-vector-icons/Ionicons";
import { auth } from "../firebaseConfig";

const db = getFirestore();

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const COLORS = [
  {
    id: "1",
    title: "Red",
    colorCode: "#FF5454",
  },
  {
    id: "2",
    title: "Orange",
    colorCode: "#FF8754",
  },
  {
    id: "3",
    title: "Yellow",
    colorCode: "#FEEE97",
  },
  {
    id: "4",
    title: "Green",
    colorCode: "#97FEA8",
  },
  {
    id: "5",
    title: "L-Blue",
    colorCode: "#73CCFE",
  },
  {
    id: "6",
    title: "Blue",
    colorCode: "#547AFF",
  },
  {
    id: "7",
    title: "Violet",
    colorCode: "#9F54FF",
  },
  {
    id: "8",
    title: "Black",
    colorCode: "#494949",
  },
];

const TOOLS = [
  {
    id: "9",
    title: "Pencil",
  },
  {
    id: "10",
    title: "Eraser",
  },
  {
    id: "11",
    title: "Undo",
  },
  {
    id: "12",
    title: "Reset",
  },
  {
    id: "13",
    title: "DONE",
  },
];

const ColorSwatch = (swatch, onPress, swatchColor, swatchSize) => (
  <TouchableOpacity onPress={onPress} style={[styles.swatch, backgroundColor]}>
    <Ionicons name={"ellipse"} size={swatchSize} color={swatchColor} />
  </TouchableOpacity>
);

const Item = ({ item, onPress, backgroundColor, swatchColor, style }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item3, style]}>
    <Ionicons name={"ellipse"} style={[swatchColor, styles.swatch]} />
  </TouchableOpacity>
);

const CircleButton = ({ iconName, onPress }) => (
  <TouchableOpacity onPress={onPress} style={[styles.toolContainer]}>
    <Ionicons name={iconName} style={[styles.toolIcon]} />
  </TouchableOpacity>
);

const CanvasUserImageScreen = ({ navigation, route }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [selectedId2, setSelectedId2] = useState(null);

  // slug from ChallengesScreen
  const slug = route.params;

  const drawRef = useRef(DrawRef);
  const viewShot = useRef(ViewShot);
  const storage = getStorage();

  const [pencilActive, setPencilActive] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  let currentThickness = 10;

  const removeLastPath = () => {
    drawRef.current.undo();
  };

  const upThickness = () => {
    if (currentThickness == 1) currentThickness = 0;
    currentThickness += 5;
    drawRef.current.setThickness(currentThickness);
  };

  const exitAndDelete = () => {
    setModalVisible(false);
    clearDrawing();
    navigation.navigate("Home");
  };

  const publishAndExit = async () => {
    setModalVisible(false);
    await captureViewShot();
    navigation.navigate("Home");
  };

  const toggleModalVisibility = () => {
    setModalVisible(!modalVisible);
  };

  const downThickness = () => {
    currentThickness -= 5;
    if (currentThickness <= 0) currentThickness = 1;
    drawRef.current.setThickness(currentThickness);
  };

  const clearDrawing = () => {
    drawRef.current.clear();
  };

  //Set the brush color
  const setColor = (color) => {
    drawRef.current.setColor(color);
  };

  //A function that takes a snapshot of the canvas element and uploads image to firebase storage
  const captureViewShot = async () => {
    viewShot.current.capture().then((uri) => {
      console.log("Do something with ", uri);
      //MediaLibrary.requestPermissionsAsync();
      //MediaLibrary.saveToLibraryAsync(uri);
      //uploadImageAsync(uri);
      const userId = auth.currentUser.uid.toString();

      //Storage path and file name of image
      const storagePath = "userProfileImages/" + userId;

      const storageRef = ref(storage, storagePath);

      const uploadImage = async (imageUri) => {
        const response = await fetch(imageUri);
        //Generate blob from image URI
        const blob = await response.blob();

        //Upload image blob to firebase storage
        uploadBytes(storageRef, blob).then((snapshot) => {
          console.log("Uploaded a blob or file!");
        });
      };

      uploadImage(uri);
    });
  };

  const ToolBar = () => (
    <View style={styles.row}>
      <CircleButton onPress={console.log("Yay")} iconName={"pencil"} />
      <View
        style={{
          transform: [{ rotate: "45deg" }],
        }}
      >
        <CircleButton
          onPress={console.log("Yay")}
          iconName={"tablet-portrait"}
        />
      </View>

      <CircleButton onPress={upThickness} iconName={"add"} />
      <CircleButton onPress={downThickness} iconName={"remove"} />
      <CircleButton onPress={removeLastPath} iconName={"arrow-undo"} />
      <CircleButton onPress={clearDrawing} iconName={"trash"} />
      <CircleButton onPress={toggleModalVisibility} iconName={"checkmark"} />
    </View>
  );

  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? "#05a6f8" : "#F5F5F5";
    const color = item.colorCode;
    const borderColor = item.id === selectedId ? "#05a6f8" : "#B9B9B9";

    return (
      <Item
        item={item}
        onPress={() => {
          setSelectedId(item.id);
          setColor(item.colorCode);
        }}
        backgroundColor={{ backgroundColor }}
        swatchColor={{ color }}
        style={{
          borderColor: borderColor,
          borderWidth: 1,
          padding: 3,
          borderRadius: 30,
          overflow: "hidden",
          margin: 2,
          marginHorizontal: 4,
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
          backgroundColor: "white",
        }}
      />
    );
  };

  return (
    <View style={styles.mainContainer}>
      <View>
        <SafeAreaView style={{ alignItems: "center" }}>
          <FlatList
            data={COLORS}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            extraData={selectedId}
            horizontal={true}
          />
        </SafeAreaView>
      </View>

      <View style={styles.title}>
        <Text style={styles.titleText}>Editing profile picture{"\n"}</Text>
      </View>

      <View style={styles.box2}>
        <View style={styles.container}>
          <ViewShot ref={viewShot} options={{ format: "jpg", quality: 0.9 }}>
            <Draw
              ref={drawRef}
              height={screenWidth}
              width={screenWidth}
              hideBottom={true}
              initialValues={{
                color: "#B644D0",
                thickness: 5,
                opacity: 1,
                paths: [],
              }}
              brushPreview="none"
              canvasStyle={{ elevation: 0, backgroundColor: "#FFFFFF" }}
            />
          </ViewShot>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          //Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>What do you want to do?</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={publishAndExit}
            >
              <Text style={styles.textStyle}>Publish Drawing & Exit</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonClose, { marginTop: 16 }]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Keep Editing</Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                styles.buttonClose,
                { marginTop: 32, backgroundColor: "red" },
              ]}
              onPress={exitAndDelete}
            >
              <Text style={styles.textStyle}>Delete Drawing & Exit</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View style={styles.box3}>
        <SafeAreaView style={{ alignItems: "center" }}>
          <ToolBar></ToolBar>
        </SafeAreaView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  title: {
    alignContent: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 20,
    fontFamily: "WorkSans_700Bold",
    textAlign: "center",
  },

  container: {
    alignContent: "center",
    justifyContent: "center",
    marginTop: 40,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#D2D2D2",
  },
  container1: {
    marginTop: StatusBar.currentHeight || 0,
    backgroundColor: "#F5F5F5",
  },
  container2: {
    backgroundColor: "#F5F5F5",
  },
  toolContainer: {
    borderColor: "#B9B9B9",
    borderWidth: 1,
    height: 44,
    width: 44,
    marginHorizontal: 4,
    borderRadius: 30,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    backgroundColor: "white",
  },
  toolIcon: {
    textAlign: "center",
    textAlignVertical: "center",
    marginHorizontal: 8,
    fontSize: 24,
    fontFamily: "WorkSans_700Bold",
    borderRadius: 30,
    color: "#515151DE",
  },

  canvas: {
    flex: 1,
    backgroundColor: "red",
    padding: 295,
  },
  item: {
    padding: 8.5,
    marginVertical: 8,
    marginHorizontal: 2,
    backgroundColor: "lightblue",
  },
  item3: {
    marginVertical: 8,
    marginHorizontal: 1,
  },
  swatch: {
    textAlign: "center",
    textAlignVertical: "center",
    paddingLeft: 1.5,
    fontSize: 32,
    fontFamily: "WorkSans_700Bold",
    borderRadius: 30,
  },
  item2: {
    padding: 8.5,
    marginVertical: 8,
    marginHorizontal: 2,
    backgroundColor: "lightgray",
  },
  box1: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  box2: {
    flex: 12,
    backgroundColor: "#FAFAFA",
  },
  box3: {
    flex: 1.25,
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  row: {
    flexDirection: "row",
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: screenWidth,
    height: screenHeight / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    elevation: 2,
    width: 200,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontFamily: "WorkSans_700Bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 48,
    textAlign: "center",
    fontSize: 24,
    fontFamily: "WorkSans_700Bold",
  },
});

export default CanvasUserImageScreen;