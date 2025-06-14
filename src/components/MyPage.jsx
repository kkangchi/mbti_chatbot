import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// 챗타펭귄 파랑 계열
const mainBlue = '#46b8ff';
const darkBlue = '#2196f3';

function getInitial(name, login) {
  const base = name || login || '';
  return base[0] ? base[0].toUpperCase() : '?';
}

// MBTI 목록
const mbtiList = [
  'ISTJ',
  'ISFJ',
  'INFJ',
  'INTJ',
  'ISTP',
  'ISFP',
  'INFP',
  'INTP',
  'ESTP',
  'ESFP',
  'ENFP',
  'ENTP',
  'ESTJ',
  'ESFJ',
  'ENFJ',
  'ENTJ',
];

const MyPage = () => {
  const [user, setUser] = useState(null);
  const [mbti, setMbti] = useState('');
  const [mbtiSaved, setMbtiSaved] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // MBTI 저장 키를 계정별로 생성
  const getMbtiKey = (userObj) => {
    if (!userObj) return 'mbti';
    return `mbti_${userObj.login || userObj.id || 'anonymous'}`;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // 계정별 MBTI 불러오기
      const mbtiKey = getMbtiKey(parsedUser);
      const storedMbti = localStorage.getItem(mbtiKey);
      if (storedMbti) setMbti(storedMbti);
    }
  }, []);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleMbtiChange = (type) => {
    setMbti(type);
    setMbtiSaved(false);
    setDropdownOpen(false);
  };

  const handleMbtiSave = () => {
    if (!user) return;
    const mbtiKey = getMbtiKey(user);
    localStorage.setItem(mbtiKey, mbti);
    setMbtiSaved(true);
  };

  if (!user) {
    return (
      <div style={{ textAlign: 'center', marginTop: 80 }}>
        <h2>로그인이 필요합니다.</h2>
        <button
          style={{
            marginTop: 24,
            padding: '10px 24px',
            background: mainBlue,
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: 16,
          }}
          onClick={() => navigate('/')}
        >
          로그인 페이지로 이동
        </button>
      </div>
    );
  }

  // 프로필 원형 색상
  const profileBg = mainBlue;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: mainBlue,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'inherit',
      }}
    >
      <div
        style={{
          width: 380,
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 4px 24px rgba(70,184,255,0.13)',
          padding: '38px 36px 32px 36px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: '50%',
            background: profileBg,
            color: '#fff',
            fontSize: 40,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 18,
            boxShadow: '0 2px 12px rgba(70,184,255,0.10)',
            border: '3px solid #fff',
          }}
        >
          {getInitial(user.name, user.login)}
        </div>
        <h2
          style={{
            margin: 0,
            fontSize: 26,
            color: mainBlue,
            fontWeight: 800,
            letterSpacing: 1,
          }}
        >
          마이페이지
        </h2>
        <span
          style={{
            color: '#888',
            fontSize: 15,
            marginTop: 4,
            marginBottom: 18,
            fontWeight: 500,
          }}
        >
          {user.provider || (user.login ? 'GitHub' : 'Google')} 계정
        </span>
        <div
          style={{
            width: '100%',
            borderTop: '1.5px solid #e3f2fd',
            margin: '18px 0 24px 0',
          }}
        />
        <div style={{ marginBottom: 18, fontSize: 17, width: '100%' }}>
          <strong
            style={{ color: mainBlue, width: 70, display: 'inline-block' }}
          >
            이름
          </strong>
          <span style={{ color: '#222', fontWeight: 600 }}>
            {user.name || user.login}
          </span>
        </div>
        {/* 이메일 정보 표시 */}
        <div style={{ marginBottom: 18, fontSize: 17, width: '100%' }}>
          <strong
            style={{ color: mainBlue, width: 70, display: 'inline-block' }}
          >
            이메일
          </strong>
          <span style={{ color: '#222', fontWeight: 600 }}>
            {user.email || '정보 없음'}
          </span>
        </div>
        <div
          style={{
            marginBottom: 10,
            fontSize: 17,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <strong
            style={{ color: mainBlue, width: 70, display: 'inline-block' }}
          >
            MBTI
          </strong>
          <div
            ref={dropdownRef}
            style={{
              position: 'relative',
              marginLeft: 8,
              width: 90,
              userSelect: 'none',
            }}
          >
            <div
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                border: `1.5px solid ${mainBlue}`,
                fontWeight: 600,
                fontSize: 15,
                color: mainBlue,
                background: '#f7fbff',
                cursor: 'pointer',
                minHeight: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onClick={() => setDropdownOpen((open) => !open)}
            >
              {mbti || '선택'}
              <span style={{ marginLeft: 6, fontSize: 12 }}>▼</span>
            </div>
            {dropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 36,
                  left: 0,
                  width: '100%',
                  maxHeight: 140,
                  overflowY: 'auto',
                  background: '#fff',
                  border: `1.5px solid ${mainBlue}`,
                  borderRadius: 6,
                  zIndex: 10,
                  boxShadow: '0 2px 8px rgba(70,184,255,0.13)',
                }}
              >
                {mbtiList.map((type) => (
                  <div
                    key={type}
                    onClick={() => handleMbtiChange(type)}
                    style={{
                      padding: '7px 10px',
                      cursor: 'pointer',
                      color: mainBlue,
                      background: mbti === type ? '#e3f2fd' : '#fff',
                      fontWeight: mbti === type ? 700 : 500,
                      fontSize: 15,
                    }}
                  >
                    {type}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleMbtiSave}
            style={{
              marginLeft: 12,
              padding: '4px 16px',
              background: mainBlue,
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = darkBlue)}
            onMouseOut={(e) => (e.currentTarget.style.background = mainBlue)}
            disabled={!mbti}
          >
            저장
          </button>
        </div>
        {mbtiSaved && (
          <div
            style={{
              color: mainBlue,
              fontWeight: 600,
              marginBottom: 10,
              fontSize: 15,
              width: '100%',
            }}
          >
            MBTI가 저장되었습니다!
          </div>
        )}
        <div style={{ marginBottom: 28, fontSize: 17, width: '100%' }}>
          <strong
            style={{ color: mainBlue, width: 70, display: 'inline-block' }}
          >
            ID
          </strong>
          <span style={{ color: '#222', fontWeight: 600 }}>
            {user.login || user.id || '-'}
          </span>
        </div>
        <button
          style={{
            width: '100%',
            padding: '13px',
            background: mainBlue,
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 18,
            cursor: 'pointer',
            letterSpacing: 1,
            boxShadow: '0 2px 8px rgba(70,184,255,0.10)',
            transition: 'background 0.2s',
            marginBottom: 10,
          }}
          onClick={() => {
            localStorage.removeItem('user');
            localStorage.removeItem('sessionId');
            navigate('/', { replace: true });
          }}
          onMouseOver={(e) => (e.currentTarget.style.background = darkBlue)}
          onMouseOut={(e) => (e.currentTarget.style.background = mainBlue)}
        >
          로그아웃
        </button>
        <button
          style={{
            width: '100%',
            padding: '13px',
            background: '#e3f2fd',
            color: mainBlue,
            border: `1.5px solid ${mainBlue}`,
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 18,
            cursor: 'pointer',
            letterSpacing: 1,
            marginTop: 4,
            transition: 'background 0.2s, color 0.2s',
          }}
          onClick={() => navigate('/chat')}
        >
          챗봇 대화로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default MyPage;
