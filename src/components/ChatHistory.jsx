import React, { useState, useEffect, useRef } from 'react'

const ChatHistory = ({ userId, onSelectMessages }) => {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingSessionId, setEditingSessionId] = useState(null)
  const [editedTitle, setEditedTitle] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/chat/${userId}/sessions`
        )
        const data = await res.json()
        console.log('[세션 목록 응답]:', data)

        const filtered = (data.sessions || []).filter(
          (s) => s.isDeleted !== true
        )
        setSessions(filtered)
      } catch (err) {
        console.error('세션 목록 불러오기 실패:', err)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchSessions()
    }
  }, [userId])

  useEffect(() => {
    if (editingSessionId && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editingSessionId])

  const handleSessionClick = async (sessionId) => {
    console.log('[클릭된 세션 ID]:', sessionId)
    try {
      const res = await fetch(
        `http://localhost:5000/api/chat/${userId}/sessions/${sessionId}/messages`
      )
      const data = await res.json()
      console.log('[세션 메시지 응답]:', data)

      if (Array.isArray(data.messages)) {
        onSelectMessages(data.messages, sessionId)
      } else {
        console.warn('[경고] 응답에 메시지 배열 없음:', data)
        onSelectMessages([], sessionId)
      }
    } catch (err) {
      console.error('세션 메시지 불러오기 실패:', err)
    }
  }

  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation()
    const confirm = window.confirm('정말 이 대화를 삭제하시겠습니까?')
    if (!confirm) return

    try {
      const res = await fetch(
        `http://localhost:5000/api/chat/${userId}/sessions/${sessionId}`,
        {
          method: 'DELETE',
        }
      )
      const data = await res.json()
      if (data.success) {
        setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId))
        const currentSessionId = localStorage.getItem('sessionId')
        if (currentSessionId === sessionId) {
          localStorage.removeItem('sessionId')
          onSelectMessages([], null)
        }
      } else {
        console.error('삭제 실패:', data)
      }
    } catch (err) {
      console.error('세션 삭제 요청 실패:', err)
    }
  }

  const handleEditTitle = (e, session) => {
    e.stopPropagation()
    setEditingSessionId(session.sessionId)
    setEditedTitle(session.title || '')
  }

  const handleSaveTitle = async (e, sessionId) => {
    e.stopPropagation()
    if (!editedTitle.trim()) return

    try {
      const res = await fetch(
        `http://localhost:5000/api/chat/${userId}/sessions/${sessionId}/title`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: editedTitle }),
        }
      )
      const data = await res.json()
      if (data.success) {
        setSessions((prev) =>
          prev.map((s) =>
            s.sessionId === sessionId ? { ...s, title: editedTitle } : s
          )
        )
        setEditingSessionId(null)
        setEditedTitle('')
      } else {
        console.error('제목 저장 실패:', data)
      }
    } catch (err) {
      console.error('제목 수정 요청 실패:', err)
    }
  }

  const handleCancelEdit = (e) => {
    e.stopPropagation()
    setEditingSessionId(null)
    setEditedTitle('')
  }

  const formatDate = (rawDate) => {
    try {
      if (rawDate?._seconds != null && rawDate?._nanoseconds != null) {
        const millis =
          rawDate._seconds * 1000 + Math.floor(rawDate._nanoseconds / 1e6)
        return new Date(millis).toLocaleString()
      }

      if (typeof rawDate === 'object' && typeof rawDate.toDate === 'function') {
        return rawDate.toDate().toLocaleString()
      }

      const dateObj = new Date(rawDate)
      return isNaN(dateObj.getTime()) ? '날짜 없음' : dateObj.toLocaleString()
    } catch {
      return '날짜 없음'
    }
  }

  if (loading) return <div className="chat-history">로딩 중...</div>
  if (sessions.length === 0)
    return <div className="chat-history">저장된 대화가 없습니다.</div>

  return (
    <div className="chat-history">
      <h4 className="chat-history-title">이전 대화</h4>
      <ul className="chat-history-list">
        {sessions.map((session) => (
          <li key={session.sessionId}>
            <div
              className="chat-history-button"
              onClick={() => handleSessionClick(session.sessionId)}
              style={{ cursor: 'pointer' }}
            >
              {editingSessionId === session.sessionId ? (
                <>
                  <input
                    ref={inputRef}
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleSaveTitle(e, session.sessionId)
                      } else if (e.key === 'Escape') {
                        e.preventDefault()
                        handleCancelEdit(e)
                      }
                    }}
                  />
                  <div className="actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleSaveTitle(e, session.sessionId)}
                      title="저장"
                    >
                      💾
                    </button>
                    <button onClick={handleCancelEdit} title="취소">
                      ❌
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span>{session.title || formatDate(session.createdAt)}</span>
                  <div className="actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleEditTitle(e, session)}
                      title="수정"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={(e) => handleDeleteSession(e, session.sessionId)}
                      title="삭제"
                    >
                      🗑
                    </button>
                  </div>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ChatHistory
