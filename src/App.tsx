import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, EyeOff, HeartHandshake, Lock, ShieldCheck, Siren, Sparkles } from "lucide-react";
import { TopBar, BottomNav, SOSSheet } from "./components/chrome";
import Onboarding from "./components/onboarding";
import { MoodSlider, TriageChat, type ChatMsg } from "./components/triage";
import { HighRiskView, LowRiskView, ModerateRiskView, RiskSwitcher, ScoreBanner, type Risk } from "./components/pathways";
import Community from "./components/community";
import Resources from "./components/resources";

function makeAnonId() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `SHY-${s}`;
}

/* Confetti particle component */
function ConfettiBurst({ active }: { active: boolean }) {
  if (!active) return null;
  const colors = ["#ffde59", "#ff914d", "#e07530", "#FFE8A0", "#C0564B"];
  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, y: 0, x: "50%", scale: 1 }}
          animate={{
            opacity: 0,
            y: [0, -60 - Math.random() * 80, 120 + Math.random() * 60],
            x: `${50 + (Math.random() - 0.5) * 80}%`,
            rotate: Math.random() * 720 - 360,
            scale: [1, 1.2, 0.6],
          }}
          transition={{ duration: 1.6 + Math.random() * 0.8, delay: Math.random() * 0.3, ease: "easeOut" }}
          className="absolute rounded-full"
          style={{
            width: 6 + Math.random() * 6,
            height: 6 + Math.random() * 6,
            background: colors[Math.floor(Math.random() * colors.length)],
            top: "40%",
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [tab, setTab] = useState<"home" | "community" | "resources">("home");
  const [nickname, setNickname] = useState("");
  const [college, setCollege] = useState("");
  const [ePhone, setEPhone] = useState("");
  const [eSet, setESet] = useState(false);
  const [anonId] = useState(makeAnonId);
  const [mood, setMood] = useState(3);

  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [qIndex, setQIndex] = useState(0);
  const [triageStarted, setTriageStarted] = useState(false);
  const [triageDone, setTriageDone] = useState(false);
  const [score, setScore] = useState(0);
  const [riskAns, setRiskAns] = useState(0);

  const [autoRisk, setAutoRisk] = useState<Risk>("low");
  const [risk, setRisk] = useState<Risk>("low");
  const [sosOpen, setSosOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [confetti, setConfetti] = useState(false);
  const toastTimer = useRef<number | null>(null);
  const phoneBodyRef = useRef<HTMLDivElement>(null);

  const showToast = useCallback((t: string) => {
    setToast(t);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => () => { if (toastTimer.current) window.clearTimeout(toastTimer.current); }, []);

  useEffect(() => {
    phoneBodyRef.current?.scrollTo({ top: 0 });
    window.scrollTo(0, 0);
  }, [step, tab]);

  const handleTriageComplete = useCallback((total: number, rAns: number) => {
    setScore(total);
    setRiskAns(rAns);
    setTriageDone(true);
    setConfetti(true);
    window.setTimeout(() => setConfetti(false), 2400);
    let auto: Risk = "low";
    if (rAns >= 1) auto = "high";
    else if (total <= 5) auto = "low";
    else if (total <= 11) auto = "moderate";
    else auto = "high";
    if (auto === "low" && mood <= 1) auto = "moderate";
    setAutoRisk(auto);
    setRisk(auto);
    showToast(
      auto === "high"
        ? "Crisis pathway readied with care \uD83D\uDC9B"
        : auto === "moderate"
          ? "Peer-support pathway matched \uD83C\uDF24\uFE0F"
          : "Wellness pathway matched \uD83C\uDF31"
    );
    window.setTimeout(() => { setStep(3); setTab("home"); }, 1700);
  }, [mood, showToast]);

  const resetTriage = () => {
    setMessages([]);
    setAnswers({});
    setQIndex(0);
    setTriageStarted(false);
    setTriageDone(false);
    setScore(0);
    setRiskAns(0);
  };

  const steps = [
    { n: 1, label: "Onboard" },
    { n: 2, label: "Check-in" },
    { n: 3, label: "Care path" },
  ];

  const gotoStep = (n: 1 | 2 | 3) => {
    if (n === 1) { setStep(1); setTab("home"); return; }
    if (n === 2) {
      if (nickname.trim().length >= 2) { setStep(2); setTab("home"); }
      else showToast("Enter an anonymous nickname first \uD83C\uDF31");
      return;
    }
    if (triageDone) { setStep(3); setTab("home"); }
    else showToast("Finish the 6 gentle questions to unlock your pathway \uD83C\uDF31");
  };

  const homeContent = useMemo(() => {
    if (step === 1) {
      return (
        <Onboarding
          nickname={nickname} setNickname={setNickname}
          college={college} setCollege={setCollege}
          ePhone={ePhone} setEPhone={setEPhone}
          eSet={eSet} setESet={setESet}
          anonId={anonId}
          onContinue={() => { setStep(2); setTab("home"); }}
        />
      );
    }
    if (step === 2) {
      return (
        <div className="px-4 pt-4 pb-2 space-y-4">
          <button onClick={() => setStep(1)} className="flex items-center gap-1.5 text-[12px] font-bold text-[#6B4520] btn-press">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to safety setup
          </button>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-[#5C2D00] text-[#ffde59] text-[12px] font-bold flex items-center justify-center">2</span>
            <div>
              <p className="text-[13px] font-bold text-[#5C2D00]">Mood check-in & AI triage</p>
              <p className="text-[11px] text-[#8A6B40]">Hey {nickname.split(" ")[0] || "friend"} — let us see what fits today</p>
            </div>
          </motion.div>
          <MoodSlider mood={mood} setMood={setMood} />
          <TriageChat
            messages={messages} setMessages={setMessages}
            answers={answers} setAnswers={setAnswers}
            qIndex={qIndex} setQIndex={setQIndex}
            started={triageStarted} setStarted={setTriageStarted}
            onComplete={handleTriageComplete}
          />
          {triageDone ? (
            <motion.button
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => { setStep(3); }}
              className="w-full py-4 rounded-[20px] font-bold text-[15px] mango-hero text-[#5C2D00] card-shadow animate-soft-pulse flex items-center justify-center gap-2"
            >
              View my care pathway <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <button onClick={() => showToast("Finish the 6 gentle questions to unlock your pathway \uD83C\uDF31")} className="w-full py-3.5 rounded-[20px] font-bold text-[13.5px] bg-white border border-dashed border-[#ff914d]/40 text-[#8A6B40] btn-press">
              {triageStarted ? "Complete the check-in to continue →" : "Your pathway unlocks after check-in 🔒"}
            </button>
          )}
          <p className="text-center text-[11px] text-[#8A6B40] pb-1 flex items-center justify-center gap-1"><EyeOff className="w-3 h-3" /> Answers stay anonymous • scored on-device for this demo</p>
        </div>
      );
    }
    return (
      <div className="px-4 pt-4 pb-2 space-y-4">
        <button onClick={() => { resetTriage(); setStep(2); setTab("home"); }} className="flex items-center gap-1.5 text-[12px] font-bold text-[#6B4520] btn-press">
          <ArrowLeft className="w-3.5 h-3.5" /> Retake check-in
        </button>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-full bg-[#5C2D00] text-[#ffde59] text-[12px] font-bold flex items-center justify-center">3</span>
          <div>
            <p className="text-[13px] font-bold text-[#5C2D00]">Your stratified care pathway</p>
            <p className="text-[11px] text-[#8A6B40]">For {nickname.split(" ")[0] || "friend"}{college ? ` • ${college}` : ""} • switch to explore</p>
          </div>
        </motion.div>
        <ScoreBanner score={score} riskAns={riskAns} mood={mood} risk={risk} />
        <RiskSwitcher risk={risk} setRisk={setRisk} auto={autoRisk} />
        <div>
          {risk === "low" && <LowRiskView nickname={nickname || "friend"} onSOS={() => setSosOpen(true)} showToast={showToast} />}
          {risk === "moderate" && <ModerateRiskView nickname={nickname || "friend"} onEscalate={() => showToast("Supervised review requested ✓ counsellor in ~4 hrs")} showToast={showToast} />}
          {risk === "high" && <HighRiskView eSet={eSet} ePhone={ePhone} onSOS={() => setSosOpen(true)} />}
        </div>
        {risk !== autoRisk && (
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={() => setRisk(autoRisk)} className="w-full text-[12px] font-bold text-[#9A5500] bg-white border border-[#ff914d]/30 rounded-2xl py-2.5 btn-press">
            ↺ Back to AI-suggested: {autoRisk} pathway
          </motion.button>
        )}
      </div>
    );
  }, [step, nickname, college, ePhone, eSet, anonId, mood, messages, answers, qIndex, triageStarted, triageDone, score, riskAns, autoRisk, risk, handleTriageComplete, showToast]);

  return (
    <div className="min-h-screen w-full lg:flex lg:items-start lg:justify-center lg:gap-10 lg:p-8" style={{ background: "linear-gradient(180deg, #FFE8A0 0%, #FFF0C8 40%, #FFFDF5 100%)" }}>
      <aside className="hidden lg:flex flex-col max-w-[400px] sticky top-8 pt-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl mango-hero flex items-center justify-center card-shadow">
            <HeartHandshake className="w-6 h-6 text-[#5C2D00]" />
          </div>
          <div>
            <p className="font-display text-[26px] font-semibold text-[#5C2D00] leading-none">SAHAY</p>
            <p className="text-[12px] text-[#6B4520] mt-1 tracking-wide">Support, Anonymous, Human, Always, for You</p>
          </div>
        </div>
        <h1 className="font-display text-[40px] leading-[1.08] font-semibold text-[#5C2D00] mt-8">
          Campus care that never asks for your name.
        </h1>
        <p className="text-[15px] text-[#6B4520] leading-relaxed mt-4">
          Anonymous onboarding, gentle PHQ-9/GAD-7-based AI triage, and three stratified pathways — from wellness tools to 24x7 Tele-MANAS crisis care.
        </p>
        <div className="grid grid-cols-2 gap-3 mt-6">
          {[
            { t: "100% anonymous", s: "Nicknames only, DPDP-aligned", icon: <EyeOff className="w-4 h-4" /> },
            { t: "AI triage, no diagnosis", s: "Routes to the right humans", icon: <Sparkles className="w-4 h-4" /> },
            { t: "PRIDE-RCT peers", s: "Trained + supervised students", icon: <ShieldCheck className="w-4 h-4" /> },
            { t: "Break-glass safety", s: "Encrypted, consent-locked SOS", icon: <Lock className="w-4 h-4" /> },
          ].map((f) => (
            <div key={f.t} className="bg-white/80 backdrop-blur rounded-2xl p-4 border border-[#ff914d]/20 card-hover">
              <span className="w-8 h-8 rounded-xl bg-[#FFE8A0] text-[#9A5500] flex items-center justify-center">{f.icon}</span>
              <p className="text-[13px] font-bold text-[#5C2D00] mt-2">{f.t}</p>
              <p className="text-[12px] text-[#8A6B40]">{f.s}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 bg-[#5C2D00] text-white rounded-2xl p-5 flex items-center gap-4">
          <span className="w-11 h-11 rounded-2xl bg-[#C0564B] flex items-center justify-center shrink-0"><Siren className="w-5 h-5" /></span>
          <div>
            <p className="text-[14px] font-bold">In crisis right now?</p>
            <p className="text-[12px] text-white/75">Tele-MANAS 14416 • Free • 24x7 • <a href="tel:14416" className="underline font-bold text-white">Call now</a></p>
          </div>
        </div>
        <p className="text-[11px] text-[#8A6B40] mt-4">Prototype UI • AI routes & converses, never diagnoses • Crisis: 14416 / KIRAN 1800-599-0019 / 112</p>
      </aside>

      <div className="w-full max-w-[430px] mx-auto lg:mx-0">
        <div className="lg:rounded-[36px] lg:overflow-hidden lg:border-[10px] lg:border-[#5C2D00] bg-[#FFFDF5] min-h-screen lg:min-h-[860px] lg:max-h-[880px] flex flex-col relative" style={{ boxShadow: "0 30px 80px -20px rgba(92,45,0,0.45)" }}>
          <TopBar nickname={nickname} anonId={anonId} onSOS={() => setSosOpen(true)} />

          <div className="px-4 pt-3">
            <div className="bg-white rounded-2xl border border-[#ff914d]/20 px-3.5 py-2.5 flex items-center gap-1 card-shadow-sm">
              {steps.map((s, i) => {
                const done = step > s.n;
                const active = step === s.n;
                return (
                  <div key={s.n} className="flex-1 flex items-center gap-1.5 last:flex-none">
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => gotoStep(s.n as 1 | 2 | 3)}
                      className={`flex items-center gap-1.5 rounded-full pl-1 pr-2.5 py-1 transition ${active ? "bg-[#5C2D00] text-white" : done ? "bg-[#FFE8A0] text-[#9A5500]" : "text-[#B09A70]"}`}
                    >
                      <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${active ? "bg-[#ffde59] text-[#5C2D00]" : done ? "bg-[#ff914d] text-white" : "bg-[#F7E8C0] text-[#B09A70]"}`}>
                        {done ? <Check className="w-3 h-3" /> : s.n}
                      </span>
                      <span className="text-[10.5px] font-bold whitespace-nowrap">{s.label}</span>
                    </motion.button>
                    {i < steps.length - 1 && <span className={`flex-1 h-[2px] rounded-full mx-0.5 ${step > s.n ? "bg-[#ff914d]" : "bg-[#EDD9A0]"}`} />}
                  </div>
                );
              })}
            </div>
          </div>

          <div ref={phoneBodyRef} className="flex-1 lg:overflow-y-auto sahay-scroll pb-3">
            {tab === "home" && homeContent}
            {tab === "community" && <Community nickname={nickname || "Quiet Banyan"} showToast={showToast} />}
            {tab === "resources" && <Resources onSOS={() => setSosOpen(true)} showToast={showToast} />}

            <div className="px-4 pt-3">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="rounded-2xl bg-white border border-[#ff914d]/20 p-3.5 flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-[#ff914d] shrink-0" />
                <p className="text-[11px] text-[#6B4520] leading-relaxed">
                  <span className="font-bold text-[#5C2D00]">Your safety, by design.</span> Anonymous ID {anonId} • chats moderated • high-risk language triggers care, never punishment.
                </p>
              </motion.div>
              <p className="text-center text-[10.5px] text-[#B09A70] mt-3 pb-1">SAHAY prototype • Made with care for Indian campuses • Tele-MANAS 14416</p>
            </div>
          </div>

          <BottomNav tab={tab} setTab={setTab} onSOS={() => setSosOpen(true)} />
          <SOSSheet open={sosOpen} onClose={() => setSosOpen(false)} nickname={nickname.split(" ")[0]} />
          <ConfettiBurst active={confetti} />

          <AnimatePresence>
            {toast && (
              <motion.div initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} transition={{ type: "spring", damping: 20, stiffness: 300 }} className="absolute left-4 right-4 bottom-24 z-40">
                <div className="bg-[#5C2D00] text-white rounded-2xl px-4 py-3 flex items-center gap-2.5" style={{ boxShadow: "0 20px 40px -12px rgba(92,45,0,0.5)" }}>
                  <Check className="w-4 h-4 text-[#ffde59] shrink-0" />
                  <p className="text-[12.5px] font-semibold leading-snug">{toast}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
