import { AnimatePresence, motion } from "framer-motion";
import { HeartHandshake, PhoneCall, ShieldCheck, Siren, X, Volume2 } from "lucide-react";

export function TopBar({ nickname, anonId, onSOS }: { nickname: string; anonId: string; onSOS: () => void }) {
  return (
    <div className="sticky top-0 z-30 backdrop-blur-xl bg-[#FFFDF5]/90 border-b border-[#ff914d]/20">
      <div className="flex items-center gap-3 px-4 pt-3 pb-3">
        <motion.div whileHover={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 0.5 }} className="w-10 h-10 rounded-2xl mango-hero flex items-center justify-center shrink-0 card-shadow-sm">
          <HeartHandshake className="w-5 h-5 text-[#5C2D00]" />
        </motion.div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-display font-semibold text-[17px] leading-none text-[#5C2D00]">SAHAY</p>
            <span className="text-[9px] font-bold tracking-[0.12em] uppercase bg-[#ff914d]/15 text-[#9A5500] px-1.5 py-0.5 rounded-full">Anonymous</span>
          </div>
          <p className="text-[11px] text-[#6B4520] truncate mt-1">{nickname ? `${nickname} • ${anonId}` : "Safe, Anonymous, Campus Support"}</p>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onSOS} className="animate-sos flex items-center gap-1.5 bg-[#C0564B] text-white text-[12px] font-bold px-3.5 py-2.5 rounded-full">
          <Siren className="w-3.5 h-3.5" /> SOS
        </motion.button>
      </div>
    </div>
  );
}

export function BottomNav({ tab, setTab, onSOS }: { tab: string; setTab: (t: "home" | "community" | "resources") => void; onSOS: () => void }) {
  return (
    <div className="sticky bottom-0 z-30 px-3 pb-4 pt-2 bg-gradient-to-t from-[#FFFDF5] via-[#FFFDF5]/95 to-transparent">
      <div className="bg-white/95 backdrop-blur-xl border border-[#ff914d]/25 rounded-[26px] card-shadow px-2 py-2 flex items-center gap-1">
        <NavBtn active={tab === "home"} label="Home" onClick={() => setTab("home")} icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M9.5 21v-6h5v6" /></svg>} />
        <NavBtn active={tab === "community"} label="Community" onClick={() => setTab("community")} icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20c1.5-4 4.5-6 7.5-6s6 2 7.5 6" /></svg>} />
        <motion.button whileTap={{ scale: 0.9 }} onClick={onSOS} className="flex-1 flex flex-col items-center gap-0.5 py-1.5">
          <span className="w-12 h-9 rounded-2xl bg-[#C0564B] text-white flex items-center justify-center font-bold text-[13px] tracking-wide">SOS</span>
          <span className="text-[10px] font-semibold text-[#C0564B]">Emergency</span>
        </motion.button>
        <NavBtn active={tab === "resources"} label="Resources" onClick={() => setTab("resources")} icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h13" /></svg>} />
      </div>
    </div>
  );
}

function NavBtn({ active, label, icon, onClick }: any) {
  return (
    <motion.button whileTap={{ scale: 0.92 }} onClick={onClick} className="flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-2xl">
      <span className={`w-12 h-9 rounded-2xl flex items-center justify-center transition-all ${active ? "mango-hero text-[#5C2D00] card-shadow-sm animate-glow-pulse" : "text-[#6B4520]"}`}>{icon}</span>
      <span className={`text-[10px] font-semibold ${active ? "text-[#9A5500]" : "text-[#8A6B40]"}`}>{label}</span>
    </motion.button>
  );
}

export function SOSSheet({ open, onClose, nickname }: { open: boolean; onClose: () => void; nickname: string }) {
  return (
    <AnimatePresence>
      {open && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#5C2D00]/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={onClose}>
        <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} transition={{ type: "spring", damping: 22, stiffness: 280 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-[430px] bg-[#FFFFF4] rounded-t-[28px] sm:rounded-[28px] overflow-hidden max-h-[92vh] overflow-y-auto sahay-scroll">
          <div className="bg-[#C0564B] px-5 pt-5 pb-6 text-white relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
            <div className="absolute right-8 top-10 w-20 h-20 rounded-full bg-white/10" />
            <button onClick={onClose} className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><X className="w-4 h-4" /></button>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/85"><Siren className="w-4 h-4" /> Crisis support • 24×7</div>
            <h3 className="font-display text-[26px] leading-tight font-semibold mt-2">You matter, {nickname || "friend"}.<br />Help is right here.</h3>
            <p className="text-[13px] text-white/90 mt-2 leading-relaxed">If you feel unsafe right now, you don't have to face it alone. These lines are free, confidential, and answered by trained humans.</p>
          </div>
          <div className="p-5 space-y-3 -mt-3">
            <a href="tel:14416" className="block mango-hero rounded-2xl p-4 card-shadow-sm card-hover">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-2xl bg-[#5C2D00]/10 flex items-center justify-center"><PhoneCall className="w-5 h-5 text-[#5C2D00]" /></span>
                <div className="flex-1">
                  <p className="font-bold text-[15px] text-[#5C2D00]">Call Tele-MANAS • 14416</p>
                  <p className="text-[12px] text-[#5C2D00]/70">Govt. of India • Free • 20+ languages • 24×7</p>
                </div>
                <span className="text-[12px] font-bold bg-[#5C2D00] text-[#ffde59] px-3 py-2 rounded-full">Call now</span>
              </div>
            </a>
            <a href="tel:18005990019" className="block bg-white border border-[#ff914d]/25 rounded-2xl p-4 card-shadow-sm card-hover">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-2xl bg-[#FFE8A0] flex items-center justify-center"><Volume2 className="w-5 h-5 text-[#9A5500]" /></span>
                <div className="flex-1">
                  <p className="font-bold text-[14px] text-[#5C2D00]">KIRAN Helpline • 1800-599-0019</p>
                  <p className="text-[12px] text-[#6B4520]">Ministry of Social Justice • 24×7 • Hindi & English</p>
                </div>
              </div>
            </a>
            <div className="bg-[#FFE8A0] rounded-2xl p-4 flex gap-3">
              <ShieldCheck className="w-5 h-5 text-[#9A5500] shrink-0 mt-0.5" />
              <p className="text-[12px] leading-relaxed text-[#9A5500]"><span className="font-bold">You're still anonymous.</span> Calling a helpline does not reveal your SAHAY nickname, college, or chat to anyone — unless you choose to share it.</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <motion.button whileTap={{ scale: 0.96 }} onClick={onClose} className="bg-white border border-[#ff914d]/30 text-[#9A5500] font-bold text-[13px] py-3 rounded-2xl">I feel safer now</motion.button>
              <motion.a whileTap={{ scale: 0.96 }} href="tel:14416" className="bg-[#5C2D00] text-white font-bold text-[13px] py-3 rounded-2xl text-center block">Stay on line with me</motion.a>
            </div>
            <p className="text-center text-[11px] text-[#8A6B40] pb-2">If there is immediate physical danger, please call <a className="underline font-bold" href="tel:112">112</a> (Emergency Response).</p>
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
