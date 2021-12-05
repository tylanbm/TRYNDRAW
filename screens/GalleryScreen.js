import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {collection, doc, setDoc, query, orderBy, limit} from 'firebase/firestore'


const GalleryScreen = () => {

    /*
    const messagesRef = collection("messages");
    await setDoc(doc(messagesRef, "SF"), {
        msg: "San Francisco is a place" 
    });
    await setDoc(doc(messagesRef, "TI"), {
        msg: "Tyrell loves to buy icecream in SF"
    });
    */
    //const q = query(messagesRef, orderBy('createdAt'), limit(5));

    //const [messages] = useCollectionData(q);


    return (
        <View>
            <Text>This is a text component</Text>
        </View>
    )
}

export default GalleryScreen

const styles = StyleSheet.create({})
