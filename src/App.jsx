import { Routes, Route, Navigate } from 'react-router-dom'
import Chat from './components/Chat'
import LoginForm from './components/LoginForm'
import MyPage from './components/MyPage'
import MbtiPage from './pages/MbtiPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/mbti" element={<MbtiPage />} />
    </Routes>
  )
}

export default App
