import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';
import { collection, doc, setDoc, query, orderBy, limit, getFirestore, getDoc } from 'firebase/firestore'

const db = getFirestore();

 

export default function DebugScreen() {


    const [data, setData] = useState([]);

    const [data2, setData2] = useState([]);

    const sampleData = [{ id: 0, title: "One" }, { id: 1, title: "Two" }]

    useEffect(() => {

        async function fetchData() {

            const docRef = doc(db, "characters", "testy");
            const docSnap = await getDoc(docRef);


            if (docSnap.exists()) {
                let gottenData = [];
                gottenData.push(docSnap.data())
                setData2(gottenData);
                 console.log("OUR REAL DATA: ", data2);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
            return
        }
        (async () => {
            await fetchData();
            
        })();

        setTimeout(() => {
            console.log("SAMPLEDATA: ", sampleData)
            setData(sampleData);
            

        }, 3000)


           

    }, [])

    
    const card = data.length > 0
        ? data.map(item => {
            return <Card style={styles.cardStyle}>
                <Text>{item.id} - {item.title}</Text>
            </Card>
        })

        : <Text>Loading...</Text>



    return (
        <View style={styles.container}>

            {card}

        </View>
    );
}

const styles = StyleSheet.create({
    container:
    {
        flex: 1,
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
    cardStyle:
    {
        backgroundColor: 'lightblue',
        padding: 20,
        margin: 20
    }

});