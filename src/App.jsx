import { useState, useRef, useEffect } from "react";
import axios from "axios";

/* ═══════════════════════════════════════════
   DESIGN TOKENS  — Luxury Editorial Dark
═══════════════════════════════════════════ */
const C = {
  bg:         "#080a0e",
  panel:      "#0c0f16",
  glass:      "rgba(255,255,255,0.032)",
  glassHi:    "rgba(255,255,255,0.06)",
  border:     "rgba(255,255,255,0.06)",
  borderHi:   "rgba(214,165,93,0.35)",
  gold:       "#d6a55d",
  goldDim:    "rgba(214,165,93,0.12)",
  goldGlow:   "rgba(214,165,93,0.22)",
  userBubble: "rgba(20,28,48,0.95)",
  userBorder: "rgba(59,100,200,0.3)",
  botBubble:  "rgba(255,255,255,0.034)",
  text1:      "#eceef2",
  text2:      "#7f8fa6",
  text3:      "#3a4455",
  serif:      "'Fraunces', serif",
  sans:       "'DM Sans', sans-serif",
  mono:       "'JetBrains Mono', monospace",
};

/* ═══════════════════════════════════════════
   GLOBAL CSS
═══════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,300&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    height: 100%;
    background: ${C.bg};
    font-family: ${C.sans};
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    color: ${C.text1};
  }

  ::-webkit-scrollbar { width: 2px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${C.text3}; border-radius: 2px; }

  textarea {
    font-family: ${C.sans};
    font-size: 14px;
    font-weight: 400;
    color: ${C.text1};
    background: transparent;
    border: none;
    outline: none;
    resize: none;
    width: 100%;
    line-height: 1.7;
    max-height: 140px;
    overflow-y: auto;
    letter-spacing: 0.01em;
  }
  textarea::placeholder { color: ${C.text3}; font-weight: 300; }

  /* ── Animations ── */
  @keyframes rise {
    from { opacity: 0; transform: translateY(14px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 0.25; transform: scale(0.7); }
    50%       { opacity: 1;   transform: scale(1); }
  }
  @keyframes glow-ring {
    0%, 100% { box-shadow: 0 0 0 0 ${C.goldGlow}, 0 20px 60px rgba(0,0,0,0.5); }
    50%       { box-shadow: 0 0 0 6px transparent, 0 20px 60px rgba(0,0,0,0.5); }
  }
  @keyframes shimmer {
    from { background-position: -200% 0; }
    to   { background-position:  200% 0; }
  }

  .msg-in  { animation: rise 0.32s cubic-bezier(0.16,1,0.3,1) both; }
  .msg-in-delay { animation: rise 0.32s cubic-bezier(0.16,1,0.3,1) 0.06s both; }

  /* ── Chip ── */
  .chip {
    display: inline-flex; align-items: center; gap: 5px;
    background: ${C.goldDim}; border: 1px solid ${C.borderHi};
    color: ${C.gold}; padding: 3px 11px; border-radius: 999px;
    font-size: 11px; font-family: ${C.mono}; text-decoration: none;
    letter-spacing: 0.03em; transition: background 0.2s, border-color 0.2s, transform 0.15s;
  }
  .chip:hover { background: ${C.goldGlow}; border-color: ${C.gold}; transform: translateY(-1px); }

  /* ── Verify button ── */
  .verify {
    display: inline-flex; align-items: center; gap: 5px;
    background: ${C.goldDim}; border: 1px solid ${C.borderHi};
    color: ${C.gold}; padding: 5px 12px; border-radius: 7px;
    font-size: 11.5px; font-weight: 500; font-family: ${C.sans};
    text-decoration: none; letter-spacing: 0.02em;
    transition: background 0.18s, transform 0.15s; white-space: nowrap;
  }
  .verify:hover { background: ${C.goldGlow}; transform: translateY(-1px); }

  /* ── Send button ── */
  .send {
    flex-shrink: 0; width: 40px; height: 40px; border-radius: 10px;
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.18s, transform 0.15s, opacity 0.18s;
  }
  .send.on  { background: ${C.gold}; }
  .send.on:hover { background: #e8be7a; transform: scale(1.07); }
  .send.on:active { transform: scale(0.95); }
  .send.off { background: ${C.glassHi}; cursor: not-allowed; opacity: 0.5; }

  /* ── Input wrapper ── */
  .inp {
    display: flex; align-items: flex-end; gap: 10px;
    background: ${C.glassHi}; border: 1px solid ${C.border};
    border-radius: 14px; padding: 12px 14px;
    transition: border-color 0.22s, box-shadow 0.22s;
  }
  .inp:focus-within {
    border-color: ${C.borderHi};
    box-shadow: 0 0 0 3px ${C.goldDim};
  }

  /* ── Pill ── */
  .pill {
    font-size: 10px; font-family: ${C.mono}; color: ${C.text3};
    border: 1px solid rgba(255,255,255,0.05); border-radius: 999px;
    padding: 2px 9px; letter-spacing: 0.05em;
  }

  /* ── Section label ── */
  .sec-label {
    font-size: 9.5px; font-family: ${C.mono}; color: ${C.text3};
    letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px;
  }
`;

/* ═══════════════════════════════════════════
   ATOMS
═══════════════════════════════════════════ */
const Logo = ({ s = 32 }) => (
  <svg width={s} height={s} viewBox="0 0 34 34" fill="none">
    <rect width="34" height="34" rx="10" fill="#0d1018"/>
    <rect x="1" y="1" width="32" height="32" rx="9" stroke={C.gold} strokeOpacity="0.2" strokeWidth="1"/>
    {/* antenna */}
    <rect x="15.5" y="4.5" width="3" height="4" rx="1" fill={C.gold} fillOpacity="0.45"/>
    <line x1="17" y1="8.5" x2="17" y2="11.5" stroke={C.gold} strokeOpacity="0.45" strokeWidth="1.3" strokeLinecap="round"/>
    {/* face */}
    <rect x="8" y="12" width="18" height="13" rx="4" fill="rgba(214,165,93,0.07)" stroke={C.gold} strokeOpacity="0.15" strokeWidth="1"/>
    <circle cx="12.5" cy="18" r="2" fill={C.gold}/>
    <circle cx="21.5" cy="18" r="2" fill={C.gold}/>
    <path d="M11 22.5c1.5 1.8 3.5 2.5 6 2.5s4.5-.7 6-2.5" stroke={C.gold} strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const UserAvatar = () => (
  <div style={{
    width: 30, height: 30, borderRadius: 9, flexShrink: 0,
    background: "linear-gradient(145deg,#1a2e6b,#2a4fc0)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.9)",
    border: `1px solid ${C.userBorder}`,
    letterSpacing: "0.05em",
  }}>YOU</div>
);

const BotAvatar = () => (
  <div style={{ flexShrink: 0, marginBottom: 2 }}>
    <Logo s={30}/>
  </div>
);

const Dots = () => (
  <div style={{ display: "flex", gap: 5, padding: "4px 0" }}>
    {[0,1,2].map(i => (
      <div key={i} style={{
        width: 6, height: 6, borderRadius: "50%", background: C.gold,
        animation: `pulse-dot 1.2s ease-in-out ${i*0.2}s infinite`,
      }}/>
    ))}
  </div>
);

const Hr = () => <div style={{ height: 1, background: C.border, margin: "13px 0" }}/>;

const FileChip = ({ file }) => (
  <a href={`http://127.0.0.1:5000/files/${file}`} target="_blank" rel="noreferrer" className="chip">
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M1.5 1h4.5l2.5 2.5V9h-7V1z" stroke={C.gold} strokeWidth="0.9" strokeLinejoin="round"/>
      <path d="M6 1v2.5h2.5" stroke={C.gold} strokeWidth="0.9" strokeLinejoin="round"/>
    </svg>
    {file}
  </a>
);

const LinkCard = ({ item }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: 12, background: "rgba(214,165,93,0.04)",
    border: `1px solid rgba(214,165,93,0.12)`,
    borderRadius: 9, padding: "10px 14px", marginBottom: 7,
  }}>
    <div style={{ minWidth: 0 }}>
      <p style={{ color: C.text1, fontSize: 12.5, fontWeight: 500, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {item.filename}
      </p>
      <p style={{ color: C.text2, fontSize: 11.5, marginBottom: 1 }}>{item.subject}</p>
      <p style={{ color: C.text3, fontSize: 10.5, fontFamily: C.mono }}>{item.college}</p>
    </div>
    <a href={item.link} target="_blank" rel="noreferrer" className="verify">
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <path d="M1.5 5.5h8M6.5 2.5l3 3-3 3" stroke={C.gold} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Verify
    </a>
  </div>
);

/* ═══════════════════════════════════════════
   WELCOME
═══════════════════════════════════════════ */
const Welcome = () => (
  <div style={{
    height: "100%", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    gap: 32, padding: "0 32px",
  }}>
    {/* Logo lockup */}
    <div style={{ textAlign: "center" }}>
      <div style={{
        width: 66, height: 66, borderRadius: 18,
        background: "rgba(214,165,93,0.06)",
        border: `1px solid rgba(214,165,93,0.25)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 20px",
        animation: "glow-ring 3.5s ease-in-out infinite",
      }}>
        <Logo s={42}/>
      </div>

      <h1 style={{
        fontFamily: C.serif,
        fontSize: 28,
        fontWeight: 500,
        letterSpacing: "-0.03em",
        color: C.text1,
        marginBottom: 10,
        lineHeight: 1.1,
      }}>
        CampusGPT
      </h1>

      <p style={{
        fontFamily: C.sans,
        fontSize: 13.5,
        fontWeight: 300,
        color: C.text2,
        lineHeight: 1.7,
        maxWidth: 320,
        letterSpacing: "0.01em",
      }}>
        Academic intelligence at your fingertips —<br/>
        papers, timetables, syllabi &amp; notices.
      </p>
    </div>

    {/* Suggestion grid */}
    <div style={{
      display: "grid", gridTemplateColumns: "1fr 1fr",
      gap: 8, width: "100%", maxWidth: 460,
    }}>
      {[
        { icon: "📄", text: "Last year's question papers" },
        { icon: "🗓", text: "Upcoming exam timetable" },
        { icon: "📚", text: "Semester syllabus breakdown" },
        { icon: "📣", text: "Recent college notices" },
      ].map(({ icon, text }, i) => (
        <div key={i} style={{
          background: C.glass,
          border: `1px solid ${C.border}`,
          borderRadius: 11,
          padding: "11px 14px",
          display: "flex", alignItems: "flex-start", gap: 9,
          cursor: "default",
          transition: "border-color 0.2s, background 0.2s",
        }}>
          <span style={{ fontSize: 14, lineHeight: 1.6 }}>{icon}</span>
          <span style={{ fontSize: 12.5, color: C.text2, lineHeight: 1.55, fontWeight: 300 }}>{text}</span>
        </div>
      ))}
    </div>

    <p style={{
      fontSize: 10.5, fontFamily: C.mono, color: C.text3,
      letterSpacing: "0.06em", textTransform: "uppercase",
    }}>
      Powered by RAG · Groq · ChromaDB
    </p>
  </div>
);

/* ═══════════════════════════════════════════
   BUBBLE
═══════════════════════════════════════════ */
const Bubble = ({ msg }) => {
  const isUser = msg.sender === "user";
  return (
    <div style={{
      padding: "13px 17px",
      borderRadius: isUser ? "17px 4px 17px 17px" : "4px 17px 17px 17px",
      background: isUser ? C.userBubble : C.botBubble,
      border: `1px solid ${isUser ? C.userBorder : C.border}`,
      backdropFilter: "blur(12px)",
      color: isUser ? "rgba(255,255,255,0.92)" : C.text2,
      fontSize: 14,
      lineHeight: 1.75,
      fontWeight: 300,
      letterSpacing: "0.01em",
      boxShadow: isUser
        ? "0 4px 24px rgba(20,40,140,0.18)"
        : "0 2px 16px rgba(0,0,0,0.18)",
    }}>
      <p style={{ whiteSpace: "pre-wrap", fontWeight: isUser ? 400 : 300 }}>{msg.text}</p>

      {!isUser && msg.sources?.length > 0 && (
        <>
          <Hr/>
          <p className="sec-label">PDF Sources</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {msg.sources.map((f, i) => <FileChip key={i} file={f}/>)}
          </div>
        </>
      )}

      {!isUser && msg.links?.length > 0 && (
        <>
          <Hr/>
          <p className="sec-label">Official Verification</p>
          {msg.links.map((item, i) => <LinkCard key={i} item={item}/>)}
        </>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   APP
═══════════════════════════════════════════ */
export default function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages]  = useState([]);
  const [loading,  setLoading]   = useState(false);
  const endRef      = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!question.trim()) return;
    const q = question;
    setMessages(p => [...p, { sender: "user", text: q }]);
    setQuestion("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);
    try {
      const { data } = await axios.post("http://127.0.0.1:5000/chat", { question: q });
      setMessages(p => [...p, {
        sender: "bot",
        text: data.answer,
        sources: data.sources || [],
        links:   data.links   || [],
      }]);
    } catch {
      setMessages(p => [...p, { sender: "bot", text: "Backend connection error", sources: [], links: [] }]);
    }
    setLoading(false);
  };

  const onKey = e => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const canSend = !!question.trim() && !loading;

  return (
    <>
      <style>{CSS}</style>

      {/* Page shell */}
      <div style={{
        minHeight: "100vh",
        background: `radial-gradient(ellipse 80% 60% at 50% -10%, rgba(214,165,93,0.06) 0%, transparent 70%), ${C.bg}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}>

        {/* Chat card */}
        <div style={{
          width: "100%", maxWidth: 820,
          height: "calc(100vh - 40px)", maxHeight: 900,
          display: "flex", flexDirection: "column",
          background: C.panel,
          borderRadius: 24,
          border: `1px solid ${C.border}`,
          overflow: "hidden",
          boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(214,165,93,0.05)",
        }}>

          {/* ── HEADER ── */}
          <div style={{
            display: "flex", alignItems: "center", gap: 14,
            padding: "15px 24px",
            borderBottom: `1px solid ${C.border}`,
            background: "rgba(255,255,255,0.018)",
            flexShrink: 0,
          }}>
            <Logo s={36}/>

            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 2 }}>
                <span style={{
                  fontFamily: C.serif,
                  fontSize: 17,
                  fontWeight: 500,
                  color: C.text1,
                  letterSpacing: "-0.02em",
                }}>
                  CampusGPT
                </span>
                {/* Live dot */}
                <span style={{
                  display: "flex", alignItems: "center", gap: 4,
                  fontSize: 10, fontFamily: C.mono, color: "#4ade80",
                  letterSpacing: "0.04em",
                }}>
                  <span style={{
                    width: 5, height: 5, borderRadius: "50%",
                    background: "#4ade80",
                    boxShadow: "0 0 5px #4ade80",
                    display: "inline-block",
                  }}/>
                  LIVE
                </span>
              </div>
              <p style={{
                fontSize: 11, fontFamily: C.mono, color: C.text3,
                letterSpacing: "0.05em",
              }}>
                Academic Retrieval System
              </p>
            </div>

            {/* Tags */}
            <div style={{ display: "flex", gap: 5 }}>
              {["Papers", "Syllabus", "Notices"].map(t => (
                <span key={t} className="pill">{t}</span>
              ))}
            </div>
          </div>

          {/* Thin gold accent line */}
          <div style={{
            height: "1.5px",
            background: `linear-gradient(90deg, transparent 0%, ${C.gold} 30%, ${C.gold} 70%, transparent 100%)`,
            opacity: 0.18,
            flexShrink: 0,
          }}/>

          {/* ── MESSAGES ── */}
          <div style={{
            flex: 1, overflowY: "auto",
            padding: "20px 22px",
          }}>
            {messages.length === 0 ? <Welcome/> : (
              <>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={i % 2 === 0 ? "msg-in" : "msg-in-delay"}
                    style={{
                      display: "flex",
                      justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                      alignItems: "flex-end",
                      gap: 10, marginBottom: 16,
                    }}
                  >
                    {msg.sender === "bot" && <BotAvatar/>}

                    <div style={{
                      maxWidth: "75%",
                      display: "flex", flexDirection: "column",
                      gap: 5,
                      alignItems: msg.sender === "user" ? "flex-end" : "flex-start",
                    }}>
                      <span style={{
                        fontSize: 9.5, fontFamily: C.mono, color: C.text3,
                        letterSpacing: "0.07em", textTransform: "uppercase",
                        paddingLeft: msg.sender === "bot" ? 3 : 0,
                        paddingRight: msg.sender === "user" ? 3 : 0,
                      }}>
                        {msg.sender === "user" ? "You" : "CampusGPT"}
                      </span>
                      <Bubble msg={msg}/>
                    </div>

                    {msg.sender === "user" && <UserAvatar/>}
                  </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                  <div className="msg-in" style={{
                    display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 16,
                  }}>
                    <BotAvatar/>
                    <div>
                      <span style={{ fontSize: 9.5, fontFamily: C.mono, color: C.text3, letterSpacing: "0.07em", textTransform: "uppercase", display: "block", marginBottom: 5, paddingLeft: 3 }}>
                        CampusGPT
                      </span>
                      <div style={{
                        padding: "11px 16px",
                        borderRadius: "4px 16px 16px 16px",
                        background: C.botBubble,
                        border: `1px solid ${C.border}`,
                        backdropFilter: "blur(12px)",
                      }}>
                        <Dots/>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={endRef}/>
              </>
            )}
          </div>

          {/* Separator */}
          <div style={{ height: 1, background: C.border, flexShrink: 0 }}/>

          {/* ── INPUT ── */}
          <div style={{
            padding: "14px 20px 18px",
            background: "rgba(255,255,255,0.012)",
            flexShrink: 0,
          }}>
            <div className="inp">
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder="Ask about papers, timetables, syllabus, notices…"
                value={question}
                onChange={e => {
                  setQuestion(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
                }}
                onKeyDown={onKey}
              />
              <button
                className={`send ${canSend ? "on" : "off"}`}
                onClick={sendMessage}
                disabled={!canSend}
              >
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                  <path
                    d="M2 8.5L15 2L10 8.5L15 15L2 8.5Z"
                    fill={canSend ? C.bg : C.text3}
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <p style={{
              textAlign: "center", marginTop: 9,
              fontSize: 10.5, fontFamily: C.mono, color: C.text3,
              letterSpacing: "0.04em",
            }}>
              ↵ send · shift+↵ newline
            </p>
          </div>

        </div>
      </div>
    </>
  );
}