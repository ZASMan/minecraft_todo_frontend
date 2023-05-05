import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAYKpPEMzGaregFfnLVs2xw3abNipfd0PA",
  authDomain: "minecraft-todo-a2380.firebaseapp.com",
  projectId: "minecraft-todo-a2380",
  storageBucket: "minecraft-todo-a2380.appspot.com",
  messagingSenderId: "471752333046",
  appId: "1:471752333046:web:e72b1d423d93ee5b49fed7"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
export { db }