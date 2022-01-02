import React, { useState, useEffect } from 'react';

import { getStorage,
    ref,
    uploadBytes,
    uploadBytesResumable } from 'firebase/storage';

import { StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    SafeAreaView,
    ActivityIndicator,
    TouchableOpacity } from 'react-native';

import { collection,
    doc,
    setDoc,
    getFirestore,
    getDoc,
    getDocs, } from 'firebase/firestore';

import { captureRef, viewRef } from 'react-native-view-shot';

const db = getFirestore();
const storage = getStorage();
const galleryRef = collection(db,"gallery");
const docRef = doc(db, "gallery", "hello");

const setDataInDatabase = async() => {
    await setDoc(doc(db, "characters", "mario2"), {
        employment: "plumber",
        outfitColor: "red",
        specialAttack: "fireball"
    });
}

const uploadImg = async() => {
    const marioRef = <Image source={require('../assets/mario.png')} />;
    const marioImgRef = captureRef(marioRef, {
        format: "png",
        result: 'base64',
      }).then(
        uri => console.log("Image saved to", uri),
        error => console.error("Oops, snapshot failed", error),
      );
		
    const metadata = { contentType: 'image/png' };
    uploadBytes(marioRef, marioImgRef, metadata).then(() => {
        console.log("Uploaded file!");
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
            let temp = {
                id: doc.data().id,
                specialAttack: doc.data().specialAttack,
            }
            tempData.push(temp);
        });
    } else {
        console.log("No such query snapshot!");
    }
    
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

    //let data = '';
    //const tempDatas = datas();
    const [fireData, setFireData] = useState([]);

    // useEffect(() => {
    //     const getIt = async() => {
    //         setData(await getData());
    //     }
    //     getIt();
    //     console.log(data);
    // })

    
    // google why useEffect is refereshing repeatedly
    useEffect(() => {
        const getIt = async() => {
            await uploadImg();
        }
        getIt();
    }, [])

    useEffect(() => {
        const getThis = async() => {
            setFireData(await getAllData());
        }
        getThis();
        console.log(fireData);
    }, [])

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
            <SafeAreaView>
                <FlatList
                    style={styles.container1}
                    data={fireData}
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