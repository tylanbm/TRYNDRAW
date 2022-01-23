// import React itself, change const state, use async methods
import React, { useState, useEffect } from 'react';

// import Firebase storage
import { getStorage,
    ref,
    getDownloadURL,
    listAll, } from 'firebase/storage';

// import React styles and features
import { StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    SafeAreaView,
    ActivityIndicator,
    TouchableOpacity, } from 'react-native';

// import Firestore docs
import { collection,
    doc,
    setDoc,
    getFirestore,
    getDoc,
    getDocs, } from 'firebase/firestore';


const db = getFirestore();
const storage = getStorage();
const galleryRef = collection(db,"gallery");
const docRef = doc(db, "gallery", "hello");

const setDataInDatabase = async() => {
    await setDoc(doc(db, "characters", "mario2"), {
        employment: "plumber",
        outfitColor: "red",
        specialAttack: "fireball",
    });
}

const uploadImg = async() => {
    // to be fixed
    const marioRef = ref(storage, 'gallery');
    const marioImgRef = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64, 0x21]);
    const metadata = { contentType: 'image/jpg' };
    uploadBytes(marioRef, marioImgRef, metadata).then(() => {
        console.log("Uploaded gallery file!");
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

//const q = query(messagesRef, orderBy('createdAt'), limit(5));
//const [messages] = useCollectionData(q);

const Item = ({ item, onPress, backgroundColor, textColor }) => (
    <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
        <Text style={[styles.titleStyle, textColor]}>{item.specialAttack}</Text>
    </TouchableOpacity>
);


const GalleryScreen = () => {

    const [getImgs, setImgs] = useState([]);
    const [fireData, setFireData] = useState([]);
    const [getRefresh, setRefresh] = useState(false);

    const getURLs = async() => {
        const listRef = ref(storage, 'testImages');
    
        listAll(listRef).then((res) => {
            res.items.forEach(async(itemRef) => {
                let temp = await getDownloadURL(itemRef);
                temp = temp.toString();
                let img = {
                    id: itemRef.name,
                    url: temp,
                }
                if (!getImgs.some(obj => obj.id === img.id)) {
                    console.log('hi');
                    setImgs(getImgs => [...getImgs, img]);
                }
            });
        }).catch((error) => {
            console.log("Image URL error!");
        });
    }

    // useEffect(() => {
    //     const getGetData = async() => {
    //         setData(await getData());
    //     }
    //     getGetData();
    // })

/*
    useEffect(() => {
        const getUpload = async() => {
            await uploadImg();
        }
        getUpload();
    }, [])*/

    // useEffect(() => {
    //     const getGetAll = async() => {
    //         setFireData(await getAllData());
    //     }
    //     getGetAll();
    // }, []);

    const getDownload = async() => {
        await getURLs();
    }

    // useEffect(() => {
    //     getDownload();
    // }, []);

    const refresh = () => {
        console.log('Reloading...');
        getDownload();
        console.log('Finished reloading');
    }

    const [selectedId, setSelectedId] = useState(null);

    const renderItem = ({ item }) => {
        const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#f9c2ff";
        const color = item.id === selectedId ? 'white' : 'black';

        return (
            <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
                <Text style={[styles.titleStyle, textColor]}>{item.specialAttack}</Text>
            </TouchableOpacity>
        );
    };

    const renderImg = ({ item }) => {
        const id = item.id;
        return (
            <TouchableOpacity
                onPress={() => console.log(id)}
                style={styles.touchable}
                >
                <Image
                    source={{uri: item.url}}
                    style={styles.imgStyle}
                    key={id}
                />
            </TouchableOpacity>
        );
    };

    return (
        <View style={{marginTop: 20}}>
            <TouchableOpacity
                onPress={() => refresh()}
            >
                <Text>Refresh</Text>
            </TouchableOpacity>
            <SafeAreaView>
                <FlatList
                    data={getImgs}
                    renderItem={renderImg}
                    horizontal={false}
                    numColumns={2}
                />
            </SafeAreaView>
        </View>
    )
}

export default GalleryScreen;


const styles = StyleSheet.create({

    // Database FlatList
    container1: {
        flexDirection: 'column',
        backgroundColor: "white",
    },

    // items in FlatList
    item: {
        padding: 8.5,
        marginVertical: 8,
        marginHorizontal: 2,
    },

    // title for Database
    titleStyle: {
        fontSize: 12,
    },

    // image button
    touchable: {
        width: '50%',
        aspectRatio: 1,
    },

    // images in FlatList
    imgStyle: {
        width: '100%',
        aspectRatio: 1,
    },
});