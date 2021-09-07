import firebase from "firebase";
import firebaseConfig from "./firebaseConfig.js";


firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();
export default storage;
