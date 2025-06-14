import React from 'react'
import './ChatbotIcon.css'
import chatbotImg from '../assets/ChattaPenguin.png'

const ChatbotIcon = () => {
  return (
    <div className="chatbot-icon">
      <img src={chatbotImg} alt="챗봇 아이콘" className="chatbot-image" />
    </div>
  )
}

export default ChatbotIcon
