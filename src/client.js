import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyBf5HRrtRpyDFYbDH982aMDha3PVPbbEJo",
  authDomain: "mirum-50b54.firebaseapp.com",
  databaseURL: "https://mirum-50b54.firebaseio.com",
  projectId: "mirum-50b54",
  storageBucket: "mirum-50b54.appspot.com",
  messagingSenderId: "410460136167"
}

firebase.initializeApp(config);

export const database = firebase.database();
export const FIREBASE_SERVER_TIMESTAMP = firebase.database.ServerValue.TIMESTAMP;
export const auth = firebase.auth;
export const provider = new firebase.auth.FacebookAuthProvider();
