// impot React
import React, { useEffect, useState } from 'react';

// import all React Native components
import { StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    Image,
    ImageBackground,
    Dimensions,
    KeyboardAvoidingView,
    FlatList,
    SafeAreaView,
    Modal,
} from 'react-native';

// import Firestore docs
import {
    collection,
    doc,
    setDoc,
    getFirestore,
    getDoc,
    getDocs,
    query,
    orderBy,
    limit,
    startAfter,
    serverTimestamp,
    onSnapshot,
} from 'firebase/firestore';

// import all Firebase Storage components
import {
    getStorage,
    ref,
    getDownloadURL,
} from 'firebase/storage';

// import Firebase authentication
import { auth } from '../firebaseConfig';

// import screen scrolling
import { ScrollView } from 'react-native-gesture-handler';

// Google Fonts
import { useFonts,
    WorkSans_700Bold,
    WorkSans_500Medium,
} from '@expo-google-fonts/work-sans';

// make sure fonts are loaded
import AppLoading from 'expo-app-loading';

// import custom buttons and profile image
import FullButton from '../components/FullButton';
import IonButton from '../components/IonButton';
import ProfileImage from '../components/ProfileImage';


// get Firestore Database and Storage
const db = getFirestore();
const storage = getStorage();

// snapshot for entire comments subcollection
let snapshot = null;

// get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// // test
// const TestComments = [
//     {
//         id: '1',
//         text: 'Hello I am dog',
//     },
//     {
//         id: '2',
//         text: 'Banana Saaaaam is my hero!',
//     },
//     {
//         id: '3',
//         text: 'Greetings, brother 🖖',
//     },
// ];

// comments
const Item = ({ title, user, userImage }) => {
    return (
        <View style={styles.commentsSpacing}>
            <ProfileImage
                url={userImage}
                size={45}
            />
            <View style={{marginLeft: '2%'}}>
                <Text style={styles.commentUsernameText}>{user}</Text>
                <Text style={styles.commentText}>{title}</Text>
            </View>
        </View>
    )
};


