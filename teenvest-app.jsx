import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// TEENVEST - Financial Education Platform for Israeli Teens
// Full Application: Landing Page + AI Agent + Background Music
// ============================================================

// --- CONSTANTS ---
const COLORS = {
  cream: "#F7F5F0",
  navy: "#0B3C5D",
  navyLight: "#134B73",
  gold: "#D4A84B",
  goldLight: "#E8C872",
  goldDark: "#B8923E",
  white: "#FFFFFF",
  grayLight: "#E8E5DF",
  grayMed: "#9A9590",
  textDark: "#1A1A2E",
  textMuted: "#6B6560",
  success: "#2ECC71",
  danger: "#E74C3C",
};

const PATHS = [
  { id: "invest", emoji: "📈", label: "השקעות", desc: "לבנות תוכנית השקעה שתצמיח את הכסף שלך" },
  { id: "content", emoji: "📱", label: "יצירת תוכן", desc: "להפוך את היצירתיות שלך למקור הכנסה" },
  { id: "business", emoji: "🚀", label: "עסק דיגיטלי", desc: "להקים את הפרויקט הדיגיטלי הראשון שלך" },
  { id: "freelance", emoji: "🎨", label: "פרילנס", desc: "להפוך כישרונות למקור הכנסה" },
  { id: "dev", emoji: "💻", label: "פיתוח", desc: "ליצור אפליקציות ומשחקים" },
  { id: "personal", emoji: "🔮", label: "גילוי עצמי", desc: "לגלות את התשוקה והכישרון שלך" },
];

const STATS = [
  { number: "73%", label: "מבני הנוער לא יודעים עקרונות פיננסיים בסיסיים" },
  { number: "27+", label: "שנות ניסיון בהשקעות" },
  { number: "24/7", label: "זמין תמיד, בכל מקום" },
  { number: "₪0", label: "עלות התחלה - חינם!" },
];

const FEATURES = [
  { emoji: "🧠", title: "AI מותאם אישית", desc: "מנטור שמכיר אותך ומתאים את ההמלצות בדיוק בשבילך" },
  { emoji: "🛡️", title: "בטוח וחינוכי", desc: "כל המידע למטרות חינוכיות, תמיד עם דגש על בטיחות" },
  { emoji: "🇮🇱", title: "מותאם לישראל", desc: "דוגמאות ישראליות - צבא, לימודים, טיול גדול" },
  { emoji: "📊", title: "ניתוח אובייקטיבי", desc: "ניתוח כנה ומקצועי, לא רק עידוד ריק" },
];

// --- LOGO COMPONENT (SVG) ---
const Logo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100" rx="20" fill={COLORS.navy} />
    <text x="50" y="38" textAnchor="middle" fill={COLORS.gold} fontSize="22" fontWeight="700" fontFamily="Rubik, sans-serif">TEEN</text>
    <text x="50" y="62" textAnchor="middle" fill={COLORS.white} fontSize="22" fontWeight="700" fontFamily="Rubik, sans-serif">VEST</text>
    <line x1="20" y1="45" x2="80" y2="45" stroke={COLORS.gold} strokeWidth="2" />
    <path d="M50 70 L55 78 L62 72 L68 80" stroke={COLORS.gold} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// --- MUSIC PLAYER COMPONENT ---
