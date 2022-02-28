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
import FullButton from '../components/FullButton';


// slug generation format
const slugOptions = {
  format: 'sentence',
  partsOfSpeech: ['adjective', 'adjective', 'noun'],
}

// icons
const emptybox = <Ionicons name='square-outline' size={20} color='#9AAAAC' />;
const checkbox = <Ionicons name='checkbox' size={20} color='#60B1B6' />;

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
    const borderColor = item.id === selectedId ? '#60B1B6' : 'transparent';
    const textColor = item.id === selectedId ? '#60B1B6' : '#9AAAAC';
    const textWeight = item.id === selectedId ? 'bold' : 'normal';
    const icon = item.id === selectedId ? checkbox : emptybox;

    return (
        <TouchableOpacity
            onPress={() => setSelectedId(item.id)}
            style={[styles.challenge, {borderColor: borderColor}, {flexDirection:"row"}]}
        >
          <Text>{icon}</Text>
          <Text style={[styles.challengeText,
            {color: textColor}, {fontWeight: textWeight}]}>{item.slug}</Text>
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
      <View style={{marginTop: 90}}/>
      <Text style={styles.title}>What do you want to draw?</Text>
      <View style={{marginTop: 50}}/>

      <SafeAreaView>
        <FlatList
          data={data}
          renderItem={renderItem}
        />
      </SafeAreaView>

      <View style={{alignItems: 'center'}}>
        <TouchableOpacity
          onPress={() => {
            let temp_data = [...data];

            for (let i=0; i<3; i++) {
              let temp_elt = {...temp_data[i]};
              temp_elt.slug = generateSlug(3, slugOptions);
              temp_data[i] = temp_elt;
            }

            setData(temp_data);
          }}
          >
        </TouchableOpacity>
      </View>
      
      
      <View style={{marginTop: 30}}/>
      
      <View style={{marginHorizontal: 32}}>
        <FullButton onPress={() => reroll()} text={'Reroll selection'} backgroundColor={'white'} textColor={'#60B1B6'} borderColor={'#60B1B6'}></FullButton>
      </View>

      <View style={{marginTop: 80}}/>

      
        <FullButton onPress={() => {
            navigation.navigate('Canvas', data[selectedId].slug);
          }} text={'Start drawing'} backgroundColor={'#60B1B6'} textColor={'white'} borderColor={'transparent'}>
        </FullButton>
      
      

      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.2)" />
    </View>
  )
}

export default ChallengesScreen;

const styles = StyleSheet.create({
  
  // entire page
  container: {
    flex:1,
    marginHorizontal: 24,
  },
 
  // page title
  title: {
    fontSize: 40,
  //  fontFamily: 'WorkSans_700Bold',
    textAlign: 'center',
  },

  // individual challenge selection buttons
  challenge: {
    marginBottom: 8,
    borderRadius: 5,
    borderWidth: 1,
    padding: 16,
    alignItems:"center"
  },

  // challenge selection button text
  challengeText: {
    fontSize: 20,
    marginLeft: 8,
 //   fontFamily: 'WorkSans_700Bold',
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