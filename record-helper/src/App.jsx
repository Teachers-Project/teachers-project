import { useMemo, useState } from "react";
import { FIELD_LIMITS, countChars } from "./rules/limits.js";
import { countBytes } from "./rules/bytes.js";
import { checkSentence } from "./rules/checks.js";
import { polishSentence } from "./api.js";

const fieldKeys = Object.keys(FIELD_LIMITS);

export default function App() {
  const [field, setField] = useState("subjectNote");
  const [original, setOriginal] = useState("");
  const [revised, setRevised] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const limit = FIELD_LIMITS[field];
  const check = useMemo(() => checkSentence(original), [original]);
  const bytes = countBytes(original);
  const chars = countChars(original);
  const overChars = chars > limit.maxChars;

  async function handlePolish() {
    setStatus("");
    if (check.blocked) {
      setStatus("학생 식별 정보가 감지되어 다듬기를 보내지 않았습니다. 해당 부분을 지운 뒤 다시 시도하세요.");
      return;
    }
    setBusy(true);
    try {
      const { revised: out } = await polishSentence({ text: original, field });
      setRevised(out);
    } catch (e) {
      setStatus(e.message);
    } finally {
      setBusy(false);
    }
  }

  function useRevised() {
    setOriginal(revised);
    setRevised("");
    setStatus("수정본을 입력란에 넣었습니다. 저장되지 않았으니 내용을 한 번 더 확인하세요.");
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 22 }}>생기부 문장 다듬기 (초안)</h1>
      <p style={{ color: "#555", fontSize: 14 }}>
        AI는 교사가 쓴 문장을 다듬기만 합니다. 새 내용을 만들지 않으며, 학생 이름이나 학번 같은 식별 정보는 입력하지 마세요.
        최종 내용은 교사가 확인해야 하며, 이 화면은 자동으로 저장하지 않습니다.
      </p>

      <label style={{ display: "block", marginTop: 16 }}>
        영역
        <select value={field} onChange={(e) => setField(e.target.value)} style={{ marginLeft: 8 }}>
          {fieldKeys.map((k) => (
            <option key={k} value={k}>
              {FIELD_LIMITS[k].label}
            </option>
          ))}
        </select>
      </label>

      <textarea
        value={original}
        onChange={(e) => setOriginal(e.target.value)}
        rows={6}
        placeholder="교사가 직접 쓴 문장을 입력하세요. 예: 수업 시간에 탐구 활동을 주도적으로 함"
        style={{ width: "100%", marginTop: 12, padding: 10, fontSize: 15, boxSizing: "border-box" }}
      />

      <div style={{ fontSize: 14, marginTop: 6, color: overChars ? "#b00020" : "#333" }}>
        {chars}자 / {limit.maxChars}자 · {bytes} 바이트 (NEIS 기준)
        {overChars && " · 글자 수 초과"}
      </div>

      {check.studentWarnings.length > 0 && (
        <Box color="#b00020" title="학생 식별 정보 감지 (다듬기 차단)">
          {check.studentWarnings.map((w) => (
            <div key={w}>· {w}</div>
          ))}
        </Box>
      )}

      {check.prohibited.length > 0 && (
        <Box color="#8a6d00" title="기재 금지 표현 확인 필요">
          {check.prohibited.map((p) => (
            <div key={p.reason}>
              · {p.reason} <span style={{ color: "#777" }}>[{p.source}]</span>
            </div>
          ))}
        </Box>
      )}

      <button
        onClick={handlePolish}
        disabled={busy || !original.trim()}
        style={{ marginTop: 12, padding: "8px 16px", fontSize: 15 }}
      >
        {busy ? "다듬는 중..." : "문장 다듬기"}
      </button>

      {status && <p style={{ color: "#b00020", fontSize: 14 }}>{status}</p>}

      {revised && (
        <section style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 15 }}>원문</h3>
            <div style={cardStyle}>{original}</div>
          </div>
          <div>
            <h3 style={{ fontSize: 15 }}>수정본 (AI 다듬기)</h3>
            <div style={cardStyle}>{revised}</div>
          </div>
          <div style={{ gridColumn: "1 / -1", fontSize: 13, color: "#555" }}>
            수정본은 교사가 확인한 뒤에만 사용하세요. 원문과 수정본의 차이를 직접 비교하는 것이 기본입니다.
          </div>
          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8 }}>
            <button onClick={useRevised}>수정본 사용</button>
            <button onClick={() => setRevised("")}>닫기 (원문 유지)</button>
          </div>
        </section>
      )}
    </main>
  );
}

function Box({ color, title, children }) {
  return (
    <div style={{ marginTop: 12, borderLeft: `4px solid ${color}`, padding: "8px 12px", background: "#fafafa", fontSize: 14 }}>
      <strong style={{ color }}>{title}</strong>
      <div style={{ marginTop: 4 }}>{children}</div>
    </div>
  );
}

const cardStyle = { border: "1px solid #ddd", borderRadius: 6, padding: 12, minHeight: 80, whiteSpace: "pre-wrap", fontSize: 15 };
