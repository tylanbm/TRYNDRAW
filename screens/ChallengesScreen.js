// import React and initialized variable state
import React, { useState } from 'react';

// import random word slug generator
import { generateSlug } from 'random-word-slugs';

// import styles, custom buttons, text box
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    FlatList,
} from 'react-native';

// import Ionicons icon library
import { Ionicons } from '@expo/vector-icons';

// make sure fonts are loaded
import AppLoading from 'expo-app-loading';

// Google Fonts
import { useFonts,
  WorkSans_700Bold,
} from '@expo-google-fonts/work-sans';


// slug generation format
const slugOptions = {
  format: 'title',
  partsOfSpeech: ['adjective', 'adjective', 'noun'],
}

// icons
const buttonIcon = <Ionicons
  name='arrow-forward'
  size={30}
  color='deepskyblue'
/>;
const emptybox = <Ionicons
  name='square-outline'
  size={20}
  color='black'
/>;
const checkbox = <Ionicons
  name='checkbox'
  size={20}
  color='deepskyblue'
/>;
const reload = <Ionicons
  name='reload'
  size={30}
  color='green'
/>;

/*generateSlug
use slug to put into state
*/

const ChallengesScreen = ({ navigation }) => {

  // which challenge to be selected
  const [selectedId, setSelectedId] = useState(0);

  // challenge data
  const [data, setData] = useState([
    {
      id: 0,
      slug: generateSlug(3, slugOptions)
    },
    {
      id: 1,
      slug: generateSlug(3, slugOptions)
    },
    {
      id: 2,
      slug: generateSlug(3, slugOptions)
    },
  ]);

  const reroll = () => {
    let temp_data = [...data];

        for (let i=0; i<3; i++) {
          let temp_elt = {...temp_data[i]};
          temp_elt.slug = generateSlug(3, slugOptions);
          temp_data[i] = temp_elt;
        }

    setData(temp_data);
  }

  const renderItem = ({ item }) => {
    const borderColor = item.id === selectedId ? 'deepskyblue' : 'transparent';
    const textColor = item.id === selectedId ? 'black' : 'grey';
    const icon = item.id === selectedId ? checkbox : emptybox;

    return (
        <TouchableOpacity
            onPress={() => setSelectedId(item.id)}
            style={[styles.challenge, {borderColor: borderColor}]}
        >
          <Text style={[styles.challengeText,
            {color: textColor}]}>{icon} "{item.slug}"</Text>
        </TouchableOpacity>
    );
  };

  // check if imported Google Fonts were loaded
  let [fontsLoaded] = useFonts({
    WorkSans_700Bold,
  });
  if (!fontsLoaded) return <AppLoading />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What do you want to draw?</Text>
      
      <SafeAreaView style={{maxHeight: 200}}>
        <FlatList
          data={data}
          renderItem={renderItem}
        />
      </SafeAreaView>

      <View style={{alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Canvas', data[selectedId].slug);
          }}
          style={styles.start}>
          <Text style={styles.startText}>Start Drawing! {buttonIcon}</Text>  
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => reroll()}
          style={styles.reroll}>
          <Text style={styles.rerollText}>Re-Roll {reload}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.2)" />
    </View>
  )
}

export default ChallengesScreen;


// global padding
let padChal = 15;
//let padExit = 5;

const styles = StyleSheet.create({
  
  // entire page
  container: {
    flex: 1,
    justifyContent: 'center',
  },

  // page title
  title: {
    fontSize: 40,
    fontFamily: 'WorkSans_700Bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  // individual challenge selection buttons
  challenge: {
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 20,
    borderWidth: 2,
    paddingLeft: padChal,
    paddingRight: padChal,
  },

  // challenge selection button text
  challengeText: {
    fontSize: 20,
    fontFamily: 'WorkSans_700Bold',
  },

  // 'Start drawing!' button
  start: {
    width: '75%',
    marginTop: 20,
    marginBottom: 10,
    borderColor: 'deepskyblue',
    borderRadius: 20,
    borderWidth: 2,
    paddingLeft: padChal,
    paddingRight: padChal,
  },

  // 'Start drawing!'
  startText: {
    fontSize: 30,
    fontFamily: 'WorkSans_700Bold',
    textAlign: 'center',
    color: 'deepskyblue',
  },

  // 'Re-Roll' button
  reroll: {
    width: '75%',
    marginTop: 20,
    marginBottom: 10,
    borderColor: 'green',
    borderRadius: 20,
    borderWidth: 2,
    paddingLeft: padChal,
    paddingRight: padChal,
  },

  // 'Re-Roll'
  rerollText: {
    fontSize: 30,
    fontFamily: 'WorkSans_700Bold',
    textAlign: 'center',
    color: 'green',
  },

  // // 'Back to Home' button
  // home: {
  //   marginTop: 20,
  //   borderColor: 'red',
  //   borderRadius: 25,
  //   borderWidth: 2,
  //   paddingLeft: padExit,
  //   paddingRight: padExit,
  //   paddingTop: padExit,
  //   paddingBottom: padExit,
  // },

  // // 'Back to Home'
  // homeText: {
  //   fontSize: 20,
  //   fontFamily: 'WorkSans_700Bold',
  //   color: 'red',
  // },
});