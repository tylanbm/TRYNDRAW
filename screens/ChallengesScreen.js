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


// slug generation format
const slugOptions = {
  format: 'title',
  partsOfSpeech: ['adjective', 'adjective', 'noun'],
}

// generated slugs
const slug1 = generateSlug(3, slugOptions);
const slug2 = generateSlug(3, slugOptions);
const slug3 = generateSlug(3, slugOptions);

// icons
const buttonIcon = <Ionicons name='arrow-forward' size={25} color='deepskyblue' />;
const n = <Ionicons name='square-outline' size={20} color='black' />;
const y = <Ionicons name='checkbox' size={20} color='deepskyblue' />;


const ChallengesScreen = () => {

  // challenge selection number
  const [select, setSelect] = useState(0);

  // display text below "Start Drawing!"
  const [drawing, setDrawing] = useState('');

  // icon checkmark change
  const [check1, setCheck1] = useState(n);
  const [check2, setCheck2] = useState(n);
  const [check3, setCheck3] = useState(n);

  // text colour change
  const [text1, setText1] = useState('grey');
  const [text2, setText2] = useState('grey');
  const [text3, setText3] = useState('grey');

  // border colour change
  const [border1, setBorder1] = useState('transparent');
  const [border2, setBorder2] = useState('transparent');
  const [border3, setBorder3] = useState('transparent');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What do you want to draw?</Text>

      <TouchableOpacity
        onPress={() => {
          // set selection to 1st slug
          setSelect(1);
          setCheck1(y);
          setCheck2(n);
          setCheck3(n);
          setBorder1('deepskyblue');
          setBorder2('transparent');
          setBorder3('transparent');
          setText1('black');
          setText2('grey');
          setText3('grey');
        }}
        style={[styles.challenge, {borderColor: border1}]}>
        <Text style={[styles.challengeText, {color: text1}]}>
          {check1} "{slug1}"</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          // set selection to 2nd slug
          setSelect(2);
          setCheck1(n);
          setCheck2(y);
          setCheck3(n);
          setBorder1('transparent');
          setBorder2('deepskyblue');
          setBorder3('transparent');
          setText1('grey');
          setText2('black');
          setText3('grey');
        }}
        style={[styles.challenge, {borderColor: border2}]}>
        <Text style={[styles.challengeText, {color: text2}]}>
          {check2} "{slug2}"</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          // set selection to 3rd slug
          setSelect(3);
          setCheck1(n);
          setCheck2(n);
          setCheck3(y);
          setBorder1('transparent');
          setBorder2('transparent');
          setBorder3('deepskyblue');
          setText1('grey');
          setText2('grey');
          setText3('black');
        }}
        style={[styles.challenge, {borderColor: border3}]}>
        <Text style={[styles.challengeText, {color: text3}]}>
          {check3} "{slug3}"</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          switch(select) {

            // print option 1
            case 1:
              setDrawing('1');
              break;

            // print option 2
            case 2:
              setDrawing('2');
              break;
              
            // print option 3
            case 3:
              setDrawing('3');
              break;

            // print invalid option
            default:
              setDrawing('Please select a challenge.');
              break;
          }
        }}
        style={styles.button}>
        <Text style={styles.buttonText}>Start Drawing! {buttonIcon}</Text>
      </TouchableOpacity>

      <Text style={{fontSize: 15}}>{drawing}</Text>
    </View>
  )
}

export default ChallengesScreen;


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
    fontWeight: 'bold',
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
    paddingLeft: 10,
  },

  // challenge selection button text
  challengeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  // 'START DRAWING' button
  button: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 25,
    fontWeight: 'bold',
    borderColor: 'deepskyblue',
    borderRadius: 20,
    borderWidth: 2,
    paddingLeft: 10,
    paddingRight: 10,
  },

  // 'START DRAWING!'
  buttonText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'deepskyblue',
  }
})