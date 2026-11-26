// 입력 문장 검사 규칙.
// 목적: 교사가 입력하기 전에 '학생 식별 정보'와 '기재 금지 표현'을 경고합니다.
// 경고는 차단이 아니라 안내입니다. 최종 판단은 교사가 합니다.
// 금지 표현 근거: 2026학년도 학교생활기록부 기재요령 중학교 편
//   '학교생활기록부 작성 시 유의사항' 3항 가~타목 (원문 대조 완료).
// 정규식은 문장 속 표현을 찾는 단서일 뿐, 모든 위반을 잡지는 못합니다.

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
  { test: (t) => /[가-힣]{2,}(초등학교|중학교|고등학교)/.test(t), reason: "학교명으로 보이는 표현이 있습니다." },
  { test: (t) => /\d{6}-?[1-4]\d{6}/.test(t), reason: "주민등록번호 형식이 있습니다. 입력하면 안 됩니다." },
  { test: (t) => /\d{3}-\d{4}-\d{4}/.test(t), reason: "전화번호 형식이 있습니다." },
];

const SRC = "기재요령 작성 시 유의사항 3항";

const PROHIBITED_PATTERNS = [
  { re: /TOEIC|TOEFL|TEPS|HSK|JPT|JLPT|DELF|DALF|TORFL|DELE|TESTDAF|토익|토플|텝스|한자능력검정|한자급수|공인어학|어학시험/i,
    reason: "공인어학시험 참여·성적은 기재할 수 없습니다.", source: `${SRC} 가목` },
  { re: /(교외|전국|시도|국제)\s*(대회|경시|올림피아드|경연)|올림피아드|경시대회|경연대회/,
    reason: "교외 대회 참여·성적·수상은 기재할 수 없습니다. (교내대회는 수상경력란에만 가능)", source: `${SRC} 나목` },
  { re: /표창장|감사장|공로상|교외상/, reason: "교외 기관·단체의 상(표창장·감사장 등)은 기재할 수 없습니다.", source: `${SRC} 다목` },
  { re: /인증시험|자격증|인증\s*(취득|획득)/, reason: "인증시험 참여·성적은 기재할 수 없습니다.", source: `${SRC} 라목` },
  { re: /(논문|학회).*(투고|등재|발표|게재)|(투고|등재|게재).*(논문|학회지)/, reason: "논문 투고·등재·학회 발표는 기재할 수 없습니다.", source: `${SRC} 바목` },
  { re: /(도서|책|저서).*(출간|출판)|(출간|출판).*(도서|책)/, reason: "도서 출간 사실은 기재할 수 없습니다.", source: `${SRC} 사목` },
  { re: /특허|실용신안|상표\s*등록|디자인\s*(출원|등록)|지식재산권/, reason: "지식재산권 출원·등록 사실은 기재할 수 없습니다.", source: `${SRC} 아목` },
  { re: /어학연수|해외\s*(봉사|연수|체험|활동)|해외\s*여행/, reason: "해외 활동실적(어학연수·해외 봉사 등)은 기재할 수 없습니다.", source: `${SRC} 자목` },
  { re: /(부모|아버지|어머니|부친|모친|친척).{0,10}(직업|직장|회사|의사|변호사|교수|사업|공무원)/, reason: "부모의 사회·경제적 지위를 암시하는 내용은 기재할 수 없습니다.", source: `${SRC} 차목` },
  { re: /장학생|장학금/, reason: "장학생·장학금 관련 내용은 기재할 수 없습니다.", source: `${SRC} 카목` },
  { re: /[가-힣A-Za-z]+대학교/, reason: "구체적인 특정 대학명은 기재할 수 없습니다.", source: `${SRC} 타목` },
  { re: /나이키|아디다스|뉴발란스|삼성|애플|유튜브|유튜버|인스타그램|[가-힣A-Za-z]+학원/,
    reason: "특정 상호명·기관명으로 보이는 표현이 있습니다. (교육관련기관명은 예외이므로 확인 필요)", source: `${SRC} 타목` },
];

export function checkSentence(text) {
  const studentWarnings = STUDENT_PATTERNS.filter((p) => p.test(text)).map((p) => p.reason);
  const seen = new Set();
  const prohibited = [];
  for (const p of PROHIBITED_PATTERNS) {
    if (p.re.test(text) && !seen.has(p.reason)) {
      seen.add(p.reason);
      prohibited.push({ reason: p.reason, source: p.source });
    }
  }
  return { studentWarnings, prohibited, blocked: studentWarnings.length > 0 };
}
