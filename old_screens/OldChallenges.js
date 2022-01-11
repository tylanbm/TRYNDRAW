// import React and initialized variable state
import React, { useState } from 'react';

// import styles, custom buttons, text box
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput
} from 'react-native';

// import icon libraries
import {
  Entypo,
  Feather,
  FontAwesome,
  FontAwesome5,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';


// screen function
const ChallengesScreen = () => {

  // icons for challenge detail names
  const nameIcon = <MaterialIcons name='drive-file-rename-outline' size={20} color='black' />;
  const toolIcon = <Feather name='pen-tool' size={20} color='black' />;
  const colourIcon = <Ionicons name='color-palette' size={20} color='black' />;
  const timeIcon = <Ionicons name='time' size={20} color='black' />;

  // icons for challenge tools
  const toolBrush = <Entypo name='brush' size={40} color='black' />;
  const toolBucket = <Foundation name='paint-bucket' size={40} color='black' />;
  const toolKnife = <MaterialCommunityIcons name='knife' size={42} color='black' />;
  const toolPencil = <Entypo name='pencil' size={40} color='black' />;
  const toolUndo = <FontAwesome5 name='undo' size={40} color='black' />;
  const toolNone = <Feather name='x' size={40} color='black' />;

  // icons for challenge colours
  const colourBlack = <FontAwesome name='circle' size={40} color='black' />;
  const colourBlue = <FontAwesome name='circle' size={40} color='blue' />;
  const colourGreen = <FontAwesome name='circle' size={40} color='green' />;
  const colourGrey = <FontAwesome name='circle' size={40} color='grey' />;
  const colourOrange = <FontAwesome name='circle' size={40} color='darkorange' />;
  const colourRed = <FontAwesome name='circle' size={40} color='red' />;
  const colourNone = <FontAwesome name='circle-o' size={40} color='black' />;

  // challenge names
  const chall1 = 'Happy\nCats';
  const chall2 = 'Cat\nMan';
  const chall3 = 'Rainy\nCity';

  // variables for challenge selection colours; top buttons
  const [challColour1, setChallColour1] = useState('grey');
  const [challColour2, setChallColour2] = useState('grey');
  const [challColour3, setChallColour3] = useState('grey');

  // variable for challenge detail name
  const [challName, setChallName] = useState('Word1\nWord2');

  // variable for challenge detail tools
  const [tool1, setTool1] = useState(toolNone);
  const [tool2, setTool2] = useState(toolNone);
  const [tool3, setTool3] = useState(toolNone);
  const [toolName1, setToolName1] = useState('None');
  const [toolName2, setToolName2] = useState('None');
  const [toolName3, setToolName3] = useState('None');

  // variables for challenge detail colours
  const [colour1, setColour1] = useState(colourNone);
  const [colour2, setColour2] = useState(colourNone);
  const [colour3, setColour3] = useState(colourNone);
  const [colourName1, setColourName1] = useState('None');
  const [colourName2, setColourName2] = useState('None');
  const [colourName3, setColourName3] = useState('None');

  // variable for challenge detail time
  const [time, setTime] = useState('00:00');

  // switches between showing the "START DRAWING!" button and the "Enter text" text box
  const [showText, setShowText] = useState(false);

  // change the 1st tool
  const changeTool1 = (tool) => {
    switch(tool) {
      case 'brush':
        setTool1(toolBrush);
        setToolName1('Brush');
        break;
      
      case 'bucket':
        setTool1(toolBucket);
        setToolName1('Bucket');
        break;

      case 'knife':
        setTool1(toolKnife);
        setToolName1('Knife');
        break;
      
      case 'pencil':
        setTool1(toolPencil);
        setToolName1('Pencil');
        break;

      case 'undo':
        setTool1(toolUndo);
        setToolName1('Undo');
        break;

      default:
        setTool1(toolNone);
        setToolName1('None');
        break;
    }
  }

  // change the 2nd tool
  const changeTool2 = (tool) => {
    switch(tool) {
      case 'brush':
        setTool2(toolBrush);
        setToolName2('Brush');
        break;
      
      case 'bucket':
        setTool2(toolBucket);
        setToolName2('Bucket');
        break;

      case 'knife':
        setTool2(toolKnife);
        setToolName2('Knife');
        break;
      
      case 'pencil':
        setTool2(toolPencil);
        setToolName2('Pencil');
        break;

      case 'undo':
        setTool2(toolUndo);
        setToolName2('Undo');
        break;

      default:
        setTool2(toolNone);
        setToolName2('None');
        break;
    }
  }

  // change the 3rd tool
  const changeTool3 = (tool) => {
    switch(tool) {
      case 'brush':
        setTool3(toolBrush);
        setToolName3('Brush');
        break;
      
      case 'bucket':
        setTool3(toolBucket);
        setToolName3('Bucket');
        break;

      case 'knife':
        setTool3(toolKnife);
        setToolName3('Knife');
        break;
      
      case 'pencil':
        setTool3(toolPencil);
        setToolName3('Pencil');
        break;

      case 'undo':
        setTool3(toolUndo);
        setToolName3('Undo');
        break;

      default:
        setTool3(toolNone);
        setToolName3('None');
        break;
    }
  }

  // change the 1st colour
  const changeColour1 = (colour) => {
    switch(colour) {
      case 'black':
        setColour1(colourBlack);
        setColourName1('Black');
        break;
        
      case 'blue':
        setColour1(colourBlue);
        setColourName1('Blue');
        break;
  
      case 'green':
        setColour1(colourGreen);
        setColourName1('Green');
        break;
        
      case 'grey':
        setColour1(colourGrey);
        setColourName1('Grey');
        break;
  
      case 'orange':
        setColour1(colourOrange);
        setColourName1('Orange');
        break;

      case 'red':
        setColour1(colourRed);
        setColourName1('Red');
        break;
  
      default:
        setColour1(colourNone);
        setColourName1('None');
        break;
    }
  }

  // change the 2nd colour
  const changeColour2 = (colour) => {
    switch(colour) {
      case 'black':
        setColour2(colourBlack);
        setColourName2('Black');
        break;
        
      case 'blue':
        setColour2(colourBlue);
        setColourName2('Blue');
        break;
  
      case 'green':
        setColour2(colourGreen);
        setColourName2('Green');
        break;
        
      case 'grey':
        setColour2(colourGrey);
        setColourName2('Grey');
        break;
  
      case 'orange':
        setColour2(colourOrange);
        setColourName2('Orange');
        break;

      case 'red':
        setColour2(colourRed);
        setColourName2('Red');
        break;
  
      default:
        setColour2(colourNone);
        setColourName2('None');
        break;
    }
  }

  // change the 3rd colour
  const changeColour3 = (colour) => {
    switch(colour) {
      case 'black':
        setColour3(colourBlack);
        setColourName3('Black');
        break;
        
      case 'blue':
        setColour3(colourBlue);
        setColourName3('Blue');
        break;
  
      case 'green':
        setColour3(colourGreen);
        setColourName3('Green');
        break;
        
      case 'grey':
        setColour3(colourGrey);
        setColourName3('Grey');
        break;
  
      case 'orange':
        setColour3(colourOrange);
        setColourName3('Orange');
        break;

      case 'red':
        setColour3(colourRed);
        setColourName3('Red');
        break;
  
      default:
        setColour3(colourNone);
        setColourName3('None');
        break;
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle1}>Select a Challenge:</Text>

      {/* select challenge buttons */}
      <View style={{flexDirection: 'row'}}>

        {/* challenge 1 button */}
        <View style={styles.challButton}>
          <TouchableOpacity
            onPress={() => {
              setChallColour1('green')
              setChallColour2('grey')
              setChallColour3('grey')
              setChallName(chall1)
              changeTool1('brush')
              changeTool2('bucket')
              changeTool3('pencil')
              changeColour1('blue')
              changeColour2('black')
              changeColour3('red')
              setTime('05:00')
            }}>
            <Text style={[styles.challText, {backgroundColor: challColour1}]}>
              {chall1}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* challenge 2 button */}
        <View style={styles.challButton}>
        <TouchableOpacity
            onPress={() => {
              setChallColour1('grey')
              setChallColour2('green')
              setChallColour3('grey')
              setChallName(chall2)
              changeTool1('brush')
              changeTool2('undo')
              changeTool3('')
              changeColour1('orange')
              changeColour2('black')
              changeColour3('')
              setTime('02:00')
            }}>
            <Text style={[styles.challText, {backgroundColor: challColour2}]}>
              {chall2}
            </Text>
          </TouchableOpacity>
        </View>

        {/* challenge 3 button */}
        <View style={styles.challButton}>
        <TouchableOpacity
            onPress={() => {
              setChallColour1('grey')
              setChallColour2('grey')
              setChallColour3('green')
              setChallName(chall3)
              changeTool1('pencil')
              changeTool2('knife')
              changeTool3('undo')
              changeColour1('blue')
              changeColour2('black')
              changeColour3('grey')
              setTime('10:00')
            }}>
            <Text style={[styles.challText, {backgroundColor: challColour3}]}>
              {chall3}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.subtitle2}>Challenge Details</Text>
      
      {/* challenge details */}
      <View style={{width: 290}}>
        <View style={{flexDirection: 'row'}}>

          {/* challenge name */}
          <View style={styles.detailLeft}>
            <Text style={styles.detailName}>{nameIcon} Name</Text>
            <Text style={styles.detail}>{challName}</Text>
          </View>

          {/* challenge tools */}
          <View style={styles.detailRight}>
            <Text style={styles.detailName}>{toolIcon} Tools</Text>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.iconView}>
                <Text style={styles.detail}>{tool1}</Text>
                <Text style={styles.iconLabel}>{toolName1}</Text>
              </View>
              <View style={styles.iconView}>
                <Text style={styles.detail}>{tool2}</Text>
                <Text style={styles.iconLabel}>{toolName2}</Text>
              </View>
              <View style={styles.iconView}>
                <Text style={styles.detail}>{tool3}</Text>
                <Text style={styles.iconLabel}>{toolName3}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{flexDirection: 'row'}}>

          {/* challenge colours */}
          <View style={styles.detailLeft}>
            <Text style={styles.detailName}>{colourIcon} Colours</Text>
            <View style={{flexDirection: 'row'}}>
              <View style={styles.iconView}>
                <Text style={styles.detail}>{colour1}</Text>
                <Text style={styles.iconLabel}>{colourName1}</Text>
              </View>
              <View style={styles.iconView}>
                <Text style={styles.detail}>{colour2}</Text>
                <Text style={styles.iconLabel}>{colourName2}</Text>
              </View>
              <View style={styles.iconView}>
                <Text style={styles.detail}>{colour3}</Text>
                <Text style={styles.iconLabel}>{colourName3}</Text>
              </View>
            </View>
          </View>

          {/* challenge time */}
          <View style={styles.detailRight}>
            <Text style={styles.detailName}>{timeIcon} Time (min:sec)</Text>
            <Text style={styles.detail}>{time}</Text>
          </View>
        </View>
      </View>

      <View style={{marginTop: 10}}/>
      
      {/* "START DRAWING!" button and "Enter text" text box */}
      {showText ?
        <TextInput
          style={styles.textView}
          placeholder='Enter text'
        />
        :
        <View style={{width: 300}}>
          <TouchableOpacity
            onPress={() => setShowText(!showText)}>
            <Text style={styles.buttonText}>START DRAWING!</Text>
          </TouchableOpacity>
        </View>
      }
    </View>
  )
}

