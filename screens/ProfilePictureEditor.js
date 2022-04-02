import React, { useState, useRef } from "react";
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
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

import { Slider } from "@miblanchard/react-native-slider";

import {
  collection,
  doc,
  setDoc,
  getFirestore,
  getDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

import Ionicons from "react-native-vector-icons/Ionicons";

import { auth } from "../firebaseConfig";
import FullButton from "../components/FullButton";

// Make sure fonts are loaded
import AppLoading from "expo-app-loading";
// Google Fonts
import { useFonts, WorkSans_300Light } from "@expo-google-fonts/work-sans";

// get database
const db = getFirestore();

// get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const COLORS = [
  {
    id: "1",
    colorCode: "#FF5454", //Red
  },
  {
    id: "2",
    colorCode: "#D00909", //Dark red
  },
  {
    id: "3",
    colorCode: "#FFB470", //Orange
  },
  {
    id: "4",
    colorCode: "#FF8754", //Dark orange
  },
  {
    id: "5",
    colorCode: "#FEEE97", //Yellow
  },
  {
    id: "6",
    colorCode: "#FFDC1F", //Dark yellow
  },
  {
    id: "7",
    colorCode: "#97FEA8", //Green
  },
  {
    id: "8",
    colorCode: "#52B52F", //Dark green
  },
  {
    id: "9",
    colorCode: "#73CCFE", //Blue
  },
  {
    id: "10",
    colorCode: "#148ED2", //Dark blue
  },
  {
    id: "11",
    colorCode: "#547AFF", //Navy
  },
  {
    id: "12",
    colorCode: "#1C3EB9", //Dark navy
  },
  {
    id: "13",
    colorCode: "#A189FF", //Violet
  },
  {
    id: "14",
    colorCode: "#9F54FF", //Dark violet
  },
  {
    id: "15",
    colorCode: "#FFC0C0", //Pink
  },
  {
    id: "16",
    colorCode: "#F79595", //Dark pink
  },
  {
    id: "17",
    colorCode: "#ECD7C8", //Sand
  },
  {
    id: "18",
    colorCode: "#AF957C", //Brown
  },
  {
    id: "19",
    colorCode: "#FFFFFF", //White
  },
  {
    id: "20",
    colorCode: "#EBEBEB", //Light grey
  },
  {
    id: "21",
    colorCode: "#C4C4C4", //Grey
  },
  {
    id: "22",
    colorCode: "#888888", //Dark grey
  },
  {
    id: "23",
    colorCode: "#494949", //Black
  },
];

//Color swatch on color selection bar
const Item = ({ item, onPress, backgroundColor, swatchColor, style }) => {
  let color = swatchColor;
  const borderColor = color == "#FFFFFF" ? "#B9B9B9" : "#FFFFFF";
  let radius = 28;

  return (
    <TouchableOpacity onPress={onPress} style={[style]}>
      <View
        style={{
          width: radius,
          height: radius,
          borderRadius: 100 / 2,
          backgroundColor: `${color}`,
          borderColor: `${borderColor}`,
          borderWidth: 1,
        }}
      ></View>
    </TouchableOpacity>
  );
};

const Tool = ({ iconName, onPress, backgroundColor, swatchColor, style }) => {
  let color = swatchColor;
  const borderColor = color == "#FFFFFF" ? "#B9B9B9" : "#FFFFFF";
  let radius = 28;

  return (
    <TouchableOpacity onPress={onPress} style={[style]}>
      <View
        style={{
          width: radius,
          height: radius,
          borderRadius: 100 / 2,
          backgroundColor: `${color}`,
          borderColor: `${borderColor}`,
          borderWidth: 1,
        }}
      ></View>
    </TouchableOpacity>
  );
};

