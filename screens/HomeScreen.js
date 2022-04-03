// import React, initialized variable state, run async functions
import React, { useState, useEffect } from "react";

// import styles
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ImageBackground,
  FlatList,
  TouchableOpacity,
} from "react-native";

// import account authentication
import { auth } from "../firebaseConfig";

// import firebase storage
import { getStorage, ref, getDownloadURL } from "firebase/storage";

// import Firestore docs
import {
  collection,
  doc,
  getFirestore,
  query,
  orderBy,
  where,
  limit,
  onSnapshot,
} from "firebase/firestore";

// Google Fonts
import {
  useFonts,
  WorkSans_700Bold,
  WorkSans_500Medium,
} from "@expo-google-fonts/work-sans";

// make sure fonts are loaded
import AppLoading from "expo-app-loading";

// button and image styles
import FullButton from "../components/FullButton";
import Ionicons from "react-native-vector-icons/Ionicons";
import ImageButton from "../components/ImageButton";
import ProfileImage from "../components/ProfileImage";

// get Firebase database and storage
const db = getFirestore();
const storage = getStorage();
const imagesRef = collection(db, "uniqueImageNames");

// profile image size
const size = "20%";

const HomeScreen = ({ navigation }) => {
  // user auth
  const user = auth.currentUser;
  const username = user.displayName;
  const userId = user.uid;

  // set up image get
  const [pic, setPic] = useState("");
  const userRef = doc(db, "users", userId);

  // array for FlatList of images
  const [getImgs, setImgs] = useState([]);
  const length = getImgs.length;

  // check if images are loaded into getImgs
  const [pending, setPending] = useState(true);

  // initial load of My Drawings
  const getURLs = async (imageSnapshot) => {
    for await (const item of imageSnapshot.docs) {
      // iterate through all testImages images
      const itemId = item.id;
      const itemRef = ref(storage, "testImages/" + itemId + ".jpg");

      // get data for img
      const itemData = item.data();
      const img = {
        id: itemId,
        name: itemData.imageTitle,
        time: itemData.timestamp,
        url: await getDownloadURL(itemRef),
      };

      // append all images to end of list
      setImgs((getImgs) => [...getImgs, img]);
    }
  };

  // load images
  useEffect(() => {
    // listen to profile image
    onSnapshot(
      query(userRef),
      { includeMetadataChanges: true },
      async (profileSnapshot) => {
        // check if there are no more pending writes
        const writes = profileSnapshot.metadata.hasPendingWrites;
        console.log("User home " + writes);

        // if no pending writes, update Home screen profile image
        if (!writes) {
          console.log("Change profile home");

          // if profile image does not exist, use default profile image
          if (profileSnapshot.data().profileImageSet) {
            const temp = await getDownloadURL(
              ref(storage, "userProfileImages/" + user.uid)
            );
            setPic(temp);
          } else {
            const temp = await getDownloadURL(
              ref(storage, "userProfileImages/profileImage.jpg")
            );
            setPic(temp);
          }
        } else {
          console.log("Do not change profile home");
        }
      }
    );

    // listen to My Drawings
    onSnapshot(
      query(
        imagesRef,
        orderBy("timestamp", "desc"),
        where("imageAuthorUsername", "==", username),
        limit(2)
      ),
      { includeMetadataChanges: false },
      async (imageSnapshot) => {
        // check if writes and type are both false
        const writes = imageSnapshot.metadata.hasPendingWrites;
        let changeType = false;
        imageSnapshot.docChanges().forEach((change) => {
          if (change.type == "removed") {
            changeType = true;
          }
        });
        console.log("Image " + writes + " " + changeType);

        // if both are false, refresh the images
        if (!writes && !changeType) {
          console.log("Change images");
          setImgs([]);
          await getURLs(imageSnapshot);
          setPending(false);
        } else console.log("Do not change images");
      }
    );
  }, []);

  const renderImg = ({ item }) => {
    return (
      <ImageButton
        navigation={navigation}
        screen={"Home"}
        url={item.url}
        id={item.id}
        name={item.name}
        touchable={styles.touchable}
        overlay={styles.overlay}
        imgText={styles.imgText}
        icon={null}
      />
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
      <View style={[styles.container, {}]}>
        <View style={{ alignItems: "center", marginTop: "5%" }}>
          <ProfileImage url={pic} size={size} />
          <Text style={styles.title}>
            Welcome back,{"\n"}
            {username}!
          </Text>
        </View>

        <View style={styles.subView}>
          <Text style={styles.subtitle}>My Drawings</Text>
          <TouchableOpacity
            style={styles.viewDrawings}
            onPress={() => navigation.navigate("My Drawings")}
          >
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        <View></View>
        {length == 0 && pending && (
          <View style={styles.flatPlace}>
            <Text style={styles.textPlace}>Loading...</Text>
          </View>
        )}

        {length == 0 && !pending && (
          <TouchableOpacity
            onPress={() => navigation.navigate("Drawing Selection")}
            style={[styles.flatEmpty, { height: "31%" }]}
          >
            <View style={{ marginVertical: "10%" }}>
              <Text style={[styles.flatEmptyText, {}]}>
                You have no drawings.
              </Text>
              <Ionicons
                name="add-outline"
                size={96}
                color="#60B1B6"
                style={[styles.flatEmptyIcon, {}]}
              />
              <Text style={[styles.flatEmptyText, {}]}>Start drawing!</Text>
            </View>
          </TouchableOpacity>
        )}

        {length > 0 && (
          <SafeAreaView style={styles.flatView}>
            <FlatList
              data={getImgs}
              renderItem={renderImg}
              horizontal={true}
              ListFooterComponent={
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <TouchableOpacity
                    onPress={() => navigation.navigate("My Drawings")}
                    style={[styles.flatEmpty, { height: "100%" }]}
                  >
                    <Ionicons
                      name="add-outline"
                      size={136}
                      color="#60B1B6"
                      style={[styles.flatEmptyIcon, { marginTop: "10%" }]}
                    />
                    <Text style={[styles.flatEmptyText]}>View all</Text>
                  </TouchableOpacity>
                </View>
              }
            />
          </SafeAreaView>
        )}

        <View style={{ flex: 1 }}></View>
        <View style={{ marginVertical: "20%" }}>
          <FullButton
            onPress={() => navigation.navigate("Drawing Selection")}
            text={"Start drawing"}
            backgroundColor={"#60B1B6"}
            textColor={"white"}
            borderColor={"transparent"}
          ></FullButton>
        </View>

        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.2)"
        />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  // entire screen
  container: {
    flex: 1,
    flexDirection: "column",
    marginHorizontal: "5%",
  },

  // 'Welcome back'
  title: {
    fontFamily: "Medium",
    textAlign: "center",
    fontSize: 22,
    marginBottom: "10%",
    color: "#2B2B28",
  },

  // view style for the subtitle
  subView: {
    flexDirection: "row",
    marginVertical: "1%",
    marginTop: "6%",
  },

  // 'My Drawings'
  subtitle: {
    fontSize: 28,
    flex: 2,
    fontFamily: "Medium",
    alignSelf: "flex-start",
    color: "#2B2B28",
  },

  // 'View all' button
  viewDrawings: {
    flex: 1,
    alignSelf: "flex-end",
    justifyContent: "center",
  },

  // 'View all'
  viewAll: {
    fontSize: 20,
    color: "#60B1B6",
    fontFamily: "Medium",
    textAlign: "right",
  },

  // FlatList pending placeholder view
  flatPlace: {
    height: "31%",
    marginLeft: "3%",
  },

  // FlatList empty
  flatEmpty: {
    alignSelf: "center",
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: "#60B1B6",
    borderRadius: 0,
  },

  // FlatList empty text
  flatEmptyText: {
    textAlign: "center",
    fontSize: 24,
    fontFamily: "Medium",
    color: "#60B1B6",
  },

  // FlatList empty + icon
  flatEmptyIcon: {
    alignSelf: "center",
  },

  // FlatList placeholder text
  textPlace: {
    marginTop: "20%",
    fontFamily: "Medium",
    fontSize: 25,
    textAlign: "center",
    justifyContent: "center",
  },

  // FlatList view
  flatView: {
    maxHeight: "31.5%",
  },

  // image button
  touchable: {
    aspectRatio: 1,
    borderRadius: 5,
  },

  // view style overlayed on img
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(149,175,178,0.8)",
    borderRadius: 5,
  },

  // text style overlayed on img
  imgText: {
    fontSize: 22,
    fontFamily: "Medium",
    textAlign: "center",
    color: "white",
    marginHorizontal: "2%",
  },
});
