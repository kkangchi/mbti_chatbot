import React from 'react';
import './Result.css';

import ENFJ from '../assets/ENFJ.png';
import ENFP from '../assets/ENFP.png';
import ENTJ from '../assets/ENTJ.png';
import ENTP from '../assets/ENTP.png';
import ESFJ from '../assets/ESFJ.png';
import ESFP from '../assets/ESFP.png';
import ESTJ from '../assets/ESTJ.png';
import ESTP from '../assets/ESTP.png';
import INFJ from '../assets/INFJ.png';
import INFP from '../assets/INFP.png';
import INTJ from '../assets/INTJ.png';
import INTP from '../assets/INTP.png';
import ISFJ from '../assets/ISFJ.png';
import ISFP from '../assets/ISFP.png';
import ISTJ from '../assets/ISTJ.png';
import ISTP from '../assets/ISTP.png';

const descriptions = {
  ISTJ: 'ISTJ: 실용적이고 책임감이 강한 사람입니다.',
  ISTP: 'ISTP: 분석적이고 즉흥적인 경향이 있습니다.',
  ISFJ: 'ISFJ: 친절하고 헌신적인 경향이 있습니다.',
  ISFP: 'ISFP: 부드럽고 예술적인 성향을 지닙니다.',
  INFJ: 'INFJ: 통찰력이 뛰어나고 이상주의적입니다.',
  INFP: 'INFP: 내향적이면서도 창의적인 성향을 보입니다.',
  INTJ: 'INTJ: 독창적이고 전략적인 사고를 합니다.',
  INTP: 'INTP: 논리적이고 호기심이 강합니다.',
  ESTP: 'ESTP: 활동적이고 현실적인 성향이 있습니다.',
  ESFP: 'ESFP: 사교적이고 즐거움을 추구합니다.',
  ENFP: 'ENFP: 열정적이며 공감 능력이 뛰어납니다.',
  ENTP: 'ENTP: 창의적이며 도전적인 성향을 보입니다.',
  ESTJ: 'ESTJ: 조직적이고 실용적인 리더십을 발휘합니다.',
  ESFJ: 'ESFJ: 친절하고 협력적인 성향이 강합니다.',
  ENFJ: 'ENFJ: 외향적이며 지도력과 공감 능력이 뛰어납니다.',
  ENTJ: 'ENTJ: 결단력 있고 전략적인 리더십을 발휘합니다.',
};

const mbtiImageMap = {
  ISTJ,
  ISTP,
  ISFJ,
  ISFP,
  INFJ,
  INFP,
  INTJ,
  INTP,
  ESTP,
  ESFP,
  ENFP,
  ENTP,
  ESTJ,
  ESFJ,
  ENFJ,
  ENTJ,
};

const Result = ({ resultType, scores }) => {
  // 이미지
  const resultImgSrc = mbtiImageMap[resultType] || null;
  // 설명
  const description = descriptions[resultType] || '설명 정보가 없습니다.';

  // ========== 퍼센트 계산 ==========
  const eiTotal = scores.E + scores.I; // = 3
  const percentE = eiTotal > 0 ? Math.round((scores.E / eiTotal) * 100) : 0;
  const percentI = 100 - percentE;

  const snTotal = scores.S + scores.N; // = 3
  const percentS = snTotal > 0 ? Math.round((scores.S / snTotal) * 100) : 0;
  const percentN = 100 - percentS;

  const tfTotal = scores.T + scores.F; // = 3
  const percentT = tfTotal > 0 ? Math.round((scores.T / tfTotal) * 100) : 0;
  const percentF = 100 - percentT;

  const jpTotal = scores.J + scores.P; // = 3
  const percentJ = jpTotal > 0 ? Math.round((scores.J / jpTotal) * 100) : 0;
  const percentP = 100 - percentJ;

  return (
    <div className="result-container">
      {/* MBTI 이미지 */}
      {resultImgSrc && (
        <div className="result-image-wrap">
          <img src={resultImgSrc} alt={resultType} className="result-image" />
        </div>
      )}

      {/* MBTI 문자열 */}
      <div className="result-type-text">{resultType}</div>

      {/* 설명 */}
      <p className="result-description">{description}</p>

      {/* ========== 막대 그래프 ========== */}
      <div className="bars-container">
        {/*  E / I*/}
        <div className="bar-row">
          <span
            className={
              percentE > percentI ? 'bar-label-left bold' : 'bar-label-left'
            }
          >
            E {percentE}%
          </span>

          <div className="bar-wrapper">
            <div className="bar-fill-left" style={{ width: `${percentE}%` }} />
            <div className="bar-fill-right" style={{ width: `${percentI}%` }} />
          </div>

          <span
            className={
              percentI > percentE ? 'bar-label-right bold' : 'bar-label-right'
            }
          >
            I {percentI}%
          </span>
        </div>

        {/*  S / N  */}
        <div className="bar-row">
          <span
            className={
              percentS > percentN ? 'bar-label-left bold' : 'bar-label-left'
            }
          >
            S {percentS}%
          </span>
          <div className="bar-wrapper">
            <div className="bar-fill-left" style={{ width: `${percentS}%` }} />
            <div className="bar-fill-right" style={{ width: `${percentN}%` }} />
          </div>
          <span
            className={
              percentN > percentS ? 'bar-label-right bold' : 'bar-label-right'
            }
          >
            N {percentN}%
          </span>
        </div>

        {/*T / F*/}
        <div className="bar-row">
          <span
            className={
              percentT > percentF ? 'bar-label-left bold' : 'bar-label-left'
            }
          >
            T {percentT}%
          </span>
          <div className="bar-wrapper">
            <div className="bar-fill-left" style={{ width: `${percentT}%` }} />
            <div className="bar-fill-right" style={{ width: `${percentF}%` }} />
          </div>
          <span
            className={
              percentF > percentT ? 'bar-label-right bold' : 'bar-label-right'
            }
          >
            F {percentF}%
          </span>
        </div>

        {/*  J / P */}
        <div className="bar-row">
          <span
            className={
              percentJ > percentP ? 'bar-label-left bold' : 'bar-label-left'
            }
          >
            J {percentJ}%
          </span>
          <div className="bar-wrapper">
            <div className="bar-fill-left" style={{ width: `${percentJ}%` }} />
            <div className="bar-fill-right" style={{ width: `${percentP}%` }} />
          </div>
          <span
            className={
              percentP > percentJ ? 'bar-label-right bold' : 'bar-label-right'
            }
          >
            P {percentP}%
          </span>
        </div>
      </div>

      <button className="retry-button" onClick={() => window.location.reload()}>
        다시 검사하기
      </button>
    </div>
  );
};

export default Result;