const ProfilePictureEditor = ({ navigation, route }) => {
  //Id of active drawing color
  const [selectedId, setSelectedId] = useState("2");
  const [selectedId2, setSelectedId2] = useState(null);
  let activeColor = "#D00909";

  //Slug from drawing selection screen
  const slug = route.params;

  const drawRef = useRef(DrawRef);
  const viewShot = useRef(ViewShot);
  const storage = getStorage();

  const [modalVisible, setModalVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [currentThickness, setCurrentThickness] = useState(10);

  const removeLastPath = () => {
    drawRef.current.undo();
  };

  const updateThickness = (value) => {
    drawRef.current.setThickness(`${value}`);
  };

  const exitAndDelete = () => {
    setModalVisible(false);
    clearDrawing();
    navigation.navigate("Account");
  };

  const publishAndExit = async () => {
    setModalVisible(false);
    await captureViewShot();
    navigation.navigate("Account");
  };

  const toggleModalVisibility = () => {
    setModalVisible(!modalVisible);
  };

  const toggleResetModalVisibility = () => {
    setResetModalVisible(!resetModalVisible);
  };

  const clearDrawing = () => {
    drawRef.current.clear();
    toggleResetModalVisibility();
  };

  //Set the brush color
  const setColor = (color) => {
    if (pencilActive) {
      activeColor = color;
      drawRef.current.setColor(color);
    }
  };

  //A function that takes a snapshot of the canvas element and uploads image to firebase storage
  const captureViewShot = async () => {
    viewShot.current.capture().then((uri) => {
      console.log("Do something with ", uri);
      //MediaLibrary.requestPermissionsAsync();
      //MediaLibrary.saveToLibraryAsync(uri);
      //uploadImageAsync(uri);
      const user = auth.currentUser;
      const userId = user.uid;

      //Database and Storage paths for profile image
      const docRef = doc(db, "users", userId);
      const storagePath = "userProfileImages/" + userId;

      const storageRef = ref(storage, storagePath);

      const uploadImage = async (imageUri) => {
        const response = await fetch(imageUri);
        //Generate blob from image URI
        const blob = await response.blob();

        //Upload image blob to firebase storage
        await uploadBytes(storageRef, blob).then(() => {
          console.log("Uploaded a blob or file!");
        });

        // update timestamp of newly created profile image
        await setDoc(docRef, {
          lastProfileImageChange: serverTimestamp(),
          profileImageSet: true,
          userName: user.displayName,
        }).then(() => console.log("Profile changed"));
      };
      uploadImage(uri);
    });
  };

  //Button component for the tools
  const CircleButton = ({ iconName, onPress, activeStyle }) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[
          styles.toolContainer,
          activeStyle,
          iconName == "cloud-upload" ? { height: 56, width: 56 } : null,
        ]}
      >
        <View
          style={{
            alignItems: "center",
            alignSelf: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Ionicons name={iconName} style={[styles.toolIcon, activeStyle]} />
        </View>
      </TouchableOpacity>
    );
  };

  //States to handle highlighting of active tools
  const [pencilActive, setPencilActive] = useState(true);
  const [eraserActive, setEraserActive] = useState(false);
  const [thicknessSliderActive, setThicknessSliderActive] = useState(true);

  const togglePencil = () => {
    if (pencilActive) {
      setPencilActive(false);
    } else {
      setPencilActive(true);
      console.log(activeColor);
      drawRef.current.setColor(activeColor);
    }
  };

  const toggleEraser = () => {
    if (eraserActive) {
      setEraserActive(false);
    } else {
      setEraserActive(true);
      console.log(activeColor);
      drawRef.current.setColor("#FFFFFF");
    }
  };

  const toggleThicknessSlider = () => {
    if (thicknessSliderActive) {
      setThicknessSliderActive(false);
    } else {
      setThicknessSliderActive(true);
    }
  };

  const ToolBar = () => {
    return (
      <View
        style={{
          borderTopColor: "#B7B7B7",
          borderTopWidth: 1,
          paddingVertical: 8,
        }}
      >
        <View
          style={[
            styles.row,
            {
              alignItems: "center",
              justifyContent: "space-evenly",
              marginHorizontal: "0.5%",
            },
          ]}
        >
          <CircleButton
            onPress={() => {
              if (!pencilActive) {
                togglePencil();
                toggleEraser();
              }
            }}
            iconName={"pencil"}
            activeStyle={pencilActive ? styles.active : styles.inActive}
          />
          <View
            style={{
              transform: [{ rotate: "-45deg" }],
            }}
          >
            <CircleButton
              onPress={() => {
                if (!eraserActive) {
                  togglePencil();
                  toggleEraser();
                }
              }}
              iconName={"tablet-portrait"}
              activeStyle={eraserActive ? styles.active : styles.inActive}
            />
          </View>
          <CircleButton onPress={removeLastPath} iconName={"arrow-undo"} />
          <CircleButton
            onPress={toggleThicknessSlider}
            iconName={"resize"}
            activeStyle={
              thicknessSliderActive ? styles.active : styles.inActive
            }
          />
          <CircleButton
            onPress={toggleResetModalVisibility}
            iconName={"trash-bin"}
            activeStyle={{ color: "#FF9C9C", borderColor: "#FF9C9C" }}
          />
          <CircleButton
            onPress={toggleModalVisibility}
            iconName={"cloud-upload"}
            activeStyle={{
              color: "#60B1B6",
              borderColor: "#60B1B6",
              fontSize: 32,
            }}
          />
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? "#60B1B6" : "#F5F5F5";
    const color = item.colorCode;
    const borderColor =
      item.id === selectedId && pencilActive ? "#60B1B6" : "#B9B9B9";
    const borderWidth = item.id === selectedId ? 1.5 : 1;

    return (
      <Item
        item={item}
        onPress={() => {
          if (pencilActive) {
            setSelectedId(item.id);
            setColor(item.colorCode);
          }
        }}
        backgroundColor={{ backgroundColor }}
        swatchColor={`${color}`}
        style={{
          borderColor: borderColor,
          borderWidth: borderWidth,
          padding: 3,
          borderRadius: 30,
          overflow: "hidden",
          margin: 2,
          marginHorizontal: 2,
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
          backgroundColor: "white",
        }}
      />
    );
  };

  let [fontsLoaded] = useFonts({
    WorkSans_300Light,
  });
  if (!fontsLoaded) return <AppLoading />;

  return (
    <View style={[styles.mainContainer]}>
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            display: "flex",
            marginVertical: "1%",
          }}
        >
          <View style={{ marginLeft: "4%", flex: 1 }}>
            <CircleButton
              onPress={() => navigation.navigate("Account")}
              iconName={"arrow-back"}
            />
          </View>
          <View
            style={{
              flex: 5,
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={styles.titleText}>TRYNDRAW</Text>
            <Text style={styles.titleText}>Your profile photo</Text>
          </View>
          <View style={{ flex: 1 }}></View>
        </View>

        <SafeAreaView
          style={{
            alignItems: "center",
            borderBottomColor: "#B7B7B7",
            borderBottomWidth: 1,
            borderTopColor: "#B7B7B7",
            borderTopWidth: 1,
            paddingVertical: 4,
          }}
        >
          <FlatList
            data={COLORS}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            extraData={selectedId}
            horizontal={true}
          />
        </SafeAreaView>
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
                color: "#D00909",
                thickness: currentThickness,
                opacity: 1,
                paths: [],
              }}
              brushPreview="none"
              canvasStyle={{ elevation: 0, backgroundColor: "#FFFFFF" }}
            />
          </ViewShot>
        </View>

        <View
          style={{
            alignSelf: "center",
            justifyContent: "center",
            flexDirection: "column",
            width: "100%",
            flex: 1,
          }}
        >
          <View style={{ alignSelf: "center", width: "90%" }}>
            {thicknessSliderActive ? (
              <View style={styles.thicknessContainer}>
                <View>
                  <Text
                    style={{ color: "#60B1B6", marginTop: 8, fontSize: 16 }}
                  >
                    {eraserActive ? "Eraser Thickness" : "Brush Thickness"}
                  </Text>
                </View>
                <View style={{ width: "80%" }}>
                  <Slider
                    value={currentThickness}
                    onValueChange={(value) => {
                      setCurrentThickness(value);
                      updateThickness(value);
                    }}
                    minimumValue={1}
                    maximumValue={100}
                    step={1}
                    thumbStyle={{
                      borderColor: "#60B1B6",
                      borderWidth: 1,
                      backgroundColor: "#fff",
                      padding: 0,
                    }}
                    trackStyle={{
                      height: 8,
                      borderRadius: 50,
                      backgroundColor: "#DFDFE5",
                      padding: 0,
                      margin: 0,
                    }}
                    minimumTrackTintColor={"#60B1B6"}
                    containerStyle={{ padding: 0, margin: 0 }}
                  />
                </View>
                <Text
                  style={{ color: "#60B1B6", marginBottom: 8, fontSize: 14 }}
                >
                  {currentThickness}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={resetModalVisible}
        onRequestClose={() => {
          //Alert.alert("Modal has been closed.");
          setResetModalVisible(!resetModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { marginBottom: "20%" }]}>
            <Text style={styles.modalText}>Clear canvas?</Text>

            <View style={{ width: "70%", marginVertical: "2%" }}>
              <FullButton
                onPress={clearDrawing}
                text={"Yes"}
                backgroundColor={"#60B1B6"}
                textColor={"#FFFFFF"}
                borderColor={"transparent"}
              />
            </View>
            <View
              style={{ width: "70%", marginVertical: "2%", marginBottom: "8%" }}
            >
              <FullButton
                onPress={() => setResetModalVisible(!resetModalVisible)}
                text={"No"}
                backgroundColor={"white"}
                textColor={"#60B1B6"}
                borderColor={"#60B1B6"}
              />
            </View>
          </View>
        </View>
      </Modal>

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
          <View style={[styles.modalView, { marginBottom: "20%" }]}>
            <Text style={styles.modalText}>Ready to leave?</Text>

            <View style={{ width: "70%", marginVertical: "2.5%" }}>
              <FullButton
                onPress={publishAndExit}
                text={"Update profile picture and exit"}
                backgroundColor={"#60B1B6"}
                textColor={"#FFFFFF"}
                borderColor={"transparent"}
              />
            </View>

            <View style={{ width: "70%", marginVertical: "2.5%" }}>
              <FullButton
                onPress={() => setModalVisible(!modalVisible)}
                text={"Stay and keep editing"}
                backgroundColor={"white"}
                textColor={"#60B1B6"}
                borderColor={"#60B1B6"}
              />
            </View>

            <View
              style={{
                width: "70%",
                marginVertical: "2.5%",
                marginBottom: "8%",
              }}
            >
              <FullButton
                onPress={exitAndDelete}
                text={"Delete drawing and exit"}
                backgroundColor={"#FF9C9C"}
                textColor={"#ffffff"}
                borderColor={"transparent"}
              />
            </View>
          </View>
        </View>
      </Modal>

      <View>
        <ToolBar />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },

  title: {
    alignContent: "center",
    justifyContent: "center",
  },

  titleText: {
    fontSize: 20,
    fontFamily: "WorkSans_300Light",
    textAlign: "center",
  },

  container: {
    alignContent: "center",
    justifyContent: "center",
    marginTop: "12%",
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
    backgroundColor: "white",
    borderColor: "#C0C0CC",
    borderWidth: 1,
    height: 44,
    width: 44,
    marginHorizontal: 0,
    borderRadius: 80,
    overflow: "hidden",
    flexDirection: "column",
    justifyContent: "center",
  },

  toolIcon: {
    fontSize: 24,
    fontFamily: "WorkSans_700Bold",
    borderRadius: 80,
    color: "#C0C0CC",
  },

  active: {
    borderColor: "#60B1B6",
    color: "#60B1B6",
  },

  inActive: {
    borderColor: "#C0C0CC",
    color: "#C0C0CC",
  },

  swatch: {
    textAlign: "center",
    textAlignVertical: "center",
    paddingLeft: 1.75,
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
    borderRadius: 4,
    width: screenWidth - screenWidth * 0.15,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    borderColor: "#60B1B6",
    borderWidth: 1,
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
    marginVertical: "6%",
    textAlign: "center",
    fontSize: 26,
    fontFamily: "WorkSans_300Light",
  },

  thicknessContainer: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 5,
    borderColor: "#60B1B6",
    borderWidth: 1,
  },
});

export default ProfilePictureEditor;
