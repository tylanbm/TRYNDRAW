import React, { useState, useRef } from "react";
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View, Dimensions, Modal, Pressable } from "react-native";
import { backgroundColor, borderColor, color } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { Draw, DrawRef,ColorPicker} from "@benjeau/react-native-draw";
import { getStorage,
    ref,
    uploadString,
    uploadBytes,
    uploadBytesResumable } from 'firebase/storage';

import {
    collection,
    doc,
    setDoc,
    getFirestore,
    getDoc,
    getDocs,
    serverTimestamp, } from 'firebase/firestore';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { auth } from "../firebaseConfig";
import ThicknessModal from "../components/ThicknessModal";

const db = getFirestore();

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const COLORS = [
    {
        id: "1",
        colorCode: '#FF5454',   //Red
    },
    {
        id: "2",
        colorCode: '#D00909',   //Dark red
    },
    {
        id: "3",
        colorCode: '#FFB470',   //Orange
    },
    {
        id: "4",
        colorCode: '#FF8754',   //Dark orange
    },
    {
        id: "5",
        colorCode: '#FEEE97',   //Yellow
    },
    {
        id: "6",
        colorCode: '#FFDC1F',   //Dark yellow
    },
    {
        id: "7",
        colorCode: '#97FEA8',   //Green
    },
    {
        id: "8",
        colorCode: '#52B52F',   //Dark green
    },
    {
        id: "9",
        colorCode: '#73CCFE',   //Blue
    },
    {
        id: "10",
        colorCode: '#148ED2',   //Dark blue
    },
    {
        id: "11",
        colorCode: '#547AFF',   //Navy
    },
    {
        id: "12",
        colorCode: '#1C3EB9',   //Dark navy
    },
    {
        id: "13",
        colorCode: '#A189FF',   //Violet
    },
    {
        id: "14",
        colorCode: '#9F54FF',   //Dark violet
    },
    {
        id: "15",
        colorCode: '#FFC0C0',   //Pink
    },
    {
        id: "16",
        colorCode: '#F79595',   //Dark pink
    },
    {
        id: "17",
        colorCode: '#ECD7C8',   //Sand
    },
    {
        id: "18",
        colorCode: '#AF957C',   //Brown
    },
    {
        id: "19",
        colorCode: '#FFFFFF',   //White
    },
    {
        id: "20",
        colorCode: '#EBEBEB',   //Light grey
    },
    {
        id: "21",
        colorCode: '#C4C4C4',   //Grey
    },
    {
        id: "22",
        colorCode: '#888888',   //Dark grey
    },
    {
        id: "23",
        colorCode: '#494949',   //Black
    },
];


//Color swatch on color selection bar
const Item = ({ item, onPress, backgroundColor, swatchColor, style }) => {
    let color = swatchColor;
    const borderColor = color == '#FFFFFF' ? "#B9B9B9" : "#FFFFFF";
    let radius = 28;
    
    return (
    <TouchableOpacity onPress={onPress} style={[style]}>
        <View style={{width: radius,height: radius, borderRadius: 100/2, backgroundColor: `${color}`, borderColor: `${borderColor}`, borderWidth:1}}></View>
    </TouchableOpacity>
    )
};


const CircleButton = ({iconName, onPress}) => (
    <TouchableOpacity onPress={onPress} style={[styles.toolContainer]}>
        <Ionicons name={iconName} style={[styles.toolIcon]}/>
    </TouchableOpacity>
);


