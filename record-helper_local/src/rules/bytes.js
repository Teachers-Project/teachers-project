// NEIS 바이트 규칙 (2026 학교생활기록부 기재요령 중학교 편, 글자수 표 기준)
// - 한글 1자 = 3바이트
// - 영문·숫자·기호 1자 = 1바이트
// - 줄바꿈(엔터) 1회 = 1바이트
// 공백도 1바이트로 계산합니다.

export function countBytes(text) {
  let bytes = 0;
  for (const ch of text) {
    if (ch === "\n") {
      bytes += 1;
    } else if (/[ᄀ-ᇿ㄰-㆏가-힯]/.test(ch)) {
      // 한글 음절·자모는 3바이트
      bytes += 3;
    } else {
      // 그 밖의 문자는 UTF-8 길이로 계산 (영문·숫자·기호는 1바이트)
      bytes += new TextEncoder().encode(ch).length;
    }
  }
  return bytes;
}
