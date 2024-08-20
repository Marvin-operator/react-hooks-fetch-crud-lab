import React, { useState, useEffect } from 'react';
import QuestionForm from './QuestionForm';

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('http://localhost:4000/questions');
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAddQuestion = (newQuestion) => {
    setQuestions([...questions, newQuestion]);
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await fetch(`http://localhost:4000/questions/${id}`, {
        method: 'DELETE',
      });
      setQuestions(questions.filter(question => question.id !== id));
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleUpdateQuestion = async (id, correctIndex) => {
    try {
      const response = await fetch(`http://localhost:4000/questions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correctIndex }),
      });
      const updatedQuestion = await response.json();
      setQuestions(questions.map(question =>
        question.id === id ? updatedQuestion : question
      ));
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  return (
    <div>
      <QuestionForm onAddQuestion={handleAddQuestion} />
      {loading ? (
        <p>Loading questions...</p>
      ) : (
        <ul>
          {questions.map(question => (
            <li key={question.id}>
              <p>{question.prompt}</p>
              <select
                value={question.correctIndex}
                onChange={(e) => handleUpdateQuestion(question.id, parseInt(e.target.value))}
              >
                {question.answers.map((answer, index) => (
                  <option key={index} value={index}>
                    {answer}
                  </option>
                ))}
              </select>
              <button onClick={() => handleDeleteQuestion(question.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuestionList;
 