const CanvasScreen = ({navigation, route}) => {
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
    }

    const upThickness = () => {
        if(currentThickness ==1)
            currentThickness = 0;
        currentThickness += 5;
        drawRef.current.setThickness(currentThickness);
    }

    const downThickness = () => {
        currentThickness -= 5;
        if (currentThickness <= 0 )
            currentThickness = 1;
        drawRef.current.setThickness(currentThickness);
    }

    const exitAndDelete = () => {
        setModalVisible(false);
        clearDrawing();
        navigation.navigate('Home');
    }

    const publishAndExit = async () => {
        setModalVisible(false);
        await captureViewShot();
        navigation.navigate('Home');
    }

    const toggleModalVisibility = () => {
        setModalVisible(!modalVisible);
    }

    const clearDrawing = () => {
        drawRef.current.clear();
    }

    //Set the brush color
    const setColor = (color) => {
        drawRef.current.setColor(color);
    }
    
    //A function that takes a snapshot of the canvas element and uploads image to firebase storage
    const captureViewShot = async () => {
        viewShot.current.capture().then((uri) => {
            console.log("Do something with ", uri);
            
            // Create a new document with an autogenerated id
            const newImageRef = doc(collection(db, "uniqueImageNames"));
            console.log("Document written with ID: ", newImageRef.id);
            
            //Storage path and file name of image
            const storagePath = "testImages/" + newImageRef.id + ".jpg"

            const storageRef = ref(storage, storagePath);
            
            const uploadImage = async (imageUri) => {
                const response = await fetch(imageUri);
                //Generate blob from image URI
                const blob = await response.blob();

                //Upload image blob to firebase storage
                await uploadBytes(storageRef, blob).then((snapshot) => {
                    console.log('Uploaded a blob or file!');
                });

                //Create a new file in database that will represent image name
                await setDoc(newImageRef, {
                    imageAuthorUID: auth.currentUser.uid,
                    imageAuthorUsername: auth.currentUser.displayName,
                    imageTitle: slug,
                    timestamp: serverTimestamp(),
                }).then(() => console.log('Document set'));

                
            }

            uploadImage(uri);

        })
    };



    const ToolBar = () => (
        <View style={styles.row}>
            <CircleButton onPress={() => console.log("Yay")} iconName={"pencil"}/>
            <View style={{
                transform: [
                    { rotate: "-45deg" },
                ]
            }}> 
            <CircleButton onPress={() => console.log("Yay")} iconName={"tablet-portrait"} />
            </View>
            
            <CircleButton onPress={upThickness} iconName={"add"} />
            <CircleButton onPress={downThickness} iconName={"remove"} />
            <CircleButton onPress={removeLastPath} iconName={"arrow-undo"} />
            <CircleButton onPress={clearDrawing} iconName={"trash"} />
            <CircleButton onPress={toggleModalVisibility} iconName={"checkmark"} />
        </View>    
    );
    

    const renderItem = ({ item }) => {
        const backgroundColor = item.id === selectedId ? "#60B1B6" : "#F5F5F5";
        const color = item.colorCode;
        const borderColor = item.id === selectedId ? "#60B1B6" : "#B9B9B9";
        const borderWidth = item.id === selectedId ? 1.5 : 1;

        return (
            <Item
                item={item}
                onPress={() => {setSelectedId(item.id); setColor(item.colorCode)}}
                backgroundColor={{ backgroundColor }}
                swatchColor={`${color}`}
                style={{borderColor: borderColor, borderWidth: borderWidth, padding: 3, borderRadius: 30, overflow: 'hidden', margin:2, marginHorizontal: 2, alignItems: 'center', justifyContent: 'center', alignContent: 'center', backgroundColor: 'white'}}
            />
        );
    };

    return (
        <View style={styles.mainContainer}>
            <View>
                <View style={{flexDirection: 'row', alignItems:'center', display: 'flex', marginVertical:'1%'}} >
                    <View style={{marginLeft: '1%', flex: 1}}>
                        <CircleButton onPress={() => navigation.navigate('Drawing Selection')} iconName={"arrow-back"} />
                    </View>
                    <View style={{flex: 5,alignContent: 'center',justifyContent:'center',alignItems:'center'}}>
                        
                            <Text style={styles.titleText}>TRYNDRAW</Text>
                            <Text style={styles.titleText}>
                            "{slug}"</Text>
                        
                    </View>
                    <View style={{flex: 1}}>
                    </View>
                   
                </View>

                
                <SafeAreaView style={{ alignItems: 'center', borderBottomColor: "#B7B7B7", borderBottomWidth: 1, borderTopColor: "#B7B7B7", borderTopWidth: 1, paddingVertical: 4}}>
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
                    <ViewShot
                        ref={viewShot}
                        options={{ format: "jpg", quality: 0.9 }} >
                        <Draw
                            ref={drawRef}
                            height={screenWidth}
                            width={screenWidth}
                            hideBottom={true}
                            initialValues={{
                                color: "#B644D0",
                                thickness: 5,
                                opacity: 1,
                                paths: []
                            }}
                            brushPreview="none"
                            canvasStyle={{ elevation: 0, backgroundColor: "#FFFFFF" }}
                        />
                        </ViewShot>
                    </View>
                    
                    <View style={{alignSelf: 'center', marginTop: "2%", width:'90%'}}>
                    <ThicknessModal></ThicknessModal>
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
                            style={[styles.button, styles.buttonClose, { marginTop: 32, backgroundColor: 'red' }]}
                            onPress={exitAndDelete}
                        >
                            <Text style={styles.textStyle}>Delete Drawing & Exit</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

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
    },
    title: {
        alignContent: "center",
        justifyContent: "center",
    },
    titleText: {
        fontSize: 20,
        fontFamily: 'WorkSans_700Bold',
        textAlign: 'center',
    },
    
    container: {
        alignContent: "center",
        justifyContent: "center",
        marginTop: "2%",
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#D2D2D2"
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
        borderRadius: 80, 
        overflow: 'hidden', 
        alignItems: 'center', 
        justifyContent: 'center', 
        alignContent: 'center', 
        backgroundColor: 'white'

    },
    toolIcon: {
        textAlign: 'center',
        textAlignVertical: 'center',
        marginHorizontal: 8,
        fontSize: 24,
        fontFamily: 'WorkSans_700Bold',
        borderRadius: 80,
        color: "#515151DE",
    },

    swatch: {
        textAlign: 'center',
        textAlignVertical: 'center',
        paddingLeft: 1.75,
        fontSize: 32,
        fontFamily: 'WorkSans_700Bold',
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
        alignItems: 'center',
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
        height: screenHeight/2,
        alignItems: "center",
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    button: {
        borderRadius: 20,
        elevation: 2,
        width: 200,
        height: 40,
        alignItems: 'center',
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
        fontFamily: 'WorkSans_700Bold',
        textAlign: "center"
    },
    modalText: {
        marginBottom: 48,
        textAlign: "center",
        fontSize: 24,
        fontFamily: 'WorkSans_700Bold',
    }
});

export default CanvasScreen;
