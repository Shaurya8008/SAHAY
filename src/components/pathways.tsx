import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, BadgeCheck, BookOpen, Fingerprint, FlaskConical, Heart, Leaf, Lock, MessageCircle, PenLine, PhoneCall, Play, ShieldCheck, Siren, Sparkles, Wind, ChevronRight, Stethoscope, Users, Send } from "lucide-react";
import { COMMUNITY_POSTS } from "../lib/sahay-data";

export type Risk = "low" | "moderate" | "high";

export function riskMeta(r: Risk) {
  if (r === "low") return { label: "Low Strain", color: "#D48A20", bg: "#FFE8A0", emoji: "\uD83C\uDF31", desc: "Lighter load right now — let's protect your pace." };
  if (r === "moderate") return { label: "Moderate Strain", color: "#D48A20", bg: "#FFF4DE", emoji: "\uD83C\uDF24\uFE0F", desc: "Carrying a fair bit — you don't have to alone." };
  return { label: "High Strain", color: "#C0564B", bg: "#FDECEA", emoji: "\uD83D\uDC9B", desc: "Heavy right now — extra care is around you." };
}

export function RiskSwitcher({ risk, setRisk, auto }: { risk: Risk; setRisk: (r: Risk) => void; auto: Risk }) {
  const tabs: Risk[] = ["low", "moderate", "high"];
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-[12px] font-bold text-[#5C2D00]">Your pathway <span className="font-normal text-[#8A6B40]">• AI-suggested: {riskMeta(auto).label}</span></p>
        <span className="text-[10px] font-bold text-[#9A5500] bg-white px-2 py-1 rounded-full border border-[#ff914d]/25">Demo: preview all</span>
      </div>
      <div className="bg-white rounded-[18px] p-1.5 flex gap-1 border border-[#ff914d]/20 card-shadow-sm">
        {tabs.map((t) => {
          const m = riskMeta(t);
          const active = risk === t;
          return (
            <motion.button whileTap={{ scale: 0.95 }} key={t} onClick={() => setRisk(t)} className={`flex-1 rounded-[13px] py-2.5 px-1 text-center transition-all ${active ? "text-white card-shadow-sm" : "text-[#8A6B40]"}`} style={active ? { background: t === "high" ? "#C0564B" : t === "moderate" ? "linear-gradient(90deg, #ff914d, #e07530)" : "linear-gradient(90deg, #ffde59, #ff914d)", color: t === "low" ? "#5C2D00" : "#fff" } : {}}>
              <p className="text-[12px] font-bold leading-none capitalize">{t === "low" ? "Low" : t === "moderate" ? "Moderate" : "High"}</p>
              <p className={`text-[9px] mt-1 font-semibold ${active ? (t === "low" ? "text-[#5C2D00]/70" : "text-white/85") : "text-[#B09A70]"}`}>{t === "low" ? "Wellness" : t === "moderate" ? "Peer 1:1" : "Crisis care"}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export function ScoreBanner({ score, riskAns, mood, risk }: { score: number; riskAns: number; mood: number; risk: Risk }) {
  const m = riskMeta(risk);
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[20px] p-4 card-shadow-sm border border-white/40" style={{ background: m.bg }}>
      <div className="flex items-center gap-3">
        <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} className="text-[30px]">{m.emoji}</motion.span>
        <div className="flex-1">
          <p className="text-[13px] font-bold" style={{ color: m.color }}>{m.label} • Triage ~{score}/18 • Mood {mood}/5</p>
          <p className="text-[12px] text-[#6B4520] leading-snug mt-0.5">{m.desc}</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-2.5 bg-white/70 rounded-xl px-2.5 py-2">
        <Stethoscope className="w-3.5 h-3.5 text-[#8A6B40] shrink-0" />
        <p className="text-[10.5px] text-[#6B4520]">Screening aid only — <span className="font-bold">not a diagnosis.</span> {riskAns >= 1 ? "Safety answer prioritised your pathway." : "Your pathway can change anytime you need."}</p>
      </div>
    </motion.div>
  );
}

/* ---------- LOW RISK ---------- */

export function LowRiskView({ nickname, onSOS, showToast }: { nickname: string; onSOS: () => void; showToast?: (t: string) => void }) {
  const [breathing, setBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState("Breathe in…");
  const [journal, setJournal] = useState("");
  const [savedTick, setSavedTick] = useState(false);
  const [entries, setEntries] = useState<string[]>(["Mess food + a walk with roomie = better evening. Note to self: call home Sundays."]);
  const [supports, setSupports] = useState<Record<number, number>>({});
  const [supported, setSupported] = useState<Record<number, boolean>>({});
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const breathRef = useRef<HTMLDivElement>(null);
  const journalRef = useRef<HTMLDivElement>(null);
  const peersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!breathing) return;
    const phases = ["Breathe in… 4", "Hold… 7", "Breathe out… 8"];
    let i = 0;
    setBreathPhase(phases[0]);
    const iv = setInterval(() => { i = (i + 1) % 3; setBreathPhase(phases[i]); }, 2800);
    return () => clearInterval(iv);
  }, [breathing]);

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    const ref = section === "Breathe" ? breathRef : section === "Journal" ? journalRef : peersRef;
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (section === "Breathe" && !breathing) setBreathing(true);
  };

  const saveJournal = () => {
    if (!journal.trim()) return;
    setEntries([journal.trim(), ...entries]);
    setJournal("");
    setSavedTick(true);
    window.setTimeout(() => setSavedTick(false), 2000);
  };

  return (
    <div className="space-y-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[22px] p-5 card-shadow-sm border border-[#ff914d]/20 card-hover">
        <div className="flex items-center gap-2">
          <Leaf className="w-4 h-4 text-[#ff914d]" />
          <p className="text-[13px] font-bold text-[#5C2D00]">Good news, {nickname.split(" ")[0] || "friend"} — let's keep you steady</p>
        </div>
        <p className="text-[12px] text-[#8A6B40] mt-1 leading-relaxed">Small, daily practices protect the good days. Pick one below — 2 minutes is enough.</p>
        <motion.button whileTap={{ scale: 0.97 }} onClick={onSOS} className="mt-3 w-full flex items-center justify-center gap-2 bg-[#FFF4DE] border border-[#E9B44C]/50 text-[#6B4E12] text-[12px] font-bold py-2.5 rounded-2xl">Need urgent help right now? Tap SOS — 14416, free 24×7</motion.button>
        {/* FIX: Made these clickable buttons that scroll to their sections */}
        <div className="grid grid-cols-3 gap-2 mt-3.5">
          {[
            { icon: <Wind className="w-5 h-5" />, label: "Breathe", sub: "4-7-8 • 2 min" },
            { icon: <PenLine className="w-5 h-5" />, label: "Journal", sub: "60 sec" },
            { icon: <Users className="w-5 h-5" />, label: "Peers", sub: "Anonymous" },
          ].map((t) => (
            <motion.button whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.95 }} key={t.label} onClick={() => scrollToSection(t.label)} className={`bg-[#FFFDF5] border rounded-2xl py-3 flex flex-col items-center gap-1 text-[#9A5500] transition-all cursor-pointer ${activeSection === t.label ? "border-[#ff914d] shadow-md bg-[#FFE8A0]" : "border-[#ff914d]/20 hover:border-[#ff914d]/50"}`}>
              {t.icon}<p className="text-[11px] font-bold">{t.label}</p><p className="text-[9.5px] text-[#8A6B40]">{t.sub}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Breathing tool */}
      <motion.div ref={breathRef} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative overflow-hidden rounded-[22px] mango-ink text-white p-5 card-shadow">
        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-[#ffde59]/20" />
        <div className="absolute left-4 bottom-3 text-[30px] opacity-20 animate-floaty">🥭</div>
        <div className="relative flex items-center gap-4">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setBreathing(!breathing)} aria-label={breathing ? "Stop breathing exercise" : "Start breathing exercise"} className="relative w-[92px] h-[92px] shrink-0 flex items-center justify-center">
            <span className={`absolute inset-0 rounded-full border-2 border-[#ffde59]/60 ${breathing ? "animate-breathe" : ""}`} style={{ background: breathing ? "linear-gradient(135deg, #ffde59 0%, #ff914d 100%)" : "linear-gradient(135deg, #ffde59 0%, #ff914d 100%)" }} />
            <span className="relative w-14 h-14 rounded-full bg-[#FFFDF5] text-[#5C2D00] flex items-center justify-center font-bold sun-ring">{breathing ? <span className="text-[10px] text-center leading-tight px-1">{breathPhase}</span> : <Play className="w-5 h-5 ml-0.5" />}</span>
          </motion.button>
          <div className="flex-1">
            <p className="text-[13.5px] font-bold">4-7-8 Calm Breathing</p>
            <p className="text-[11.5px] text-white/70 leading-relaxed mt-0.5">Tap the circle to {breathing ? "pause" : "begin"}. Used before vivas & placements across campuses.</p>
            <div className="flex gap-1.5 mt-2">
              <span className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded-full">EN • HI audio</span>
              <span className="text-[10px] font-bold bg-[#ffde59] text-[#5C2D00] px-2 py-1 rounded-full">{breathing ? "Playing… tap to stop" : "2 min"}</span>
            </div>
          </div>
        </div>
        {breathing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
            <span className="flex gap-1 items-center">{[0, 1, 2, 3].map((b) => <motion.span key={b} animate={{ scaleY: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: b * 0.15 }} className="w-1 h-4 rounded-full bg-[#ffde59]" />)}</span>
            <p className="text-[11px] font-bold text-[#ffde59]">Guided breathing active • Focus on the rhythm</p>
          </motion.div>
        )}
      </motion.div>

      {/* Journal */}
      <motion.div ref={journalRef} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-[22px] p-5 card-shadow-sm border border-[#ff914d]/20 card-hover">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-[#ff914d]" /><p className="text-[13px] font-bold text-[#5C2D00]">Private journal</p></div>
          <span className="text-[10px] font-bold text-[#9A5500] bg-[#FFE8A0] px-2 py-1 rounded-full flex items-center gap-1"><Lock className="w-3 h-3" /> Only on device</span>
        </div>
        <textarea value={journal} onChange={(e) => setJournal(e.target.value)} placeholder="One line about today… what felt light, what felt heavy?" rows={2} className="mt-3 w-full bg-[#FFFDF5] border border-[#ff914d]/25 rounded-2xl p-3 text-[13px] outline-none focus:border-[#ff914d] focus:ring-2 focus:ring-[#ff914d]/20 placeholder:text-[#B09A70] resize-none transition-all" />
        <div className="flex items-center justify-between mt-2">
          <p className="text-[11px] text-[#8A6B40]">{savedTick ? "✅ Saved just now • private" : "🔥 3-day gentle streak • keep it kind"}</p>
          <motion.button whileTap={{ scale: 0.95 }} onClick={saveJournal} disabled={!journal.trim()} className={`text-[12px] font-bold px-4 py-2 rounded-xl transition-all ${journal.trim() ? "mango-hero text-[#5C2D00]" : "bg-[#F7E8C0] text-[#B09A70]"}`}>Save entry</motion.button>
        </div>
        <div className="space-y-2 mt-3">
          {entries.slice(0, 3).map((e, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="bg-[#FFFBEE] border border-[#ff914d]/15 rounded-2xl p-3">
              <p className="text-[12px] text-[#3B1A00] leading-relaxed">"{e}"</p>
              <p className="text-[10px] text-[#B09A70] mt-1 font-semibold">{i === 0 && entries.length > 1 ? "Just now • private" : i === 0 ? "Yesterday • private" : `${i + 1} days ago • private`}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Community feed preview */}
      <motion.div ref={peersRef} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[22px] p-5 card-shadow-sm border border-[#ff914d]/20 card-hover">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-[#ff914d]" /><p className="text-[13px] font-bold text-[#5C2D00]">Anonymous peer community</p></div>
          <span className="text-[10px] font-bold text-[#9A5500] bg-[#FFE8A0] px-2 py-1 rounded-full flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Moderated</span>
        </div>
        <div className="space-y-2.5 mt-3">
          {COMMUNITY_POSTS.slice(0, 3).map((p) => (
            <motion.div key={p.id} whileHover={{ scale: 1.01 }} className="border border-[#ff914d]/15 rounded-2xl p-3.5 bg-[#FFFFF9]">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold" style={{ background: p.color }}>{p.alias[0]}</span>
                <p className="text-[12px] font-bold text-[#5C2D00]">{p.alias}</p>
                <span className="text-[10px] font-semibold text-[#9A5500] bg-[#FFE8A0] px-2 py-0.5 rounded-full">{p.tag}</span>
                <span className="ml-auto text-[10px] text-[#B09A70]">{p.time}</span>
              </div>
              <p className="text-[12.5px] text-[#3B1A00] leading-relaxed mt-2">{p.text}</p>
              <div className="flex items-center gap-2 mt-2.5">
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => { setSupported({ ...supported, [p.id]: !supported[p.id] }); setSupports({ ...supports, [p.id]: (supports[p.id] ?? p.supports) + (supported[p.id] ? -1 : 1) }); }} className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all ${supported[p.id] ? "bg-[#ff914d] text-white border-[#ff914d]" : "bg-white text-[#9A5500] border-[#ff914d]/30"}`}><Heart className={`w-3.5 h-3.5 ${supported[p.id] ? "fill-current" : ""}`} /> {supports[p.id] ?? p.supports}</motion.button>
                {/* FIX: Made replies clickable */}
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => showToast?.("Replies coming soon — stay tuned! 💬")} className="text-[11px] font-semibold text-[#8A6B40] hover:text-[#ff914d] transition-colors cursor-pointer">💬 {p.replies} replies</motion.button>
                <span className="ml-auto text-[10px] text-[#B09A70] flex items-center gap-1"><Fingerprint className="w-3 h-3" /> anon</span>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-3 bg-[#FFE8A0] rounded-2xl p-3 flex gap-2">
          <Sparkles className="w-4 h-4 text-[#ff914d] shrink-0 mt-0.5" />
          <p className="text-[11.5px] text-[#9A5500] leading-relaxed"><span className="font-bold">House rules:</span> no real names, no DMs, kind words only. Trained moderators + AI filter keep it safe.</p>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------- MODERATE RISK ---------- */

interface PeerMsg { from: "peer" | "me" | "sys"; text: string }

const PEER_REPLIES = [
  "Thank you for sharing that — it takes real strength, especially during semesters. I'm here, no rush. 💛",
  "That sounds really heavy to carry alone. Is it mostly studies, hostel life, or something else weighing most today?",
  "I hear you. A lot of students here felt the same around exams. Would a tiny 2-minute reset together help, or do you want to just vent?",
  "You're not a burden for feeling this way — truly. I'm staying right here with you. What would feel 1% lighter right now?",
];

export function ModerateRiskView({ nickname, onEscalate, showToast }: { nickname: string; onEscalate: () => void; showToast?: (t: string) => void }) {
  const [msgs, setMsgs] = useState<PeerMsg[]>([
    { from: "peer", text: `Namaste ${nickname.split(" ")[0] || "friend"} 🙏 I'm Meera, a trained peer supporter (final-year psych, supervised). This space is anonymous — I'm here to listen, not judge. What's been on your mind lately?` },
  ]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [replyIdx, setReplyIdx] = useState(0);
  const [checkOpen, setCheckOpen] = useState(false);
  const [escalated, setEscalated] = useState(false);
  const [prideOpen, setPrideOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  const send = (text?: string) => {
    const t = (text ?? draft).trim();
    if (!t || typing) return;
    setMsgs((m) => [...m, { from: "me", text: t }]);
    setDraft("");
    setTyping(true);
    const idx = replyIdx;
    setReplyIdx((i) => i + 1);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { from: "peer", text: PEER_REPLIES[idx % PEER_REPLIES.length] }]);
    }, 1400);
  };

  const requestReview = () => {
    setEscalated(true);
    onEscalate();
  };

  return (
    <div className="space-y-4">
      {/* Peer header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[22px] p-4 card-shadow-sm border border-[#E9B44C]/40 card-hover">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="w-12 h-12 rounded-2xl bg-[#FFF1D6] border border-[#E9B44C]/50 flex items-center justify-center text-[22px]">👩🏽‍🎓</span>
            <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
          </div>
          <div className="flex-1">
            <p className="text-[13.5px] font-bold text-[#5C2D00] flex items-center gap-1.5">Meera • Trained Peer Supporter <BadgeCheck className="w-4 h-4 text-[#ff914d]" /></p>
            <p className="text-[11px] text-[#8A6B40]">Anonymous 1:1 • Supervised • Online now</p>
          </div>
        </div>
        <div className="mt-3 bg-[#FFF7E6] border border-[#E9B44C]/40 rounded-2xl p-3 flex gap-2.5">
          <FlaskConical className="w-4 h-4 text-[#D48A20] shrink-0 mt-0.5" />
          <p className="text-[11.5px] leading-relaxed text-[#6B4E12]"><span className="font-bold">PRIDE-RCT evidence badge:</span> peer-support model adapted from the PRIDE trial (India, 2022) — trained students + counsellor supervision reduced distress in school/college settings. {/* FIX: Made "Why this works" a functional button */}<motion.button whileTap={{ scale: 0.95 }} onClick={() => setPrideOpen(!prideOpen)} className="underline font-semibold text-[#ff914d] hover:text-[#e07530] transition-colors cursor-pointer">Why this works</motion.button></p>
        </div>
        {/* FIX: PRIDE info card that opens on click */}
        <AnimatePresence>
          {prideOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="mt-2.5 bg-[#FFE8A0] rounded-2xl p-3.5 border border-[#ff914d]/30">
                <p className="text-[12px] font-bold text-[#5C2D00] mb-1.5">🔬 The PRIDE Evidence</p>
                <p className="text-[11.5px] text-[#6B4520] leading-relaxed">The <span className="font-bold">PRIDE trial (2022)</span> — a randomised controlled trial across Indian schools — showed that trained student counsellors, with weekly professional supervision, significantly reduced psychological distress. SAHAY adapts this model for college campuses.</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-[10px] font-bold text-[#9A5500] bg-white/60 px-2 py-1 rounded-full">RCT evidence</span>
                  <span className="text-[10px] font-bold text-[#9A5500] bg-white/60 px-2 py-1 rounded-full">India-specific</span>
                  <span className="text-[10px] font-bold text-[#9A5500] bg-white/60 px-2 py-1 rounded-full">Supervised</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex gap-2 mt-2.5">
          {["Listening, not judging", "You set the pace", "Pause anytime"].map((c) => (
            <span key={c} className="flex-1 text-center text-[10px] font-bold text-[#9A5500] bg-[#FFFDF5] border border-[#ff914d]/20 px-1 py-1.5 rounded-xl">{c}</span>
          ))}
        </div>
      </motion.div>

      {/* Chat */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[22px] overflow-hidden card-shadow-sm border border-[#ff914d]/20">
        <div className="px-4 py-3 border-b border-[#ff914d]/15 flex items-center gap-2 bg-[#FFFBEE]">
          <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-2 h-2 rounded-full bg-green-500" />
          <p className="text-[11.5px] font-bold text-[#9A5500]">Confidential 1:1 • Ends with a supervised check-in</p>
        </div>
        <div className="px-4 py-3 h-[280px] overflow-y-auto sahay-scroll space-y-2.5 bg-[#FFFFF9]">
          {msgs.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", damping: 20 }} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${m.from === "me" ? "bg-gradient-to-r from-[#ff914d] to-[#e07530] text-white rounded-br-md" : "bg-[#FFF7E6] border border-[#E9B44C]/30 text-[#3B1A00] rounded-bl-md"}`}>
                {m.from === "peer" && <p className="text-[9.5px] font-bold uppercase tracking-wider text-[#D48A20] mb-1">Meera • Peer</p>}
                {m.text}
              </div>
            </motion.div>
          ))}
          {typing && <div className="flex justify-start"><div className="bg-[#FFF7E6] border border-[#E9B44C]/30 rounded-2xl px-4 py-3 flex gap-1.5">{[0, 1, 2].map((d) => <motion.span key={d} animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1, delay: d * 0.2 }} className="w-2 h-2 rounded-full bg-[#D48A20]" />)}</div></div>}
          {escalated && (
            <div className="flex justify-center"><div className="bg-[#FFE8A0] border border-[#E9B44C]/50 rounded-2xl px-3.5 py-2.5 text-[11.5px] font-bold text-[#6B4E12] text-center">✅ Supervised review requested — a counsellor will read this chat (still anonymous) within ~4 working hrs.</div></div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="p-3 border-t border-[#ff914d]/15 bg-white">
          <div className="flex gap-1.5 mb-2.5 overflow-x-auto sahay-scroll">
            {["Exams are crushing me \uD83D\uDE2E\u200D\uD83D\uDCA8", "Can't sleep at night", "Fights with roommate", "Just need someone to listen"].map((chip) => (
              <motion.button whileTap={{ scale: 0.93 }} key={chip} onClick={() => send(chip)} className="shrink-0 text-[11px] font-semibold text-[#9A5500] bg-[#FFFDF5] border border-[#ff914d]/25 px-3 py-1.5 rounded-full btn-press">{chip}</motion.button>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Share at your pace… (anonymous)" className="flex-1 bg-[#FFFDF5] border border-[#ff914d]/25 rounded-2xl px-3.5 py-2.5 text-[13px] outline-none focus:border-[#ff914d] transition-all" />
            <motion.button whileTap={{ scale: 0.9, rotate: -15 }} onClick={() => send()} aria-label="Send message" className="w-11 h-11 rounded-2xl mango-hero text-[#5C2D00] flex items-center justify-center shrink-0 card-shadow-sm"><Send className="w-4 h-4" /></motion.button>
          </div>
        </div>
      </motion.div>

      {/* Escalation */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-[22px] p-4 card-shadow-sm border border-[#ff914d]/20">
        <motion.button whileTap={{ scale: 0.98 }} onClick={() => setCheckOpen(!checkOpen)} className="w-full flex items-center gap-3 bg-[#FFFDF5] border border-[#ff914d]/25 rounded-2xl p-3.5 text-left transition-all hover:border-[#ff914d]/50">
          <span className="w-10 h-10 rounded-xl bg-white border border-[#ff914d]/25 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-[#ff914d]" /></span>
          <span className="flex-1"><span className="block text-[13px] font-bold text-[#5C2D00]">Supervised escalation check</span><span className="block text-[11px] text-[#8A6B40]">Feeling worse? A counsellor reviews within hours.</span></span>
          <ChevronRight className={`w-4 h-4 text-[#ff914d] transition ${checkOpen ? "rotate-90" : ""}`} />
        </motion.button>
        <AnimatePresence>
          {checkOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="pt-3 space-y-2">
                <p className="text-[12px] text-[#6B4520] leading-relaxed">If things feel heavier, you can request a <span className="font-bold text-[#5C2D00]">counsellor-supervised review</span>. A professional reads the chat (still anonymous) and suggests next care — usually within 4 working hours.</p>
                <div className="grid grid-cols-2 gap-2">
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => setCheckOpen(false)} className="py-2.5 rounded-xl border border-[#ff914d]/30 text-[12.5px] font-bold text-[#9A5500]">Stay with peer</motion.button>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={requestReview} disabled={escalated} className={`py-2.5 rounded-xl text-[12.5px] font-bold ${escalated ? "bg-[#F7E8C0] text-[#B09A70]" : "bg-[#5C2D00] text-white"}`}>{escalated ? "Requested ✓" : "Request review ✓"}</motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/* ---------- HIGH RISK ---------- */

export function HighRiskView({ eSet, ePhone, onSOS }: { eSet: boolean; ePhone: string; onSOS: () => void }) {
  const [consent, setConsent] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [groundStep, setGroundStep] = useState(0);
  const ground = ["5 things you can SEE", "4 things you can TOUCH", "3 things you can HEAR", "2 things you can SMELL", "1 thing you can TASTE"];

  return (
    <div className="space-y-4">
      {/* Holding */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[24px] bg-gradient-to-b from-[#FFF8E6] to-[#FFE4A3] border border-[#ff914d]/40 p-5 text-center card-shadow-sm">
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full mango-hero opacity-90" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-[#C0564B]/10" />
        {/* Floating particles */}
        <div className="absolute left-12 top-6 w-2 h-2 rounded-full bg-[#ffde59]/50 animate-float-particle" />
        <div className="absolute right-16 top-20 w-3 h-3 rounded-full bg-[#ff914d]/30 animate-float-particle" style={{ animationDelay: "2s" }} />
        <div className="relative">
          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} className="w-16 h-16 mx-auto rounded-full mango-hero flex items-center justify-center text-[30px] card-shadow-sm sun-ring">💛</motion.div>
          <h3 className="font-display text-[21px] font-semibold text-[#5C2D00] leading-snug mt-3">You're not alone in this.<br />Stay with us for a moment.</h3>
          <p className="text-[12.5px] text-[#6B4520] leading-relaxed mt-2 max-w-[300px] mx-auto">What you're feeling is real, and it deserves immediate human care. You don't need to be strong right now — just stay connected. We'll hold this space with you.</p>
          <motion.button whileTap={{ scale: 0.95 }} onClick={onSOS} className="animate-sos mt-4 w-full bg-[#C0564B] text-white font-bold text-[15px] py-4 rounded-[18px] flex items-center justify-center gap-2"><Siren className="w-5 h-5" /> SOS — Get help now</motion.button>
          <p className="text-[11px] text-[#9A5500] mt-2 font-semibold">One tap opens Tele-MANAS (14416) + KIRAN • Free • 24×7 • Anonymous</p>
        </div>
      </motion.div>

      {/* Tele-MANAS card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mango-ink text-white rounded-[22px] p-5 card-shadow relative overflow-hidden">
        <div className="absolute -right-8 -bottom-10 w-40 h-40 rounded-full bg-[#ffde59]/10" />
        <div className="relative">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#FFD97A]"><PhoneCall className="w-3.5 h-3.5" /> Direct line • On-call professional 24×7</div>
          <p className="font-display text-[20px] font-semibold mt-1.5">Tele-MANAS • 14416</p>
          <p className="text-[12px] text-white/75 leading-relaxed mt-1">Govt. of India's national tele-mental health line. Trained counsellors, 20+ languages, free from any phone. Average pickup under a minute.</p>
          <div className="grid grid-cols-2 gap-2 mt-3.5">
            <motion.a whileTap={{ scale: 0.95 }} href="tel:14416" className="mango-hero text-[#5C2D00] font-bold text-[13.5px] py-3 rounded-2xl text-center block">📞 Call 14416</motion.a>
            <motion.a whileTap={{ scale: 0.95 }} href="tel:18005990019" className="bg-white/10 border border-white/25 text-white font-bold text-[13.5px] py-3 rounded-2xl text-center block">KIRAN line</motion.a>
          </div>
          <div className="flex items-center gap-2 mt-3 bg-white/10 rounded-xl px-3 py-2.5">
            <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-2 h-2 rounded-full bg-[#7CFC00] shrink-0" />
            <p className="text-[11px] text-white/85"><span className="font-bold">3 counsellors online now</span> in your language cluster • wait ~1 min</p>
          </div>
        </div>
      </motion.div>

      {/* Break-glass consent */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className={`rounded-[22px] p-5 card-shadow-sm border-2 transition-all ${unlocked ? "bg-[#FFF7E6] border-[#E9B44C]" : "bg-white border-[#ff914d]/20"}`}>
        <div className="flex items-start gap-3">
          <span className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${unlocked ? "bg-[#D48A20]" : "bg-[#5C2D00]"}`}><Lock className="w-5 h-5 text-[#ffde59]" /></span>
          <div className="flex-1">
            <p className="text-[13.5px] font-bold text-[#5C2D00]">Consent-based break-glass unlock</p>
            <p className="text-[12px] text-[#6B4520] leading-relaxed mt-1">Your sealed contact <span className="font-bold text-[#5C2D00]">{eSet && ePhone ? `(+91 •••••${ePhone.replace(/\D/g, "").slice(-5)})` : "(not added yet)"}</span> opens <span className="font-bold">only</span> when a high-risk trigger fires <span className="font-bold">and you explicitly consent</span> below. SAHAY staff can never open it otherwise.</p>
          </div>
        </div>
        <motion.button whileTap={{ scale: 0.98 }} onClick={() => { if (!consent) setConsent(true); else if (!unlocked) setUnlocked(true); else { setUnlocked(false); setConsent(false); } }} className={`mt-4 w-full rounded-2xl p-[3px] transition-all ${consent ? "bg-[#D48A20]" : "bg-[#F7E8C0]"}`} aria-pressed={consent}>
          <span className={`flex items-center justify-between rounded-[14px] px-4 py-3 ${consent ? "bg-[#FFF7E6]" : "bg-white"}`}>
            <span className="text-left"><span className="block text-[12.5px] font-bold text-[#5C2D00]">{!consent ? "I consent to unlock if I become unreachable" : unlocked ? "Unlocked — tap to re-seal" : "Consent recorded — tap again to unlock now"}</span><span className="block text-[10.5px] text-[#8A6B40]">{!consent ? "Slide of trust • you stay in control" : "Logged • revocable anytime"}</span></span>
            <span className={`w-12 h-7 rounded-full p-1 transition-all shrink-0 ${consent ? "bg-[#D48A20]" : "bg-[#E3CE8F]"}`}><motion.span animate={{ marginLeft: consent ? 20 : 0 }} className="block w-5 h-5 rounded-full bg-white shadow" /></span>
          </span>
        </motion.button>
        {consent && !unlocked && (
          <div className="mt-2.5 flex items-center justify-between bg-[#FFFDF5] rounded-xl px-3 py-2">
            <p className="text-[11px] font-semibold text-[#6B4520]">Changed your mind? You can withdraw anytime.</p>
            <button onClick={() => setConsent(false)} className="text-[11px] font-bold text-[#C0564B] underline shrink-0">Withdraw</button>
          </div>
        )}
        {unlocked && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-3 bg-[#5C2D00] text-white rounded-2xl p-3.5 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#ffde59] shrink-0" />
            <p className="text-[12px] leading-relaxed flex-1"><span className="font-bold">Break-glass open (audit-logged).</span> {eSet ? "Responder view: trusted contact notified with your consent." : "No contact sealed — a counsellor will reach you in-chat instead."}</p>
            <button onClick={() => { setUnlocked(false); setConsent(false); }} className="text-[11px] font-bold underline text-white/70 shrink-0">Re-seal</button>
          </motion.div>
        )}
        <div className="grid grid-cols-3 gap-1.5 mt-3 text-center">
          {["Trigger logged", "Consent needed", "Audit trail"].map((s) => (
            <span key={s} className="text-[10px] font-bold text-[#8A6B40] bg-[#FFFDF5] rounded-lg py-1.5">{s}</span>
          ))}
        </div>
      </motion.div>

      {/* Grounding */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[22px] p-5 card-shadow-sm border border-[#ff914d]/20 card-hover">
        <p className="text-[13px] font-bold text-[#5C2D00]">While you wait — 5-4-3-2-1 grounding</p>
        <p className="text-[12px] text-[#8A6B40] mt-0.5">Tap through slowly. Name each one out loud if you can.</p>
        <div className="mt-3 bg-[#FFFDF5] rounded-2xl p-4 text-center">
          <AnimatePresence mode="wait">
            <motion.p key={groundStep} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="font-display text-[17px] font-semibold text-[#9A5500]">{ground[groundStep]}</motion.p>
          </AnimatePresence>
          <div className="flex gap-1.5 justify-center mt-3">
            {ground.map((_, i) => <motion.span key={i} animate={{ width: i <= groundStep ? 24 : 12 }} className={`h-1.5 rounded-full transition-all ${i <= groundStep ? "bg-[#ff914d]" : "bg-[#F7E8C0]"}`} />)}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <motion.button whileTap={{ scale: 0.95 }} disabled={groundStep === 0} onClick={() => setGroundStep(Math.max(0, groundStep - 1))} className="py-2 rounded-xl border border-[#ff914d]/30 text-[12px] font-bold text-[#9A5500] disabled:opacity-40">← Back</motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setGroundStep(groundStep >= 4 ? 0 : groundStep + 1)} className="py-2 rounded-xl mango-hero text-[#5C2D00] text-[12px] font-bold">{groundStep >= 4 ? "↺ Start over" : "Done → Next"}</motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
