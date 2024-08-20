import React, { useState } from 'react';

const QuestionForm = ({ onAddQuestion }) => {
  const [prompt, setPrompt] = useState('');
  const [answers, setAnswers] = useState(['', '']);
  const [correctIndex, setCorrectIndex] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newQuestion = {
      prompt,
      answers,
      correctIndex,
    };

    try {
      const response = await fetch('http://localhost:4000/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuestion),
      });
      const addedQuestion = await response.json();
      onAddQuestion(addedQuestion);
    } catch (error) {
      console.error('Error adding question:', error);
    }

    setPrompt('');
    setAnswers(['', '']);
    setCorrectIndex(0);
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Prompt:</label>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Answers:</label>
        {answers.map((answer, index) => (
          <input
            key={index}
            type="text"
            value={answer}
            onChange={(e) => handleAnswerChange(index, e.target.value)}
            required
          />
        ))}
      </div>
      <div>
        <label>Correct Answer Index:</label>
        <input
          type="number"
          value={correctIndex}
          onChange={(e) => setCorrectIndex(parseInt(e.target.value))}
          min="0"
          max={answers.length - 1}
          required
        />
      </div>
      <button type="submit">Add Question</button>
    </form>
  );
};

export default QuestionForm;
