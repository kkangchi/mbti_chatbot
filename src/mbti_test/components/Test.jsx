import React from 'react';
import './Test.css';

const Test = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  onBack,
  onRestart,
  isFirst,
}) => {
  const { text, options } = question;

  return (
    <div className="test-container">
      {/* 진행 상태 (ex 8 / 12) */}
      <div className="test-progress">
        {questionNumber} / {totalQuestions}
      </div>

      {/* 질문*/}
      <h2 className="test-question">{text}</h2>

      {/*답안*/}
      <div className="test-options">
        {options.map((opt, idx) => (
          <button
            key={idx}
            className="button-option"
            onClick={() => onAnswer(opt.type)}
          >
            {opt.text}
          </button>
        ))}
      </div>

      {/* 이전으로 / 처음으로 */}
      <div className="test-navigation">
        <button className="button-nav" onClick={onBack} disabled={isFirst}>
          이전으로
        </button>
        <button className="button-nav" onClick={onRestart}>
          처음으로
        </button>
      </div>
    </div>
  );
};

export default Test;
