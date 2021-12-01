// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAvqhDSnvGv1VOx9IeOKE7pTsXlng8zfCI",
    authDomain: "dart-bd1be.firebaseapp.com",
    projectId: "dart-bd1be",
    storageBucket: "dart-bd1be.appspot.com",
    messagingSenderId: "436353280155",
    appId: "1:436353280155:web:2ab90101ed1bb423403e3e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);