// 영역별 글자 수 상한 (한글 기준).
// 출처: 2026학년도 학교생활기록부 기재요령 중학교 편, 글자수 표 (원문 대조 완료).
// 주의: 중학교 기준입니다. 초등·고등학교는 영역과 상한이 다르므로 별도 확인이 필요합니다.
// 독서·행동특성·창체 등 일부 항목은 원문상 '학년 단위' 최대 글자수입니다.

export const FIELD_LIMITS = {
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

export function countChars(text) {
  return [...text].length;
}
