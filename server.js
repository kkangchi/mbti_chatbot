import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { OAuth2Client } from 'google-auth-library'
import chatRoutes from './chatRoutes.js' // Firestore 메시지 저장 라우트

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Firestore 메시지 저장용 라우터 등록
app.use('/api/chat', chatRoutes)

// Google OAuth2 설정
const GOOGLE_CLIENT_ID =
  '670597003725-jq6jaa85oeojos02kcdkta5ghtj99e7i.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_REDIRECT_URI = 'http://localhost:5173'

const oauth2Client = new OAuth2Client(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
)

// Google OAuth 로그인 처리
app.post('/auth/google', async (req, res) => {
  try {
    const { code } = req.body

    // 액세스 토큰 받기
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // 사용자 정보 요청
    const userInfoResponse = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    )
    const userInfo = await userInfoResponse.json()

    res.json({
      success: true,
      user: {
        id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      },
    })
  } catch (error) {
    console.error('Google OAuth Error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to authenticate with Google',
    })
  }
})

// GitHub OAuth 로그인 처리
app.post('/auth/github', async (req, res) => {
  try {
    const { code } = req.body
    const clientId = 'Ov23li5L5MWwr3CjBDO5'
    const clientSecret = process.env.GITHUB_CLIENT_SECRET

    // 액세스 토큰 요청
    const tokenResponse = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      }
    )
    const tokenData = await tokenResponse.json()

    // 사용자 정보 요청
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    const userData = await userResponse.json()

    res.json({
      success: true,
      user: {
        id: userData.id,
        login: userData.login,
        name: userData.name,
        avatar_url: userData.avatar_url,
      },
    })
  } catch (error) {
    console.error('GitHub OAuth Error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to authenticate with GitHub',
    })
  }
})

// 서버 시작
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
