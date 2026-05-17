import { useState, useRef, useEffect } from "react";
import axios from "axios";

/* ─────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────── */
const T = {
  bg:        "#07090f",
  surface:   "#0e1219",
  surfaceHi: "#141b26",
  border:    "rgba(255,255,255,0.07)",
  borderHi:  "rgba(110,231,183,0.28)",
  accent:    "#6ee7b7",
  accentDim: "rgba(110,231,183,0.12)",
  blue:      "#3b82f6",
  textPri:   "#f1f5f9",
  textSec:   "#8b9bb4",
  textMut:   "#3d4f68",
  mono:      "'IBM Plex Mono', monospace",
  sans:      "'Sora', sans-serif",
};

/* ─────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${T.bg}; font-family: ${T.sans}; -webkit-font-smoothing: antialiased; }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${T.textMut}; border-radius: 4px; }

  textarea {
    font-family: ${T.sans}; font-size: 14px; color: ${T.textPri};
    background: transparent; border: none; outline: none;
    resize: none; width: 100%; line-height: 1.65; max-height: 130px; overflow-y: auto;
  }
  textarea::placeholder { color: ${T.textMut}; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes blink {
    0%, 100% { opacity: 0.2; transform: scaleY(0.6); }
    50%       { opacity: 1;   transform: scaleY(1); }
  }

  .msg { animation: fadeUp 0.28s cubic-bezier(.22,1,.36,1) both; }

  .chip-link {
    display: inline-flex; align-items: center; gap: 5px;
    background: ${T.accentDim}; border: 1px solid ${T.borderHi};
    color: ${T.accent}; padding: 3px 11px; border-radius: 999px;
    font-size: 11.5px; font-family: ${T.mono}; text-decoration: none;
    transition: background 0.18s, border-color 0.18s; letter-spacing: 0.02em;
  }
  .chip-link:hover { background: rgba(110,231,183,0.2); border-color: rgba(110,231,183,0.5); }

  .verify-btn {
    display: inline-flex; align-items: center; gap: 5px;
    background: ${T.accentDim}; border: 1px solid ${T.borderHi};
    color: ${T.accent}; padding: 6px 13px; border-radius: 8px;
    font-size: 12px; font-weight: 600; font-family: ${T.sans};
    text-decoration: none; transition: all 0.18s; white-space: nowrap;
  }
  .verify-btn:hover { background: rgba(110,231,183,0.22); transform: translateY(-1px); }

  .send-btn {
    flex-shrink: 0; width: 42px; height: 42px; border-radius: 11px;
    border: none; cursor: pointer; display: flex; align-items: center;
    justify-content: center; transition: all 0.18s;
  }
  .send-btn.active { background: ${T.accent}; }
  .send-btn.active:hover { background: #a7f3d0; transform: scale(1.06); }
  .send-btn.active:active { transform: scale(0.96); }
  .send-btn.disabled { background: ${T.surfaceHi}; cursor: not-allowed; }

  .input-wrap {
    display: flex; align-items: flex-end; gap: 10px;
    background: ${T.surfaceHi}; border: 1px solid ${T.border};
    border-radius: 14px; padding: 11px 12px; transition: border-color 0.2s;
  }
  .input-wrap:focus-within { border-color: ${T.borderHi}; }

  .pill-tag {
    font-size: 10.5px; font-family: ${T.mono}; color: ${T.textMut};
    border: 1px solid rgba(255,255,255,0.06); border-radius: 999px;
    padding: 2px 9px; letter-spacing: 0.04em;
  }
`;

/* ─────────────────────────────────────────
   SUBCOMPONENTS
───────────────────────────────────────── */
const BotLogo = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <rect width="32" height="32" rx="9" fill="#0a1020"/>
    <rect x="1" y="1" width="30" height="30" rx="8" stroke={T.accent} strokeOpacity="0.18"/>
    <circle cx="11.5" cy="15" r="2.2" fill={T.accent}/>
    <circle cx="20.5" cy="15" r="2.2" fill={T.accent}/>
    <path d="M10 20.5c1.6 2 3.8 2.8 6 2.8s4.4-.8 6-2.8" stroke={T.accent} strokeWidth="1.6" strokeLinecap="round"/>
    <rect x="14.5" y="5" width="3" height="3.5" rx="1" fill={T.accent} fillOpacity="0.5"/>
    <line x1="16" y1="8.5" x2="16" y2="11" stroke={T.accent} strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

const UserBadge = () => (
  <div style={{
    width: 30, height: 30, borderRadius: 9, flexShrink: 0,
    background: "linear-gradient(135deg,#1d40ae,#3b82f6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 700, color: "#fff",
    border: "1px solid rgba(59,130,246,0.3)",
  }}>U</div>
);

