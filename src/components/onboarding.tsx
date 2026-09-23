import { useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Dices, EyeOff, Fingerprint, GraduationCap, Lock, Phone, ShieldCheck, Sparkles, ChevronDown, Check } from "lucide-react";
import { COLLEGES, NICKNAME_IDEAS } from "../lib/sahay-data";

const cardVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  visible: (i: number) => ({
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { delay: i * 0.1, duration: 0.45, ease: "easeOut" as const },
  }),
};

export default function Onboarding({ nickname, setNickname, college, setCollege, ePhone, setEPhone, eSet, setESet, anonId, onContinue }: any) {
  const [showPhone, setShowPhone] = useState(false);
  const [phoneDraft, setPhoneDraft] = useState(ePhone || "");
  const [phoneError, setPhoneError] = useState("");
  const [collegeOpen, setCollegeOpen] = useState(false);
  const [agreed, setAgreed] = useState(true);

  const shuffle = () => {
    const pick = NICKNAME_IDEAS[Math.floor(Math.random() * NICKNAME_IDEAS.length)];
    const num = Math.floor(10 + Math.random() * 89);
    setNickname(`${pick} ${num}`);
  };

  const savePhone = () => {
    const digits = phoneDraft.replace(/\D/g, "");
    if (digits.length >= 10) {
      setEPhone(phoneDraft);
      setESet(true);
      setShowPhone(false);
      setPhoneError("");
    } else {
      setPhoneError("Please enter a valid 10-digit mobile number.");
    }
  };

  const masked = ePhone ? `+91 ••••• ${ePhone.replace(/\D/g, "").slice(-5)}` : "";
  const canContinue = nickname.trim().length >= 2 && agreed;
  const continueLabel = nickname.trim().length < 2
    ? "Enter a nickname to continue"
    : !agreed
      ? "Please accept the note above to continue"
      : `Continue as ${nickname.split(" ").slice(0, 2).join(" ")} →`;

  return (
    <div className="px-4 pt-4 pb-2 space-y-4">
      {/* Welcome hero — mango pop */}
      <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible" className="relative overflow-hidden rounded-[26px] mango-hero text-[#5C2D00] p-5 card-shadow">
        <div className="absolute inset-0 dot-grid opacity-40" />
        <div className="absolute -right-10 -bottom-14 w-48 h-48 rounded-full bg-white/25 animate-floaty" />
        <div className="absolute right-10 -top-10 w-24 h-24 rounded-full bg-[#5C2D00]/10" />
        {/* Floating mango particles */}
        <div className="absolute left-8 top-8 w-3 h-3 rounded-full bg-[#ffde59]/50 animate-float-particle" style={{ animationDelay: "0s" }} />
        <div className="absolute right-20 bottom-20 w-2 h-2 rounded-full bg-[#ff914d]/40 animate-float-particle" style={{ animationDelay: "1.5s" }} />
        <div className="absolute left-1/2 top-12 w-2.5 h-2.5 rounded-full bg-white/30 animate-float-particle" style={{ animationDelay: "3s" }} />
        <div className="absolute left-6 bottom-4 text-[44px] opacity-25 select-none animate-floaty" style={{ animationDelay: "1s" }}>🥭</div>
        <div className="relative">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-[#5C2D00] text-[#ffde59] px-2.5 py-1 rounded-full text-[10px] font-bold tracking-[0.12em] uppercase"><EyeOff className="w-3 h-3" /> 100% Anonymous</span>
            <span className="inline-flex items-center gap-1 bg-white/85 text-[#5C2D00] px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide"><Sparkles className="w-3 h-3" /> Made for campuses</span>
          </div>
          <h1 className="font-display text-[27px] leading-[1.12] font-semibold mt-3">SAHAY — Safe,<br />Anonymous, Campus<br />Support</h1>
          <p className="text-[13px] text-[#5C2D00]/80 leading-relaxed mt-2.5 font-medium">Support, Anonymous, Human, Always, for You. A peer-first space for Indian college students — no real names, no judgement, no records tied to you.</p>
          <div className="flex items-center gap-2 mt-3.5">
            {["No real name", "Moderated", "DPDP-aligned"].map((t) => (
              <span key={t} className="text-[10.5px] font-semibold bg-[#5C2D00]/10 border border-[#5C2D00]/20 px-2.5 py-1.5 rounded-full flex items-center gap-1"><Check className="w-3 h-3" />{t}</span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Step label */}
      <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible" className="flex items-center gap-2.5">
        <span className="w-7 h-7 rounded-full bg-[#5C2D00] text-[#ffde59] text-[12px] font-bold flex items-center justify-center">1</span>
        <div>
          <p className="text-[13px] font-bold text-[#5C2D00]">Anonymous onboarding & safety setup</p>
          <p className="text-[11px] text-[#8A6B40]">Takes ~40 seconds • Nothing identifies you</p>
        </div>
      </motion.div>

      {/* Nickname */}
      <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible" className="bg-white rounded-[22px] p-5 card-shadow-sm border border-[#ff914d]/20 card-hover">
        <div className="flex items-center gap-2">
          <Fingerprint className="w-4 h-4 text-[#ff914d]" />
          <p className="text-[13px] font-bold text-[#5C2D00]">Choose an anonymous nickname</p>
        </div>
        <p className="text-[12px] text-[#8A6B40] mt-1">No real name required. This is the only name anyone will ever see.</p>
        <div className="flex gap-2 mt-3">
          <input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="e.g. Quiet Banyan 42" maxLength={24}
            className="flex-1 bg-[#FFFDF5] border border-[#ff914d]/25 rounded-2xl px-3.5 py-3 text-[14px] font-semibold text-[#5C2D00] outline-none focus:border-[#ff914d] focus:ring-2 focus:ring-[#ff914d]/20 placeholder:text-[#B09A70] placeholder:font-normal transition-all" />
          <motion.button whileTap={{ scale: 0.9, rotate: 180 }} onClick={shuffle} className="w-[52px] rounded-2xl bg-[#FFE8A0] border border-[#ff914d]/25 flex items-center justify-center text-[#9A5500] transition" aria-label="Random nickname">
            <Dices className="w-5 h-5" />
          </motion.button>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {NICKNAME_IDEAS.slice(0, 4).map((n) => (
            <motion.button whileTap={{ scale: 0.93 }} key={n} onClick={() => setNickname(n + " " + Math.floor(10 + Math.random() * 89))} className="text-[11px] font-semibold text-[#9A5500] bg-[#FFFDF5] border border-[#ff914d]/20 px-2.5 py-1.5 rounded-full btn-press">{n}</motion.button>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3 bg-[#FFFDF5] rounded-xl px-3 py-2.5">
          <BadgeCheck className="w-4 h-4 text-[#ff914d] shrink-0" />
          <p className="text-[11px] text-[#6B4520]">Your anonymous ID: <span className="font-mono font-bold text-[#5C2D00]">{anonId}</span> • stored only on this device</p>
        </div>
      </motion.div>

      {/* College */}
      <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible" className="bg-white rounded-[22px] p-5 card-shadow-sm border border-[#ff914d]/20 card-hover">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-[#ff914d]" />
          <p className="text-[13px] font-bold text-[#5C2D00]">College <span className="font-normal text-[#8A6B40]">(optional)</span></p>
        </div>
        <p className="text-[12px] text-[#8A6B40] mt-1">Used only to show campus-relevant resources. Never shared with your college.</p>
        <div className="relative mt-3">
          <button onClick={() => setCollegeOpen(!collegeOpen)} className="w-full flex items-center justify-between bg-[#FFFDF5] border border-[#ff914d]/25 rounded-2xl px-3.5 py-3 text-left transition-all hover:border-[#ff914d]/50">
            <span className={`text-[14px] ${college ? "font-semibold text-[#5C2D00]" : "text-[#B09A70]"}`}>{college || "Select your college (optional)"}</span>
            <ChevronDown className={`w-4 h-4 text-[#ff914d] transition ${collegeOpen ? "rotate-180" : ""}`} />
          </button>
          {collegeOpen && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="absolute z-20 left-0 right-0 mt-2 bg-white border border-[#ff914d]/25 rounded-2xl overflow-hidden card-shadow max-h-56 overflow-y-auto sahay-scroll">
              {["Skip — prefer not to say", ...COLLEGES].map((c) => (
                <button key={c} onClick={() => { setCollege(c.startsWith("Skip") ? "" : c); setCollegeOpen(false); }} className={`w-full text-left px-4 py-2.5 text-[13px] border-b border-[#ff914d]/10 last:border-0 transition-colors hover:bg-[#FFE8A0]/40 ${college === c ? "bg-[#FFE8A0] font-bold text-[#9A5500]" : "text-[#3B1A00]"}`}>{c.startsWith("Skip") ? "⊘  Prefer not to say" : c}</button>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Break glass */}
      <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible" className="relative overflow-hidden rounded-[22px] border border-[#ff914d]/25 bg-gradient-to-b from-white to-[#FFE8A0]/60 p-5 card-shadow-sm">
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-2xl bg-[#5C2D00] flex items-center justify-center shrink-0"><Lock className="w-5 h-5 text-[#ffde59]" /></span>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[13.5px] font-bold text-[#5C2D00]">Break-glass emergency contact</p>
              <span className="text-[9px] font-bold uppercase tracking-[0.1em] bg-[#ff914d] text-white px-2 py-0.5 rounded-full">Encrypted</span>
            </div>
            <p className="text-[12px] text-[#6B4520] leading-relaxed mt-1.5">A trusted person's number, sealed on this device. It stays <span className="font-bold text-[#5C2D00]">encrypted & unread</span> — opened only if a high-risk trigger fires <span className="font-bold text-[#5C2D00]">and you consent</span> to unlock it.</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3.5 text-center">
          {["Sealed on device", "Needs your consent", "High-risk only"].map((s, i) => (
            <div key={s} className="bg-white/80 border border-[#ff914d]/20 rounded-xl px-1 py-2">
              <p className="text-[10px] font-bold text-[#9A5500] leading-tight">{["🔒", "✋", "🚨"][i]} {s}</p>
            </div>
          ))}
        </div>
        {!showPhone && !eSet && (
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setShowPhone(true)} className="mt-3.5 w-full flex items-center justify-center gap-2 bg-[#5C2D00] text-white font-bold text-[13.5px] py-3.5 rounded-2xl">
            <Phone className="w-4 h-4" /> Add a trusted phone number
          </motion.button>
        )}
        {showPhone && !eSet && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3.5 bg-white rounded-2xl border border-[#ff914d]/25 p-3.5">
            <p className="text-[11px] font-bold text-[#9A5500] uppercase tracking-wide">Trusted contact • +91</p>
            <div className="flex gap-2 mt-2">
              <input value={phoneDraft} onChange={(e) => { setPhoneDraft(e.target.value); if (phoneError) setPhoneError(""); }} inputMode="tel" placeholder="98XXX XXXXX" className="flex-1 bg-[#FFFDF5] border border-[#ff914d]/25 rounded-xl px-3 py-2.5 text-[14px] font-semibold outline-none focus:border-[#ff914d] transition-all" />
              <motion.button whileTap={{ scale: 0.95 }} onClick={savePhone} className="bg-[#ff914d] text-white text-[13px] font-bold px-4 rounded-xl">Seal 🔒</motion.button>
            </div>
            {phoneError && <p className="text-[11px] font-bold text-[#C0564B] mt-2">{phoneError}</p>}
            <p className="text-[11px] text-[#8A6B40] mt-2 flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Sealed with AES-256 (demo). SAHAY team cannot read it.</p>
          </motion.div>
        )}
        {eSet && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-3.5 bg-[#5C2D00] text-white rounded-2xl p-3.5 flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-[#ff914d] flex items-center justify-center"><Lock className="w-4 h-4 text-[#5C2D00]" /></span>
            <div className="flex-1">
              <p className="text-[13px] font-bold">Sealed • {masked}</p>
              <p className="text-[11px] text-white/70">Unlock needs high-risk trigger + your tap</p>
            </div>
            <button onClick={() => { setESet(false); setEPhone(""); setPhoneDraft(""); }} className="text-[11px] font-bold text-white/70 underline">Remove</button>
          </motion.div>
        )}
      </motion.div>

      {/* Consent */}
      <motion.div custom={5} variants={cardVariants} initial="hidden" animate="visible" onClick={() => setAgreed(!agreed)} className="flex gap-3 bg-white rounded-2xl border border-[#ff914d]/20 p-4 card-shadow-sm cursor-pointer card-hover">
        <motion.span animate={{ scale: agreed ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.3 }} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 ${agreed ? "bg-[#ff914d] border-[#ff914d]" : "border-[#EDD9A0]"}`}>{agreed && <Check className="w-4 h-4 text-white" />}</motion.span>
        <p className="text-[12px] text-[#6B4520] leading-relaxed">I understand SAHAY is <span className="font-bold text-[#5C2D00]">peer support + AI triage, not a diagnosis or therapy</span>. If I feel unsafe, I can tap SOS anytime for Tele-MANAS (14416).</p>
      </motion.div>

      <motion.button custom={6} variants={cardVariants} initial="hidden" animate="visible" whileHover={canContinue ? { scale: 1.02 } : {}} whileTap={canContinue ? { scale: 0.97 } : {}} disabled={!canContinue} onClick={onContinue} className={`w-full py-4 rounded-[20px] font-bold text-[15px] transition-all ${canContinue ? "mango-hero text-[#5C2D00] card-shadow animate-soft-pulse" : "bg-[#F7E8C0] text-[#B09A70]"}`}>
        {continueLabel}
      </motion.button>
      <p className="text-center text-[11px] text-[#8A6B40] pb-1">🔐 Nothing leaves this device with your identity • You can delete anytime</p>
    </div>
  );
}
