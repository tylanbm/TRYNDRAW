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
import { useFonts, WorkSans_700Bold } from '@expo-google-fonts/work-sans';


// slug generation format
const slugOptions = {
  format: 'title',
  partsOfSpeech: ['adjective', 'adjective', 'noun'],
}

// icons
const buttonIcon = <Ionicons name='arrow-forward' size={25} color='deepskyblue' />;
const no = <Ionicons name='square-outline' size={20} color='black' />;
const yes = <Ionicons name='checkbox' size={20} color='deepskyblue' />;
const exit = <Ionicons name='arrow-back' size={20} color='red' />;


const ChallengesScreen = ({ navigation }) => {

  // generated slugs
  const [slug1, setSlug1] = useState(generateSlug(3, slugOptions));
  const [slug2, setSlug2] = useState(generateSlug(3, slugOptions));
  const [slug3, setSlug3] = useState(generateSlug(3, slugOptions));

  // selected slug
  const [select, setSelect] = useState('');

  // icon checkmark change
  const [check1, setCheck1] = useState(no);
  const [check2, setCheck2] = useState(no);
  const [check3, setCheck3] = useState(no);

  // text colour change
  const [text1, setText1] = useState('grey');
  const [text2, setText2] = useState('grey');
  const [text3, setText3] = useState('grey');

  // border colour change
  const [border1, setBorder1] = useState('transparent');
  const [border2, setBorder2] = useState('transparent');
  const [border3, setBorder3] = useState('transparent');

  // note to tell users to select a challenge
  const [note, setNote] = useState('Please select a challenge.');
  const [noteColour, setNoteColour] = useState('black');

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
          setSelect(slug1);
          setCheck1(yes);
          setCheck2(no);
          setCheck3(no);
          setBorder1('deepskyblue');
          setBorder2('transparent');
          setBorder3('transparent');
          setText1('black');
          setText2('grey');
          setText3('grey');
          setNote('');
        }}
        style={[styles.challenge, {borderColor: border1}]}>
        <Text style={[styles.challengeText, {color: text1}]}>
          {check1} "{slug1}"</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          // set selection to 2nd slug
          setSelect(slug2);
          setCheck1(no);
          setCheck2(yes);
          setCheck3(no);
          setBorder1('transparent');
          setBorder2('deepskyblue');
          setBorder3('transparent');
          setText1('grey');
          setText2('black');
          setText3('grey');
          setNote('');
        }}
        style={[styles.challenge, {borderColor: border2}]}>
        <Text style={[styles.challengeText, {color: text2}]}>
          {check2} "{slug2}"</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          // set selection to 3rd slug
          setSelect(slug3);
          setCheck1(no);
          setCheck2(no);
          setCheck3(yes);
          setBorder1('transparent');
          setBorder2('transparent');
          setBorder3('deepskyblue');
          setText1('grey');
          setText2('grey');
          setText3('black');
          setNote('');
        }}
        style={[styles.challenge, {borderColor: border3}]}>
        <Text style={[styles.challengeText, {color: text3}]}>
          {check3} "{slug3}"</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          if (!select) setNote('Please select a challenge.');
          else navigation.navigate('Details', select);
        }}
        style={styles.button}>
        <Text style={styles.buttonText}>Start Drawing! {buttonIcon}</Text>  
      </TouchableOpacity>

      <Text style={styles.note}>{note}</Text>

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
        <Text style={styles.homeText}>{exit} Home</Text>
      </TouchableOpacity>
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

  // note message
  note: {
    marginTop: 10,
    marginBottom: 10,
    fontFamily: 'WorkSans_700Bold',
  }
});