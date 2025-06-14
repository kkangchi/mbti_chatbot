// ChatForm.jsx
import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react'

const ChatForm = forwardRef(({ onSendMessage }, ref) => {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef(null)

  useImperativeHandle(ref, () => ({
    focusInput: () => {
      inputRef.current?.focus()
    },
  }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim() === '') return

    onSendMessage(inputValue)
    setInputValue('')
  }

  return (
    <form onSubmit={handleSubmit} className="chat-form">
      <input
        ref={inputRef}
        type="text"
        placeholder="메시지를 입력하세요..."
        className="message-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        required
      />
      <button type="submit" className="material-symbols-rounded">
        arrow_upward
      </button>
    </form>
  )
})

export default ChatForm
