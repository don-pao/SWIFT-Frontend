import React, { useState, useEffect } from 'react';
import ResponsiveAppBar from '../../component/Appbar';
import AvatarTheme from '../../component/Theme';
import { useLocation } from 'react-router-dom';
import './Answer.css';
import { Button } from '@mui/material';

const AnswerForm = () => {
  const location = useLocation();
  const quiz = location.state?.quiz;
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (quiz) {
      setSelectedAnswers(new Array(quiz.questions.length).fill(null));
    }
  }, [quiz]);

  const handleAnswerChange = (questionIndex, optionIndex) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmitAnswers = () => {
    let score = 0;

    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswerIndex) {
        score += question.score;
      }
    });

    setTotalScore(score);
    setIsSubmitted(true);
  };

  if (!quiz) {
    return <div>No quiz data available</div>;
  }

  return (
    <>
      <ResponsiveAppBar />
      <AvatarTheme />
      <div className="answer-form-container">
        <div className="quiz-header">Answer Quiz: {quiz.title}</div>
        <div className="quiz-questions">
          {quiz.questions.map((question, questionIndex) => (
            <div key={questionIndex} className="quiz-question">
              <div className="question-text">
                {questionIndex + 1}. {question.text}
              </div>
              <div className="question-options">
                {question.options.map((option, optionIndex) => {
                  const isCorrectAnswer = question.correctAnswerIndex === optionIndex;
                  const isSelectedAnswer =
                    selectedAnswers[questionIndex] === optionIndex;

                  const optionClass = isSubmitted
                    ? isCorrectAnswer
                      ? 'correct-option'
                      : isSelectedAnswer
                      ? 'incorrect-option'
                      : ''
                    : '';

                  return (
                    <label
                      key={optionIndex}
                      className={`option-label ${optionClass}`}
                    >
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        value={optionIndex}
                        checked={isSelectedAnswer}
                        onChange={() =>
                          handleAnswerChange(questionIndex, optionIndex)
                        }
                        disabled={isSubmitted}
                      />
                      {option}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {!isSubmitted ? (
          <Button
            className="submit-button2"
            onClick={handleSubmitAnswers}
            variant="contained"
            color="primary"
          >
            Submit Answers
          </Button>
        ) : (
          <div className="result-message">
            <strong>Total Score: {totalScore}</strong>
          </div>
        )}
      </div>
    </>
  );
};

export default AnswerForm;
