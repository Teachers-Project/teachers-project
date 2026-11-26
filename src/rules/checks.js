// 입력 문장 검사 규칙 (시작 버전).
// 목적: 교사가 입력하기 전에 '학생 식별 정보'와 '기재 금지 표현'을 경고합니다.
// 경고는 차단이 아니라 안내입니다. 최종 판단은 교사가 합니다.
// TODO: 금지 표현 목록은 2026 기재요령 원문과 한 줄씩 대조해서 확정해야 합니다.

// '○○ 학생' 앞에 와도 이름이 아닌 흔한 말. 이 말들이면 이름으로 보지 않습니다.
const NOT_A_NAME = new Set([
  "다른", "모든", "각각", "같은", "여러", "주변", "동료", "친구", "반", "우리", "일부",
  "다양한", "해당", "다수", "소수", "어려운", "이", "그", "저", "한", "두", "세",
]);

function hasNameLikeStudent(text) {
  for (const m of text.matchAll(/([가-힣]{2,4})\s*학생/g)) {
    if (!NOT_A_NAME.has(m[1])) return true;
  }
  return false;
}

const STUDENT_PATTERNS = [
  { test: (t) => /\d{4,6}\s*번?\s*학생|학번\s*[:：]?\s*\d+/.test(t), reason: "학번으로 보이는 숫자가 있습니다." },
  { test: hasNameLikeStudent, reason: "'○○ 학생' 형태의 이름이 있을 수 있습니다." },
  // 학교명: '○○초등학교/중학교/고등학교' 형태. 일반어인 '중학교 생활' 같은 표현은 앞 글자가 2자 이상일 때만 학교명으로 봅니다.
  { test: (t) => /[가-힣]{2,}(초등학교|중학교|고등학교)/.test(t), reason: "학교명으로 보이는 표현이 있습니다." },
  { test: (t) => /\d{6}-?[1-4]\d{6}/.test(t), reason: "주민등록번호 형식이 있습니다. 입력하면 안 됩니다." },
  { test: (t) => /\d{3}-\d{4}-\d{4}/.test(t), reason: "전화번호 형식이 있습니다." },
];

const PROHIBITED_PATTERNS = [
  { re: /[가-힣A-Za-z]+대학교/, reason: "특정 대학교명은 기재요령에서 금지합니다.", source: "중학교 기재요령 (대학명 표기 금지, 확인 필요)" },
  { re: /(대회|올림피아드|경시|경연).*(수상|입상|우수|최우수|금상|은상|동상)|(수상|입상).*(대회|올림피아드)/, reason: "교외 대회 수상 실적은 기재할 수 없습니다.", source: "중학교 기재요령 수상경력 (교내상만, 확인 필요)" },
  { re: /(교외|외부)\s*(체험학습|활동|봉사)/, reason: "교외 활동은 기재하지 않습니다.", source: "중학교 기재요령 (확인 필요)" },
  { re: /나이키|아디다스|뉴발란스|삼성|애플|유튜브|유튜버|인스타그램/, reason: "특정 상표·기관명이 보입니다. 기재요령상 사용하지 않습니다.", source: "확인 필요" },
];

export function checkSentence(text) {
  const studentWarnings = STUDENT_PATTERNS.filter((p) => p.test(text)).map((p) => p.reason);
  const prohibited = PROHIBITED_PATTERNS.filter((p) => p.re.test(text)).map((p) => ({
    reason: p.reason,
    source: p.source,
  }));
  return { studentWarnings, prohibited, blocked: studentWarnings.length > 0 };
}
