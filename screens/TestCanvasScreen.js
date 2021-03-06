// React, use tools
import React, { useRef } from "react";

// styling
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// take screenshot of drawing
import ViewShot from "react-native-view-shot";

import * as MediaLibrary from "expo-media-library";

// draw on the canvas screen
import { Draw, DrawRef } from "@benjeau/react-native-draw";

const TestCanvasScreen = () => {
  const drawRef = useRef(DrawRef);
  const viewShot = useRef(ViewShot);

  captureViewShot = () => {
    viewShot.current.capture().then((uri) => {
      console.log("Do something with ", uri);
      MediaLibrary.requestPermissionsAsync();
      MediaLibrary.saveToLibraryAsync(uri);
    });
  };

  return (
    <ViewShot ref={viewShot} options={{ format: "jpg", quality: 0.9 }}>
      <View style={styles.container}>
        <Draw
          ref={drawRef}
          height={400}
          width={300}
          initialValues={{
            color: "#B644D0",
            thickness: 10,
            opacity: 0.5,
            paths: [],
          }}
          brushPreview="none"
          canvasStyle={{ elevation: 0, backgroundColor: "red" }}
        />
        <TouchableOpacity onPress={captureViewShot} style={styles.touchable}>
          <Text>Take Pic</Text>
        </TouchableOpacity>
      </View>
    </ViewShot>
  );
};

export default TestCanvasScreen;


const styles = StyleSheet.create({

  // entire screen
  container: {
    marginTop: 130,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },

  // upload drawing
  touchable: {
    padding: 5,
    backgroundColor: "blue",
  },
});