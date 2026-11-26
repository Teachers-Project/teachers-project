import { useEffect, useMemo, useRef, useState } from "react";
import { SCHOOL_LEVELS, fieldsFor, countChars } from "./rules/limits.js";
import { countBytes } from "./rules/bytes.js";
import { checkSentence } from "./rules/checks.js";
import { polishSentence } from "./api.js";

const DEFAULT_LEVEL = "middle";

// 수정본에서 원문에 없던 어절만 표시합니다 (눈으로 비교하기 쉽게 하는 용도이며 판정에는 쓰지 않습니다).
function changedWords(original, revised) {
  const known = new Set(original.split(/\s+/).filter(Boolean));
  return revised.split(/(\s+)/).map((part, i) =>
    /^\s+$/.test(part) || known.has(part) ? part : <mark key={i}>{part}</mark>,
  );
}

export default function App() {
  const [level, setLevel] = useState(DEFAULT_LEVEL);
  const fields = fieldsFor(level);
  const fieldKeys = Object.keys(fields);
  const [field, setField] = useState(fieldKeys[0]);
  const [original, setOriginal] = useState("");
  const [revised, setRevised] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const resultRef = useRef(null);

  // 수정본이 나오면 비교 화면이 보이도록 자동으로 내려갑니다.
  useEffect(() => {
    if (revised && resultRef.current) resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [revised]);

  const limit = fields[field] ?? fields[fieldKeys[0]];
  const check = useMemo(() => checkSentence(original, level), [original, level]);
  const bytes = countBytes(original);
  const chars = countChars(original);
  const overChars = limit.maxChars !== null && chars > limit.maxChars;
  const ratio = limit.maxChars ? Math.min(chars / limit.maxChars, 1) : 0;

  function changeLevel(next) {
    setLevel(next);
    setField(Object.keys(fieldsFor(next))[0]);
    setRevised("");
  }

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
    <div className="page">
      <div className="topbar">
        <div className="wrap">
          <span className="brand">교사를 위한 학교 도구</span>
          <span className="where">생활기록부 도우미</span>
        </div>
      </div>

      <div className="wrap layout">
        <aside className="side">
          <div className="eyebrow-row">
            <p className="eyebrow">생활기록부 도우미</p>
            <span className="chip">초안</span>
          </div>
          <h1>생기부 문장 다듬기</h1>
          <p className="lede">
            AI는 교사가 쓴 문장을 다듬기만 합니다. 새 내용을 만들지 않으며, 학생 이름이나 학번 같은 식별 정보는 입력하지 마세요.
            최종 내용은 교사가 확인해야 하며, 이 화면은 자동으로 저장하지 않습니다.
          </p>
          <ul className="rules">
            <li><b>학생 정보 없이</b><span>식별 정보가 보이면 다듬기를 멈춥니다.</span></li>
            <li><b>다듬기만</b><span>쓰신 문장의 표현만 고칩니다.</span></li>
            <li><b>확인은 교사가</b><span>원문과 비교한 뒤 쓸지 정합니다.</span></li>
          </ul>
        </aside>

        <main className="work">
          <section className="step">
            <h2><span className="no">01</span>학교급과 영역</h2>
            <div className="seg" role="radiogroup" aria-label="학교급">
              {Object.entries(SCHOOL_LEVELS).map(([k, v]) => (
                <button
                  key={k}
                  type="button"
                  role="radio"
                  aria-checked={level === k}
                  className={level === k ? "on" : ""}
                  onClick={() => changeLevel(k)}
                >
                  {v}
                </button>
              ))}
            </div>
            <label className="field">
              <span className="sr">영역</span>
              <select className="select" value={field} onChange={(e) => setField(e.target.value)}>
                {fieldKeys.map((k) => (
                  <option key={k} value={k}>
                    {fields[k].label}
                  </option>
                ))}
              </select>
            </label>
          </section>

          <section className="step">
            <h2><span className="no">02</span>문장 입력</h2>
            <textarea
              className="editor"
              value={original}
              onChange={(e) => setOriginal(e.target.value)}
              rows={6}
              placeholder="교사가 직접 쓴 문장을 입력하세요. 예: 수업 시간에 탐구 활동을 주도적으로 함"
            />
            {limit.maxChars !== null && (
              <div className="gauge" aria-hidden="true">
                <i className={overChars ? "over" : ""} style={{ width: `${ratio * 100}%` }} />
              </div>
            )}
            <div className={`meta${overChars ? " over" : ""}`}>
              {chars}자 / {limit.maxChars === null ? "별도 제한 없음" : `${limit.maxChars}자`} · {bytes} 바이트 (NEIS 기준)
              {overChars && " · 글자 수 초과"}
            </div>

            {check.studentWarnings.length > 0 && (
              <Box kind="block" title="학생 식별 정보 감지 (다듬기 차단)">
                {check.studentWarnings.map((w) => (
                  <div key={w}>· {w}</div>
                ))}
              </Box>
            )}

            {check.prohibited.length > 0 && (
              <Box kind="check" title="기재 금지 표현 확인 필요">
                {check.prohibited.map((p) => (
                  <div key={p.reason}>
                    · {p.reason} <span className="src">[{p.source}]</span>
                  </div>
                ))}
              </Box>
            )}
          </section>

          <section className="step">
            <h2><span className="no">03</span>다듬기</h2>
            <div className="actions">
              <button className="btn primary" onClick={handlePolish} disabled={busy || !original.trim()}>
                {busy ? "다듬는 중..." : "문장 다듬기"}
              </button>
            </div>
            {status && <p className="status" role="status">{status}</p>}
          </section>

          {revised && (
            <section className="step result" ref={resultRef}>
              <h2><span className="no">04</span>원문과 수정본 비교</h2>
              <div className="compare">
                <div>
                  <h3>원문</h3>
                  <div className="card-text">{original}</div>
                </div>
                <div className="after">
                  <h3>수정본 (AI 다듬기)</h3>
                  <div className="card-text">{changedWords(original, revised)}</div>
                </div>
              </div>
              <p className="note">수정본은 교사가 확인한 뒤에만 사용하세요. 원문과 수정본의 차이를 직접 비교하는 것이 기본입니다. 밑줄 친 부분은 원문과 달라진 어절입니다.</p>
              <div className="actions">
                <button className="btn primary" onClick={useRevised}>수정본 사용</button>
                <button className="btn" onClick={() => setRevised("")}>닫기 (원문 유지)</button>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function Box({ kind, title, children }) {
  return (
    <div className={`alert ${kind}`}>
      <strong>{title}</strong>
      <div>{children}</div>
    </div>
  );
}
