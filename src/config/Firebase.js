// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDccZIO2MOezhCENEF3k2jZiv2iQ7o86Lk",
  authDomain: "mycookbookdiary-36c56.firebaseapp.com",
  projectId: "mycookbookdiary-36c56",
  storageBucket: "mycookbookdiary-36c56.appspot.com",
  messagingSenderId: "886205746094",
  appId: "1:886205746094:web:4cc870e63461ed2936963f",
  measurementId: "G-Z7HE1L5DPG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
const analytics = getAnalytics(app);
export const firestore = getFirestore(app);