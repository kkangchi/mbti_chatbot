import React, { useState, useEffect } from 'react';
import './LoginForm.css';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ChattaPenguin from '../assets/ChattaPenguin.png';

function LoginForm() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ 환경변수에서 redirect_uri 가져오기
  const googleRedirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
  const githubRedirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      navigate('/chat', { replace: true });
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const scope = urlParams.get('scope');
    const state = urlParams.get('state');

    if (code && scope) {
      (async () => {
        await handleGoogleCallback();
      })();
    } else if (code) {
      handleGitHubCallback();
    }
  }, [navigate]);

  const handleGitHubLogin = () => {
    const clientId = 'Ov23li5L5MWwr3CjBDO5';
    const scope = 'read:user';
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${githubRedirectUri}&scope=${scope}`;
    window.location.href = authUrl;
  };

  const handleGoogleLogin = () => {
    const clientId =
      '670597003725-jq6jaa85oeojos02kcdkta5ghtj99e7i.apps.googleusercontent.com';
    const scope =
      'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${googleRedirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
    window.location.href = authUrl;
  };

  const handleGitHubCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    if (code && !state) {
      try {
        const response = await fetch('/auth/github', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();
        if (data.success) {
          const userData = data.user;
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
          navigate('/chat', { replace: true });
        } else {
          console.error('GitHub OAuth Error:', data.error);
        }
      } catch (error) {
        console.error('Error during GitHub callback:', error);
      }
    }
  };

  const handleGoogleCallback = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      try {
        const response = await fetch('/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();
        if (data.success) {
          const userData = data.user;
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          );
          navigate('/chat', { replace: true });
        } else {
          console.error('Google OAuth Error:', data.error);
        }
      } catch (error) {
        console.error('Error during Google callback:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/', { replace: true });
  };

  return (
    <div className="container">
      <div className="image-section">
        <img src={ChattaPenguin} alt="Login" className="login-image" />
      </div>
      <div className="login-section">
        <div className="login-box">
          <h1 className="welcome-title">챗타펭귄에 오신 것을 환영합니다!</h1>
          {user ? (
            <div className="welcome-box">
              <h2>환영합니다, {user.name || user.login}!</h2>
              <button className="logout-button" onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          ) : (
            <div className="login-form">
              <h2>로그인</h2>
              <button
                className="login-button github"
                onClick={handleGitHubLogin}
              >
                <FaGithub style={{ marginRight: '8px' }} />
                GitHub로 로그인
              </button>
              <button
                className="login-button google"
                onClick={handleGoogleLogin}
              >
                <FaGoogle style={{ marginRight: '8px' }} />
                Google로 로그인
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
