// --- E/I 문항 ---
const eiQuestions = [
  {
    id: 'EI1',
    dimension: 'EI',
    text: '유명 유튜버가 인터뷰 하자고 다가왔다',
    options: [
      {
        text: '와 대박! 나한테도 이런 기회가',
        type: 'E',
      },
      {
        text: '어우..누구세요 부담스렁',
        type: 'I',
      },
    ],
  },
  {
    id: 'EI2',
    dimension: 'EI',
    text: '지금 당장 문 앞에 택배나 배달이 왔다',
    options: [
      { text: '마주치면 마주치는거지 뭐. 안녕하세요~~~', type: 'E' },
      { text: '인기척이 사라지면 나간다', type: 'I' },
    ],
  },
  {
    id: 'EI3',
    dimension: 'EI',
    text: '친구 생일파티에 갔는데 아는 친구가 없다',
    options: [
      { text: '친구의 친구는 곧 내 친구', type: 'E' },
      { text: '기빨려 나간다', type: 'I' },
    ],
  },
  {
    id: 'EI4',
    dimension: 'EI',
    text: '친구가 갑자기 나 지금 너무 할 말이 많아 들어줘',
    options: [
      { text: '문자로 보내줘', type: 'I' },
      { text: 'ㄱㄱ 콜 전화할래?', type: 'E' },
    ],
  },
  {
    id: 'EI5',
    dimension: 'EI',
    text: '놀러 나갔는데 아는 사람이 지나간다',
    options: [
      { text: '절대 안 마주치게 돌아간다', type: 'I' },
      { text: '어! 야!!! 너 여기서 뭐해', type: 'E' },
    ],
  },
]

// --- S/N 문항 ---
const snQuestions = [
  {
    id: 'SN1',
    dimension: 'SN',
    text: '선생님이 시험 기출로 병아리는 월월이라 하셨다',
    options: [
      { text: '그냥 외운다', type: 'S' },
      { text: '왜지? (무한생각중)', type: 'N' },
    ],
  },
  {
    id: 'SN2',
    dimension: 'SN',
    text: '비행기를 탔다',
    options: [
      { text: '기내식 뭘까?', type: 'S' },
      { text: '추락하면 어떡하지', type: 'N' },
    ],
  },
  {
    id: 'SN3',
    dimension: 'SN',
    text: '그림을 볼 때 당신의 스타일은?',
    options: [
      {
        text: '뭔가 저 인물.. 외로움과 갈망 사이에서 흔들리는 중이야 ',
        type: 'N',
      },
      { text: '색감, 구도, 선 디테일을 본다 ', type: 'S' },
    ],
  },
  {
    id: 'SN4',
    dimension: 'SN',
    text: '영화 다 보고 나온 친구가 어땠어? 라고 물었을 때',
    options: [
      { text: '와… 그 대사 하나가 아직도 뇌에 맴도는 중', type: 'N' },
      { text: '연출 깔끔했고, 후반에 몰입도 장난 아님', type: 'S' },
    ],
  },
  {
    id: 'SN5',
    dimension: 'SN',
    text: '곧 5시야 라는 말을 들었을 때',
    options: [
      {
        text: '벌써 5시라니… 시간은 왜 이렇게 덧없이 흘러가는 걸까',
        type: 'N',
      },
      { text: '오, 5분 후에 뭐 해야 하니까 준비해야겠다', type: 'S' },
    ],
  },
]

// --- T/F  ---
const tfQuestions = [
  {
    id: 'TF1',
    dimension: 'TF',
    text: '친구가 연애 끝났다고 전화함',
    options: [
      { text: '근데 너네 사귄 지 2주 아니었냐…?', type: 'T' },
      { text: '2주라도 진심이었잖아…', type: 'F' },
    ],
  },
  {
    id: 'TF2',
    dimension: 'TF',
    text: '친구가 ‘나 요즘 너무 못생겨진 것 같아…’ 라고 말함',
    options: [
      { text: '사진 한 장 찍어봐. 진짜로 비교해보자', type: 'T' },
      { text: '무슨 소리야! 지금이 제일 예쁜데?? ', type: 'F' },
    ],
  },
  {
    id: 'TF3',
    dimension: 'TF',
    text: '나 사고났어',
    options: [
      { text: '(걱정해줘)', type: 'F' },
      { text: '(알아두도록 해)', type: 'T' },
    ],
  },
  {
    id: 'TF4',
    dimension: 'TF',
    text: '친구 커플이 싸웠는데 상대가 연락 자주하는 게 힘들다고 함',
    options: [
      { text: '거리감 느껴졌다면 그 관계는 재정비 필요함', type: 'T' },
      { text: '그 말 들으면 너무 상처일 텐데… ㅠㅠ', type: 'F' },
    ],
  },
  {
    id: 'TF5',
    dimension: 'TF',
    text: '헬스 다닌 지 1주일 된 친구가 거울 보면서 몸 좀 달라지지 않았냐?',
    options: [
      { text: '변화의 시작이지! 눈빛이 달라졌어!', type: 'F' },
      { text: '1주일은 세포도 안 놀랐음. 아니', type: 'T' },
    ],
  },
]

// --- J/P 문항 ---
const jpQuestions = [
  {
    id: 'JP1',
    dimension: 'JP',
    text: '교수님이 과제를 두 주 뒤까지 제출하래.',
    options: [
      { text: '시간이 남았을 때 조금씩 해두자! 계획 잡자', type: 'J' },
      { text: '두 주면 널널하지 ㅋ 데드라인 하루 전 풀가동', type: 'P' },
    ],
  },
  {
    id: 'JP2',
    dimension: 'JP',
    text: '방 청소를 할 때 당신은?',
    options: [
      { text: '청소 순서 정해서 구역별로 처리함', type: 'J' },
      { text: '하다보면 갑자기 인생 사진 앨범 보고 있음', type: 'P' },
    ],
  },
  {
    id: 'JP3',
    dimension: 'JP',
    text: '계획을 세우는 이유는?',
    options: [
      { text: '계획 세우면 그 계획이 날 가둬…', type: 'P' },
      { text: '내 통제 안에 있다는 게 마음의 안정이야', type: 'J' },
    ],
  },
  {
    id: 'JP4',
    dimension: 'JP',
    text: '주말에 하루가 비었다!',
    options: [
      { text: '눈 떴을 때 몇 시냐에 따라 그날 일정이 정해짐', type: 'P' },
      { text: '밀린 일정 처리 + 자율 정리 시간으로 쪼개씀', type: 'J' },
    ],
  },
  {
    id: 'JP5',
    dimension: 'JP',
    text: '해야 할 일’이 머릿속에 떠오르면?',
    options: [
      { text: '일단 메모장에 적고 분류해서 처리함', type: 'J' },
      { text: '기억날 때 하자… 근데 기억 안 남', type: 'P' },
    ],
  },
]

const allQuestions = [
  ...eiQuestions,
  ...snQuestions,
  ...tfQuestions,
  ...jpQuestions,
]

export { allQuestions, eiQuestions, snQuestions, tfQuestions, jpQuestions }
export default allQuestions