const ImageScreen = ({ route, navigation }) => {

    // props from ImageButton
    const {imageSourceToLoad, imageId, screen} = route.params;
    //console.log('SOURCE: ' + imageSourceToLoad);
    //console.log('ID: ' + imageId);

    // number of comments
    const [commentsLength, setCommentsLength] = useState(0);
    const [s, setS] = useState('');

    // modal visibility
    const [modalVisible, setModalVisible] = useState(false);

    // arrays of comments
    const [get2Comments, set2Comments] = useState([]);
    const [getAllComments, setAllComments] = useState([]);

    // post comment
    const [getComment, setComment] = useState('');

    // image metadata
    const [imageUsername, setImageUsername] = useState('Default');
    const [imageTitle, setImageTitle] = useState('Default');
    const [userImageUrl, setUserImageUrl] = useState('Default');

    // render FlatList of comments
    const renderItem = ({ item }) => (
        <Item title={item.text}
            user={item.username}
            userImage={item.userImageSource}
        />
    );

    // click the like button
    const likeImage = () => {
        console.log('You liked the image');
    }

    // click the dislike button
    const dislikeImage = () => {
        console.log('You disliked the image');
    }

    // click the flag button
    const reportImage = () => {
        console.log('You reported the image');
    }

    // get the image's user data
    const getUserData = async() => {

        const docRef = doc(db, 'uniqueImageNames', imageId);
        const docSnap = await getDoc(docRef);
        const docSnapData = docSnap.data();

        const userId = docSnapData.imageAuthorUID;
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
        const userSnapData = userSnap.data();

        console.log('ImageId: ' + imageId);

        if (docSnap.exists()) {
            setImageUsername(docSnapData.imageAuthorUsername);
            setImageTitle(docSnapData.imageTitle);

            // if profile image does not exist, use default profile image
            if (userSnapData.profileImageSet) {
                const temp = await getDownloadURL(ref(storage,
                    'userProfileImages/' + userId));
                setUserImageUrl(temp);
            }
            else {
                const temp = await getDownloadURL(ref(storage,
                    'userProfileImages/profileImage.jpg'));
                setUserImageUrl(temp);
            }
            
        } else {
            // docData does not exist
            console.log('No such document!');
        }

        await loadComments();
    }

    // initial comment load
    const loadComments = async() => {
        await get2CommentsData();
        // if (commentsLength != 1) setS('s');
        // else setS('');

        console.log('Comments: ' + get2Comments);
    }

    // get data from all the comments
    const get2CommentsData = async() => {

        // Create a new document with the image ID
        const commentsRef = collection(db, 'uniqueImageNames', imageId, 'comments');

        // create the 2 comments query
        const q2 = query(commentsRef,
            orderBy('timestamp', 'desc'),
            limit(2));
        const snapshot2 = await getDocs(q2);

        onSnapshot(query(commentsRef,
            orderBy('timestamp', 'desc')),
            { includeMetadataChanges: false },
            async(snapshotAll) => {
                
            // check if writes and type are both false
            const writes = snapshotAll.metadata.hasPendingWrites;
            let changeType = false;
            snapshotAll.docChanges().forEach((change) => {
                if (change.type == 'added') {
                    changeType = true;
                }
            })
            console.log(writes + ' ' + changeType);
    
            // if both are false, refresh the images
            if (!writes && changeType) {
                console.log('Change ' + new Date().getSeconds());
                setAllComments([]);
                await getAllCommentsData(snapshotAll);
            }
            else console.log('Do not change ' + new Date().getSeconds());
        });

        console.log('Snapshots gotten!');
        
        if (snapshot2 != null) {
            snapshot2.forEach(async(item) => {

                const itemData = item.data();
                const commentUserID = itemData.commentAuthorID;

                const userRef = doc(db, 'users', commentUserID);
                const userSnap = await getDoc(userRef);
                const userSnapData = userSnap.data();

                let commentUserImageUrl = 'Default';

                // if profile image does not exist, use default profile image
                if (userSnapData.profileImageSet) {
                    const temp = await getDownloadURL(ref(storage,
                        'userProfileImages/' + commentUserID));
                    commentUserImageUrl = temp;
                }
                else {
                    const temp = await getDownloadURL(ref(storage,
                        'userProfileImages/profileImage.jpg'));
                    commentUserImageUrl = temp;
                }
                
                console.log('Profile image: ' + commentUserImageUrl);
                
                let aComment = {
                    id: item.id,
                    text: itemData.commentText,
                    username: itemData.commentAuthorUsername,
                    userId: commentUserID,
                    userImageSource: commentUserImageUrl,
                }
                set2Comments(get2Comments => [...get2Comments, aComment]);
            });
        } else {
            console.log('No such query snapshot!');
        }
    }

    // get data from all the comments
    const getAllCommentsData = async(snapshotAll) => {
        if (snapshotAll != null) {
            snapshotAll.forEach(async(item) => {

                const itemData = item.data();
                const commentUserID = itemData.commentAuthorID;

                const userRef = doc(db, 'users', commentUserID);
                const userSnap = await getDoc(userRef);
                const userSnapData = userSnap.data();

                let commentUserImageUrl = 'Default';
                // if profile image does not exist, use default profile image
                if (userSnapData.profileImageSet) {
                    const temp = await getDownloadURL(ref(storage,
                        'userProfileImages/' + commentUserID));
                    commentUserImageUrl = temp;
                }
                else {
                    const temp = await getDownloadURL(ref(storage,
                        'userProfileImages/profileImage.jpg'));
                    commentUserImageUrl = temp;
                }
                
                console.log('Profile image: ' + commentUserImageUrl);
                
                let aComment = {
                    id: item.id,
                    text: itemData.commentText,
                    username: itemData.commentAuthorUsername,
                    userId: commentUserID,
                    userImageSource: commentUserImageUrl,
                }
                setAllComments(getAllComments => [...getAllComments, aComment]);
            });
        } else {
            console.log('No such query snapshot!');
        }
        setCommentsLength(snapshotAll.docs.length);
    }

    // click the image
    const openImage = () => {
        console.log('Touched image');
    }
  
    // initial load
    useEffect(() => {
        getUserData();


    }, []);

    // upon first modal open, load all comments
    // upon all subsequent modal opens, don't reload comments
    const openModal = async() => {
        setModalVisible(true);
    }

    // post comment
    const postComment = async(comment) => {
        //console.log('You posted a comment');
        console.log('You commented: ' + comment);

        // Create a new document ref with an autogenerated id
        const newCommentRef = doc(collection(
            db, 'uniqueImageNames',
            imageId, 'comments',
        ));

        const currUser = auth.currentUser;
        // Add a new document in collection 'cities'
        await setDoc(newCommentRef, {
            commentText: comment,
            commentAuthorID: currUser.uid,
            commentAuthorUsername: currUser.displayName,
            timestamp: serverTimestamp(),
        });

        setComment('');
        set2Comments([]);
        await loadComments();
    }

    //console.log('Got ID:' + imageId);

    // check if imported Google Fonts were loaded
    let [fontsLoaded] = useFonts({
        'Bold': WorkSans_700Bold,
        'Medium': WorkSans_500Medium,
    });
    if (!fontsLoaded) return <AppLoading />;

  
    return (
        <KeyboardAvoidingView behavior='padding'>
            <ScrollView>
                <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={() => openImage()}>
                        <ImageBackground
                            source={{ uri: imageSourceToLoad }}
                            style={styles.imageStyle}
                        >
                            <View style={styles.arrow}>
                                <IonButton
                                    name='arrow-back'
                                    onPress={() => navigation.navigate(screen)}
                                    color='#979797'
                                    size={30}
                                    style={styles.ionStyle}
                                />
                            </View>
                            <View style={styles.heart}>
                                <IonButton
                                    name='heart'
                                    onPress={() => likeImage()}
                                    color='#979797'
                                    size={30}
                                    style={styles.ionStyle}
                                />
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                </View>

                <View style={styles.imageFooterContainer}>
                    <View style={{marginHorizontal: '1%'}}/>
                        <View style={styles.profileView}>
                            <ProfileImage
                                url={userImageUrl}
                                size={50}
                            />
                        </View>
                        <View style={styles.imageFooterText}>
                            <Text style={styles.imageNameText}>{imageTitle}</Text>
                            <Text style={styles.usernameText}>by {imageUsername}</Text>
                        </View>
                        <View style={styles.report}>
                            <IonButton
                                name='flag'
                                onPress={() => reportImage()}
                                size={30}
                                color='#979797'
                                style={styles.ionStyle}
                            />
                        </View>
                    </View>

                <View style={styles.commentsContainer}>
                    <Text style={styles.commentsCount}>
                        {commentsLength} Comment(s)
                    </Text>

                    <SafeAreaView style={{marginBottom: '5%'}}>
                        <FlatList
                            data={get2Comments}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                        />
                    </SafeAreaView>

                    <FullButton
                        onPress={async() => await openModal()}
                        text={'View all comments'}
                        backgroundColor={'white'}
                        textColor={'#60B1B6'}
                        borderColor={'#60B1B6'}
                    />
                    <View style={{marginVertical: '5%'}}>
                        <FullButton
                            onPress={async() => await openModal()}
                            text={'Add a comment...'}
                            backgroundColor={'#60B1B6'}
                            textColor={'white'}
                            borderColor={'transparent'}
                        />
                    </View>
                </View>

                <Modal
                    animationType='slide'
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalHeader}>
                        <View style={{flex: 1,}}>
                        <IonButton
                            name='arrow-back'
                            onPress={() => setModalVisible(false)}
                            color='#979797'
                            size={30}
                            style={[styles.ionStyle, styles.modalIonStyle]}
                        /></View>
                
                        <View style={{flex: 2,}}>
                        <Text style={styles.modalCommentsCount}>
                            {commentsLength} Comment(s)
                        </Text></View>
                        <View style={{flex: 1,}}/>
                    </View>
                
                    <View style={styles.imageFooterContainer}>
                        <View style={styles.profileView}>
                            <ProfileImage
                                url={userImageUrl}
                                size={56}
                        /></View>

                        <View style={styles.imageFooterText}>
                            <Text style={styles.imageNameText}>{imageTitle}</Text>
                            <Text style={styles.usernameText}>by {imageUsername}</Text>
                        </View>
                        <View style={styles.modalImageView}>
                            <Image
                                source={{ uri: imageSourceToLoad }}
                                style={styles.modalImageStyle}
                            />
                        </View>
                    </View>

                    <View style={styles.commentsContainer}>
                        <View style={styles.commentsHeaderContainer}>
                            <View
                                behavior='height'
                                style={styles.inputContainer}
                            >
                                <TextInput
                                    style={styles.inputComment}
                                    multiline={true}
                                    value={getComment}
                                    onChangeText={text => setComment(text)}
                                    placeholder='Add a comment...'
                                    onSubmitEditing={() => setComment('')}
                                />
                            </View>

                            <IonButton
                                name='send'
                                onPress={async() => await postComment(getComment)}
                                size={30}
                                color='cyan'
                            />
                        </View>
                        <SafeAreaView style={{marginTop: '5%'}}>
                            <FlatList
                                data={getAllComments}
                                renderItem={renderItem}
                                keyExtractor={item => item.id}
                            />
                        </SafeAreaView>
                    </View>
                </Modal>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default ImageScreen;


const styles = StyleSheet.create({

    // image and image footer
    imageContainer: {
        flex: 1,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderTopColor: 'gray',
        borderBottomColor: 'gray',
        // marginTop: StatusBar.currentHeight || 0,
    },

    // image
    imageStyle: {
        flex: 1,
        width: screenWidth,
        aspectRatio: 1,
    },

    // IonButton style
    ionStyle: {
        padding: 8,
        borderRadius: 100,
        backgroundColor: 'white',
        borderColor: '#979797',
        borderWidth: 1,
    },

    // heart icon background
    heart: {
        flex: 1,
        alignSelf: 'flex-start',
        justifyContent: 'flex-end',
        margin: '1%',
    },

    // arrow icon background
    arrow: {
        flex: 1,
        alignSelf: 'flex-start',
        justifyContent: 'flex-start',
        margin: '1%',
    },

    // image footer
    imageFooterContainer: {
        paddingVertical: 5,
        marginBottom: 5,
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: 'gray',
    },

    // modal profile view
    profileView: {
        flex: 1,
        justifyContent: 'center',
    },

    // title and user of image
    imageFooterText: {
        flex: 5,
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: '1%',
    },

    // name of the image
    imageNameText: {
        fontSize: 20,
        fontFamily: 'Medium',
    },

    // name of the user who drew the image
    usernameText: {
        fontSize: 15,
        fontFamily: 'Bold',
    },

    // report button
    report: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // comments section
    commentsContainer: {
        flex: 1,
        marginHorizontal: '5%',
    },

    // title for number of comments
    commentsCount: {
        marginBottom: 15,
        fontSize: 24,
        fontFamily: 'Medium',
    },

    // individual comments
    commentsSpacing: {
        flexDirection: 'row',
        marginBottom: 20,
    },

    // comments footer
    commentsHeaderContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
    },

    // text input and send button
    inputContainer: {
        marginVertical: '5%',
        width: screenWidth * 0.8,
        backgroundColor: 'white',
        borderRadius: 30,
        borderWidth: 2,
        flexWrap: 'wrap',
        marginRight: '2%',
    },

    // input text for submitting a comment
    inputComment: {
        padding: '3%',
        width: '100%',
    },

    // name of user who left the comment
    commentUsernameText: {
        fontSize: 15,
        fontFamily: 'Bold',
    },

    // style of text inside of each comment
    commentText: {
        fontSize: 15,
        fontFamily: 'Medium',
    },

    // modal header
    modalHeader: {
        flexDirection: 'row',
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderTopColor: 'gray',
        borderBottomColor: 'gray',
        paddingVertical: 5,
    },

    // modal back button
    modalIonStyle: {
        marginLeft: '10%',
        justifyContent: 'center',
        alignSelf: 'flex-start',
    },

    // modal comments count title
    modalCommentsCount: {
        textAlign: 'center',
        marginVertical: '3%',
        fontSize: 24,
        fontFamily: 'Medium',
    },

    // modal image view
    modalImageView: {
        flex: 1,
        justifyContent: 'center',
    },

    // modal image style
    modalImageStyle: {
        width: '100%',
        aspectRatio: 1,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.5)',
    },
});