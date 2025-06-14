import { useState } from 'react';
import {
  eiQuestions,
  snQuestions,
  tfQuestions,
  jpQuestions,
} from '../data/questions';

/*
배열에서 n개를 중복 없이 랜덤덤 */
function sampleRandom(arr, n) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

export function useMbtitest() {
  //  질문을 한 번만 3개씩 생성
  const [questions] = useState(() => {
    const selectedEI = sampleRandom(eiQuestions, 3);
    const selectedSN = sampleRandom(snQuestions, 3);
    const selectedTF = sampleRandom(tfQuestions, 3);
    const selectedJP = sampleRandom(jpQuestions, 3);
    const combined = [
      ...selectedEI,
      ...selectedSN,
      ...selectedTF,
      ...selectedJP,
    ];
    return sampleRandom(combined, combined.length);
  });

  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState({
    E: 0,
    I: 0,
    S: 0,
    N: 0,
    T: 0,
    F: 0,
    J: 0,
    P: 0,
  });
  const [selectedTypes, setSelectedTypes] = useState([]); // 선택된 유형 순서대로 저장
  const [isFinished, setIsFinished] = useState(false);
  const [resultType, setResultType] = useState('');

  //사용자가 답안 호출되는 함수
  const answerQuestion = (type) => {
    setScores((prev) => {
      const updated = { ...prev, [type]: prev[type] + 1 };
      return updated;
    });

    setSelectedTypes((prev) => [...prev, type]);

    //  다음 질문으로 이동/ 계산
    const nextIdx = currentIdx + 1;
    if (nextIdx >= questions.length) {
      // 마지막 질문 응답 → 결과 화면
      setIsFinished(true);
      setScores((prevScores) => {
        const newScores = { ...prevScores, [type]: prevScores[type] + 1 };
        calculateMbti(newScores);
        return newScores;
      });
    } else {
      setCurrentIdx(nextIdx);
    }
  };

  //돌아가기
  const goBack = () => {
    if (currentIdx === 0) return; // 첫 질문일 때는 돌아갈 수 없음

    //마지막으로 선택된 유형 꺼내기기
    const lastType = selectedTypes[selectedTypes.length - 1];

    //해당 유형 점수 1 감소
    setScores((prev) => {
      const updated = { ...prev };
      updated[lastType] = Math.max(0, updated[lastType] - 1);
      return updated;
    });

    // 선택 이력에서 마지막 요소 제거
    setSelectedTypes((prev) => prev.slice(0, -1));

    //  이전 질문 이동
    setCurrentIdx((prev) => prev - 1);

    //결과 화면에서 돌아갈 때 상태 초기화
    if (isFinished) {
      setIsFinished(false);
      setResultType('');
    }
  };

  // 처음으로 가기
  const restart = () => {
    setScores({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
    setSelectedTypes([]);
    setCurrentIdx(0);
    setIsFinished(false);
    setResultType('');
  };

  // 최종 MBTI 결과
  const calculateMbti = (finalScores) => {
    const arr = [];
    arr.push(finalScores.E >= finalScores.I ? 'E' : 'I');
    arr.push(finalScores.S >= finalScores.N ? 'S' : 'N');
    arr.push(finalScores.T >= finalScores.F ? 'T' : 'F');
    arr.push(finalScores.J >= finalScores.P ? 'J' : 'P');
    setResultType(arr.join(''));
  };

  return {
    questions,
    currentIdx,
    isFinished,
    resultType,
    scores,
    answerQuestion,
    goBack,
    restart,
  };
}
