import React, { useState, useEffect } from 'react'

import { StyleSheet,
    Text,
    View,
    FlatList,
    SafeAreaView,
    ActivityIndicator,
    TouchableOpacity } from 'react-native'
import { collection,
    doc,
    setDoc,
    getFirestore,
    getDoc,
    getDocs } from 'firebase/firestore'

const db = getFirestore();
const galleryRef = collection(db,"gallery");
const docRef = doc(db, "gallery", "hello");

const setDataInDatabase = async() => {

    await setDoc(doc(db, "characters", "mario2"), {
        employment: "plumber",
        outfitColor: "red",
        specialAttack: "fireball"
    });

}

const getData = async() => {

    const docRef = doc(db, "characters", "mario");
    const docSnap = await getDoc(docRef);
    let returnVal = '';

    if (docSnap.exists()) {
        returnVal = String(docSnap.data().specialAttack.toString());
    } else {
        // doc.data() will be undefined in this case
        returnVal = "No document found!";
        console.log("No such document!");
    }
    return returnVal;
}

const getAllData = async() => {
    const docsRef = collection(db, "characters");
    const querySnapshot = await getDocs(docsRef);
    const tempData = [];
    
    if (querySnapshot != null) {
        querySnapshot.forEach((doc) => {
            let yay = {
                id: doc.data().id,
                attack: doc.data().specialAttack,
            }
            tempData.push(yay);
        });
    } else {
        console.log("No such query snapshot!");
    }
     
    console.log(tempData); 
    return tempData;
}


//getAllData();


//const q = query(messagesRef, orderBy('createdAt'), limit(5));
//const [messages] = useCollectionData(q);

const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
        <Text style={[styles.title, textColor]}>{item.specialAttack}</Text>
    </TouchableOpacity>
);

/*<FlatList
                style={styles.container1}
                data={fbData}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                extraData={selectedId}
            />*/

const datas = () => {
    const DATA = [
        {
            id: "1",
            specialAttack: "fireball",
        },
        {
            id: "2",
            specialAttack: "memepower",
        },
        {
            id: "3",
            specialAttack: "meows loudly",
        },
    ];

    return DATA;
}

const GalleryScreen = () => {

    const data = '';
    const [fbData, setFbData] = useState([]);
    const tempDatas = datas();

    // useEffect(() => {
    //     const getIt = async() => {
    //         setData(await getData());
    //     }
    //     getIt();
    //     console.log(data);
    // })

    /*
    // google why useEffect is refereshing repeatedly
    useEffect(() => {
        const getThis = async() => {
            setFbData(await getAllData());
        }
        getThis();
        console.log(fbData);
    }, [data])*/

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
            <Text>I use {data}</Text>
            <SafeAreaView>
            <FlatList
                style={styles.container1}
                data={tempDatas}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                extraData={selectedId}
            />
            </SafeAreaView>
        </View>
    )
}

export default GalleryScreen;

const styles = StyleSheet.create({
    container1: {
        backgroundColor: "#F5F5F5",
    }, 
    item: {
        padding: 8.5,
        marginVertical: 8,
        marginHorizontal: 2,
    },
    title: {
        fontSize: 12,
    },
})