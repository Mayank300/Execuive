import firebase from "firebase";
require("@firebase/firestore");

var firebaseConfig = {
  apiKey: "AIzaSyAwece7RVV4qAXCVt9zjeMY4itM2kbyWv4",
  authDomain: "executive-2021.firebaseapp.com",
  projectId: "executive-2021",
  storageBucket: "executive-2021.appspot.com",
  messagingSenderId: "197300104961",
  appId: "1:197300104961:web:c114981e1500f85d3b7500",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase.firestore();