const TypingDots = () => (
  <div style={{ display: "flex", gap: 5, padding: "3px 2px" }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{
        width: 7, height: 7, borderRadius: "50%", background: T.accent,
        animation: `blink 1.1s ease-in-out ${i * 0.18}s infinite`,
      }}/>
    ))}
  </div>
);

const SectionLabel = ({ children }) => (
  <p style={{
    fontSize: "10.5px", fontFamily: T.mono, color: T.textMut,
    letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8,
  }}>{children}</p>
);

const Divider = () => (
  <div style={{ height: 1, background: T.border, margin: "12px 0" }}/>
);

const FileChip = ({ file, idx }) => (
  <a key={idx} href={`http://127.0.0.1:5000/files/${file}`}
    target="_blank" rel="noreferrer" className="chip-link">
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path d="M2 1h5l3 3v6H2V1z" stroke={T.accent} strokeWidth="1" strokeLinejoin="round"/>
      <path d="M7 1v3h3" stroke={T.accent} strokeWidth="1" strokeLinejoin="round"/>
    </svg>
    {file}
  </a>
);

const OfficialLinkCard = ({ item }) => (
  <div style={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
    gap: 12, background: "rgba(255,255,255,0.025)", border: `1px solid ${T.border}`,
    borderRadius: 10, padding: "11px 14px", marginBottom: 8,
  }}>
    <div style={{ minWidth: 0 }}>
      <p style={{ color: T.textPri, fontSize: 13, fontWeight: 600, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {item.filename}
      </p>
      <p style={{ color: T.textSec, fontSize: 12, marginBottom: 2 }}>{item.subject}</p>
      <p style={{ color: T.textMut, fontSize: 11, fontFamily: T.mono }}>{item.college}</p>
    </div>
    <a href={item.link} target="_blank" rel="noreferrer" className="verify-btn">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 6h8M7 3l3 3-3 3" stroke={T.accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Verify
    </a>
  </div>
);

const WelcomeScreen = () => (
  <div style={{
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", height: "100%", gap: 28, padding: "0 24px",
  }}>
    <div style={{ textAlign: "center" }}>
      <div style={{
        width: 60, height: 60, borderRadius: 16, background: T.surface,
        border: `1px solid ${T.borderHi}`, display: "flex", alignItems: "center",
        justifyContent: "center", margin: "0 auto 18px",
        boxShadow: "0 0 32px rgba(110,231,183,0.1)",
      }}>
        <BotLogo size={38}/>
      </div>
      <h2 style={{ color: T.textPri, fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 8 }}>
        Ask CampusGPT
      </h2>
      <p style={{ color: T.textSec, fontSize: 14, lineHeight: 1.65, maxWidth: 340 }}>
        Retrieve question papers, timetables, syllabus details, and academic notices instantly.
      </p>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, width: "100%", maxWidth: 440 }}>
      {["Last year's question papers", "Upcoming exam timetable", "Semester syllabus outline", "Recent college notices"].map((s, i) => (
        <div key={i} style={{
          background: T.surfaceHi, border: `1px solid ${T.border}`,
          borderRadius: 10, padding: "10px 13px",
          fontSize: 12.5, color: T.textSec, lineHeight: 1.5, cursor: "default",
        }}>{s}</div>
      ))}
    </div>
  </div>
);

