import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
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

const getData = async () => {

    const docRef = doc(db, "characters", "mario");
    const docSnap = await getDoc(docRef);
    let returnValue = "";

    if (docSnap.exists()) {
        returnValue = String(docSnap.data().specialAttack.toString());
        console.log("Document data yay:", returnValue);
    } else {
        // doc.data() will be undefined in this case
        returnValue="No document found!"
        console.log("No such document!");
    }
    returnValue = 'john'
    return returnValue;
    
}



//const q = query(messagesRef, orderBy('createdAt'), limit(5));

    //const [messages] = useCollectionData(q);

const GalleryScreen = () => {

    let meme = getData();
    console.log('Hooh:', meme)
    

    return (
        <View>
            <Text>Okay! {meme.toString()}</Text>
        </View>
    )
}

export default GalleryScreen

const styles = StyleSheet.create({})
