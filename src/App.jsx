import React, { useState, useEffect } from 'react';
import './App.css';
import ChapterList from './components/ChapterList';
import QuestionPaper from './components/QuestionPaper';
import { saveQuestions, saveUsedQuestions, getQuestions, getUsedQuestions, saveGeneratedPaper, deleteUsedQuestionsData } from './utils/firebaseUtils';

function App() {
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [showPaper, setShowPaper] = useState(false);
  const [usedQuestions, setUsedQuestions] = useState({});
  const [units, setUnits] = useState([
    {
      title: "Unit 1",
      questions: [
        { id: "U1Q1", text: "What is a chemical equation? Explain with an example." },
        { id: "U1Q2", text: "What are the different types of chemical reactions? Give examples." },
        { id: "U1Q3", text: "Explain the process of balancing chemical equations." }
      ]
    },
    {
      title: "Unit 2",
      questions: [
        { id: "U2Q1", text: "What are acids and bases? Give examples of each." },
        { id: "U2Q2", text: "Explain the pH scale and its importance." },
        { id: "U2Q3", text: "What are salts? How are they formed?" }
      ]
    },
    {
      title: "Unit 3",
      questions: [
        { id: "U3Q1", text: "What are the physical properties of metals and non-metals?" },
        { id: "U3Q2", text: "Explain the reactivity series of metals." },
        { id: "U3Q3", text: "How do metals react with acids? Give examples." }
      ]
    },
    {
      title: "Unit 4",
      questions: [
        { id: "U4Q1", text: "What are hydrocarbons? Explain their types." },
        { id: "U4Q2", text: "Describe the structure and properties of ethanol." },
        { id: "U4Q3", text: "What are functional groups? Give examples." }
      ]
    },
    {
      title: "Unit 5",
      questions: [
        { id: "U5Q1", text: "Explain Mendeleev's periodic table and its significance." },
        { id: "U5Q2", text: "What are the trends in the modern periodic table?" },
        { id: "U5Q3", text: "Describe the properties of elements in the same group." }
      ]
    }
  ]);
  
  // Load questions and used questions from Firestore on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Get questions from Firestore
        const savedQuestions = await getQuestions();
        if (savedQuestions && savedQuestions.length > 0) {
          setUnits(savedQuestions);
        } else {
          // If no questions in Firestore, save the default ones
          console.log('No questions found in Firestore, saving default questions...');
          await saveQuestions(units);
        }
        
        // Get used questions from Firestore
        const savedUsedQuestions = await getUsedQuestions();
        if (Object.keys(savedUsedQuestions).length > 0) {
          console.log('Found used questions in Firestore:', savedUsedQuestions);
          setUsedQuestions(savedUsedQuestions);
        }
      } catch (error) {
        console.error('Error loading data from Firestore:', error);
      }
    };
    
    loadData();
  }, [units]);  // Include units in the dependency array

  // Fisher-Yates shuffle algorithm to randomize array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleGeneratePaper = () => {
    try {
      // Select one random question from each unit that hasn't been used yet
      const selectedQuestions = [];
      const newUsedQuestions = { ...usedQuestions };

      units.forEach(unit => {
        // Get unused questions from this unit
        const unusedQuestions = unit.questions.filter(q => !usedQuestions[q.id]);
        
        if (unusedQuestions.length > 0) {
          // Select a random question from unused ones
          const randomIndex = Math.floor(Math.random() * unusedQuestions.length);
          const selectedQuestion = unusedQuestions[randomIndex];
          
          // Mark this question as used
          newUsedQuestions[selectedQuestion.id] = true;
          
          // Add to selected questions
          selectedQuestions.push({
            ...selectedQuestion,
            unit: unit.title
          });
        } else {
          // If all questions are used, show a message
          console.log(`All questions from ${unit.title} have been used.`);
        }
      });
      
      // Check if we were able to generate at least one question
      if (selectedQuestions.length > 0) {
        // Shuffle the questions to randomize their order
        const shuffledQuestions = shuffleArray(selectedQuestions);
        
        // Update state first to ensure UI updates
        setUsedQuestions(newUsedQuestions);
        setGeneratedQuestions(shuffledQuestions);
        setShowPaper(true);
        
        // Then try to save to Firestore (non-blocking)
        saveUsedQuestions(newUsedQuestions).catch(err => console.error('Error saving used questions:', err));
        saveGeneratedPaper({
          questions: shuffledQuestions,
          date: new Date().toISOString()
        }).catch(err => console.error('Error saving paper:', err));
      } else {
        alert("All questions have been used. Please reset the question bank.");
      }
    } catch (error) {
      console.error('Error generating paper:', error);
      alert('There was an error generating the question paper. Please try again.');
    }
  };

  // Check if all questions are used
  const areAllQuestionsUsed = () => {
    // Total number of questions (5 units * 3 questions = 15)
    const totalQuestions = 15;
    return Object.keys(usedQuestions).length >= totalQuestions;
  };

  const handleBackToQuestionBank = () => {
    setShowPaper(false);
  };
  
  const handleResetQuestionBank = () => {
    try {
      // Reset used questions locally first
      const emptyUsedQuestions = {};
      setUsedQuestions(emptyUsedQuestions);
      
      // Delete data from Firebase (non-blocking)
      deleteUsedQuestionsData()
        .catch(err => console.error('Error deleting used questions data:', err));
      
      alert("Question bank has been reset successfully.");
    } catch (error) {
      console.error('Error resetting question bank:', error);
      alert('There was an error resetting the question bank, but we have cleared it locally.');
    }
  };

  return (
    <div className="app">
      {!showPaper ? (
        <div className="question-bank-container">
          {areAllQuestionsUsed() ? (
            <div className="all-used-message">
              <h2>All questions have been used</h2>
              <p>Click the button below to reset the question bank.</p>
              <button 
                className="reset-button"
                onClick={handleResetQuestionBank}
              >
                Reset Question Bank
              </button>
            </div>
          ) : (
            <ChapterList 
              units={units}
              onGeneratePaper={handleGeneratePaper} 
              usedQuestions={usedQuestions} 
            />
          )}
        </div>
      ) : (
        <div className="question-paper-container">
          <QuestionPaper 
            questions={generatedQuestions} 
            onBackClick={handleBackToQuestionBank}
          />
        </div>
      )}
    </div>
  );
}

export default App;
