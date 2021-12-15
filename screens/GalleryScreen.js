import React, { useState, useEffect } from "react";
import { View, FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity} from 'react-native'
import {collection, doc, setDoc, query, orderBy, limit, getFirestore,getDoc} from 'firebase/firestore'


const db = getFirestore();
const galleryRef = collection(db,"gallery");

const docRef = doc(db, "gallery", "hello");


const setData = async () => {

    await setDoc(doc(db, "characters", "mario2"), {
        employment: "plumber",
        outfitColor: "red",
        specialAttack: "fireball"
    });

}


const setData2 = async () => {

    await setDoc(doc(db, "characters", "testy"), {
    
        id: "58694a0f-3da1-471f-bd96-145571e29d72",
        title: "Fourth Item",
        
    });

}

setData2();

const getData = async () => {

    const docRef = doc(db, "characters", "testy");
    const docSnap = await getDoc(docRef);
    let ourData = [];

    if (docSnap.exists()) {
        ourData =  docSnap.data()
        //console.log("FIREBASE DATA:", ourData);
    } else {
        // doc.data() will be undefined in this case
        ourData.push("No document found!");
        console.log("No such document!");
    }
    return ourData;
    
}




//const q = query(messagesRef, orderBy('createdAt'), limit(5));

    //const [messages] = useCollectionData(q);




    

const DATA = [
    
    {
        id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
        title: "Second Item",
    },
    {
        id: "58694a0f-3da1-471f-bd96-145571e29d72",
        title: "Third Item",
    },
    
    {
        id: "58694a0f-3da1-471f-bd96-145571e29d72",
        title: "Fifth Item",
    },
];

const DATA2 = [
    {
        id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
        specialAttack: "First Item",
    },
];

//console.log("TEST DATA:", DATA2);



const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
        <Text style={[styles.title, textColor]}>{item.specialAttack}</Text>
    </TouchableOpacity>
);

getData();


const GalleryScreen = () => {
    
    const [selectedId, setSelectedId] = useState(null);
    
    const [data, setData] = useState([]);
    
    useEffect(() => {

        async function fetchData() {

            const docRef = doc(db, "characters", "testy");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setData(docSnap.data());
                //console.log("FIREBASE DATA:", data);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }

            return docSnap;
        }
        fetchData()
    }, [])


    const renderItem = ({ item }) => {
        const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#f9c2ff";
        const color = item.id === selectedId ? 'white' : 'black';
        setData("MEMEMEMEME");
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
        <View >
            <SafeAreaView>
                <FlatList
                    style={styles.container1}
                    horizontal={true}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    extraData={selectedId}
                />
            </SafeAreaView>
            
        </View>
    );
};

export default GalleryScreen


const styles = StyleSheet.create({
    container1: {
        marginTop: StatusBar.currentHeight || 0,
        backgroundColor: "#F5F5F5",
    },
    container2: {
        backgroundColor: "#F5F5F5",
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
    },
    title: {
        fontSize: 12,
    },
});