export default ChallengesScreen;


const styles = StyleSheet.create({

  // style for entire page
  container: {
    flex: 1,
    alignItems: 'center',
  },

  // "Select a Challenge:"
  subtitle1: {
    fontSize: 40,
    fontStyle: 'italic',
  },

  // challenge selection buttons
  challButton: {
    width: 120,
    height: 120,
  },

  // text within challenge buttons
  challText: {
    fontSize: 30,
    marginLeft: 10,
    marginRight: 10,
    textAlign: 'center',
    lineHeight: 50,
    borderRadius: 10,
  },

  // "Challenge Details"
  subtitle2: {
    fontSize: 35,
    fontWeight: 'bold',
  },

  // text for the detail categories
  detailName: {
    fontSize: 20,
    marginTop: 10,
  },

  // text and icons in the categories
  detail: {
    fontSize: 30,
    fontWeight: 'bold',
  },

  // left column details; name and colours
  detailLeft: {
    flexDirection: 'column',
    width: 100,
  },

  // right column details; Tools and Time
  detailRight: {
    flexDirection: 'column',
    marginLeft: 60,
  },

  // labels for challenge detail icons
  iconLabel: {
    fontSize: 12,
  },

  // how the challenge detail icons appear
  iconView: {
    flexDirection: 'column',
    alignItems: 'center',
    width: 45,
  },

  // "Enter text" text box
  textView: {
    fontSize: 25,
    width: 300,
  },

  // "START DRAWING!" button
  buttonText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'green',
    borderRadius: 10,
    textAlign: 'center',
  },

  // I think this formats the whole screen
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})