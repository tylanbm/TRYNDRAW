import React, { useState, useRef } from "react";
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { backgroundColor, color } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { Draw, DrawRef,ColorPicker} from "@benjeau/react-native-draw";
import { getStorage,
    ref,
    uploadBytes,
    uploadBytesResumable } from 'firebase/storage';

const COLORS = [
    {
        id: "1",
        title: "Red",
    },
    {
        id: "2",
        title: "Orange",
    },
    {
        id: "3",
        title: "Yellow",
    },
    {
        id: "4",
        title: "Green",
    },
    {
        id: "5",
        title: "L-Blue",
    },
    {
        id: "6",
        title: "D-Blue",
    },
    {
        id: "7",
        title: "Violet",
    },
    {
        id: "8",
        title: "Black",
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

const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
        <Text style={[styles.title, textColor]}>{item.title}</Text>
    </TouchableOpacity>
);

const Item2 = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
        <Text style={[styles.title, textColor]}>{item.title}</Text>
    </TouchableOpacity>
);



const CanvasScreen = () => {
    const [selectedId, setSelectedId] = useState(null);
    const [selectedId2, setSelectedId2] = useState(null);

    const drawRef = useRef(DrawRef);
    const viewShot = useRef(ViewShot);
    const storage = getStorage();
    

    let currentThickness = 10;


    const removeLastPath = () => {
        drawRef.current.undo();
    }

    const upThickness = () => {
        currentThickness -=5;
        drawRef.current.setThickness(currentThickness);
    }

    const downThickness = () => {
        currentThickness += 5;
        drawRef.current.setThickness(currentThickness);
    }
    
    const clearDrawing = () => {
        drawRef.current.clear();
    }

    //Colors
    const setRed = () => {
        drawRef.current.setColor("red");
    }
    const setOrange = () => {
        drawRef.current.setColor("orange");
    }
    const setYellow = () => {
        drawRef.current.setColor("yellow");
    }
    const setGreen = () => {
        drawRef.current.setColor("green");
    }
    const setLightBlue = () => {
        drawRef.current.setColor("lightblue");
    }
    const setBlue = () => {
        drawRef.current.setColor("blue");
    }
    const setViolet = () => {
        drawRef.current.setColor("violet");
    }
    const setBlack = () => {
        drawRef.current.setColor("#000000");
    }

    const captureViewShot = () => {
        viewShot.current.capture().then((uri) => {
            console.log("Do something with ", uri);
            MediaLibrary.requestPermissionsAsync();
            MediaLibrary.saveToLibraryAsync(uri);

            /* !!!NEEDS TO BE FIXED!!!
            const imgRef = ref(storage, 'canvas.jpg');
            const imgFile = new File(uri, 'canvas.jpg', {type: 'image/jpg'});
            const metadata = { contentType: 'image/jpg' };
            uploadBytes(imgRef, imgFile, metadata).then(() => {
                console.log("Uploaded canvas file!");
            });*/
        })
    };

    const ColorBar = () => (
        <View style={[styles.row]}>
            <TouchableOpacity onPress={setRed} style={[styles.item, backgroundColor]}>
                <Text style={[styles.title]}>Red</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={setOrange} style={[styles.item, backgroundColor]}>
                <Text style={[styles.title]}>Orange</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={setYellow} style={[styles.item, backgroundColor]}>
                <Text style={[styles.title]}>Yellow</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={setGreen} style={[styles.item, backgroundColor]}>
                <Text style={[styles.title]}>Green</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={setLightBlue} style={[styles.item, backgroundColor]}>
                <Text style={[styles.title]}>L-Blue</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={setBlue} style={[styles.item, backgroundColor]}>
                <Text style={[styles.title]}>Blue</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={setViolet} style={[styles.item, backgroundColor]}>
                <Text style={[styles.title]}>Violet</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={setBlack} style={[styles.item, backgroundColor]}>
                <Text style={[styles.title]}>Black</Text>
            </TouchableOpacity>


        </View>

    );


    const ToolBar = () => (
        <View style={[styles.row]}>
            <TouchableOpacity onPress={clearDrawing} style={[styles.item, backgroundColor]}>
                <Text style={[styles.title]}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={removeLastPath} style={[styles.item, backgroundColor]}>
                <Text style={[styles.title]}>Undo</Text>
            </TouchableOpacity>

            <TouchableOpacity  style={[styles.item2]}>
                <Text style={[styles.title]}>    -    </Text>
            </TouchableOpacity>

            <TouchableOpacity  style={[styles.item2]}>
                <Text style={[styles.title]}>    +    </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={captureViewShot} style={[styles.item, backgroundColor]}>
                <Text style={[styles.title]}>Done</Text>
            </TouchableOpacity>

        </View>
        
    );
    

    


    const renderItem = ({ item }) => {
        const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#f9c2ff";
        const color = item.id === selectedId ? 'white' : 'black';

        return (
            <Item2
                item={item}
                onPress={() => setSelectedId2(item.id) }
                backgroundColor={{ backgroundColor }}
                textColor={{ color }}
            />
        );
    };

    const renderItem2 = ({ item }) => {
        const backgroundColor = item.id === selectedId2 ? "#6e3b6e" : "#f9c2ff";
        const color = item.id === selectedId2 ? 'white' : 'black';

        return (
            <Item2
                item={item}
                onPress={() => removeLastPath()}
                backgroundColor={{ backgroundColor }}
                textColor={{ color }}
            />
        );
    };


    return (
        <View style={styles.mainContainer}>
            <View style={styles.box1}>
                <SafeAreaView style={{ alignItems: 'center' }}>
                    <ColorBar/>
                </SafeAreaView>
            </View>
            <View style={styles.title}>
                <Text> You are drawing... HAPPY CATS</Text>
            </View>
            <View style={styles.box2}>
                
                <ViewShot
                    ref={viewShot}
                    options={{ format: "jpg", quality: 0.9, result: 'base64' }} >

                    <View style={styles.container}>
                        <Draw
                            ref={drawRef}
                            height={400}
                            width={300}
                            hideBottom={true}
                            initialValues={{
                                color: "#B644D0",
                                thickness: 10,
                                opacity: 0.5,
                                paths: []
                            }}
                            brushPreview="none"
                            canvasStyle={{ elevation: 0, backgroundColor: "#F5F5F5" }}
                        />
                    </View>
                    

                </ViewShot>
            </View>

            <View style={styles.box3}>
                <SafeAreaView style={{ alignItems: 'center'}}>
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
        fontSize: 44,
    },
    
    container: {
        alignContent: "center",
        justifyContent: "center",
        margin: 40,
    },
    container1: {
        marginTop: StatusBar.currentHeight || 0,
        backgroundColor: "#F5F5F5",
    },
    container2: {
        backgroundColor: "#F5F5F5",
    }, 
    canvas: {
        flex:1,
        backgroundColor: "red",
        padding: 295,
    },
    item: {
        padding: 8.5,
        marginVertical: 8,
        marginHorizontal: 2,
        backgroundColor: "lightblue",
    },
    item2: {
        padding: 8.5,
        marginVertical: 8,
        marginHorizontal: 2,
        backgroundColor: "lightgray",
    },
    title: {
        fontSize: 12,
    },
    box1: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    box2: {
        flex: 12,
        backgroundColor: "white",
    },
    box3: {
        flex: 1.25,
        alignItems: 'center',
        backgroundColor: "#F5F5F5",
    },
    row: {
        flexDirection: "row",
    },
});

export default CanvasScreen;