// 백엔드 다듬기 API 호출.
// 서버는 오류 시 { error, reasons? } 를 돌려줍니다 (400 / 422 / 503).
// 요청에는 학생 식별 정보가 담기지 않도록 프론트(App.jsx)에서도 한 번 더 막습니다.
export async function polishSentence({ text, field }) {
  let res;
  try {
    res = await fetch("/api/saenggibu/polish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, field }),
    });
  } catch {
    throw new Error("서버에 연결할 수 없습니다. 백엔드(localhost:8080)가 실행 중인지 확인하세요.");
  }

  if (!res.ok) {
    let body = null;
    try {
      body = await res.json();
    } catch {
      // 본문이 JSON이 아니면 아래 기본 문구를 씁니다.
    }
    const base = body?.error ?? `다듬기 요청이 실패했습니다 (${res.status}).`;
    const reasons = Array.isArray(body?.reasons) && body.reasons.length ? ` (${body.reasons.join(" / ")})` : "";
    throw new Error(base + reasons);
  }
  return res.json(); // 기대 응답: { revised: "..." }
}
