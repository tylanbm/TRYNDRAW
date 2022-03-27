// import all of React
import React from 'react';

// import styles
import {
    StyleSheet,
    Image,
} from 'react-native';


/* props:
    url
    size
*/
const ProfileImage = (props) => {
    return (
        <Image
            source={{ uri: props.url }}
            style={[styles.profileImage,
                {
                    width: props.size,
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
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.5)',
        alignSelf: 'center',
    },
});