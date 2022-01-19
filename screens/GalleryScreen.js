
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
import { styleProps } from 'react-native-web/dist/cjs/modules/forwardedProps';


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

/*
const uploadImg = async() => {
    // to be fixed
    const marioRef = ref(storage, 'gallery');
    const marioImgRef = new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x2c, 0x20, 0x77, 0x6f, 0x72, 0x6c, 0x64, 0x21]);
    const metadata = { contentType: 'image/jpg' };
    uploadBytes(marioRef, marioImgRef, metadata).then(() => {
        console.log("Uploaded gallery file!");
    });
}*/

// const getURLs = async() => {
//     const listRef = ref(storage, 'images');
//     const urls = [];
//     let index = 0;

//     listAll(listRef).then((res) => {
//         res.items.forEach(async(itemRef) => {
//             let temp = await getDownloadURL(itemRef);
//             temp = String(temp.toString());
//             let img = {
//                 id: index,
//                 url: temp,
//             }
//             console.log(index + ": " + img.url);
//             urls.push(img);
//             index++;
//         });
//     }).catch((error) => {
//         console.log("Image URL error!");
//     });
//     return urls;
// }

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

const datas = [
    {
        id: "0",
        url: 'https://firebasestorage.googleapis.com/v0/b/dart-bd1be.appspot.com/o/images%2Fmario0.jpg?alt=media&token=520833ee-1590-45f6-95e8-eef6641069d8',
    },
    {
        id: "1",
        url: 'https://firebasestorage.googleapis.com/v0/b/dart-bd1be.appspot.com/o/images%2Fmario1.jpg?alt=media&token=e1fbaaa8-e0ef-44e0-93b0-fe0a3052bfcb',
    },
    {
        id: "2",
        url: 'https://firebasestorage.googleapis.com/v0/b/dart-bd1be.appspot.com/o/images%2Fmario4.jpg?alt=media&token=cf33a555-4f23-4e89-8f57-0b25c9d95063',
    },
    {
        id: "3",
        url: 'https://firebasestorage.googleapis.com/v0/b/dart-bd1be.appspot.com/o/images%2Fmario3.jpg?alt=media&token=208a07d6-3f17-4dbb-9900-c404832b382b',
    },
    {
        id: "4",
        url: 'https://firebasestorage.googleapis.com/v0/b/dart-bd1be.appspot.com/o/images%2Fmario2.jpg?alt=media&token=380a7b9d-a133-4f0e-886e-82a24f85f033',
    },
    {
        id: "5",
        url: 'https://firebasestorage.googleapis.com/v0/b/dart-bd1be.appspot.com/o/images%2Fmario5.jpg?alt=media&token=97041184-a60f-4b49-91dc-2be2ca62273c',
    },
    {
        id: "6",
        url: 'https://firebasestorage.googleapis.com/v0/b/dart-bd1be.appspot.com/o/images%2Fmario7.jpg?alt=media&token=7032d64d-7bb9-4bc3-9a3d-4f0965d36dfb',
    },
    {
        id: "7",
        url: 'https://firebasestorage.googleapis.com/v0/b/dart-bd1be.appspot.com/o/images%2Fmario6.jpg?alt=media&token=e865315d-318d-4c9b-bfa7-b88ec48706e5',
    },
];

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
        let index = 0;
    
        listAll(listRef).then((res) => {
            res.items.forEach(async(itemRef) => {
                let temp = await getDownloadURL(itemRef);
                temp = temp.toString();
                let img = {
                    id: index,
                    url: temp,
                }
                setImgs(getImgs => [...getImgs, img]);
                index++;
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

    useEffect(() => {
        const getDownload = async() => {
            await getURLs();
        }
        getDownload();
    }, []);

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
        <View>
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