// import everything and ability to change consts
import React, { useState } from 'react';

// import styles, text, view, buttons
import { StyleSheet,
    Text,
    View,
    Button,
    TouchableOpacity } from 'react-native';

// import authentication
import { getAuth,
    signOut,
    onAuthStateChanged } from 'firebase/auth';

// import icon libraries
import { AntDesign } from '@expo/vector-icons';


// screen function
const SettingsScreen = () => {

    const auth = getAuth();
    const user = auth.currentUser;

    // set what the text says at the bottom of the screen
    const [textInfo, setTextInfo] = useState('');

    // set colours to button clicks
    const [iconColour1, setIconColour1] = useState('grey');
    const [iconColour2, setIconColour2] = useState('grey');
    const [buttonColour1, setButtonColour1] = useState('grey');
    const [buttonColour2, setButtonColour2] = useState('grey');

    // heart icon for both buttons
    const heart1 = <AntDesign name='heart' size={15} color={iconColour1} />;
    const heart2 = <AntDesign name='heart' size={15} color={iconColour2} />;

    // sign out button
    const signOutUser = () => {
        signOut(auth).then(() => {
            // Sign out successful.
            console.log('Signed out');
            global.signedIn = false;
        }).catch((error) => {
            // An error happened.
            console.log('Sign out error!')
        });
    }

    return (
        <View style={styles.container}>

            {/* sign out button */}
            <View style={styles.signout}>
                <Button
                    title="Sign Out"
                    onPress={() => signOutUser()}
                />
            </View>

            

            {/* divider line */}
            <View style={styles.divider} />

            <View style={{marginTop: 150}}>

                {/* SETTINGS button */}
                <TouchableOpacity
                    onPress={() => {
                        setTextInfo('Set your things')
                        setButtonColour1('green')
                        setButtonColour2('grey')
                        setIconColour1('green')
                        setIconColour2('grey')
                    }}
                    style={styles.buttonStyle}
                    >
                    <Text style={{fontWeight: 'bold', color: buttonColour1}}>SETTINGS</Text>
                    <Text style={styles.icon}>{heart1}</Text>
                </TouchableOpacity>

                <View style={{marginTop: 10}}/>
                
                {/* APP INFO button */}
                <TouchableOpacity
                    onPress={() => {
                        setTextInfo('This is an app where you can draw things')
                        setButtonColour1('grey')
                        setButtonColour2('green')
                        setIconColour1('grey')
                        setIconColour2('green')
                    }}
                    style={styles.buttonStyle}
                    >
                    <Text style={{fontWeight: 'bold', color: buttonColour2}}>APP INFO</Text>
                    <Text style={styles.icon}>{heart2}</Text>
                </TouchableOpacity>
            </View>

            {/* info text at the bottom of the screen */}
            <View style={styles.info}>
                <Text>{textInfo}</Text>
            </View>
        </View>
    )
}

export default SettingsScreen;


const styles = StyleSheet.create({

    // style for entire screen
    container: {
        flex: 1,
    },

    signout: {
        alignItems: 'center',
        marginTop: 25,
    },

    // divider line below SIGN OUT button
    divider: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        marginTop: 50,
    },

    // both buttons
    buttonStyle: {
        flexDirection: 'row',
        width: '95%',
    },

    // heart icon
    icon: {
        flex: 1,
        textAlign: 'right',
    },

    // info from button clicks
    info: {
        marginTop: 100,
        alignItems: 'center',
    },
});