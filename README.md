# *TRYNDRAW*

![logo](/readme_resources/logo.jpg)

*TRYNDRAW* is a social-lite drawing platform. Users are given randomly generated prompts that depict funny senarios. Then they are tasked to "try and draw" these prompts relying on their imagination and humor. Once they are done, the drawing is uploaded onto the platform for their friends and the world to see!

*TRYNDRAW* is powered by [React Native](https://reactnative.dev/) and [Firebase](https://firebase.google.com/).

Check out *TRYNDRAW* here: https://github.com/tylanbm/TRYNDRAW


## Table of Contents
1. [The Onbarding Screen](#onboarding)
2. [The Sign Up Screen](#signup)
3. [The Home Tab](#home)
4. [The Gallery Tab](#gallery)
5. [The Image Screen](#image)
6. [The Comments Modal](#comments)
7. [Exploring the Gallery Tab](#explore-gallery)
8. [Creating a Drawing](#creating-drawing)
9. [The Drawing Selection Screen](#drawing-selection)
10. [The Canvas Screen](#canvas)
11. [The Upload Modal](#upload)
12. [Uploading your drawing](#upload-drawing)
13. [Back to the Home Tab](#back-home)
14. [The My Drawings Screen](#my-drawings)
15. [Creating your own profile image](#create-profile-image)
16. [The Account Tab](#account)
17. [The Profile Image Editor Screen](#profile-image-editor)
18. [Back to the Account and Home Tabs](#back-to-account-and-home)
19. [Logging out of your account](#logout)
20. [The LogIn Screen](#login)
21. [Best wishes!](#end)


### The Onboarding Screen <a name="onboarding"></a>

![onboarding](/readme_resources/onboarding_screen.jpg)

To get started, tap the "Sign up" button to create an account on *TRYNDRAW*.


### The Sign Up Screen <a name="signup"></a>

![signup](/readme_resources/signup_screen.jpg)

The [Sign Up Screen](#signup) prompts you to enter a unique username, email address and password for your new account. Firebase handles most error cases for authentication, but it misses a few crucial ones. For example, it does not check if your chosen username is unique to other users' usernames, so we implemented the `isUsernameAvailable()` function to handle username query conflicts.

<details><summary>Sign Up Screen: isUsernameAvailable()</summary>

```javascript
// check if the current username is unique
   const isUsernameAvailable = async(userNameInput) => {
 
       // edge case: username is a nonempty string
       if (userNameInput == '') {
           setBorderUsername('red');
           setBorderEmail('black');
           setBorderPassword('black');
           setErrorMessage('Please enter a username.');
           return false;
       }
  
       // Create a reference to the users collection
       const usersRef = collection(db, "users");
       // Create a query against the collection.
       const q = query(usersRef, where("userName", "==", userNameInput));
  
       const querySnapshot = await getDocs(q);
      
       if (querySnapshot.empty) {
           console.log(userNameInput + ' is available!');
           return true;
      
       } else {
           setBorderUsername('red');
           setBorderEmail('black');
           setBorderPassword('black');
           setErrorMessage('"' + userNameInput + '" is already taken, please try another username.');
           return false;
       }
   }
```

</details>

This prevents you and everyone else from creating the same usernames by querying into the [Firestore Database](https://firebase.google.com/docs/firestore). It uses the "users" collection and checks each registered username to ensure your username does not match. If the query returns empty, your username is unique. If it returns nonempty, another user has a username the same as yours and thus prompts you to enter a different one. This prevents false queries from overwriting one user's data with another.

After entering a valid username, email and password, you can tap the "Create account" button to go to the [Home Tab](#home).


### The Home Tab <a name="home"></a>

![](/readme_resources/home_tab.jpg)

The [Home Tab](#home) will greet you with a welcome message, a default profile picture and a prompt to start your first drawing. You can also navigate to other tabs at the bottom of the app to view screens such as the [Gallery Tab](#gallery).


### The Gallery Tab <a name="gallery"></a>

![gallery](/readme_resources/gallery_tab.jpg)

The [Gallery Tab](#gallery) displays all the uploaded drawings drawn by other users for you to view and comment on with other users. Displaying the drawings requires loading them into a FlatList using our `getURLs()` function.

<details><summary>Gallery Tab: getURLs()</summary>

```javascript
const docsRef = collection(db, "uniqueImageNames");
const imgsToLoad = 20;

[...]

// await async calls for getting img URLs
   const getDownload = async() => {
       loading = true;
 
       q = query(docsRef,
           orderBy('timestamp', 'desc'),
           limit(imgsToLoad));
      
       querySnapshot = await getDocs(q);
       last = await getURLs(querySnapshot);
       loading = false;
   }

// initial load of gallery screen
   const getURLs = async(querySnapshot) => {
        querySnapshot.forEach(async(item) => {
 
           // iterate through all testImages images
           const itemId = item.id;
           const itemRef = ref(storage, 'testImages/' + itemId + '.jpg');
          
           // get data for img
           let itemData = item.data();
           let img = {
               id: itemId,
               name: itemData.imageTitle,
               time: itemData.timestamp,
               url: await getDownloadURL(itemRef),
           }
 
           // append all images to end of list
           setImgs(getImgs => [...getImgs, img]);
       })
 
       let output = querySnapshot.docs;
       return output[output.length-1];
   }
```

</details>

It loads each drawing into an array the FlatList uses to display them all on the [Gallery Tab](#gallery) by querying into the database and fetching the storage. It uses the "uniqueImageNames" collection in the database to fetch all its documents. It then uses their IDs to fetch the drawings in the "testImages" folder in the storage. It then uses the IDs along with the drawings' names, timestamps and URLs to correctly order and display the drawings with their unique titles. This gives us all the data it needs to render each drawing only once with each new refresh.

It also limits how many drawings the screen loads at a time (currently set to 20) until you request more drawings when you scroll 75% down the image list. Thus, if there are n>20 documents in the "uniqueImageNames" collection, we save n-20 API calls until you scroll 75% down the list which then queries for 20 more images. This is crucial because if n is large, saving n-20 API calls saves a lot of money and data resources for the database ($0.10 per 1000 API calls). It also causes less slowdown on your device when needing to only call for 20 images instead of all n, giving you an earlier chance to explore other users' drawings.

This continues until the screen has loaded all the drawings which then asks if you want to refresh the image list. Pressing the button refreshes the image list. To view a drawing in the [Gallery Tab](#gallery), simply tap on it to go to the [Image Screen](#image).


### The Image Screen <a name="image"></a>

![image](/readme_resources/image_screen.jpg)

The [Image Screen](#image) displays a full-size image of the selected drawing with a back button, a like button and a report button. You can also view the full name of the drawing along with who drew it and its comments section. This screen displays only the first 2 comments using our `get2CommentsData()` function.

<details><summary>Image Screen: get2CommentsData()</summary>

```javascript
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
  
           // if no pending writes but comment is added, refresh the images
           if (!writes && changeType) {
               console.log('Change ' + new Date().getSeconds());
               setAllComments([]);
               await getAllCommentsData(snapshotAll);
           }
           else console.log('Do not change ' + new Date().getSeconds());
       });

[...]

}
```

</details>

It queries into the "uniqueImageNames" collection to fetch its "comments" collection, containing all the drawing's comments. It then uses 2 queries, each with its own purpose: one to fetch only the first 2 most recent comments and another to fetch all the comments. The screen displays only the first 2 comments to give you an idea of what the recent consensus is on the drawing. It uses `onSnapshot()` to update the comments when a user adds a new comment to the drawing.

This screen also displays the total number of the drawing's comments. If there are n comments, the top of the comments section will say "n Comments." For example, if n=4, it will display "4 Comments." To view all the comments or write a comment of your own, tap either the "View all comments" or "Add a comment" button to display the [Comments Modal](#comments).


### The Comments Modal <a name="comments"></a>

![comments](/readme_resources/comments_modal.jpg)

The [Comments Modal](#comments) displays all the comments of the current drawing. You can tap on the "Add a comment" field to add your own comment and send it with the blue send button to the right of the input field. You can add as many comments as you want!

Each time you add a comment, the [Image Screen](#image)'s `onSnapshot()` method updates the current comment list to show your added comment. This allows you to have a live discussion with other users about the drawing.

To return back to the [Gallery Tab](#gallery), simply tap the back button at the top-left of the screen to go back to the [Image Screen](#image), then tap the back button on the image in the top-left.


### Exploring the Gallery Tab <a name="explore-gallery"></a>

You can continue to view and comment on other drawings as you please. Scrolling downwards sequentially displays 20 more drawings until you reach the end of all the drawings. The screen then gives you the option to refresh all the drawings from the start, possibly displaying newer ones submitted by other users if they have created any. You can also refresh the screen by scrolling upwards at the top of the [Gallery](#gallery)'s image list.


### Creating a drawing <a name="creating-drawing"></a>

Do you want to create your own drawing? Go to the [Home Tab](#home) and tap either the big button in the middle saying "You have no drawings" or the "Start drawing" button at the bottom of the screen to take you to the [Drawing Selection Screen](#drawing-selection).


### The Drawing Selection Screen <a name="drawing-selection"></a>

![drawing-selection](/readme_resources/drawingselection_screen.jpg)

The [Drawing Selection Screen](#drawing-selection) gives you a list of randomly generated 3-word prompts containing 2 adjectives and a noun. These are the same style as the drawing titles in the [Gallery Tab](#gallery). Whichever one you select will be the drawing you will *TRY AND DRAW*! If you do not like the selection given, you can tap the "Reroll selection" button to generate three more 3-word prompts using our `reroll()` function.

<details><summary>Drawing Selection Screen: get2CommentsData()</summary>

```javascript
// generates 3 more 3-word prompts
 const reroll = () => {
   let temp_data = [...data];
 
       for (let i=0; i<3; i++) {
         let temp_elt = {...temp_data[i]};
         temp_elt.slug = generateSlug(3, slugOptions);
         temp_data[i] = temp_elt;
       }
 
   setData(temp_data);
}
```

</details>

It creates a temporary copy of the prompt list, generating 3 more prompts for the copy one by one then sets the current list of prompts displayed on the screen to that modified copy. It cannot simply place the 3 new slugs into the displayed list because the list is a const. Thus, it cannot write directly to its elements. It needs to create a copy first then set the const list to the modified copy asynchronously. However, this also allows all 3 new prompts to display at once instead of displaying sequentially which could confuse some users upon first pressing the "Reroll" button.

When you have decided on your prompt, you can then tap the "Start drawing" button to go to the [Canvas Screen](#canvas).


### The Canvas Screen <a name="canvas"></a>

![canvas](/readme_resources/canvas_screen.jpg)

The [Canvas Screen](#canvas) provides many different tools for you to draw your best representation of your selected prompt. The screen displays your selected prompt at the top of the screen so you do not forget what you are drawing. In the middle of the screen is the canvas itself, giving you ample room for you to draw as large and detailed of a drawing as you want.

At the top and bottom of the screen are your tools. The top features 23 different colours for you to use. The bottom features a brush utensil, an eraser, an Undo button, a brush thickness slider, an Undo all button and an Upload button. When you are done drawing, tap the Upload button to display the [Upload Modal](#upload).


### The Upload Modal <a name="upload"></a>

![upload](/readme_resources/upload_modal.jpg)

You can choose one of the 3 options the [Upload Modal](#upload) provides. You can upload your drawing and exit to the [Home Tab](#home), stay to continue your drawing or delete the drawing and exit to the [Home Tab](#home).


### Uploading your drawing <a name="upload-drawing"></a>

Tapping the "Upload drawing and exit" button runs the `captureViewShot()` function before returning you to the [Home Tab](#home).

<details><summary>Upload Modal: captureViewShot()</summary>

```javascript
//A function that takes a snapshot of the canvas element and uploads image to firebase storage
   const captureViewShot = async () => {
       viewShot.current.capture().then((uri) => {
           console.log("Do something with ", uri);
          
           // Create a new document with an autogenerated id
           const newImageRef = doc(collection(db, "uniqueImageNames"));
           console.log("Document written with ID: ", newImageRef.id);
          
           //Storage path and file name of image
           const storagePath = "testImages/" + newImageRef.id + ".jpg"
 
           const storageRef = ref(storage, storagePath);
          
           const uploadImage = async (imageUri) => {
               const response = await fetch(imageUri);
               //Generate blob from image URI
               const blob = await response.blob();
 
               //Upload image blob to firebase storage
               await uploadBytes(storageRef, blob).then((snapshot) => {
                   console.log('Uploaded a blob or file!');
               });
 
               //Create a new file in database that will represent image name
               await setDoc(newImageRef, {
                   imageAuthorUID: auth.currentUser.uid,
                   imageAuthorUsername: auth.currentUser.displayName,
                   imageTitle: slug,
                   timestamp: serverTimestamp(),
               }).then(() => console.log('Document set'));
           }
           uploadImage(uri);
       })
   };
```

</details>

This uploads your new drawing as an image to the storage and then to the database with the image's data. This is crucial for retrieving the image's data for the [Image Screen](#image) and ordering the images in batches of 20 for the [Gallery Tab](#gallery). It first gets the uri of your drawing's viewShot and uploads it as a blob to the "testImages" folder in storage. It then uploads the image data (user ID, username, image title and timestamp) to the database so it can retrieve the image with all its data from anywhere in the app.


### Back to the Home Tab <a name="back-home"></a>

Returning to the [Home Tab](#home) will eventually replace the "You have no drawings" button with your uploaded drawing. It will also show a "View all" button to the right of your drawing with a big + icon. This happens due to the [Home Tab](#home)'s `onSnapshot()` function for showing your drawings.

<details><summary>Home Tab: onSnapshot() for drawings</summary>
   
```javascript
const imagesRef = collection(db, "uniqueImageNames");

[...]

// listen to uploading or deleting a drawing
       onSnapshot(query(imagesRef,
           orderBy('timestamp', 'desc'),
           where('imageAuthorUsername', '==', username),
           limit(2)),
           { includeMetadataChanges: false },
           async(imageSnapshot) => {
          
           // check if writes and type are both false
           const writes = imageSnapshot.metadata.hasPendingWrites;
           let changeType = false;
           imageSnapshot.docChanges().forEach((change) => {
               if (change.type == 'removed') {
                   changeType = true;
               }
           })
           console.log('Image ' + writes + ' ' + changeType);
 
           // if both are false, refresh the images
           if (!writes && !changeType) {
               console.log('Change images');
               setImgs([]);
               await getURLs(imageSnapshot);
               setPending(false);
           }
           else console.log('Do not change images');
       });
```

</details>

This updates every time you upload a drawing or delete one of your 2 newest drawings (more on deleting drawings in [The My Drawings Screen](#my-drawings)). It queries for the 2 newest drawings whenever there is a change in the query itself. If you have only one drawing, it queries for just that one drawing, no others. The "View all" button with the + icon will always display to the right of your drawings if you have at least one. Otherwise, if you have no drawings, it will display the "You have no drawings" button.

We want to display only your 2 newest drawings because we want to prevent clutter on the [Home Tab](#home). Furthermore, if you have n>2 drawings, we save n-2 API calls. This is the same principle we use as limiting the initial query in the [Gallery Tab](#gallery) to 20 images. If you want to see more drawings, you can tap one of the "View all" buttons to go to the [My Drawings Screen](#my-drawings) which we discuss at the end of this section.

Uploading a drawing always runs the `onSnapshot()` function because your newest drawing will have the most recent timestamp of all your drawings. Thus, it will always show up on your [Home Tab](#home). You can tap it to go to its [Image Screen](#image) to view its image details and comments, exactly the same as other users' drawings in the [Gallery Tab](#gallery). You most likely will not see any comments yet as you have just recently uploaded your drawing. You can then view your new drawing in the [Gallery Tab](#gallery) by scrolling upwards as before to refresh all the drawings.

You can create as many drawings as you want! However, the [Home Tab](#home) will display only your 2 newest drawings to prevent clutter. To view all your drawings, tap either the "View all" button at the top right of the drawings list or to the right of your first 2 drawings to go to the My Drawings Screen.


### The My Drawings Screen <a name="my-drawings"></a>

![my-drawings](/readme_resources/mydrawings_screen.jpg)

The [My Drawings Screen](#my-drawings) will display all your drawings in chronological order. You can again tap to view them in the [Image Screen](#image). You can also delete them with the Delete button at the bottom right of the image which runs the `onDeleteObject()` function.
   
<details><summary>My Drawings Screen: onDeleteObject()</summary>
   
```javascript
// delete an image
   const onDeleteObject = async(item, itemId) => {
       const docRef = doc(db, 'uniqueImageNames', itemId);
       const itemRef = ref(storage, 'testImages/' + itemId + '.jpg');
 
       // delete image from FlatList
       console.log('Deleting from array...');
       const tempImgs = [...getImgs];
       tempImgs.splice(tempImgs.indexOf(item), 1);
       setImgs(tempImgs);
       console.log('Deleted item ' + itemId);
 
       // delete image data from database
       console.log('Deleting from Database...');
       await deleteDoc(docRef);
       console.log('Deleted doc ' + itemId);
 
       // delete image from storage
       console.log('Deleting from Storage...');
       await deleteObject(itemRef);
       console.log('Deleted image ' + itemId);
   }
```

</details>

It deletes your chosen drawing first from the FlatList which displays it on the screen. It then deletes the drawing from the database and storage. It does this so there are no more traces of your drawing anywhere on the backend.

While we do not need to delete your drawing from storage, it is good practice. It is not necessary to delete the drawing because it requires querying into its database document in the "uniqueImageNames" collection. Thus, if we delete its data from the database, there is no way to retrieve it from storage. However, deleting your drawing from storage saves space for other users to upload their drawings. We want to allocate as much storage space for users' drawings as possible.

If the drawing you delete is one of your 2 newest, the [Home Tab](#home) will call `onSnapshot()` to refresh your 2 newest drawings.


### Creating your own profile image <a name="create-profile-image"></a>

You may have noticed some users have unique profile images when viewing their drawings in the [Gallery Tab](#gallery). To create your own profile image, first tap the "Account" tab to go to the [Account Tab](#account).


### The Account Tab <a name="account"></a>

![account](/readme_resources/account_tab.jpg)

The [Account Tab](#account) will show your default profile image along with "Edit profile image" and "Sign out" buttons. Tap on the "Edit profile image" button to go to the [Profile Image Editor Screen](#profile-image-editor).


### The Profile Image Editor Screen <a name="profile-image-editor"></a>

![profile-image-editor](/readme_resources/profileimageeditor_screen.jpg)

The [Profile Image Editor Screen](#profile-image-editor) is the same as the [Canvas Screen](#canvas) but with "Your profile photo" displayed at the top. You can draw whatever you want as your unique profile image!

Once done drawing your new profile image, tap the Upload button as before and tap "Upload profile photo and exit" to run its `captureViewShot()` function and upload the image.
   
<details><summary>Profile Image Editor Screen: captureViewShot()</summary>
   
```javascript
//A function that takes a snapshot of the canvas element and uploads image to firebase storage
   const captureViewShot = async () => {
       viewShot.current.capture().then((uri) => {
           console.log("Do something with ", uri);
           //MediaLibrary.requestPermissionsAsync();
           //MediaLibrary.saveToLibraryAsync(uri);
           //uploadImageAsync(uri);
           const user = auth.currentUser;
           const userId = user.uid;
          
           //Database and Storage paths for profile image
           const docRef = doc(db, 'users', userId);
           const storagePath = 'userProfileImages/' + userId;
 
           const storageRef = ref(storage, storagePath);
          
           const uploadImage = async(imageUri) => {
               const response = await fetch(imageUri);
               //Generate blob from image URI
               const blob = await response.blob();
              
               //Upload image blob to firebase storage
               await uploadBytes(storageRef, blob).then(() => {
                   console.log('Uploaded a blob or file!');
               });
 
               // update timestamp of newly created profile image
               await setDoc(docRef, {
                   lastProfileImageChange: serverTimestamp(),
                   profileImageSet: true,
                   userName: user.displayName,
               }).then(() => console.log('Profile changed'));
           }
           uploadImage(uri);
       })
   };
```

</details>
   
This `captureViewShot()` function is very similar to the `captureViewShot()` function in the [Canvas Screen](#canvas) but differs in where it uploads. It still gets the uri from its viewShot and fetches its blob but instead of querying the "uniqueImageNames" collection, it queries the "users" collection. If there is no profile image currently set, it overwrites your "profileImageSet" boolean to true and your "lastProfileImageChange" timestamp to the current timestamp. This way, your new profile image overwrites your current profile image (including if your current profile image is the default) when querying for it in the [Account Tab](#account) and [Home Tab](#home) (discussed in [Back to the Account and Home Tabs](#back-to-account-and-home)). Furthermore, the storage path is your profile image in the "uniqueProfileImages" folder. Thus, your new profile image overwrites your current profile image in both the database and storage.

Thus, unlike the [Canvas Screen](#canvas) that creates a brand new image with a new ID with your new drawing, there is no additional storage allocation for your profile image. It is set once you create a profile image and it never changes. No matter how many times you create a new profile image, we do not need anymore database nor storage allocation. If an image is size k, we save k storage space with each new profile image creation any user creates.


### Back to the Account and Home Tabs <a name="back-to-account-and-home"></a>

After tapping the "Upload profile photo and exit" button in the [Profile Picture Editor Screen](#profile-image-editor), you will go back to the [Account Tab](#account) and it along with the [Home Tab](#home) will set your profile image by running their own `onSnapshot()` functions. The `onSnapshot()` functions are the same on both screens. This means the [Home Tab](#home) has 2 `onSnapshot()` functions: one for updating your 2 newest drawings and another for updating your profile image.
   
<details><summary>Account and Home Tabs: captureViewShot() for profile image</summary>
   
```javascript
const userRef = doc(db, 'users', userId);

[...]

// listen to profile image change
       onSnapshot(query(userRef),
           { includeMetadataChanges: true },
           async(profileSnapshot) => {
          
           // check if there are no more pending writes
           const writes = profileSnapshot.metadata.hasPendingWrites;
           console.log('User settings ' + writes);
 
           // if no pending writes, update Home screen profile image
           if (!writes) {
               console.log('Change profile settings ' + new Date().getSeconds());
 
               // if profile image does not exist, use default profile image
               if (profileSnapshot.data().profileImageSet) {
                   const temp = await getDownloadURL(ref(storage,
                       'userProfileImages/' + user.uid));
                   setPic(temp);
               }
               else {
                   const temp = await getDownloadURL(ref(storage,
                   'userProfileImages/profileImage.jpg'));
                   setPic(temp);
               }
           }
           else console.log('Do not change profile settings ' + new Date().getSeconds());
       });
```

</details>

This `onSnapshot()` function is conceptually the same as the other `onSnapshot()` functions. It runs when the query, in this case the document with the name of your user ID, in the "users" collection changes. This is the same document that changes when you change your profile image in the Profile Picture Editor Screen. When there are no more pending writes, it retrieves the default profile image from storage if "profileImageSet" is false. If "profileImageSet" is true, it retrieves your unique profile image with the name of your user ID from the "userProfileImages" folder in storage.

Your newly created profile image will replace your default profile image on your [Account Tab](#account) and [Home Tab](#home) along with the drawings you drew and comments you wrote. However, you will initially have only 2 API calls: one for the [Account Tab](#account) and another for the [Home Tab](#home). More API calls will happen when you go to the [Image Screen](#image) but that is the same as before you set your profile image. You can now display your unique profile image to other users just like they can with their own profile images!


### Logging out of your account <a name="logout"></a>

If you ever wish to sign out of your account, simply tap the "Sign out" button on the [Account Tab](#account) to go back to the [Onboarding Screen](#onboarding). You can then tap the "Login" button to go to the [LogIn Screen](#login).


### The LogIn Screen <a name="login"></a>

![login](/readme_resources/login_screen.jpg)

You can use the [LogIn Screen](#login) to log back into your account using your email and password. If you want to create a new account instead, you can tap the "Don't have an account?" button to go back to the [Sign Up](#signup) Screen.


### Best wishes! <a name="end"></a>

We hope you enjoy *TRYNDRAW* to express and exercise your creativity and share it with others!

Check out *TRYNDRAW* here: https://github.com/tylanbm/TRYNDRAW
