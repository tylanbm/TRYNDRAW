// import all of React
import React from 'react';

// import styles
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';


/* props:
    url
    size
    left
    vertical
*/
const ProfileImage = (props) => {
    return (
        <Image
            source={{ uri: props.url }}
            style={[styles.profileImage,
                {
                    width: props.size,
                    marginLeft: props.left,
                    marginVertical: props.vertical,
                }
            ]}
        />
    );
};

export default ProfileImage;


const styles = StyleSheet.create({

    // user's profile photo
    profileImage: {
        aspectRatio: 1,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.5)',
    },
});