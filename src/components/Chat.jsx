import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ChatbotIcon from './ChatbotIcon';
import ChatForm from './ChatForm';
import CustomDropdown from './CustomDropdown';
import ChatHistory from './ChatHistory';
import './Chat.css';
import { fetchOpenRouterReply } from '../api/fetchOpenRouterReply';
import mbtiApiMap from '../api/mbtiApiMap';

const Chat = () => {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [selectedMbti, setSelectedMbti] = useState('');
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true); // ✅ 추가
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [initialIntroMessage, setInitialIntroMessage] = useState(null);
  const [isNewSession, setIsNewSession] = useState(false);
  const [hasSentMessage, setHasSentMessage] = useState(false);
  const [lastUsedMbti, setLastUsedMbti] = useState('');
  const [hasIntroMessage, setHasIntroMessage] = useState(false);
  const messagesEndRef = useRef(null);
  const sessionInitRef = useRef(false);
  const chatFormRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const generateIntroMessage = (mbti) => {
    const speaker =
      mbti && mbti.trim() !== '' && mbti.toLowerCase() !== 'chattapenguin'
        ? `${mbti.toUpperCase()} 상담가`
        : '챗타펭귄 상담가';
    return {
      text: `안녕하세요! 저는 ${speaker}예요. 오늘은 기분이 어떠신가요?`,
      isUser: false,
      temporary: true,
    };
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      setUser(null);
      setUserLoading(false);
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    setUserLoading(false);

    const storedSessionId = localStorage.getItem('sessionId');
    if (sessionInitRef.current) return;

    const initializeSession = async () => {
      if (storedSessionId) {
        try {
          const res = await fetch(
            `http://localhost:5000/api/chat/${parsedUser.id}/sessions/${storedSessionId}/messages`
          );
          const data = await res.json();
          if (Array.isArray(data.messages) && data.messages.length > 0) {
            setSessionId(storedSessionId);
            setMessages(data.messages);
            sessionInitRef.current = true;
            setHasIntroMessage(true);
            return;
          } else {
            localStorage.removeItem('sessionId');
          }
        } catch (err) {
          console.error('세션 유효성 검사 실패:', err);
          localStorage.removeItem('sessionId');
        }
      }

      sessionInitRef.current = true;
      const intro = generateIntroMessage(selectedMbti);
      setMessages([intro]);
      setInitialIntroMessage({ text: intro.text, isUser: false });
      setHasIntroMessage(true);
    };

    initializeSession();
  }, []);

  useEffect(() => {
    if (!hasSentMessage && sessionInitRef.current && hasIntroMessage) {
      const intro = generateIntroMessage(selectedMbti);
      setMessages([intro]);
      setInitialIntroMessage({ text: intro.text, isUser: false });
    }
  }, [selectedMbti]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    chatFormRef.current?.focusInput();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewChat = async () => {
    if (!user) return;
    const userId = String(user?.id || user?.login || 'anonymous');

    setSessionId(null);
    localStorage.removeItem('sessionId');
    sessionInitRef.current = true;
    const intro = generateIntroMessage(selectedMbti);
    setInitialIntroMessage({ text: intro.text, isUser: false });
    setMessages([intro]);
    setIsNewSession(true);
    setHasSentMessage(false);
    setHasIntroMessage(true);
    setLastUsedMbti(selectedMbti);
    chatFormRef.current?.focusInput();
  };

  const addMessage = async (message) => {
    const userId = String(user?.id || user?.login || 'anonymous');
    const userMessage = { text: message, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    scrollToBottom();

    try {
      let currentSessionId = sessionId;

      if (!currentSessionId) {
        const res = await fetch('http://localhost:5000/api/chat/startSession', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });
        const data = await res.json();
        if (data.sessionId) {
          currentSessionId = data.sessionId;
          setSessionId(currentSessionId);
          localStorage.setItem('sessionId', currentSessionId);
        } else {
          throw new Error('세션 생성 실패');
        }
      }

      if (initialIntroMessage) {
        await fetch(
          `http://localhost:5000/api/chat/${userId}/sessions/${currentSessionId}/message`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...initialIntroMessage, userId }),
          }
        );
        setInitialIntroMessage(null);
      }

      await fetch(
        `http://localhost:5000/api/chat/${userId}/sessions/${currentSessionId}/message`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...userMessage, userId }),
        }
      );

      let botReply = '';
      const effectiveMbti = selectedMbti || lastUsedMbti;

      if (
        effectiveMbti.toLowerCase() === 'chattapenguin' &&
        mbtiApiMap[effectiveMbti]
      ) {
        const res = await fetch(mbtiApiMap[effectiveMbti], {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
        });
        const data = await res.json();
        botReply = data.reply || '응답을 불러오는 데 실패했어요.';
      } else {
        botReply = await fetchOpenRouterReply(
          message,
          [...messages, userMessage],
          effectiveMbti.toLowerCase()
        );
      }

      await fetch(
        `http://localhost:5000/api/chat/${userId}/sessions/${currentSessionId}/message`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: botReply, isUser: false, userId }),
        }
      );

      setMessages((prev) => [...prev, { text: botReply, isUser: false }]);
      setHasSentMessage(true);
      setLastUsedMbti(effectiveMbti);
    } catch (err) {
      console.error('메시지 처리 오류:', err);
      setMessages((prev) => [
        ...prev,
        { text: '챗봇 응답을 받아올 수 없습니다.', isUser: false },
      ]);
    }

    scrollToBottom();
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('sessionId');
    navigate('/', { replace: true });
  };

  const handleSessionSelect = (msgs, newSessionId) => {
    setSessionId(newSessionId);
    localStorage.setItem('sessionId', newSessionId);
    setIsNewSession(false);

    const hasWelcome = msgs.some(
      (m) => !m.isUser && m.text?.includes('오늘은 기분이 어떠신가요?')
    );

    if (!hasWelcome || msgs.length === 0) {
      const intro = generateIntroMessage(selectedMbti);
      msgs = [{ ...intro }, ...msgs];
      setInitialIntroMessage({ text: intro.text, isUser: false });
      setHasIntroMessage(true);
    } else {
      setHasIntroMessage(true);
    }

    setMessages(msgs);
    chatFormRef.current?.focusInput();
  };

  // ✅ 사용자 로딩 중 표시 → 깜빡임 방지
  if (userLoading) return <div>로딩 중...</div>;

  // ✅ 로그인 안 한 경우 리디렉션
  if (!user) {
    navigate('/', { replace: true });
    return null;
  }

  const userId = String(user?.id || user?.login || 'anonymous');

  return (
    <div className="container">
      {isNavbarVisible && (
        <nav className="navbar">
          <button
            className="material-symbols-rounded navbar-toggle"
            onClick={() => setIsNavbarVisible(false)}
          >
            keyboard_arrow_up
          </button>

          <ChatHistory userId={userId} onSelectMessages={handleSessionSelect} />

          <div className="sidebar-logout">
            <button onClick={handleNewChat}>새 대화 시작</button>
          </div>
          <div className="sidebar-logout">
            <button onClick={() => navigate('/mypage')}>마이페이지</button>
          </div>
          <div className="sidebar-logout">
            <button onClick={() => navigate('/mbti')}>MBTI 테스트</button>
          </div>
          <div className="sidebar-logout">
            <button onClick={handleLogout}>로그아웃</button>
          </div>
        </nav>
      )}

      <div
        className={`chatbot-popup ${
          isNavbarVisible ? 'with-navbar' : 'full-width'
        }`}
      >
        <div className="chat-header">
          <div className="header-info">
            {!isNavbarVisible && (
              <button
                className="material-symbols-rounded navbar-toggle"
                onClick={() => setIsNavbarVisible(true)}
              >
                keyboard_arrow_down
              </button>
            )}
            <span className="chatbot-title center-title">챗타펭귄</span>
          </div>
          <div className="header-actions">
            <CustomDropdown
              selectedMbti={selectedMbti}
              setSelectedMbti={setSelectedMbti}
            />
          </div>
        </div>

        <div className="chat-body">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`message-${msg.isUser ? 'user' : 'bot'}-message`}
            >
              {!msg.isUser && <ChatbotIcon />}
              <p className="message-text">{msg.text}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-footer">
          <ChatForm ref={chatFormRef} onSendMessage={addMessage} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
