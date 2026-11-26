// 백엔드 다듬기 API 호출. 백엔드(Spring Boot)가 준비되기 전까지는 실패합니다.
// 요청에는 학생 식별 정보가 담기지 않도록 프론트에서 한 번 더 막습니다(App.jsx).
export async function polishSentence({ text, field }) {
  const res = await fetch("/api/saenggibu/polish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, field }),
  });
  if (!res.ok) {
    throw new Error(`다듬기 요청이 실패했습니다 (${res.status}). 백엔드 연결을 확인하세요.`);
  }
  return res.json(); // 기대 응답: { revised: "..." }
}
