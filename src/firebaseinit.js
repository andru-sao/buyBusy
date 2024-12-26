
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHQ7FuCBzDsUxVzJPPryQ0Xt2BBQbqxvc",
  authDomain: "buybusy-1-41386.firebaseapp.com",
  projectId: "buybusy-1-41386",
  storageBucket: "buybusy-1-41386.appspot.com",
  messagingSenderId: "607289707790",
  appId: "1:607289707790:web:671c424f61228236715b5f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);