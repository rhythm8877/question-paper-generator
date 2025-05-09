// Using a try-catch to handle Firebase initialization
// This makes Firebase optional so the app works even without it

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

let db = null;

try {

  const firebaseConfig = {
    apiKey: "AIzaSyBDqvIuPC5dROanTYw4wIdIwn8vodGTUEQ",
    authDomain: "question-paper-1e8f5.firebaseapp.com",
    projectId: "question-paper-1e8f5",
    storageBucket: "question-paper-1e8f5.appspot.com",
    messagingSenderId: "676476480933",
    appId: "1:676476480933:web:1351218e6491119dc00c4c"
  };

  console.log('Initializing Firebase Firestore...');

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Firestore
  db = getFirestore(app);

  console.log('Firebase Firestore initialized successfully');
} catch (error) {
  console.error('Firebase Firestore initialization failed:', error.message);
  console.log('App will run without Firebase functionality');
  db = null;
}

export { db };