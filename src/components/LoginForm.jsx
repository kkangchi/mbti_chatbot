import React, { useState, useEffect } from 'react'
import './LoginForm.css' // 스타일링을 위한 CSS 파일
import { FaGithub, FaGoogle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import ChattaPenguin from '../assets/ChattaPenguin.png'

function LoginForm() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    console.log('LoginForm useEffect 실행')
    const storedUser = localStorage.getItem('user')
    console.log('저장된 사용자 정보:', storedUser)

    if (storedUser) {
      const userData = JSON.parse(storedUser)
      console.log('저장된 사용자 정보가 있음:', userData)
      setUser(userData)
      navigate('/chat', { replace: true })
      return
    }

    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const scope = urlParams.get('scope') // Google에만 존재
    const state = urlParams.get('state') // GitHub에서 사용하는 경우 있음음
    // const scope = urlParams.get('scope')
    console.log('URL 파라미터:', { code, scope, state })

    if (code && scope) {
      console.log('Google 콜백 처리 시작')
      ;(async () => {
        await handleGoogleCallback()
      })()
    } else if (code) {
      console.log('GitHub 콜백 처리 시작')
      handleGitHubCallback()
    }
  }, [navigate])

  const handleGitHubLogin = () => {
    console.log('GitHub 로그인 시작')
    const clientId = 'Ov23li5L5MWwr3CjBDO5'
    const redirectUri = 'http://localhost:5173'
    const scope = 'read:user'
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`
    console.log('GitHub 인증 URL:', authUrl)
    window.location.href = authUrl
  }

  const handleGoogleLogin = () => {
    console.log('Google 로그인 시작')
    const clientId =
      '670597003725-jq6jaa85oeojos02kcdkta5ghtj99e7i.apps.googleusercontent.com'
    const redirectUri = 'http://localhost:5173'
    const scope =
      'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`
    console.log('Google 인증 URL:', authUrl)
    window.location.href = authUrl
  }

  const handleGitHubCallback = async () => {
    console.log('GitHub 콜백 처리 시작')
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const state = urlParams.get('state')
    console.log('GitHub 콜백 파라미터:', { code, state })

    if (code && !state) {
      try {
        console.log('GitHub 서버 요청 시작')
        const response = await fetch('http://localhost:5000/auth/github', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        })

        const data = await response.json()
        console.log('GitHub 서버 응답:', data)

        if (data.success) {
          console.log('GitHub 로그인 성공, 사용자 정보 저장')
          const userData = data.user
          localStorage.setItem('user', JSON.stringify(userData))
          setUser(userData)
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          )
          console.log('Chat 페이지로 이동 시도')
          navigate('/chat', { replace: true })
        } else {
          console.error('GitHub OAuth Error:', data.error)
        }
      } catch (error) {
        console.error('Error during GitHub callback:', error)
      }
    }
  }

  const handleGoogleCallback = async () => {
    console.log('Google 콜백 처리 시작')
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    console.log('Google 콜백 파라미터:', { code })

    if (code) {
      try {
        console.log('Google 서버 요청 시작')
        const response = await fetch('http://localhost:5000/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        })

        const data = await response.json()
        console.log('Google 서버 응답:', data)

        if (data.success) {
          console.log('Google 로그인 성공, 사용자 정보 저장')
          const userData = data.user
          localStorage.setItem('user', JSON.stringify(userData))
          setUser(userData)
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          )
          console.log('Chat 페이지로 이동 시도')
          navigate('/chat', { replace: true })
        } else {
          console.error('Google OAuth Error:', data.error)
        }
      } catch (error) {
        console.error('Error during Google callback:', error)
      }
    }
  }

  const handleLogout = () => {
    console.log('로그아웃 처리')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/', { replace: true })
  }

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
  )
}

export default LoginForm
