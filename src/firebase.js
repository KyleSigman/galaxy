
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "xxxxxx",
  authDomain: "influencer-777.firebaseapp.com",
  projectId: "influencer-777",
  storageBucket: "influencer-777.appspot.com",
  messagingSenderId: "84860251239",
  appId: "1:84860251239:web:dfc2ae68e57c6203e0b8c2",
  measurementId: "G-0QYN75XXL3"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage(app);
export const db = getFirestore(app)
// export const provider = new GoogleAuthProvider()

