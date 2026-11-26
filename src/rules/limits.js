// 영역별 글자 수 상한 (한글 기준). 중학교 기재요령 기준 초안입니다.
// 학교급·학년도별로 다를 수 있으므로 실제 적용 전 원문과 대조해야 합니다.
// 값 출처 메모: 일부 항목은 2026 기재요령 원문을 아직 전부 대조하지 않았습니다. (TODO 표시)

export const FIELD_LIMITS = {
  personalTalent: { label: "인적·사항 특기", maxChars: 500 },       // TODO: 학교급별 확인
  attendanceNote: { label: "출결 특이사항", maxChars: 500 },        // TODO: 확인
  award: { label: "수상명", maxChars: 100 },                        // TODO: 확인
  autonomy: { label: "창의적 체험활동 · 자율활동", maxChars: 500 },
  club: { label: "창의적 체험활동 · 동아리활동", maxChars: 500 },
  career: { label: "창의적 체험활동 · 진로활동", maxChars: 500 },
  volunteer: { label: "봉사활동 실적(건별)", maxChars: 50 },
  dailyLife: { label: "일상생활 및 행동 특성", maxChars: 1000 },   // TODO: 확인
  subjectNote: { label: "교과 세부능력 및 특기사항(과목별)", maxChars: 500 },
  reading: { label: "독서활동(과목별)", maxChars: 250 },
  behavior: { label: "행동특성 및 종합의견", maxChars: 300 },
};

export function countChars(text) {
  return [...text].length;
}
