import React from 'react';
import './ChapterList.css';

const ChapterList = ({ units, onGeneratePaper, usedQuestions = {} }) => {
  return (
    <div className="question-bank">
      <h2>Question Bank</h2>
      
      <div className="units-container">
        {units.map((unit, unitIndex) => (
          <div key={unitIndex} className="unit-card">
            <div className="unit-title">
              <h3>{unit.title}</h3>
            </div>
            <div className="unit-content">
              <div className="unit-questions">
                {unit.questions.map((question, qIndex) => (
                  <div 
                    key={qIndex} 
                    className={`question-item ${usedQuestions[question.id] ? 'used-question' : ''}`}
                  >
                    {question.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="button-container">
        <button 
          className="generate-button"
          onClick={onGeneratePaper}
        >
          Generate Question Paper
        </button>
      </div>
    </div>
  );
};

export default ChapterList; 