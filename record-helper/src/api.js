// 백엔드 다듬기 API 호출.
// 서버는 오류 시 { error, reasons? } 를 돌려줍니다 (400 / 422 / 503).
// 요청에는 학생 식별 정보가 담기지 않도록 프론트(App.jsx)에서도 한 번 더 막습니다.
export async function polishSentence({ text, field }) {
  return postJson("/api/saenggibu/polish", { text, field }, "다듬기");
}

// 맞춤법 검사: 문장을 고치지 않고 { issues: [{ original, suggestion, reason }] } 만 돌려받습니다.
export async function checkSpelling({ text, field }) {
  return postJson("/api/saenggibu/spellcheck", { text, field }, "맞춤법 검사");
}

async function postJson(url, payload, label) {
  let res;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
    const base = body?.error ?? `${label} 요청이 실패했습니다 (${res.status}).`;
    const reasons = Array.isArray(body?.reasons) && body.reasons.length ? ` (${body.reasons.join(" / ")})` : "";
    throw new Error(base + reasons);
  }
  return res.json();
}
