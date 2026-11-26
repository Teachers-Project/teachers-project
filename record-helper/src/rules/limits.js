// 학교급별 영역과 글자 수 상한 (한글 기준).
// 출처: 2026학년도 학교생활기록부 기재요령 (초등학교 편, 중학교 편, 고등학교 편)의 '영역별 입력 가능 최대 글자수' 표.
// maxChars가 null이면 원문상 '별도 글자수 제한 없음'(시스템상 입력 가능 범위 내)입니다.
// 독서·행동특성·창체 등 일부 항목은 원문상 '학년 단위' 최대 글자수입니다.

// 입력칸에 넣을 수 있는 최대 글자 수. 영역별 기재요령 상한(maxChars)과 별개로, 긴 초안을 쓰고 줄일 수 있게 합니다.
// 영역 상한을 넘으면 화면 경고가 나오고, 서버도 1000자까지만 받습니다.
export const INPUT_MAX = 1000;

export const SCHOOL_LEVELS = {
  elementary: "초등학교",
  middle: "중학교",
  high: "고등학교",
};

const MIDDLE = {
  personalTalent: { label: "인적·학적사항 특기사항", maxChars: 500 },
  attendanceNote: { label: "출결상황 특기사항", maxChars: 500 },
  award: { label: "수상경력 수상명", maxChars: 100 },
  autonomy: { label: "창의적 체험활동 · 자율·자치활동 (3학년은 자율활동)", maxChars: 500 },
  club: { label: "창의적 체험활동 · 동아리활동", maxChars: 500 },
  career: { label: "창의적 체험활동 · 진로활동", maxChars: 500 },
  volunteer: { label: "봉사활동실적 활동내용(실적별)", maxChars: 50 },
  dailyLife: { label: "일상생활 활동상황 특기사항", maxChars: 1000 },
  freeCareer: { label: "자유학기 · 진로탐색활동", maxChars: 1000 },
  freeTopic: { label: "자유학기 · 주제선택활동", maxChars: 1000 },
  freeArtsPE: { label: "자유학기 · 예술·체육활동", maxChars: 1000 },
  freeClub: { label: "자유학기 · 동아리활동", maxChars: 1000 },
  subjectNote: { label: "교과 세부능력 및 특기사항(과목별)", maxChars: 500 },
  individualNote: { label: "개인별 세부능력 및 특기사항", maxChars: 500 },
  readingCommon: { label: "독서활동 공통", maxChars: 500 },
  reading: { label: "독서활동 과목별", maxChars: 250 },
  behavior: { label: "행동특성 및 종합의견", maxChars: 300 },
};

const ELEMENTARY = {
  personalTalent: { label: "인적·학적사항 특기사항", maxChars: 500 },
  attendanceNote: { label: "출결상황 특기사항", maxChars: 500 },
  autonomy: { label: "창의적 체험활동 · 자율·자치활동 (통합)", maxChars: null },
  club: { label: "창의적 체험활동 · 동아리활동 (통합)", maxChars: null },
  career: { label: "창의적 체험활동 · 진로활동 (통합)", maxChars: null },
  volunteer: { label: "봉사활동실적 활동내용(실적별)", maxChars: 50 },
  dailyLife: { label: "일상생활 활동상황 특기사항", maxChars: null },
  subjectNote: { label: "교과학습 성취수준 및 특기사항", maxChars: null },
  behavior: { label: "행동특성 및 종합의견", maxChars: null },
};

const HIGH = {
  personalTalent: { label: "인적·학적사항 특기사항", maxChars: 500 },
  attendanceNote: { label: "출결상황 특기사항", maxChars: 500 },
  award: { label: "수상경력 수상명", maxChars: 100 },
  awardTarget: { label: "수상경력 참가대상(참가인원)", maxChars: 25 },
  certificate: { label: "자격증 및 인증 취득상황 명칭 또는 종류", maxChars: 100 },
  autonomy: { label: "창의적 체험활동 · 자율·자치활동 (3학년은 자율활동)", maxChars: 500 },
  club: { label: "창의적 체험활동 · 동아리활동", maxChars: 500 },
  career: { label: "창의적 체험활동 · 진로활동", maxChars: 500 },
  volunteer: { label: "봉사활동실적 활동내용(실적별)", maxChars: 50 },
  dailyLife: { label: "일상생활 활동상황 특기사항", maxChars: 1000 },
  subjectNote: { label: "교과 세부능력 및 특기사항(과목별, 공통과목 1·2 합산 500자)", maxChars: 500 },
  individualNote: { label: "개인별 세부능력 및 특기사항", maxChars: 500 },
  readingCommon: { label: "독서활동 공통", maxChars: 500 },
  reading: { label: "독서활동 과목별", maxChars: 250 },
  behavior: { label: "행동특성 및 종합의견", maxChars: 300 },
};

const FIELDS_BY_LEVEL = { elementary: ELEMENTARY, middle: MIDDLE, high: HIGH };

// 학교급에 맞는 영역 목록을 돌려줍니다. 알 수 없는 학교급이면 중학교 기준을 씁니다.
export function fieldsFor(level) {
  return FIELDS_BY_LEVEL[level] ?? MIDDLE;
}

export function countChars(text) {
  return [...text].length;
}