const MusicPlayer = ({ audioSrc }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [showVolume, setShowVolume] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Try autoplay on first user interaction anywhere on page
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted && audioRef.current) {
        setHasInteracted(true);
        audioRef.current.volume = volume;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Autoplay blocked, user can click the button
        });
      }
    };
    document.addEventListener("click", handleFirstInteraction, { once: true });
    document.addEventListener("touchstart", handleFirstInteraction, { once: true });
    document.addEventListener("scroll", handleFirstInteraction, { once: true });
    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
      document.removeEventListener("scroll", handleFirstInteraction);
    };
  }, [hasInteracted, volume]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.volume = volume;
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isPlaying, volume]);

  const handleVolume = useCallback((e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  return (
    <>
      <audio ref={audioRef} src={audioSrc} loop preload="auto" />
      <div style={{
        position: "fixed", bottom: 20, left: 20, zIndex: 9999,
        display: "flex", alignItems: "center", gap: 8,
        background: "rgba(11, 60, 93, 0.9)", backdropFilter: "blur(10px)",
        borderRadius: 50, padding: "8px 14px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        transition: "all 0.3s ease",
      }}
        onMouseEnter={() => setShowVolume(true)}
        onMouseLeave={() => setShowVolume(false)}
      >
        <button onClick={togglePlay} style={{
          background: "none", border: "none", cursor: "pointer",
          color: COLORS.gold, fontSize: 20, padding: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          width: 32, height: 32,
        }}>
          {isPlaying ? "🔊" : "🔇"}
        </button>
        <div style={{
          overflow: "hidden",
          width: showVolume ? 80 : 0,
          transition: "width 0.3s ease",
        }}>
          <input
            type="range" min="0" max="1" step="0.05"
            value={volume} onChange={handleVolume}
            style={{
              width: 75, height: 4, cursor: "pointer",
              accentColor: COLORS.gold,
            }}
          />
        </div>
        {!hasInteracted && (
          <span style={{ color: COLORS.goldLight, fontSize: 11, whiteSpace: "nowrap" }}>
            🎵 לחץ להפעלה
          </span>
        )}
      </div>
    </>
  );
};

// --- LANDING PAGE ---
const LandingPage = ({ onStartChat }) => {
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    const timer1 = setTimeout(() => setVisibleSections(s => new Set([...s, "hero"])), 100);
    const timer2 = setTimeout(() => setVisibleSections(s => new Set([...s, "stats"])), 400);
    const timer3 = setTimeout(() => setVisibleSections(s => new Set([...s, "features"])), 700);
    const timer4 = setTimeout(() => setVisibleSections(s => new Set([...s, "paths"])), 1000);
    const timer5 = setTimeout(() => setVisibleSections(s => new Set([...s, "cta"])), 1300);
    return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); clearTimeout(timer4); clearTimeout(timer5); };
  }, []);

  const sectionStyle = (name) => ({
    opacity: visibleSections.has(name) ? 1 : 0,
    transform: visibleSections.has(name) ? "translateY(0)" : "translateY(30px)",
    transition: "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
  });

  return (
    <div style={{ minHeight: "100vh", background: COLORS.cream, direction: "rtl", fontFamily: "'Rubik', sans-serif" }}>
      {/* HERO */}
      <div style={{ ...sectionStyle("hero"), background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyLight} 100%)`, padding: "60px 20px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(212,168,75,0.08)" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 150, height: 150, borderRadius: "50%", background: "rgba(212,168,75,0.05)" }} />
        
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <Logo size={70} />
        </div>
        <h1 style={{ color: COLORS.white, fontSize: "clamp(28px, 6vw, 48px)", fontWeight: 800, margin: "0 0 12px", lineHeight: 1.2 }}>
          TEENVEST
        </h1>
        <p style={{ color: COLORS.gold, fontSize: "clamp(16px, 3.5vw, 22px)", fontWeight: 600, margin: "0 0 8px" }}>
          🚀 המנטור הפיננסי הדיגיטלי שלך
        </p>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "clamp(14px, 3vw, 17px)", margin: "0 auto 30px", maxWidth: 500, lineHeight: 1.6 }}>
          למד להשקיע, לנהל כסף ולבנות עסק דיגיטלי — בשפה שלך, בקצב שלך
        </p>
        <button onClick={onStartChat} style={{
          background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
          color: COLORS.navy, border: "none", borderRadius: 50,
          padding: "16px 40px", fontSize: 18, fontWeight: 700,
          cursor: "pointer", fontFamily: "'Rubik', sans-serif",
          boxShadow: "0 4px 20px rgba(212,168,75,0.4)",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
          onMouseEnter={e => { e.target.style.transform = "scale(1.05)"; e.target.style.boxShadow = "0 6px 30px rgba(212,168,75,0.5)"; }}
          onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "0 4px 20px rgba(212,168,75,0.4)"; }}
        >
          🔥 בוא נתחיל!
        </button>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginTop: 12 }}>
          ⚠️ למטרות חינוכיות בלבד • תמיד בליווי הורה
        </p>
      </div>

      {/* STATS */}
      <div style={{ ...sectionStyle("stats"), display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, padding: "40px 20px", maxWidth: 700, margin: "0 auto" }}>
        {STATS.map((s, i) => (
          <div key={i} style={{ textAlign: "center", padding: 20, background: COLORS.white, borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ color: COLORS.gold, fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 800 }}>{s.number}</div>
            <div style={{ color: COLORS.textMuted, fontSize: 13, marginTop: 4, lineHeight: 1.4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <div style={{ ...sectionStyle("features"), padding: "20px 20px 40px", maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", color: COLORS.navy, fontSize: 24, fontWeight: 700, marginBottom: 24 }}>
          💎 למה TEENVEST?
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ display: "flex", gap: 14, padding: 20, background: COLORS.white, borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", alignItems: "flex-start" }}>
              <span style={{ fontSize: 32, flexShrink: 0 }}>{f.emoji}</span>
              <div>
                <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 15, marginBottom: 4 }}>{f.title}</div>
                <div style={{ color: COLORS.textMuted, fontSize: 13, lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PATHS */}
      <div style={{ ...sectionStyle("paths"), padding: "20px 20px 40px", maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", color: COLORS.navy, fontSize: 24, fontWeight: 700, marginBottom: 24 }}>
          🎯 בחר את המסלול שלך
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          {PATHS.map((p) => (
            <button key={p.id} onClick={onStartChat} style={{
              background: COLORS.white, border: `2px solid ${COLORS.grayLight}`,
              borderRadius: 16, padding: "20px 16px", cursor: "pointer",
              textAlign: "center", transition: "all 0.25s ease",
              fontFamily: "'Rubik', sans-serif",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.gold; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 25px rgba(212,168,75,0.15)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.grayLight; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ fontSize: 36, marginBottom: 8 }}>{p.emoji}</div>
              <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 15, marginBottom: 4 }}>{p.label}</div>
              <div style={{ color: COLORS.textMuted, fontSize: 12, lineHeight: 1.4 }}>{p.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ ...sectionStyle("cta"), background: COLORS.navy, padding: "50px 20px", textAlign: "center" }}>
        <h2 style={{ color: COLORS.white, fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 700, marginBottom: 12 }}>
          🚀 מוכן להתחיל את המסע הפיננסי?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, marginBottom: 24 }}>
          הצטרף לאלפי בני נוער שכבר לומדים להשקיע בחכמה
        </p>
        <button onClick={onStartChat} style={{
          background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
          color: COLORS.navy, border: "none", borderRadius: 50,
          padding: "16px 44px", fontSize: 18, fontWeight: 700,
          cursor: "pointer", fontFamily: "'Rubik', sans-serif",
          boxShadow: "0 4px 20px rgba(212,168,75,0.4)",
        }}>
          💰 התחל עכשיו — חינם!
        </button>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 30 }}>
          © 2026 TEENVEST • כל הזכויות שמורות • למטרות חינוכיות בלבד
        </p>
      </div>
    </div>
  );
};

// --- CHAT INTERFACE ---
const ChatInterface = ({ onBack }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [quickOptions, setQuickOptions] = useState([]);
  const messagesEndRef = useRef(null);

  const SYSTEM_PROMPT = `אתה TEENVEST - המנטור הפיננסי הדיגיטלי הראשון לבני נוער ישראלים בגילאי 15 ומעלה.

רקע מקצועי: צוות מומחים וירטואלי - יועץ AI (9+ שנים), יועץ עסקי (18+ שנים), יועץ השקעות (27+ שנים).

כללים חשובים:
- דבר בעברית בלבד, בשפה ידידותית ומובנת לבני נוער
- השתמש באימוג'ים בכל תשובה
- הצג תמיד אפשרויות ממוספרות (1️⃣ 2️⃣ 3️⃣ וכו')
- שאל שאלה אחת בכל פעם וחכה לתשובה
- כל מידע הוא למטרות חינוכיות בלבד
- הדגש תמיד שכל פעולה פיננסית צריכה ליווי הורה
- היה אובייקטיבי - אל תענה חיובית כברירת מחדל לכל רעיון
- הודעות קצרות - מקסימום 4 שורות + אפשרויות
- השתמש בדוגמאות ישראליות (טיול אחרי צבא, לימודים, דירה ראשונה)

פתיחת שיחה:
היי! 🔥 אני TEENVEST - המנטור הפיננסי שלך!

מה הכי מעניין אותך עכשיו?
1️⃣ 💰 להתחיל להשקיע (גם עם 0₪)
2️⃣ 🚀 להקים עסק דיגיטלי בגיל שלך
3️⃣ 🎯 לגלות את הכישרון שיכול להרוויח לך כסף
4️⃣ 📊 להבין השקעות (מניות vs קריפטו vs נדל"ן)

בחר/י מספר ובוא נתחיל! 👇`;

  // Parse numbered options from AI responses
  const parseQuickOptions = useCallback((text) => {
    const optionRegex = /([1-9]️⃣|[1-9]\.|[1-9]\))\s*([^\n]+)/g;
    const opts = [];
    let match;
    while ((match = optionRegex.exec(text)) !== null) {
      const num = match[1].replace(/[️⃣.)\s]/g, "").trim();
      opts.push({ number: num, text: match[2].trim() });
    }
    return opts.slice(0, 6);
  }, []);

  // Initial welcome message
  useEffect(() => {
    const welcome = `היי! 🔥 אני TEENVEST - המנטור הפיננסי שלך!

מה הכי מעניין אותך עכשיו?
1️⃣ 💰 להתחיל להשקיע (גם עם 0₪)
2️⃣ 🚀 להקים עסק דיגיטלי בגיל שלך
3️⃣ 🎯 לגלות את הכישרון שיכול להרוויח לך כסף
4️⃣ 📊 להבין השקעות (מניות vs קריפטו vs נדל"ן)

בחר/י מספר ובוא נתחיל! 👇`;
    setMessages([{ role: "assistant", content: welcome }]);
    setQuickOptions(parseQuickOptions(welcome));
  }, [parseQuickOptions]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setQuickOptions([]);
    setLoading(true);

    try {
      const apiMessages = [
        { role: "user", content: SYSTEM_PROMPT },
        { role: "assistant", content: "מבין! אני מוכן לעזור כמנטור פיננסי לבני נוער. אפעל לפי כל ההנחיות." },
        ...messages.filter(m => m.role !== "system").map(m => ({ role: m.role, content: m.content })),
        userMsg,
      ];

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: apiMessages,
        }),
      });

      const data = await response.json();
      const assistantText = data.content?.map(b => b.type === "text" ? b.text : "").join("") || "סליחה, משהו השתבש. נסה שוב! 🙏";
      setMessages(prev => [...prev, { role: "assistant", content: assistantText }]);
      setQuickOptions(parseQuickOptions(assistantText));
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "אופס! 😅 משהו השתבש בחיבור. נסה שוב בבקשה! 🔄" }]);
    } finally {
      setLoading(false);
    }
  }, [loading, messages, parseQuickOptions]);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: COLORS.cream, direction: "rtl", fontFamily: "'Rubik', sans-serif" }}>
      {/* Header */}
      <div style={{
        background: COLORS.navy, padding: "12px 16px",
        display: "flex", alignItems: "center", gap: 12,
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
      }}>
        <button onClick={onBack} style={{
          background: "rgba(255,255,255,0.1)", border: "none",
          borderRadius: 10, padding: "8px 12px", cursor: "pointer",
          color: COLORS.white, fontSize: 16,
        }}>
          ← חזרה
        </button>
        <Logo size={36} />
        <div>
          <div style={{ color: COLORS.white, fontWeight: 700, fontSize: 16 }}>TEENVEST</div>
          <div style={{ color: COLORS.gold, fontSize: 11 }}>🟢 מוכן לעזור</div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-start" : "flex-end",
          }}>
            <div style={{
              maxWidth: "85%",
              padding: "12px 16px",
              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: msg.role === "user"
                ? `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyLight})`
                : COLORS.white,
              color: msg.role === "user" ? COLORS.white : COLORS.textDark,
              fontSize: 14, lineHeight: 1.7,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{
              background: COLORS.white, borderRadius: 18, padding: "12px 20px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              display: "flex", gap: 6, alignItems: "center",
            }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: COLORS.gold,
                  animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Options */}
      {quickOptions.length > 0 && !loading && (
        <div style={{
          padding: "8px 16px", display: "flex", flexWrap: "wrap", gap: 8,
          borderTop: `1px solid ${COLORS.grayLight}`,
          background: "rgba(247,245,240,0.95)",
        }}>
          {quickOptions.map((opt, i) => (
            <button key={i} onClick={() => sendMessage(opt.number)} style={{
              background: COLORS.white, border: `1.5px solid ${COLORS.gold}`,
              borderRadius: 20, padding: "8px 14px", cursor: "pointer",
              fontSize: 13, color: COLORS.navy, fontWeight: 600,
              fontFamily: "'Rubik', sans-serif",
              transition: "all 0.2s ease",
              maxWidth: "100%", textAlign: "right",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}
              onMouseEnter={e => { e.target.style.background = COLORS.gold; e.target.style.color = COLORS.white; }}
              onMouseLeave={e => { e.target.style.background = COLORS.white; e.target.style.color = COLORS.navy; }}
            >
              {opt.number}️⃣ {opt.text.substring(0, 40)}{opt.text.length > 40 ? "..." : ""}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: "12px 16px", borderTop: `1px solid ${COLORS.grayLight}`,
        background: COLORS.white, display: "flex", gap: 10, alignItems: "center",
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage(input)}
          placeholder="הקלד הודעה..."
          disabled={loading}
          style={{
            flex: 1, border: `2px solid ${COLORS.grayLight}`, borderRadius: 25,
            padding: "12px 18px", fontSize: 15, fontFamily: "'Rubik', sans-serif",
            direction: "rtl", outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={e => e.target.style.borderColor = COLORS.gold}
          onBlur={e => e.target.style.borderColor = COLORS.grayLight}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          style={{
            background: input.trim() ? `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})` : COLORS.grayLight,
            border: "none", borderRadius: "50%", width: 46, height: 46,
            cursor: input.trim() ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, transition: "all 0.2s",
            flexShrink: 0,
          }}
        >
          🚀
        </button>
      </div>

      {/* Bounce animation */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
};

// --- MAIN APP ---
export default function TeenVestApp() {
  const [currentView, setCurrentView] = useState("landing");
  
  // Create a blob URL for the background music
  // The MP3 file should be placed alongside this component
  // For deployment, replace this with your actual audio file URL
  const [audioUrl, setAudioUrl] = useState(null);
  
  useEffect(() => {
    // Try to load the music file - adjust path as needed for your deployment
    // Option 1: If hosted alongside the app
    setAudioUrl("/bg-music.mp3");
    
    // Option 2: If you want to use a direct URL, replace with:
    // setAudioUrl("https://your-domain.com/path/to/music.mp3");
  }, []);

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Rubik', sans-serif; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.grayMed}; border-radius: 3px; }
        input[type="range"] { -webkit-appearance: none; appearance: none; height: 4px; border-radius: 2px; background: rgba(255,255,255,0.3); }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; background: ${COLORS.gold}; cursor: pointer; }
      `}</style>

      {/* Background Music Player - always visible */}
      {audioUrl && <MusicPlayer audioSrc={audioUrl} />}

      {/* Page Content */}
      {currentView === "landing" ? (
        <LandingPage onStartChat={() => setCurrentView("chat")} />
      ) : (
        <ChatInterface onBack={() => setCurrentView("landing")} />
      )}
    </>
  );
}
