import { collection, doc, setDoc, getDoc, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Check if Firebase is available
const isFirebaseAvailable = () => {
  return db !== null;
};

// Save questions to Firestore
export const saveQuestions = async (questions) => {
  if (!isFirebaseAvailable()) {
    console.log('Firestore not available, skipping saveQuestions');
    return true; // Return success to not block the app flow
  }
  
  try {
    // Save each unit as a separate document in the 'units' collection
    for (const unit of questions) {
      await setDoc(doc(db, 'units', unit.title), unit);
    }
    console.log('Questions saved successfully to Firestore');
    return true;
  } catch (error) {
    console.error('Error saving questions to Firestore:', error);
    return false;
  }
};

// Save generated paper to Firestore
export const saveGeneratedPaper = async (paper) => {
  if (!isFirebaseAvailable()) {
    console.log('Firestore not available, skipping saveGeneratedPaper');
    return true; // Return success to not block the app flow
  }
  
  try {
    const timestamp = new Date().getTime();
    const paperWithTimestamp = {
      ...paper,
      timestamp
    };
    
    // Add a new document with auto-generated ID
    await addDoc(collection(db, 'generatedPapers'), paperWithTimestamp);
    console.log('Paper saved successfully to Firestore');
    return true;
  } catch (error) {
    console.error('Error saving paper to Firestore:', error);
    return false;
  }
};

// Get questions from Firestore
export const getQuestions = async () => {
  if (!isFirebaseAvailable()) {
    console.log('Firestore not available, returning null from getQuestions');
    return null; // Return null to use default questions
  }
  
  try {
    const unitsCollection = collection(db, 'units');
    const querySnapshot = await getDocs(unitsCollection);
    
    if (!querySnapshot.empty) {
      const units = [];
      querySnapshot.forEach((doc) => {
        units.push(doc.data());
      });
      return units;
    } else {
      console.log('No questions found in Firestore');
      return null;
    }
  } catch (error) {
    console.error('Error getting questions from Firestore:', error);
    return null;
  }
};

// Get used questions status from Firestore
export const getUsedQuestions = async () => {
  if (!isFirebaseAvailable()) {
    console.log('Firestore not available, returning empty object from getUsedQuestions');
    return {}; // Return empty object to start fresh
  }
  
  try {
    const usedQuestionsDoc = await getDoc(doc(db, 'usedQuestions', 'status'));
    
    if (usedQuestionsDoc.exists()) {
      return usedQuestionsDoc.data().questions || {};
    } else {
      console.log('No used questions found in Firestore');
      return {};
    }
  } catch (error) {
    console.error('Error getting used questions from Firestore:', error);
    return {};
  }
};

// Save used questions status to Firestore
export const saveUsedQuestions = async (usedQuestions) => {
  if (!isFirebaseAvailable()) {
    console.log('Firestore not available, skipping saveUsedQuestions');
    return true; // Return success to not block the app flow
  }
  
  try {
    await setDoc(doc(db, 'usedQuestions', 'status'), { 
      questions: usedQuestions,
      updatedAt: new Date().toISOString()
    });
    console.log('Used questions status saved successfully to Firestore');
    return true;
  } catch (error) {
    console.error('Error saving used questions status to Firestore:', error);
    return false;
  }
};

// Delete all used questions data from Firestore
export const deleteUsedQuestionsData = async () => {
  if (!isFirebaseAvailable()) {
    console.log('Firestore not available, skipping deleteUsedQuestionsData');
    return true; // Return success to not block the app flow
  }
  
  try {
    await setDoc(doc(db, 'usedQuestions', 'status'), { 
      questions: {},
      updatedAt: new Date().toISOString(),
      reset: true
    });
    console.log('Used questions data deleted successfully from Firestore');
    return true;
  } catch (error) {
    console.error('Error deleting used questions data from Firestore:', error);
    return false;
  }
};
