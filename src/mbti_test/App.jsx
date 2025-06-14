import React from 'react'
import Test from './components/Test'
import Result from './components/Result'
import { useMbtitest } from './hooks/useMbtitest'
import { useNavigate } from 'react-router-dom'
import './index.css'

const App = () => {
  const {
    questions,
    currentIdx,
    isFinished,
    resultType,
    scores,
    answerQuestion,
    goBack,
    restart,
  } = useMbtitest()

  const navigate = useNavigate()

  return (
    <div className="app-container">
      <div className="card">
        {isFinished ? (
          <Result resultType={resultType} scores={scores} />
        ) : (
          <Test
            question={questions[currentIdx]}
            questionNumber={currentIdx + 1}
            totalQuestions={questions.length}
            onAnswer={answerQuestion}
            onBack={goBack}
            onRestart={restart}
            isFirst={currentIdx === 0}
          />
        )}

        {/* ✅ 카드 안에 버튼 위치 */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={() => navigate('/chat')}
            className="back-to-chat-button"
          >
            챗봇으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
