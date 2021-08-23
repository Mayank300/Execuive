import firebase from "firebase";
require("@firebase/firestore");

var firebaseConfig = {
  apiKey: "AIzaSyDix4u3DjXiHIFSuQpgNItmtY52cf-TjCo",
  authDomain: "team-executive.firebaseapp.com",
  projectId: "team-executive",
  storageBucket: "team-executive.appspot.com",
  messagingSenderId: "537430705010",
  appId: "1:537430705010:web:9a80a57aa71eb872fe53eb",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase.firestore();
