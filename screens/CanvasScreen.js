import React, { useState } from "react";
import { FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { backgroundColor } from "react-native/Libraries/Components/View/ReactNativeStyleAttributes";

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

    const renderItem = ({ item }) => {
        const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#f9c2ff";
        const color = item.id === selectedId ? 'white' : 'black';

        return (
            <Item
                item={item}
                onPress={() => setSelectedId(item.id)}
                backgroundColor={{ backgroundColor }}
                textColor={{ color }}
            />
        );
    };

    const renderItem2 = ({ item }) => {
        const backgroundColor = item.id === selectedId2 ? "#6e3b6e" : "#f9c2ff";
        const color = item.id === selectedId2 ? 'white' : 'black';

        return (
            <Item
                item={item}
                onPress={() => setSelectedId2(item.id)}
                backgroundColor={{ backgroundColor }}
                textColor={{ color }}
            />
        );
    };

    return (
        <View style={styles.mainContainer}>
            <View style={styles.box1}>
                <SafeAreaView style={{ alignItems: 'center' }}>
                    <FlatList
                        horizontal={true}
                        data={COLORS}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id}
                        extraData={selectedId}
                    />
                </SafeAreaView>
            </View>

            <View style={styles.box2}>

            </View>

            <View style={styles.box3}>
                <SafeAreaView style={{ alignItems: 'center'}}>
                    <FlatList
                        horizontal={true}
                        data={TOOLS}
                        renderItem={renderItem2}
                        keyExtractor={(item) => item.id}
                        extraData={selectedId}
                    />
                </SafeAreaView>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
        backgroundColor: "gray",
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
});

export default CanvasScreen;