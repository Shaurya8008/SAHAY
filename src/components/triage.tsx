import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Info, ShieldCheck, Stethoscope, Sparkles } from "lucide-react";
import { ANSWER_OPTIONS, MOODS, TRIAGE_QUESTIONS } from "../lib/sahay-data";

export function MoodSlider({ mood, setMood }: { mood: number; setMood: (m: number) => void }) {
  const current = MOODS.find((m) => m.value === mood)!;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-[22px] p-5 card-shadow-sm border border-[#ff914d]/20 card-hover">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-bold text-[#5C2D00]">How are you right now?</p>
        <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9A5500] bg-[#FFE8A0] px-2 py-1 rounded-full">1–5 scale</span>
      </div>
      <div className="flex justify-between mt-4 px-0.5">
        {MOODS.map((m) => (
          <button key={m.value} onClick={() => setMood(m.value)} aria-label={`Mood ${m.value}: ${m.label}`} className="flex flex-col items-center gap-1.5 flex-1 group">
            <motion.span
              animate={{ scale: mood === m.value ? 1.18 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              whileTap={{ scale: 0.85 }}
              className={`text-[30px] leading-none w-[52px] h-[52px] flex items-center justify-center rounded-2xl transition-all ${mood === m.value ? "bg-[#FFE8A0] border-2 shadow-sm" : "grayscale-[0.35] opacity-70 border-2 border-transparent"}`}
              style={mood === m.value ? { borderColor: m.color } : {}}
            >{m.emoji}</motion.span>
            <span className={`text-[10px] font-bold ${mood === m.value ? "text-[#5C2D00]" : "text-[#B09A70]"}`}>{m.label}</span>
            {mood === m.value && <motion.span layoutId="mood-dot" className="w-1.5 h-1.5 rounded-full" style={{ background: m.color }} />}
          </button>
        ))}
      </div>
      <div className="mt-3">
        <input type="range" min={1} max={5} step={1} value={mood} onChange={(e) => setMood(Number(e.target.value))} aria-label="Mood slider 1 to 5" className="w-full accent-[#ff914d]" />
        <div className="flex justify-between text-[10px] font-semibold text-[#B09A70]"><span>Very low</span><span>Bright</span></div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={mood} initial={{ opacity: 0, y: 6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", damping: 20, stiffness: 300 }} className="mt-3 rounded-2xl p-3.5 flex items-center gap-3" style={{ background: current.color + "14", border: `1px solid ${current.color}30` }}>
          <motion.span animate={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.5 }} className="text-[26px]">{current.emoji}</motion.span>
          <div>
            <p className="text-[13px] font-bold" style={{ color: current.color }}>{current.label} — {current.desc}</p>
            <p className="text-[11.5px] text-[#6B4520]">{mood <= 2 ? "Thank you for being honest. Let's go gently — I'm here." : mood === 3 ? "Steady is a good place to check in from." : "Lovely to hear. Let's keep that light protected."}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

export interface ChatMsg { from: "bot" | "user"; text: string; tag?: string }

export function TriageChat({ messages, setMessages, answers, setAnswers, qIndex, setQIndex, onComplete, started, setStarted }: any) {
  const [typing, setTyping] = useState(false);
  const [locked, setLocked] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);
  useEffect(() => () => { timers.current.forEach((t) => window.clearTimeout(t)); }, []);

  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  };

  const start = () => {
    if (started || typing) return;
    setStarted(true);
    setTyping(true);
    later(() => {
      setTyping(false);
      setMessages([{ from: "bot", text: `Namaste 🙏 I'm the SAHAY Assistant. I'll ask 6 short, gentle questions about the last 2 weeks — adapted from PHQ-9 & GAD-7 screeners used across India. There are no wrong answers. Ready?`, tag: "Welcome" }]);
      later(() => askQ(0), 700);
    }, 900);
  };

  const askQ = (i: number) => {
    if (i >= TRIAGE_QUESTIONS.length) return;
    setTyping(true);
    later(() => {
      setTyping(false);
      const q = TRIAGE_QUESTIONS[i];
      setMessages((m: ChatMsg[]) => [...m, { from: "bot", text: q.text, tag: `Q${i + 1}/6 • ${q.tag}` }]);
    }, 800);
  };

  const answer = (score: number, label: string) => {
    if (typing || locked) return;
    const q = TRIAGE_QUESTIONS[qIndex];
    if (!q) return;
    setLocked(true);
    const merged = { ...answers, [q.id]: score };
    setAnswers(merged);
    setMessages((m: ChatMsg[]) => [...m, { from: "user", text: label }]);
    const next = qIndex + 1;
    setTyping(true);
    later(() => {
      setTyping(false);
      setMessages((m: ChatMsg[]) => [...m, { from: "bot", text: q.followup, tag: "SAHAY" }]);
      if (next < TRIAGE_QUESTIONS.length) {
        setQIndex(next);
        setLocked(false);
        later(() => askQ(next), 650);
      } else {
        setQIndex(next);
        later(() => {
          const total = Object.values(merged).reduce((a: number, b: any) => a + (b as number), 0);
          const riskAns: number = q.id === "risk" ? score : (merged["risk"] ?? 0);
          let verdict = "";
          if (riskAns >= 1) verdict = "Thank you for telling me — that took courage. Your safety is the priority, so I'll ready the crisis pathway for you next. You deserve immediate, human care. 💛";
          else if (total <= 5) verdict = `Thank you for sharing openly. Your responses suggest lighter strain right now (score ~${total}/18). I'll open the wellness & community pathway — gentle tools to stay steady.`;
          else if (total <= 11) verdict = `Thank you — I hear you. Your responses suggest moderate strain (score ~${total}/18). I'll open the trained peer-supporter pathway so you don't carry this alone.`;
          else verdict = `Thank you for trusting me with this. Your responses suggest heavy strain (score ~${total}/18). I'll ready the crisis & professional pathway with extra care around you.`;
          setMessages((m: ChatMsg[]) => [...m, { from: "bot", text: verdict, tag: "Your result" }]);
          later(() => onComplete(total, riskAns), 900);
        }, 800);
      }
    }, 750);
  };

  const progress = Math.min(qIndex / TRIAGE_QUESTIONS.length, 1);
  const currentQ = TRIAGE_QUESTIONS[qIndex];
  const awaitingAnswer = started && !locked && qIndex < TRIAGE_QUESTIONS.length && messages.length > 0 && messages[messages.length - 1].from === "bot" && messages[messages.length - 1].tag?.startsWith("Q") && !typing;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[22px] overflow-hidden card-shadow-sm border border-[#ff914d]/20">
      <div className="mango-ink px-4 pt-4 pb-3.5 text-white relative overflow-hidden">
        <div className="absolute -right-6 -top-8 w-32 h-32 rounded-full bg-[#ffde59]/15" />
        <div className="flex items-center gap-2.5 relative">
          <span className="w-10 h-10 rounded-2xl mango-hero flex items-center justify-center border border-white/20"><Bot className="w-5 h-5 text-[#5C2D00]" /></span>
          <div className="flex-1">
            <p className="text-[14px] font-bold flex items-center gap-1.5 text-white">SAHAY Assistant <span className="flex items-center gap-1 text-[9px] bg-[#ffde59]/20 text-[#FFF3C4] px-1.5 py-0.5 rounded-full font-bold"><span className="w-1.5 h-1.5 rounded-full bg-[#ffde59] animate-pulse" />Online</span></p>
            <p className="text-[11px] text-white/70">Gentle triage • PHQ-9 + GAD-7 adapted • Hinglish OK</p>
          </div>
        </div>
        {started && (
          <div className="mt-3 h-1.5 bg-white/15 rounded-full overflow-hidden relative">
            <motion.div className="h-full rounded-full relative overflow-hidden" style={{ background: "linear-gradient(90deg, #ffde59, #ff914d)" }} animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.5, ease: "easeOut" }}>
              <div className="absolute inset-0 animate-shimmer" />
            </motion.div>
          </div>
        )}
      </div>

      {/* Non-diagnostic banner */}
      <div className="mx-4 mt-3 bg-[#FFF7E6] border border-[#E9B44C]/40 rounded-2xl px-3 py-2.5 flex gap-2.5">
        <Stethoscope className="w-4 h-4 text-[#D48A20] shrink-0 mt-0.5" />
        <p className="text-[11px] leading-relaxed text-[#7A5A1E]"><span className="font-bold">AI routes & converses — it does not diagnose.</span> Only a qualified professional can diagnose. This chat decides which support path fits best.</p>
      </div>

      <div className="px-4 py-3 max-h-[340px] overflow-y-auto sahay-scroll space-y-2.5 min-h-[180px]">
        {!started && (
          <div className="text-center py-4">
            <motion.span animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }} className="text-[40px] inline-block">🥭</motion.span>
            <p className="text-[13px] font-bold text-[#5C2D00] mt-2">A 2-minute gentle check-in</p>
            <p className="text-[12px] text-[#8A6B40] mt-1 leading-relaxed">6 questions • Tap an answer • You can pause anytime.<br />Adapted from PHQ-9 (mood) & GAD-7 (worry).</p>
            <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={start} className="mt-3.5 mango-hero text-[#5C2D00] text-[13.5px] font-bold px-6 py-3 rounded-2xl inline-flex items-center gap-2 card-shadow-sm"><Sparkles className="w-4 h-4" /> Start gentle check-in</motion.button>
          </div>
        )}
        {messages.map((m: ChatMsg, i: number) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", damping: 20, stiffness: 300 }} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${m.from === "user" ? "bg-gradient-to-r from-[#ff914d] to-[#e07530] text-white rounded-br-md" : "bg-[#FFF7E6] text-[#3B1A00] rounded-bl-md border border-[#ff914d]/15"}`}>
              {m.tag && <p className={`text-[9.5px] font-bold uppercase tracking-[0.08em] mb-1 ${m.from === "user" ? "text-white/70" : "text-[#9A5500]"}`}>{m.tag}</p>}
              <p className="text-[13px] leading-relaxed">{m.text}</p>
            </div>
          </motion.div>
        ))}
        {typing && (
          <div className="flex justify-start"><div className="bg-[#FFF7E6] rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5 border border-[#ff914d]/15">
            {[0, 1, 2].map((d) => <motion.span key={d} animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: d * 0.2 }} className="w-2 h-2 rounded-full bg-[#ff914d]" />)}
          </div></div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 pb-4">
        {awaitingAnswer && currentQ && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-2">
            {ANSWER_OPTIONS.map((o) => (
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} key={o.label} onClick={() => answer(o.score, o.label)} className={`text-left rounded-2xl border px-3 py-2.5 transition ${currentQ.id === "risk" ? "border-[#C0564B]/25 bg-[#FFF5F4] hover:border-[#C0564B]" : "border-[#ff914d]/25 bg-[#FFFBEE] hover:border-[#ff914d] hover:bg-[#FFE8A0]"}`}>
                <p className="text-[12.5px] font-bold text-[#5C2D00]">{o.label}</p>
                <p className="text-[10.5px] text-[#8A6B40]">{o.hint}</p>
              </motion.button>
            ))}
          </motion.div>
        )}
        {started && !awaitingAnswer && qIndex < TRIAGE_QUESTIONS.length && (
          <p className="text-center text-[11px] text-[#B09A70] flex items-center justify-center gap-1.5 py-1"><ShieldCheck className="w-3.5 h-3.5" /> Take your time — SAHAY is listening…</p>
        )}
        {started && (
          <p className="flex items-center justify-center gap-1.5 text-[10.5px] text-[#B09A70] mt-2"><Info className="w-3 h-3" /> Q set: PHQ-9 items 1–2, GAD-7 items 1–2, sleep/energy + safety check</p>
        )}
      </div>
    </motion.div>
  );
}