/* ─────────────────────────────────────────
   MAIN APP
───────────────────────────────────────── */
export default function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!question.trim()) return;
    const userQuestion = question;
    setMessages(prev => [...prev, { sender: "user", text: userQuestion }]);
    setQuestion("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:5000/chat", { question: userQuestion });
      setMessages(prev => [...prev, {
        sender: "bot",
        text: response.data.answer,
        sources: response.data.sources || [],
        links: response.data.links || [],
      }]);
    } catch (error) {
      console.log(error);
      setMessages(prev => [...prev, {
        sender: "bot", text: "Backend connection error", sources: [], links: [],
      }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const canSend = question.trim() && !loading;

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <div style={{
        minHeight: "100vh", background: T.bg,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}>
        <div style={{
          width: "100%", maxWidth: 860,
          height: "calc(100vh - 40px)", maxHeight: 880,
          display: "flex", flexDirection: "column",
          background: T.surface, borderRadius: 22,
          border: `1px solid ${T.border}`, overflow: "hidden",
          boxShadow: "0 30px 80px rgba(0,0,0,0.65)",
        }}>

          {/* HEADER */}
          <div style={{
            display: "flex", alignItems: "center", gap: 13,
            padding: "14px 22px", borderBottom: `1px solid ${T.border}`,
            background: "rgba(255,255,255,0.015)", flexShrink: 0,
          }}>
            <BotLogo size={34}/>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: T.textPri, fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>
                  CampusGPT
                </span>
                <span style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: T.accent, boxShadow: `0 0 6px ${T.accent}`, display: "inline-block",
                }}/>
              </div>
              <p style={{ color: T.textMut, fontSize: 11.5, fontFamily: T.mono, letterSpacing: "0.04em" }}>
                Academic Retrieval System
              </p>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["Papers", "Syllabus", "Notices"].map(t => (
                <span key={t} className="pill-tag">{t}</span>
              ))}
            </div>
          </div>

          {/* MESSAGES */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
            {messages.length === 0 ? <WelcomeScreen/> : (
              <>
                {messages.map((msg, index) => (
                  <div key={index} className="msg" style={{
                    display: "flex",
                    justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                    alignItems: "flex-end", gap: 10, marginBottom: 14,
                  }}>
                    {msg.sender === "bot" && <div style={{ flexShrink: 0, marginBottom: 2 }}><BotLogo size={30}/></div>}

                    <div style={{
                      maxWidth: "76%", display: "flex", flexDirection: "column", gap: 4,
                      alignItems: msg.sender === "user" ? "flex-end" : "flex-start",
                    }}>
                      <span style={{
                        fontSize: 10.5, fontFamily: T.mono, color: T.textMut,
                        letterSpacing: "0.04em",
                        paddingLeft: msg.sender === "bot" ? 2 : 0,
                        paddingRight: msg.sender === "user" ? 2 : 0,
                      }}>
                        {msg.sender === "user" ? "YOU" : "CAMPUSGPT"}
                      </span>

                      <div style={{
                        padding: "12px 16px",
                        borderRadius: msg.sender === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
                        background: msg.sender === "user"
                          ? "linear-gradient(135deg,#1d40ae 0%,#2563eb 100%)"
                          : T.surfaceHi,
                        border: msg.sender === "user" ? "none" : `1px solid ${T.border}`,
                        color: msg.sender === "user" ? "#fff" : T.textSec,
                        fontSize: 14, lineHeight: 1.7,
                      }}>
                        <p style={{ whiteSpace: "pre-wrap" }}>{msg.text}</p>

                        {msg.sender === "bot" && msg.sources?.length > 0 && (
                          <>
                            <Divider/>
                            <SectionLabel>PDF Sources</SectionLabel>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                              {msg.sources.map((file, idx) => <FileChip key={idx} file={file} idx={idx}/>)}
                            </div>
                          </>
                        )}

                        {msg.sender === "bot" && msg.links?.length > 0 && (
                          <>
                            <Divider/>
                            <SectionLabel>Official Verification Links</SectionLabel>
                            {msg.links.map((item, idx) => <OfficialLinkCard key={idx} item={item}/>)}
                          </>
                        )}
                      </div>
                    </div>

                    {msg.sender === "user" && <div style={{ flexShrink: 0, marginBottom: 2 }}><UserBadge/></div>}
                  </div>
                ))}

                {loading && (
                  <div className="msg" style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 14 }}>
                    <BotLogo size={30}/>
                    <div style={{
                      padding: "10px 16px", borderRadius: "4px 16px 16px 16px",
                      background: T.surfaceHi, border: `1px solid ${T.border}`,
                    }}>
                      <TypingDots/>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef}/>
              </>
            )}
          </div>

          {/* INPUT */}
          <div style={{
            padding: "12px 18px 16px", borderTop: `1px solid ${T.border}`,
            background: "rgba(255,255,255,0.015)", flexShrink: 0,
          }}>
            <div className="input-wrap">
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder="Ask about papers, syllabus, timetables, notices…"
                value={question}
                onChange={e => {
                  setQuestion(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 130) + "px";
                }}
                onKeyDown={handleKeyDown}
              />
              <button className={`send-btn ${canSend ? "active" : "disabled"}`} onClick={sendMessage} disabled={!canSend}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2.5 9L15.5 2L10.5 9L15.5 16L2.5 9Z" fill={canSend ? T.surface : T.textMut}/>
                </svg>
              </button>
            </div>
            <p style={{
              textAlign: "center", fontSize: 11, fontFamily: T.mono,
              color: T.textMut, marginTop: 9, letterSpacing: "0.03em",
            }}>
              Enter to send · Shift+Enter for new line
            </p>
          </div>

        </div>
      </div>
    </>
  );
}