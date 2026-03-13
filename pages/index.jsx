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
        position: "fixed", top: 20, left: 20, zIndex: 9999,
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
const LandingPage = ({ onStartChat, onLegalPage }) => {
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
        <div style={{ marginTop: 30, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px 16px" }}>
          {[
            { id: "accessibility", label: "הצהרת נגישות" },
            { id: "privacy", label: "מדיניות פרטיות" },
            { id: "terms", label: "תנאי שירות" },
            { id: "rights", label: "זכויות נושא מידע" },
            { id: "copyright", label: "זכויות יוצרים" },
          ].map(link => (
            <button key={link.id} onClick={() => onLegalPage(link.id)} style={{
              background: "none", border: "none", color: "rgba(255,255,255,0.5)",
              fontSize: 11, cursor: "pointer", fontFamily: "'Rubik', sans-serif",
              textDecoration: "underline", padding: 0,
            }}>
              {link.label}
            </button>
          ))}
        </div>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 12 }}>
          © 2026 TEENVEST • כל הזכויות שמורות • למטרות חינוכיות בלבד
        </p>
      </div>
    </div>
  );
};
 
// --- REGISTRATION PAGE ---
const RegistrationPage = ({ onComplete, onBack }) => {
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
 
  const handleSubmit = () => {
    if (!email.trim()) {
      setError("נא להזין כתובת אימייל");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setError("כתובת אימייל לא תקינה");
      return;
    }
    if (!gender) {
      setError("נא לבחור מגדר");
      return;
    }
    setError("");
    const userData = { email: email.trim(), gender };
    try { localStorage.setItem("teenvest_user", JSON.stringify(userData)); } catch(e) {}
    onComplete(userData);
  };
 
  return (
    <div style={{ minHeight: "100vh", background: COLORS.cream, direction: "rtl", fontFamily: "'Rubik', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: COLORS.white, borderRadius: 24, padding: "40px 32px", maxWidth: 420, width: "100%", boxShadow: "0 8px 40px rgba(0,0,0,0.1)", textAlign: "center" }}>
        <Logo size={60} />
        <h1 style={{ color: COLORS.navy, fontSize: 28, fontWeight: 800, margin: "16px 0 4px" }}>TEENVEST</h1>
        <p style={{ color: COLORS.gold, fontSize: 15, fontWeight: 600, marginBottom: 8 }}>🚀 המנטור הפיננסי הדיגיטלי שלך</p>
        <p style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 28 }}>הירשם כדי לקבל חוויה מותאמת אישית</p>
 
        {/* Email */}
        <div style={{ marginBottom: 18, textAlign: "right" }}>
          <label style={{ color: COLORS.navy, fontSize: 13, fontWeight: 600, marginBottom: 6, display: "block" }}>📧 אימייל</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={{
              width: "100%", padding: "14px 16px", borderRadius: 14,
              border: `2px solid ${COLORS.grayLight}`, fontSize: 15,
              fontFamily: "'Rubik', sans-serif", outline: "none",
              direction: "ltr", textAlign: "left",
              transition: "border-color 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = COLORS.gold}
            onBlur={e => e.target.style.borderColor = COLORS.grayLight}
          />
        </div>
 
        {/* Gender */}
        <div style={{ marginBottom: 24, textAlign: "right" }}>
          <label style={{ color: COLORS.navy, fontSize: 13, fontWeight: 600, marginBottom: 10, display: "block" }}>👤 מגדר</label>
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { value: "male", label: "👦 זכר", emoji: "♂️" },
              { value: "female", label: "👧 נקבה", emoji: "♀️" },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setGender(opt.value)}
                style={{
                  flex: 1, padding: "14px 12px", borderRadius: 14, cursor: "pointer",
                  border: `2px solid ${gender === opt.value ? COLORS.gold : COLORS.grayLight}`,
                  background: gender === opt.value ? `linear-gradient(135deg, ${COLORS.gold}15, ${COLORS.goldLight}20)` : COLORS.white,
                  color: COLORS.navy, fontSize: 16, fontWeight: 600,
                  fontFamily: "'Rubik', sans-serif",
                  transition: "all 0.2s ease",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
 
        {/* Error */}
        {error && (
          <p style={{ color: COLORS.danger, fontSize: 13, marginBottom: 12, fontWeight: 600 }}>⚠️ {error}</p>
        )}
 
        {/* Submit */}
        <button onClick={handleSubmit} style={{
          width: "100%", padding: "16px", borderRadius: 50, border: "none",
          background: `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldDark})`,
          color: COLORS.navy, fontSize: 18, fontWeight: 700, cursor: "pointer",
          fontFamily: "'Rubik', sans-serif",
          boxShadow: "0 4px 20px rgba(212,168,75,0.4)",
          transition: "transform 0.2s, box-shadow 0.2s",
          marginBottom: 16,
        }}
          onMouseEnter={e => { e.target.style.transform = "scale(1.03)"; }}
          onMouseLeave={e => { e.target.style.transform = "scale(1)"; }}
        >
          🔥 בוא נתחיל!
        </button>
 
        <button onClick={onBack} style={{
          background: "none", border: "none", color: COLORS.textMuted,
          fontSize: 13, cursor: "pointer", fontFamily: "'Rubik', sans-serif",
        }}>
          ← חזרה לעמוד הראשי
        </button>
 
        <p style={{ color: COLORS.textMuted, fontSize: 11, marginTop: 16, lineHeight: 1.5 }}>
          ⚠️ למטרות חינוכיות בלבד • תמיד בליווי הורה
          <br />🔒 הפרטים נשמרים רק במכשיר שלך
        </p>
      </div>
    </div>
  );
};
 
// --- CHAT INTERFACE ---
const ChatInterface = ({ onBack, userProfile }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [quickOptions, setQuickOptions] = useState([]);
  const messagesEndRef = useRef(null);
 
  const isMale = userProfile?.gender === "male";
  const genderNote = isMale 
    ? "המשתמש הוא זכר. דבר אליו בלשון זכר בלבד (אתה, שלך, תרצה, תבחר, וכו'). לעולם אל תשתמש בלשון נקבה."
    : "המשתמשת היא נקבה. דברי אליה בלשון נקבה בלבד (את, שלך, תרצי, תבחרי, וכו'). לעולם אל תשתמש בלשון זכר.";
  const welcomeName = userProfile?.email ? userProfile.email.split("@")[0] : "";
  const heyText = isMale ? "היי" : "היי";
  const chooseText = isMale ? "בחר מספר ובוא נתחיל!" : "בחרי מספר ובואי נתחיל!";
  const startInvest = isMale ? "להתחיל להשקיע (גם עם 0₪)" : "להתחיל להשקיע (גם עם 0₪)";
  const startBiz = isMale ? "להקים עסק דיגיטלי בגיל שלך" : "להקים עסק דיגיטלי בגיל שלך";
  const findTalent = isMale ? "לגלות את הכישרון שיכול להרוויח לך כסף" : "לגלות את הכישרון שיכול להרוויח לך כסף";
 
  const SYSTEM_PROMPT = `אתה TEENVEST - המנטור הפיננסי הדיגיטלי הראשון לבני נוער ומשקיעים צעירים ישראלים בגילאי 15 ומעלה.
 
רקע מקצועי: צוות מומחים וירטואלי - יועץ AI (9+ שנים), יועץ עסקי (18+ שנים), יועץ השקעות (27+ שנים), מומחה נדל"ן (15+ שנים).
 
${genderNote}
 
כללים חשובים:
- דבר בעברית בלבד, בשפה ידידותית ומובנת לבני נוער
- ${isMale ? "דבר תמיד בלשון זכר - אתה, שלך, תרצה, תוכל, תבחר" : "דברי תמיד בלשון נקבה - את, שלך, תרצי, תוכלי, תבחרי"}
- השתמש באימוג'ים בכל תשובה
- הצג תמיד אפשרויות ממוספרות (1️⃣ 2️⃣ 3️⃣ וכו')
- שאל שאלה אחת בכל פעם וחכה לתשובה
- כל מידע הוא למטרות חינוכיות בלבד
- הדגש תמיד שכל פעולה פיננסית צריכה ליווי הורה/יועץ מוסמך
- היה אובייקטיבי - אל תענה חיובית כברירת מחדל לכל רעיון
- השתמש בדוגמאות ישראליות (טיול אחרי צבא, לימודים, דירה ראשונה)
 
=== מודול השקעות מתקדם ===
 
כשמשתמש שואל על השקעות, נדל"ן, מניות, או "איפה להשקיע" - עקוב אחרי התהליך הזה בדיוק:
 
שלב 1 - אפיון פיננסי אמיתי (שאלה אחת בכל פעם!):
 
שאלה 1 - סכום חודשי קבוע (זו השאלה הכי חשובה!):
"כמה כסף אתה יכול להתחייב להשקיע בכל חודש באופן קבוע? 💰
1️⃣ עד 500₪ בחודש
2️⃣ 500-2,000₪ בחודש
3️⃣ 2,000-5,000₪ בחודש
4️⃣ 5,000-10,000₪ בחודש
5️⃣ מעל 10,000₪ בחודש
(גם סכום קטן בעקביות שווה יותר מסכום גדול חד-פעמי!)"
 
שאלה 2 - הון התחלתי (אם יש):
"יש לך גם סכום חד-פעמי שאתה יכול להשקיע כבר עכשיו?
1️⃣ אין לי כרגע - רק חודשי
2️⃣ עד 10,000₪
3️⃣ 10,000-50,000₪
4️⃣ 50,000-200,000₪
5️⃣ מעל 200,000₪"
 
שאלה 3 - אופק זמן:
"מתי תצטרך את הכסף הזה?
1️⃣ תוך 1-3 שנים (טיול, מכונית)
2️⃣ 3-7 שנים (לימודים, התבססות)
3️⃣ 7+ שנים (דירה, חופש כלכלי)
4️⃣ עדיין לא החלטתי - פתוח לאפשרויות"
 
שאלה 4 - רמת סיכון:
"איך אתה מרגיש לגבי סיכון?
1️⃣ 🛡️ שמרני - עדיף פחות רווח אבל בטוח
2️⃣ ⚖️ מאוזן - קצת סיכון בשביל רווח טוב יותר
3️⃣ 🔥 אגרסיבי - מוכן לסכן בשביל רווח גבוה
4️⃣ 🤷 לא בטוח - עזור לי להחליט"
 
שלב 2 - בניית פורטפוליו מותאם:
אחרי שיש לך את כל 4 התשובות, בנה פורטפוליו מפורט:
 
הצג תמיד:
💰 תקציב חודשי: [הסכום שנאמר]
📊 חלוקה מומלצת לפי אחוזים:
- X% ל[אפיק 1] = [סכום חודשי] (למשל: "40% למדד S&P 500 = 2,000₪/חודש")
- Y% ל[אפיק 2] = [סכום חודשי]
- Z% ל[אפיק 3] = [סכום חודשי]
 
📈 תחזית צמיחה:
- עוד שנה: [סכום צפוי]
- עוד 3 שנים: [סכום צפוי]
- עוד 5 שנים: [סכום צפוי]
- עוד 10 שנים: [סכום צפוי]
(כולל הסבר שזו הערכה ולא התחייבות!)
 
חשוב: התאם את ההמלצות לסכום החודשי!
- עד 500₪/חודש: התמקד ב-ETF מדדים + קריפטו קטן, לא נדל"ן ישיר
- 500-2,000₪/חודש: ETF + קריפטו + REITs, התחל לחסוך לנדל"ן
- 2,000-5,000₪/חודש: פורטפוליו מגוון + אפשרות חיסכון לנדל"ן בחו"ל
- 5,000-10,000₪/חודש: כל האפשרויות פתוחות כולל חיסכון לנדל"ן בארץ/בחו"ל
- מעל 10,000₪/חודש: פורטפוליו מתקדם + נדל"ן בחו"ל כאפשרות מיידית
 
שלב 3 - העמקה והמשך:
אחרי הצגת הפורטפוליו, הצע תמיד:
1️⃣ להעמיק באחד האפיקים
2️⃣ לראות תחזית מפורטת יותר
3️⃣ לשנות את רמת הסיכון ולראות חלוקה אחרת
4️⃣ לשמוע על חדשות שמשפיעות על ההשקעות עכשיו
 
🏠 נדל"ן - כשרלוונטי:
- נדל"ן בישראל: מחירי דירות עדכניים, ערים מומלצות להשקעה, תשואות שכירות, מחיר למשתכן
- נדל"ן בחו"ל: מדינות אטרקטיביות (ארה"ב, יוון, פורטוגל, גאורגיה, דובאי), תשואות צפויות, יתרונות וחסרונות
- REITs: קרנות נדל"ן סחירות כחלופה נגישה עם סכומים קטנים
- השוואה: תשואת שכירות vs עליית ערך vs REITs
 
📈 מניות - כשרלוונטי:
- מדדים מומלצים למתחילים (S&P 500, NASDAQ, ת"א 35)
- מניות AI ומהפכת הבינה המלאכותית: NVIDIA, Microsoft, Google, מניות ישראליות בתחום
- ETF סקטוריאליים: טכנולוגיה, בריאות, אנרגיה ירוקה
- מניות דיבידנד להכנסה פסיבית
- השקעות ערך vs השקעות צמיחה
 
🪙 קריפטו - כשרלוונטי:
- ביטקוין ואתריום כבסיס
- הסיכונים הייחודיים לקריפטו
- אחוז מומלץ מהתיק (5-15% מקסימום לצעירים)
 
=== מודול חדשות והשפעה על השקעות ===
 
כשיש לך נתונים עדכניים (מ-Perplexity), חובה:
- להציג חדשות רלוונטיות שמשפיעות על ההשקעות
- להסביר איך כל חדשה משפיעה: "ריבית עלתה = מניות בנקים עולות, נדל"ן נפגע"
- לתת התראות: "⚡ עדכון חשוב: [חדשה] - ככה זה משפיע על ההשקעה שלך"
- להמליץ אם כדאי לשקול מעבר בין אפיקים לאור המצב
 
דוגמאות להשפעת חדשות:
- העלאת ריבית בנק ישראל → נדל"ן נפגע (משכנתאות יקרות יותר), אג"ח אטרקטיבי יותר
- ירידת דולר → מניות אמריקאיות זולות יותר לישראלים
- חוק מיסוי חדש → השפעה על כדאיות נדל"ן להשקעה
- פריצת טכנולוגית AI → מניות הסקטור עולות
- מלחמה/מתיחות → זהב ואג"ח עולים, מניות יורדות
 
=== פורמט תשובה להשוואת מסלולים ===
 
כשמשתמש שואל "מניות או נדל"ן?" - הצג בפורמט הזה:
 
💰 עם [סכום] בחודש למשך [תקופה]:
 
🏠 מסלול נדל"ן:
- אפשרויות: [REITs / חיסכון לדירה / נדל"ן בחו"ל]
- תשואה צפויה: [X-Y%]
- יתרון: [...]
- חיסרון: [...]
 
📈 מסלול מניות:
- אפשרויות: [מדדים / מניות AI / דיבידנד]
- תשואה צפויה: [X-Y%]
- יתרון: [...]
- חיסרון: [...]
 
🔀 מסלול משולב (המלצתי):
- חלוקה מומלצת: [X% מניות, Y% נדל"ן, Z% אחר]
- תשואה צפויה: [X-Y%]
- למה זה הכי חכם: [...]
 
⚡ עדכון שוק רלוונטי:
- [חדשה עדכנית והשפעתה]
 
ותמיד סיים עם אפשרויות להעמקה ממוספרות!
 
=== הבנת שפה טבעית ===
 
המשתמשים שלך הם בני נוער ומבוגרים צעירים. הם לא תמיד יכתבו מספרים כתשובה. חובה להבין תשובות חופשיות:
 
דוגמאות לתשובות שצריך להבין:
- "8100 ש"ח לחודש" = סכום חודשי 8,100₪, אפיין לפי זה
- "יש לי עשרים אלף" = 20,000₪
- "אני רוצה דירה" = מטרה: נדל"ן / דירה ראשונה
- "משהו בטוח" = רמת סיכון שמרנית
- "אני מוכן לסכן" = רמת סיכון אגרסיבית
- "לא יודע" / "מה אתה ממליץ" = תן המלצה מותאמת עם הסבר
- "כן" / "לא" / "אולי" = הבן בהקשר השאלה הקודמת
- "ספר לי עוד" / "תרחיב" = המשך להסביר את הנושא האחרון
- "לא הבנתי" = הסבר מחדש בצורה פשוטה יותר עם דוגמה
- "חזור" / "תחזור" = חזור לשלב הקודם בשיחה
 
כללי הבנה:
- אם המשתמש כותב סכום בכל פורמט (8100, 8,100, שמונת אלפים, 8K) - הבן את הסכום
- אם המשתמש כותב תשובה שלא מתאימה לאפשרויות - נסה להבין את הכוונה ואל תגיד "לא הבנתי, בחר מספר"
- אם המשתמש שואל שאלה באמצע תהליך - ענה על השאלה ואז חזור לתהליך
- אם המשתמש כותב בסלנג או בקיצורים - הבן את הכוונה (יאללה = כן/בוא נתחיל, נ"ל = נדל"ן, וכו')
 
=== כללי פורמט תשובה ===
 
חשוב מאוד: אל תשתמש בסימני Markdown כמו ** או ## או --- בתשובות שלך!
- במקום **טקסט מודגש** כתוב את הטקסט רגיל או הוסף אימוג'י לפניו
- במקום ## כותרת כתוב את הכותרת עם אימוג'י בתחילתה
- במקום --- השתמש בשורה ריקה
- השתמש באימוג'ים ובמספור (1️⃣ 2️⃣ 3️⃣) ליצירת מבנה ברור בלי Markdown`;
 
 
  // Simple markdown renderer for chat messages
  const renderMessage = useCallback((text) => {
    if (!text) return null;
    // Process markdown-like formatting
    const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__|---)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} style={{ fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('__') && part.endsWith('__')) {
        return <strong key={i} style={{ fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
      }
      if (part === '---') {
        return <hr key={i} style={{ border: 'none', borderTop: `1px solid ${COLORS.grayLight}`, margin: '8px 0' }} />;
      }
      return <span key={i}>{part}</span>;
    });
  }, []);
 
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
    const welcome = isMale 
      ? `${heyText}${welcomeName ? " " + welcomeName : ""}! 🔥 אני TEENVEST - המנטור הפיננסי שלך!
 
מה הכי מעניין אותך עכשיו?
1️⃣ 💰 להתחיל להשקיע (גם עם 0₪)
2️⃣ 🚀 להקים עסק דיגיטלי בגיל שלך
3️⃣ 🎯 לגלות את הכישרון שיכול להרוויח לך כסף
4️⃣ 📊 להבין השקעות (מניות vs קריפטו)
5️⃣ 🏠 להבין השקעות בנדל"ן בישראל
 
בחר מספר ובוא נתחיל! 👇`
      : `${heyText}${welcomeName ? " " + welcomeName : ""}! 🔥 אני TEENVEST - המנטורית הפיננסית שלך!
 
מה הכי מעניין אותך עכשיו?
1️⃣ 💰 להתחיל להשקיע (גם עם 0₪)
2️⃣ 🚀 להקים עסק דיגיטלי בגיל שלך
3️⃣ 🎯 לגלות את הכישרון שיכול להרוויח לך כסף
4️⃣ 📊 להבין השקעות (מניות vs קריפטו)
5️⃣ 🏠 להבין השקעות בנדל"ן בישראל
 
בחרי מספר ובואי נתחיל! 👇`;
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
 
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
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
              {renderMessage(msg.content)}
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
 
// --- LEGAL PAGES ---
const LEGAL_CONTENT = {
  accessibility: {
    title: "♿ הצהרת נגישות",
    content: `TEENVEST מחויבת להנגשת האתר והשירותים הדיגיטליים שלה לכלל האוכלוסייה, לרבות אנשים עם מוגבלויות, בהתאם לתקן WCAG 2.2 ברמה AA.
 
תקן נגישות:
אתר זה נבנה ומתוחזק בהתאם לתקן הנגישות הבינלאומי Web Content Accessibility Guidelines (WCAG) 2.2 ברמת AA, המהווה את התקן העדכני ביותר שפורסם על ידי ארגון W3C. התקן מבוסס על ארבעה עקרונות יסוד:
• ניתן לתפיסה (Perceivable) — מידע ורכיבי ממשק מוצגים באופן שכל המשתמשים יכולים לתפוס
• ניתן להפעלה (Operable) — רכיבי ממשק וניווט ניתנים להפעלה על ידי כל המשתמשים
• ניתן להבנה (Understandable) — מידע והפעלת ממשק ניתנים להבנה
• עמיד (Robust) — תוכן מספיק עמיד כדי להתפרש באופן אמין על ידי טכנולוגיות עזר
 
פעולות נגישות שננקטו:
• תמיכה מלאה בניווט מקלדת
• תאימות עם קוראי מסך ותוכנות טכנולוגיות עזר
• טקסט חלופי (alt text) לכל התמונות והאלמנטים הוויזואליים
• ניגודיות צבעים מספקת בין טקסט לרקע בהתאם לתקן
• מבנה כותרות היררכי ותקין
• תמיכה מלאה ב-RTL (כיוון ימין-לשמאל) לעברית
• גופנים ברורים וקריאים בגודל מתאים
• טפסים נגישים עם תוויות ברורות והנחיות שגיאה
• אפשרות להשהות, לעצור או להשתיק תוכן אודיו (מוזיקת רקע)
 
עדכון רציף:
אנו מבצעים סקירות נגישות תקופתיות ומעדכנים את האתר בהתאם לשינויים בתקנים ובטכנולוגיות. עם כל עדכון של תקני WCAG, אנו מתחייבים לעדכן את האתר בהתאם בתוך 90 ימים.
 
יצירת קשר בנושא נגישות:
אם נתקלת בבעיית נגישות באתר או שיש לך הצעות לשיפור, נשמח לשמוע:
📧 admin@teenvest.ai
אנו מתחייבים לטפל בכל פנייה בנושא נגישות תוך 5 ימי עסקים.
 
תאריך עדכון אחרון: מרץ 2026`
  },
 
  privacy: {
    title: "🔒 מדיניות פרטיות",
    content: `מדיניות פרטיות זו מתארת כיצד TEENVEST ("אנחנו", "שלנו") אוספת, משתמשת ומגינה על המידע שלך בעת השימוש באתר ובשירותים שלנו.
 
מידע שאנחנו אוספים:
• כתובת אימייל — לצורכי רישום וזיהוי
• מגדר — להתאמה לשונית (לשון זכר/נקבה) בלבד
• היסטוריית שיחות — נשמרת באופן מקומי במכשיר שלך בלבד (localStorage)
 
מידע שאנחנו לא אוספים:
• לא אוספים מידע פיננסי אמיתי (מספרי חשבון, כרטיסי אשראי)
• לא אוספים מידע על מיקום מדויק
• לא אוספים מידע ביומטרי
• לא אוספים מידע רפואי
 
שימוש במידע:
המידע שנאסף משמש אך ורק ל:
• התאמה אישית של חוויית השימוש (לשון פנייה)
• שיפור השירות והתוכן
• תקשורת בנוגע לעדכוני שירות (רק עם הסכמה)
 
אחסון מידע:
• פרטי הרישום (אימייל, מגדר) נשמרים במכשיר שלך בלבד באמצעות localStorage
• שיחות עם הצ'אט מעובדות דרך שירותי AI (Anthropic Claude, Perplexity) — השיחות לא נשמרות בשרתים שלנו
• אנחנו לא מנהלים מסד נתונים עם מידע אישי של משתמשים
 
שיתוף מידע עם צדדים שלישיים:
• אנו לא מוכרים, משכירים או מסחרים במידע אישי
• שיחות מעובדות דרך Anthropic (Claude AI) ו-Perplexity בהתאם למדיניות הפרטיות שלהם
• לא נשתף מידע אישי ללא הסכמה מפורשת, אלא אם נדרש על פי חוק
 
בני נוער:
• השירות מיועד לגילאי 15 ומעלה
• אנו ממליצים בחום שבני נוער מתחת לגיל 18 ישתמשו בשירות בליווי והסכמת הורה או אפוטרופוס
• אנו לא אוספים ביודעין מידע מילדים מתחת לגיל 15
 
זכויותיך:
ראה סעיף "זכויות נושא מידע" באתר
 
עוגיות (Cookies):
אתר זה אינו משתמש בעוגיות מעקב. אנו משתמשים אך ורק ב-localStorage לשמירת פרטי הרישום שלך במכשיר.
 
שינויים במדיניות:
אנו שומרים לעצמנו את הזכות לעדכן מדיניות זו. שינויים מהותיים יפורסמו באתר ויכנסו לתוקף 14 ימים לאחר הפרסום.
 
יצירת קשר:
📧 admin@teenvest.ai
 
תאריך עדכון אחרון: מרץ 2026`
  },
 
  terms: {
    title: "📋 תנאי שירות",
    content: `ברוכים הבאים ל-TEENVEST. בשימוש באתר ובשירותים שלנו, אתה מסכים לתנאים הבאים:
 
1. תיאור השירות:
TEENVEST הוא פלטפורמה חינוכית המספקת מידע פיננסי לבני נוער ומבוגרים צעירים באמצעות בינה מלאכותית. השירות כולל מידע על השקעות, יזמות דיגיטלית, וניהול כספים.
 
2. הצהרת אחריות חינוכית — חשוב!
⚠️ כל המידע המוצג ב-TEENVEST הוא למטרות חינוכיות והעשרה בלבד.
• המידע אינו מהווה ייעוץ פיננסי, השקעתי, משפטי או מקצועי מכל סוג
• אין לראות במידע המוצג המלצה לביצוע פעולה פיננסית כלשהי
• כל החלטה פיננסית צריכה להיעשות לאחר התייעצות עם יועץ פיננסי מוסמך
• בני נוער מתחת לגיל 18 נדרשים לקבל הסכמה ופיקוח של הורה או אפוטרופוס
 
3. תנאי שימוש:
• השירות מיועד לגילאי 15 ומעלה
• אין להשתמש בשירות לצורכי ייעוץ השקעות אמיתי
• אין להעתיק, לשכפל או להפיץ תכנים מהאתר ללא אישור
• אין להשתמש בשירות באופן שעלול לפגוע בפעילות האתר
 
4. הגבלת אחריות:
• TEENVEST אינה אחראית לנזקים ישירים או עקיפים שייגרמו כתוצאה מהשימוש במידע באתר
• התוצאות, התחזיות והחישובים המוצגים הם הערכות בלבד ואינם מבטיחים תוצאות עתידיות
• ביצועי עבר אינם מעידים על ביצועים עתידיים בהשקעות
• אנו עושים מאמץ לספק מידע מדויק ועדכני אך אין אנו מתחייבים לדיוק מוחלט
 
5. שימוש ב-AI:
• התשובות מופקות באמצעות בינה מלאכותית (Claude של Anthropic ו-Perplexity)
• מערכות AI עלולות לטעות — יש לבדוק מידע קריטי ממקורות נוספים
• השירות אינו תחליף ליועץ פיננסי אנושי מוסמך
 
6. קניין רוחני:
ראה סעיף "זכויות יוצרים" באתר.
 
7. שינויים בשירות:
אנו שומרים לעצמנו את הזכות לשנות, להשעות או להפסיק את השירות בכל עת.
 
8. דין וסמכות שיפוט:
תנאי שירות אלו כפופים לדיני מדינת ישראל. סמכות השיפוט הבלעדית נתונה לבתי המשפט המוסמכים בישראל.
 
יצירת קשר:
📧 admin@teenvest.ai
 
תאריך עדכון אחרון: מרץ 2026`
  },
 
  rights: {
    title: "👤 זכויות נושא מידע",
    content: `בהתאם לחוק הגנת הפרטיות, התשמ"א-1981, ותקנות הגנת הפרטיות, עומדות לך הזכויות הבאות בנוגע למידע האישי שלך:
 
1. הזכות לעיון:
יש לך זכות לעיין במידע אישי המוחזק אצלנו אודותיך. הערה: מרבית המידע שלך נשמר במכשיר שלך בלבד (localStorage) ולא בשרתים שלנו.
 
2. הזכות לתיקון:
אם מצאת שמידע אישי אודותיך אינו נכון, שלם, ברור או מעודכן, אתה רשאי לבקש את תיקונו.
 
3. הזכות למחיקה:
אתה רשאי לבקש את מחיקת המידע האישי שלך. מאחר שהמידע נשמר במכשירך, תוכל למחוק אותו בעצמך:
• בדפדפן: נקה את נתוני האתר (Clear site data) עבור teenvest.ai
• או: מחק את localStorage דרך כלי המפתח (Developer Tools > Application > Local Storage)
 
4. הזכות להגבלת עיבוד:
אתה רשאי לבקש להגביל את עיבוד המידע שלך למטרות מסוימות בלבד.
 
5. הזכות להתנגד:
אתה רשאי להתנגד לעיבוד מידע אישי שלך, כולל התנגדות לקבלת דיוור שיווקי.
 
6. הזכות לניוד מידע:
אתה רשאי לבקש לקבל את המידע האישי שלך בפורמט מובנה, שמיש ומכונה-קריא.
 
7. הזכות שלא להיות כפוף להחלטה אוטומטית:
המלצות ההשקעה שלנו מבוססות על AI, אך הן למטרות חינוכיות בלבד ואינן מהוות החלטות מחייבות.
 
הגשת בקשה:
לצורך מימוש זכויותיך, פנה אלינו:
📧 admin@teenvest.ai
 
אנו נטפל בבקשתך תוך 30 ימים מיום קבלתה.
 
הגשת תלונה:
אם אתה סבור שזכויותיך נפגעו, באפשרותך להגיש תלונה לרשות להגנת הפרטיות:
🌐 www.gov.il/he/departments/the_privacy_protection_authority
 
תאריך עדכון אחרון: מרץ 2026`
  },
 
  copyright: {
    title: "©️ זכויות יוצרים",
    content: `כל הזכויות שמורות ל-TEENVEST © 2026
 
1. בעלות על תכנים:
כל התכנים באתר TEENVEST, לרבות טקסטים, עיצוב, לוגו, גרפיקה, קוד תוכנה, ותכני AI, הם קניינה הרוחני של TEENVEST, אלא אם צוין אחרת.
 
2. שימוש מותר:
• צפייה ושימוש אישי, לא מסחרי, בתכני האתר
• שיתוף קישורים לאתר
• ציטוט קצר לצורכי ביקורת או לימוד, עם מתן קרדיט ל-TEENVEST
 
3. שימוש אסור:
• העתקה, שכפול, או הפצה של תכנים ללא אישור בכתב
• שימוש מסחרי בתכנים או בשם המותג
• שינוי, עיבוד או יצירת יצירות נגזרות מתכני האתר
• הסרת סימני מסחר, זכויות יוצרים, או סימונים אחרים
 
4. סימני מסחר:
השם "TEENVEST", הלוגו, וכל סימני המסחר הקשורים הם קניינה של TEENVEST ואין להשתמש בהם ללא אישור מפורש.
 
5. תכני צדדים שלישיים:
• נתוני שוק ומידע פיננסי עדכני מסופקים באמצעות Perplexity AI
• מנוע השיחה מופעל על ידי Claude של Anthropic
• כל סימני המסחר של צדדים שלישיים שייכים לבעליהם
 
6. תכנים שנוצרו על ידי AI:
תכנים שנוצרו על ידי מנוע ה-AI כחלק מהשיחה עם המשתמש אינם מהווים ייעוץ מקצועי ואין להסתמך עליהם לצורך קבלת החלטות פיננסיות.
 
7. דיווח על הפרה:
אם אתה סבור שתוכן באתר מפר זכויות יוצרים שלך, פנה אלינו:
📧 admin@teenvest.ai
נא לכלול: תיאור התוכן המפר, הוכחת בעלות, ופרטי התקשרות.
 
תאריך עדכון אחרון: מרץ 2026`
  },
};
 
const LegalPage = ({ pageId, onBack }) => {
  const page = LEGAL_CONTENT[pageId];
  if (!page) return null;
 
  return (
    <div style={{ minHeight: "100vh", background: COLORS.cream, direction: "rtl", fontFamily: "'Rubik', sans-serif" }}>
      <div style={{ background: COLORS.navy, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{
          background: "rgba(255,255,255,0.1)", border: "none",
          borderRadius: 10, padding: "8px 14px", cursor: "pointer",
          color: COLORS.white, fontSize: 14, fontFamily: "'Rubik', sans-serif",
        }}>
          ← חזרה
        </button>
        <Logo size={32} />
        <span style={{ color: COLORS.white, fontWeight: 700, fontSize: 16 }}>TEENVEST</span>
      </div>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "30px 20px 60px" }}>
        <h1 style={{ color: COLORS.navy, fontSize: 26, fontWeight: 800, marginBottom: 24 }}>{page.title}</h1>
        <div style={{
          background: COLORS.white, borderRadius: 20, padding: "30px 24px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
          color: COLORS.textDark, fontSize: 14, lineHeight: 2,
          whiteSpace: "pre-wrap",
        }}>
          {page.content}
        </div>
        <div style={{ marginTop: 30, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
          {Object.entries(LEGAL_CONTENT).filter(([id]) => id !== pageId).map(([id, p]) => (
            <button key={id} onClick={() => onBack(id)} style={{
              background: "none", border: `1px solid ${COLORS.grayLight}`, borderRadius: 20,
              padding: "8px 16px", cursor: "pointer", fontSize: 12, color: COLORS.navy,
              fontFamily: "'Rubik', sans-serif",
            }}>
              {p.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
 
// --- MAIN APP ---
export default function TeenVestApp() {
  const [currentView, setCurrentView] = useState("landing");
  const [userProfile, setUserProfile] = useState(null);
  const [legalPageId, setLegalPageId] = useState(null);
  
  const [audioUrl, setAudioUrl] = useState(null);
  
  useEffect(() => {
    setAudioUrl("/bg-music.mp3");
    // Check if user already registered
    try {
      const saved = localStorage.getItem("teenvest_user");
      if (saved) setUserProfile(JSON.parse(saved));
    } catch(e) {}
  }, []);
 
  const handleStartChat = () => {
    if (userProfile) {
      setCurrentView("chat");
    } else {
      setCurrentView("register");
    }
  };
 
  const handleRegistration = (profile) => {
    setUserProfile(profile);
    setCurrentView("chat");
  };
 
  const handleLegalPage = (pageId) => {
    setLegalPageId(pageId);
    setCurrentView("legal");
  };
 
  const handleLegalBack = (newPageId) => {
    if (newPageId && typeof newPageId === "string") {
      setLegalPageId(newPageId);
    } else {
      setCurrentView("landing");
      setLegalPageId(null);
    }
  };
 
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
        <LandingPage onStartChat={handleStartChat} onLegalPage={handleLegalPage} />
      ) : currentView === "register" ? (
        <RegistrationPage onComplete={handleRegistration} onBack={() => setCurrentView("landing")} />
      ) : currentView === "legal" ? (
        <LegalPage pageId={legalPageId} onBack={handleLegalBack} />
      ) : (
        <ChatInterface onBack={() => setCurrentView("landing")} userProfile={userProfile} />
      )}
    </>
  );
}
 








