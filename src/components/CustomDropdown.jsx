import React, { useState, useEffect } from 'react'

const mbtiOptions = [
  '챗타펭귄', // 항상 맨 위
  'INTJ',
  'INTP',
  'ENTJ',
  'ENTP',
  'INFJ',
  'INFP',
  'ENFJ',
  'ENFP',
  'ISTJ',
  'ISFJ',
  'ESTJ',
  'ESFJ',
  'ISTP',
  'ISFP',
  'ESTP',
  'ESFP',
]

const CustomDropdown = ({ selectedMbti, setSelectedMbti }) => {
  const [isOpen, setIsOpen] = useState(false)

  // 처음 렌더링할 때 기본값을 챗타펭귄으로 설정
  useEffect(() => {
    if (!selectedMbti) {
      setSelectedMbti('챗타펭귄')
    }
  }, [selectedMbti, setSelectedMbti])

  const handleSelect = (option) => {
    setSelectedMbti(option)
    setIsOpen(false)
  }

  return (
    <div className="custom-dropdown">
      <div
        className="custom-dropdown-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedMbti}
        <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className="custom-dropdown-list">
          {mbtiOptions.map((option) => (
            <div
              key={option}
              className="custom-dropdown-item"
              onClick={() => handleSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomDropdown
