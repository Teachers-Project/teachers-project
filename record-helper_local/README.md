# record-helper (생기부 문장 다듬기, 초안)

record.teachers.me.kr 용 1단계 프론트엔드입니다.

## 원칙
- 교사가 직접 쓴 문장을 다듬기만 합니다. 새 문장을 생성하지 않습니다.
- 학생 이름·학번·학교명·주민번호·전화번호가 감지되면 AI로 보내지 않습니다.
- 수정본은 원문과 나란히 보여 주고, 교사가 선택한 경우에만 입력란에 반영합니다.
- 자동 저장과 NEIS 연동은 없습니다.

## 실행
```
npm install
npm run dev     # 개발 서버. /api 는 localhost:8080 으로 프록시
npm test        # 규칙(바이트·검사) 테스트
npm run build
```

## 구조
- `src/rules/bytes.js` NEIS 바이트 계산 (한글 3, 영문·숫자 1, 엔터 1)
- `src/rules/limits.js` 영역별 글자 수 상한 (일부 항목 TODO: 기재요령 원문 대조 필요)
- `src/rules/checks.js` 학생 식별 정보 차단, 기재 금지 표현 경고 (목록은 원문 대조 필요)
- `src/api.js` 다듬기 API 호출 (`POST /api/saenggibu/polish`, 응답 `{ revised }`)
- `src/App.jsx` 입력 → 검사 → 다듬기 → 원문/수정본 비교 화면

## 백엔드 연결 (record-api)
1. `record-api` 에서 `mvn spring-boot:run` (포트 8080)
2. 이 폴더에서 `npm run dev` → http://localhost:5173
3. AI 키가 없으면 다듬기는 서버 메시지와 함께 실패합니다 (503). 학생 정보 차단(422)은 키 없이도 동작합니다.
4. 실제 다듬기: 백엔드 실행 전에 환경변수 `ANTHROPIC_API_KEY` 를 설정합니다. (모델은 `SAENGGIBU_AI_MODEL`, 기본 `claude-haiku-5-5`)
   키는 파일에 적거나 커밋하지 마세요.

## 규칙 근거
- 글자 수 상한·바이트: 2026 기재요령 중학교 편 글자수 표 (대조 완료)
- 금지 표현: 같은 문서 '작성 시 유의사항' 3항 가~타목 (대조 완료)
- 초등·고등학교 규칙, 교육청별 설정은 아직 없습니다.
