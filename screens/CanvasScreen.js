import React, { useState, useEffect } from "react";
import { FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View } from "react-native";

const DATA = [
    {
        id: "1",
        title: "First Item",
    },
    {
        id: "2",
        title: "Second Item",
    },
    {
        id: "3",
        title: "Third Item",
    },
    {
        id: "4",
        title: "Fourth Item",
    },
    {
        id: "5",
        title: "Fifth Item",
    },
];

const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
        <Text style={[styles.title, textColor]}>{item.title}</Text>
    </TouchableOpacity>
);

const CanvasScreen = () => {
    const [selectedId, setSelectedId] = useState(null);

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

    return (
        <View>
            <SafeAreaView style={{alignItems: 'center'}}>
                <FlatList
                    style={styles.container1}
                    horizontal={true}
                    data={DATA}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    extraData={selectedId}
                />
            </SafeAreaView>

            <SafeAreaView style={styles.canvas}></SafeAreaView>
            <SafeAreaView>
                <FlatList
                    style={styles.container2}
                    horizontal={true}
                    data={DATA}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    extraData={selectedId}
                />
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default CanvasScreen;