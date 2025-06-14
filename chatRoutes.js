// 새로운 구조:
// users/{userId}/sessions/{sessionId}/messages/{messageId}

import express from 'express'
import admin from 'firebase-admin'
import fs from 'fs'

const router = express.Router()

const serviceAccount = JSON.parse(
  fs.readFileSync('./firebaseServiceKey.json', 'utf8')
)

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })
}

const db = admin.firestore()

// 세션 생성
router.post('/startSession', async (req, res) => {
  const { userId } = req.body
  if (!userId) return res.status(400).json({ error: 'userId가 필요합니다' })

  try {
    const sessionRef = await db
      .collection('users')
      .doc(String(userId))
      .collection('sessions')
      .add({
        createdAt: new Date(),
        updatedAt: new Date(),
        title: '새로운 대화',
        isDeleted: false,
      })

    console.log('세션 생성 완료:', sessionRef.id)
    res.status(200).json({ sessionId: sessionRef.id })
  } catch (error) {
    console.error('세션 생성 실패:', error)
    res.status(500).json({ error: '세션 생성 실패' })
  }
})

// 메시지 저장
router.post('/:userId/sessions/:sessionId/message', async (req, res) => {
  const { userId, sessionId } = req.params
  const { text, isUser } = req.body

  if (!text || typeof isUser !== 'boolean' || !userId) {
    return res.status(400).json({ error: '필수 항목 누락' })
  }

  try {
    const sessionRef = db
      .collection('users')
      .doc(String(userId))
      .collection('sessions')
      .doc(sessionId)

    const sessionSnap = await sessionRef.get()
    if (!sessionSnap.exists) {
      await sessionRef.set({
        createdAt: new Date(),
        updatedAt: new Date(),
        title: '새로운 대화',
        isDeleted: false,
      })
      console.log('[세션 새로 생성됨]:', sessionId)
    } else {
      await sessionRef.update({ updatedAt: new Date() })
    }

    await sessionRef.collection('messages').add({
      text,
      isUser,
      timestamp: new Date(),
    })

    console.log('[메시지 저장 완료]', sessionId, text)
    res.status(200).json({ success: true, sessionId })
  } catch (error) {
    console.error('메시지 저장 실패:', error)
    res.status(500).json({ error: '메시지 저장 실패' })
  }
})

// 사용자 세션 목록 조회
router.get('/:userId/sessions', async (req, res) => {
  const { userId } = req.params
  if (!userId) return res.status(400).json({ error: 'userId가 필요합니다' })

  try {
    const sessionSnap = await db
      .collection('users')
      .doc(String(userId))
      .collection('sessions')
      .where('isDeleted', '!=', true)
      .orderBy('isDeleted')
      .orderBy('updatedAt', 'desc')
      .get()

    const sessions = await Promise.all(
      sessionSnap.docs.map(async (doc) => {
        const messagesSnap = await doc.ref.collection('messages').limit(1).get()
        return {
          sessionId: doc.id,
          hasMessages: !messagesSnap.empty,
          ...doc.data(),
        }
      })
    )

    console.log('세션 목록 조회:', sessions.length, '개')
    res.status(200).json({ sessions })
  } catch (error) {
    console.error('세션 목록 조회 실패:', error)
    res.status(500).json({ error: '세션 목록 조회 실패' })
  }
})

// 특정 세션의 메시지 조회
router.get('/:userId/sessions/:sessionId/messages', async (req, res) => {
  const { userId, sessionId } = req.params
  if (!userId || !sessionId) {
    return res.status(400).json({ error: 'userId 또는 sessionId 누락' })
  }

  try {
    const snapshot = await db
      .collection('users')
      .doc(String(userId))
      .collection('sessions')
      .doc(sessionId)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .get()

    const messages = snapshot.docs.map((doc) => ({
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || null,
    }))

    console.log('세션 메시지 조회:', sessionId, messages.length, '개')
    res.status(200).json({ messages })
  } catch (error) {
    console.error('세션 메시지 조회 실패:', error)
    res.status(500).json({ error: '세션 메시지 조회 실패' })
  }
})

// 세션 제목 수정
router.patch('/:userId/sessions/:sessionId/title', async (req, res) => {
  const { userId, sessionId } = req.params
  const { title } = req.body
  if (!title) return res.status(400).json({ error: 'title 누락' })

  try {
    await db
      .collection('users')
      .doc(String(userId))
      .collection('sessions')
      .doc(sessionId)
      .update({
        title,
        updatedAt: new Date(),
      })

    console.log('세션 제목 수정 완료:', sessionId, title)
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('세션 제목 수정 실패:', error)
    res.status(500).json({ error: '세션 제목 수정 실패' })
  }
})

// 세션 가상 삭제 → chatSessions로 옮기고 messages도 함께 복사 후 원본 삭제
router.delete('/:userId/sessions/:sessionId', async (req, res) => {
  const { userId, sessionId } = req.params
  if (!userId || !sessionId) {
    return res.status(400).json({ error: 'userId 또는 sessionId 누락' })
  }

  try {
    const userDoc = db.collection('users').doc(String(userId))
    const sourceRef = userDoc.collection('sessions').doc(sessionId)
    const targetRef = userDoc.collection('chatSessions').doc(sessionId)

    const doc = await sourceRef.get()
    if (!doc.exists) {
      return res.status(404).json({ error: '세션 문서가 존재하지 않음' })
    }

    // 세션 문서 복사
    await targetRef.set(doc.data())

    // messages 복사
    const sourceMessages = await sourceRef.collection('messages').get()
    const batch = db.batch()

    sourceMessages.forEach((messageDoc) => {
      const newMessageRef = targetRef.collection('messages').doc(messageDoc.id)
      batch.set(newMessageRef, messageDoc.data())
    })

    // messages 삭제 + 세션 삭제
    sourceMessages.forEach((messageDoc) => {
      batch.delete(sourceRef.collection('messages').doc(messageDoc.id))
    })

    batch.delete(sourceRef)
    await batch.commit()

    console.log('[세션 및 메시지 백업 후 삭제 완료]:', sessionId)
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('세션 삭제 처리 실패:', error)
    res.status(500).json({ error: '세션 삭제 중 오류 발생' })
  }
})

export default router
