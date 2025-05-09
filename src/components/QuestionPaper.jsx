import { jsPDF } from 'jspdf';
import React from 'react';
import './QuestionPaper.css';

const QuestionPaper = ({ questions, onBackClick }) => {
  const handleDownloadPDF = () => {
    try {
      // Create a new jsPDF instance
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Set font styles
      doc.setFont('helvetica', 'normal');
      
      // Page dimensions
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20; // margin in mm
      
      // Write title
      doc.setFontSize(18);
      doc.text('Unit Test', pageWidth / 2, margin, { align: 'center' });
      
      // Add a line
      doc.setLineWidth(0.5);
      doc.line(margin, margin + 12, pageWidth - margin, margin + 12);
      
      // Add instructions
      doc.setFontSize(11);
      doc.setDrawColor(200, 200, 200);
      doc.setFillColor(245, 245, 245);
      doc.roundedRect(margin, margin + 20, pageWidth - (margin * 2), 15, 2, 2, 'FD');
      
      doc.text(`Duration: 40 Minutes`, margin + 5, margin + 30);
      doc.text(`Instructions: Answer all questions.`, pageWidth - margin - 60, margin + 30);
      
      // Current Y position for content
      let yPosition = margin + 50;
      
      // Loop through all questions
      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        
        // Check if we need a new page
        if (yPosition > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        
        // Add question number and text on the same line
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(`${i + 1}) `, margin, yPosition);
        
        // Add question text with proper line wrapping
        doc.setFont('helvetica', 'normal');
        const questionText = question.text;
        const splitText = doc.splitTextToSize(questionText, pageWidth - (margin * 2) - 15);
        doc.text(splitText, margin + 10, yPosition);
        
        // Update Y position for next question (add height based on text length)
        yPosition += 10 + (splitText.length * 5);
        
        // Add a small separation between questions
        doc.setDrawColor(220, 220, 220);
        doc.line(margin, yPosition - 5, pageWidth - margin, yPosition - 5);
      }
      
      // Save the PDF
      doc.save('unit-test.pdf');
    } catch (error) {
      console.error('Error creating PDF:', error);
      alert('Error creating PDF. Please try again.');
    }
  };

  return (
    <div className="paper-container">
      <div className="question-paper" id="questionPaper">
        <div className="paper-header">
          <h1>Unit Test</h1>
          <hr className="divider" />
        </div>
        
        <div className="paper-instructions">
          <p><strong>Duration:</strong> 40 Minutes</p>
          <p><strong>Instructions:</strong> Answer all questions.</p>
        </div>

        <div className="questions-section">
          {questions && questions.length > 0 ? (
            questions.map((question, index) => (
              <div key={index} className="question">
                <p className="question-text"><span className="question-number">{index + 1}) </span>{question.text}</p>
              </div>
            ))
          ) : (
            <p className="no-questions">No questions available.</p>
          )}
        </div>
      </div>

      <div className="paper-actions">
        <button 
          className="download-button"
          onClick={handleDownloadPDF}
        >
          Download PDF
        </button>
        
        <button 
          className="back-button"
          onClick={onBackClick}
        >
          Back to Question Bank
        </button>
      </div>
    </div>
  );
};

export default QuestionPaper; 