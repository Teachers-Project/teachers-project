import { test } from "node:test";
import assert from "node:assert/strict";
import { countBytes } from "./bytes.js";
import { checkSentence } from "./checks.js";
import { countChars } from "./limits.js";

test("한글 1자는 3바이트, 영문·숫자는 1바이트", () => {
  assert.equal(countBytes("가"), 3);
  assert.equal(countBytes("A"), 1);
  assert.equal(countBytes("가A1"), 5);
});

test("줄바꿈 1회는 1바이트", () => {
  assert.equal(countBytes("가\n나"), 3 + 1 + 3);
});

test("글자 수는 코드포인트 기준으로 센다", () => {
  assert.equal(countChars("가나다"), 3);
});

test("학번 형태를 학생 식별 경고로 잡는다", () => {
  const r = checkSentence("20101 학번 학생이 발표함");
  assert.equal(r.blocked, true);
});

test("주민등록번호 형식을 막는다", () => {
  const r = checkSentence("번호 900101-1234567 기재");
  assert.equal(r.blocked, true);
});

test("학생 식별 정보가 없으면 차단하지 않는다", () => {
  const r = checkSentence("수업 시간에 성실하게 참여하며 탐구 활동을 주도함.");
  assert.equal(r.blocked, false);
  assert.equal(r.prohibited.length, 0);
});

test("특정 대학교명을 금지 표현으로 잡는다", () => {
  const r = checkSentence("서울대학교 진학을 목표로 함");
  assert.ok(r.prohibited.length > 0);
});

test("'다른 학생' 같은 일반 표현은 이름으로 보지 않는다", () => {
  assert.equal(checkSentence("다른 학생의 의견을 경청하며 모둠 활동을 이끎.").blocked, false);
});

test("'영희 학생' 형태의 이름은 차단한다", () => {
  assert.equal(checkSentence("영희 학생이 발표를 주도함.").blocked, true);
});

test("학교명은 차단하고 '중학교 생활' 같은 일반 표현은 통과한다", () => {
  assert.equal(checkSentence("서울초등학교에서 전학 온 후 잘 적응함.").blocked, true);
  assert.equal(checkSentence("우리 중학교 생활에 적응하며 성실하게 참여함.").blocked, false);
});
