import firebase from "firebase";
require("@firebase/firestore");

var firebaseConfig = {
  apiKey: "AIzaSyCgoxXBYILggp2drwG9mEvbpwVDTyT0MgA",
  authDomain: "executive-003.firebaseapp.com",
  projectId: "executive-003",
  storageBucket: "executive-003.appspot.com",
  messagingSenderId: "171399653823",
  appId: "1:171399653823:web:80fa8238f2ac8dfb54590a",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase.firestore();
