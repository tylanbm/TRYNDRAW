// import React and initialized variable state
import React, { useState } from 'react';

// import random word slug generator
import { generateSlug } from 'random-word-slugs';

// import styles, custom buttons, text box
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput
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
const buttonIcon = <Ionicons name='arrow-forward' size={25} color='deepskyblue' />;
const checkbox = <Ionicons name='square-outline' size={20} color='black' />;
const emptybox = <Ionicons name='checkbox' size={20} color='deepskyblue' />;
const exitIcon = <Ionicons name='arrow-back' size={20} color='red' />;


const ChallengesScreen = ({ navigation }) => {

  // generated slugs
  const [slug1, setSlug1] = useState(generateSlug(3, slugOptions));
  const [slug2, setSlug2] = useState(generateSlug(3, slugOptions));
  const [slug3, setSlug3] = useState(generateSlug(3, slugOptions));

  // selected slug
  const [selectedSlug, setSelectedSlug] = useState(slug1);

  // icon checkmark change
  const [box1, setBox1] = useState(checkbox);
  const [box2, setBox2] = useState(emptybox);
  const [box3, setBox3] = useState(emptybox);

  // text colour change
  const [textColour1, setTextColour1] = useState('black');
  const [textColour2, setTextColour2] = useState('grey');
  const [textColour3, setTextColour3] = useState('grey');

  // border colour change
  const [border1, setBorder1] = useState('deepskyblue');
  const [border2, setBorder2] = useState('transparent');
  const [border3, setBorder3] = useState('transparent');

  // check if imported Google Fonts were loaded
  let [fontsLoaded] = useFonts({
    WorkSans_700Bold,
  });
  if (!fontsLoaded) return <AppLoading />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What do you want to draw?</Text>

      <TouchableOpacity
        onPress={() => {
          // set selection to 1st slug
          setSelectedSlug(slug1);
          setBox1(checkbox);
          setBox2(emptybox);
          setBox3(emptybox);
          setBorder1('deepskyblue');
          setBorder2('transparent');
          setBorder3('transparent');
          setText1('black');
          setText2('grey');
          setText3('grey');
        }}
        style={[styles.challenge, {borderColor: border1}]}>
        <Text style={[styles.challengeText, {color: text1}]}>
          {box1} "{slug1}"</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          // set selection to 2nd slug
          setSelectedSlug(slug2);
          setBox1(emptybox);
          setBox2(checkbox);
          setBox3(emptybox);
          setBorder1('transparent');
          setBorder2('deepskyblue');
          setBorder3('transparent');
          setText1('grey');
          setText2('black');
          setText3('grey');
        }}
        style={[styles.challenge, {borderColor: border2}]}>
        <Text style={[styles.challengeText, {color: text2}]}>
          {box2} "{slug2}"</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          // set selection to 3rd slug
          setSelectedSlug(slug3);
          setBox1(emptybox);
          setBox2(emptybox);
          setBox3(checkbox);
          setBorder1('transparent');
          setBorder2('transparent');
          setBorder3('deepskyblue');
          setText1('grey');
          setText2('grey');
          setText3('black');
        }}
        style={[styles.challenge, {borderColor: border3}]}>
        <Text style={[styles.challengeText, {color: text3}]}>
          {box3} "{slug3}"</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Canvas', select);
        }}
        style={styles.button}>
        <Text style={styles.buttonText}>Start Drawing! {buttonIcon}</Text>  
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          setSlug1(generateSlug(3, slugOptions));
          setSlug2(generateSlug(3, slugOptions));
          setSlug3(generateSlug(3, slugOptions));
        }}
        style={styles.reroll}>
        <Text style={styles.rerollText}>Re-Roll</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}
        style={styles.home}>
        <Text style={styles.homeText}>{exitIcon} Home</Text>
      </TouchableOpacity>

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.2)" />
    </View>
  )
}

export default ChallengesScreen;


// global padding
let padChal = 10;
let padExit = 5;

const styles = StyleSheet.create({
  
  // entire page
  container: {
    flex: 1,
    alignItems: 'center',
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
    width: '95%',
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 20,
    borderWidth: 2,
    paddingLeft: padChal,
  },

  // challenge selection button text
  challengeText: {
    fontSize: 20,
    fontFamily: 'WorkSans_700Bold',
  },

  // 'Start drawing!' button
  button: {
    marginTop: 20,
    marginBottom: 10,
    borderColor: 'deepskyblue',
    borderRadius: 20,
    borderWidth: 2,
    paddingLeft: padChal,
    paddingRight: padChal,
  },

  // 'Start drawing!'
  buttonText: {
    fontSize: 25,
    fontFamily: 'WorkSans_700Bold',
    color: 'deepskyblue',
  },

  reroll: {
    marginTop: 20,
    marginBottom: 10,
    borderColor: 'green',
    borderRadius: 20,
    borderWidth: 2,
    paddingLeft: padChal,
    paddingRight: padChal,
  },

  rerollText: {
    fontSize: 25,
    fontFamily: 'WorkSans_700Bold',
    color: 'green',
  },

  // 'Back to Home' button
  home: {
    marginTop: 20,
    borderColor: 'red',
    borderRadius: 25,
    borderWidth: 2,
    paddingLeft: padExit,
    paddingRight: padExit,
    paddingTop: padExit,
    paddingBottom: padExit,
  },

  // 'Back to Home'
  homeText: {
    fontSize: 20,
    fontFamily: 'WorkSans_700Bold',
    color: 'red',
  },
});