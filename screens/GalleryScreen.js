import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {collection, doc, setDoc, query, orderBy, limit, getFirestore,getDoc} from 'firebase/firestore'


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

    const docRef = doc(db, "characters", "testy");
    const docSnap = await getDoc(docRef);
    let returnVal = '';

    if (docSnap.exists()) {
        returnVal = String(docSnap.data().title.toString());
        console.log("Document data:", returnVal);
    } else {
        // doc.data() will be undefined in this case
        returnVal = "No document found!";
        console.log("No such document!");
    }
    return returnVal;
}


//const q = query(messagesRef, orderBy('createdAt'), limit(5));
//const [messages] = useCollectionData(q);

const GalleryScreen = () => {
    
    const [data, setData] = useState('');

    useEffect(() => {
        const getIt = async() => {
            setData(await getData());
        }
        getIt();
    })

    return (
        <View>
            <Text>I use {data}</Text>
        </View>
    )
}

export default GalleryScreen;

const styles = StyleSheet.create({})