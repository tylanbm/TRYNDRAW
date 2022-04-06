// import React itself, change const state, use async methods
import React, { useState, useEffect } from "react";

// import Firebase storage
import {
  getStorage,
  ref,
  getDownloadURL,
} from "firebase/storage";

// import React styles and features
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  RefreshControl,
} from "react-native";

// import Firestore docs
import {
  collection,
  getFirestore,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";

// Google Fonts
import {
  useFonts,
  WorkSans_700Bold,
  WorkSans_500Medium,
} from "@expo-google-fonts/work-sans";

// make sure fonts are loaded
import AppLoading from "expo-app-loading";

// standardized button style
import FullButton from "../components/FullButton";
import ImageButton from "../components/ImageButton";


// get database and storage
const db = getFirestore();
const storage = getStorage();

// global variables (set once per app reload)
const docsRef = collection(db, "uniqueImageNames");
const imgsToLoad = 20;
let q = null;
let querySnapshot = null;
let last = 0;
let dragging = false;
let loading = false;
let refreshing = false;


const GalleryScreen = ({ navigation }) => {
  // array for FlatList of images
  const [getImgs, setImgs] = useState([]);

  // check if the current snapshot is empty
  const [isEmpty, setIsEmpty] = useState(false);

  // initial load of gallery screen
  const getURLs = async (querySnapshot) => {
    querySnapshot.forEach(async(item) => {
      // iterate through all testImages images
      const itemId = item.id;
      const itemRef = ref(storage, "testImages/" + itemId + ".jpg");

      // get data for img
      let itemData = item.data();
      let img = {
        id: itemId,
        name: itemData.imageTitle,
        time: itemData.timestamp,
        url: await getDownloadURL(itemRef),
      };

      // append all images to end of list
      setImgs((getImgs) => [...getImgs, img]);
    });

    let output = querySnapshot.docs;
    return output[output.length - 1];
  };

  // initial load
  useEffect(() => {
    getDownload();
  }, []);

  // await async calls for getting img urls
  const getDownload = async () => {
    loading = true;
    q = query(docsRef, orderBy("timestamp", "desc"), limit(imgsToLoad));
    querySnapshot = await getDocs(q);
    last = await getURLs(querySnapshot);
    loading = false;
  };

  // await async calls for getting img urls
  const getRefresh = async () => {
    if (!loading) {
      console.log("Refreshing...");

      dragging = false;
      loading = true;
      setIsEmpty(false);
      setImgs([]);

      q = query(docsRef, orderBy("timestamp", "desc"), limit(imgsToLoad));
      querySnapshot = await getDocs(q);
      last = await getURLs(querySnapshot);

      loading = false;
    } else console.log("Cannot refresh at this time.");
  };

  // load new imgs when halfway through FlatList
  const getMoreDownload = async () => {
    loading = true;

    q = query(
      docsRef,
      orderBy("timestamp", "desc"),
      startAfter(last),
      limit(imgsToLoad)
    );
    querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      last = await getURLs(querySnapshot);
    } else if (querySnapshot.empty) {
      setIsEmpty(true);
    }

    loading = false;
  };

  // images
  const renderImg = ({ item }) => {
    return (
      <ImageButton
        navigation={navigation}
        screen={"Gallery"}
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

  // scrolling 75% down causes more images to load
  const handleOnEndReached = async () => {
    if (dragging && !isEmpty) {
      console.log("Load new");
      await getMoreDownload();
    }
  };

  // check if imported Google Fonts were loaded
  let [fontsLoaded] = useFonts({
    Bold: WorkSans_700Bold,
    Medium: WorkSans_500Medium,
  });
  if (!fontsLoaded) return <AppLoading />;

  // when images are still loading
  const LoadingComponent = () => <Text style={styles.footer}>Loading...</Text>;

  // reached the end of the list
  const EndOfListComponent = () => (
    <View
      style={{
        width: "90%",
        marginBottom: 4,
        marginTop: 2,
        marginHorizontal: "5%",
      }}
    >
      <FullButton
        onPress={async () => await getRefresh()}
        text={"End of gallery, tap to refresh!"}
        backgroundColor={"#60B1B6"}
        textColor={"white"}
        borderColor={"transparent"}
      ></FullButton>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <FlatList
          data={getImgs}
          renderItem={renderImg}
          horizontal={false}
          numColumns={2}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => await getRefresh()}
            />
          }
          onEndReached={async () => await handleOnEndReached()}
          onEndReachedThreshold={0.5}
          onScrollBeginDrag={() => {
            dragging = true;
          }}
          ListFooterComponent={() => {
            if (!isEmpty) return <LoadingComponent />;
            else return <EndOfListComponent />;
          }}
        />
      </SafeAreaView>

      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.2)"
      />
    </View>
  );
};

export default GalleryScreen;


const styles = StyleSheet.create({

  // entire page
  container: {
    backgroundColor: "#FFFFFF",
  },

  // footer of FlatList
  footer: {
    fontSize: 20,
    fontFamily: "Medium",
    textAlign: "center",
  },

  // image button
  touchable: {
    width: "50%",
    aspectRatio: 1,
  },

  // view style overlayed on img
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(149,175,178,0.8)",
    borderRadius: 0,
  },

  // text style overlayed on img
  imgText: {
    fontSize: 22,
    fontFamily: "Medium",
    textAlign: "center",
    color: "white",
    marginHorizontal: "3%",
  },

  // light/dark mode
  separator: {
    marginVertical: "10%",
    height: 1,
    width: "80%",
  },
});
