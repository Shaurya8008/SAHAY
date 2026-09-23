import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ChevronDown, Clock, Languages, Moon, PhoneCall, Users, Wind } from "lucide-react";
import { RESOURCES } from "../lib/sahay-data";

const ICONS: Record<string, any> = {
  breath: <Wind className="w-5 h-5" />,
  ground: <BookOpen className="w-5 h-5" />,
  sleep: <Moon className="w-5 h-5" />,
  study: <Clock className="w-5 h-5" />,
  family: <Users className="w-5 h-5" />,
  phone: <PhoneCall className="w-5 h-5" />,
};

export default function Resources({ onSOS, showToast }: { onSOS: () => void; showToast?: (t: string) => void }) {
  const [open, setOpen] = useState<number | null>(1);
  const [playing, setPlaying] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [saved, setSaved] = useState<Record<number, boolean>>({ 1: true, 3: true });
  const [offline, setOffline] = useState<Record<number, boolean>>({ 4: true });
  const [filter, setFilter] = useState("All");
  const cats = ["All", "Anxiety tool", "Sleep", "Study stress", "Relationships", "Crisis info"];
  const visible = filter === "All" ? RESOURCES : RESOURCES.filter((r) => r.cat === filter);

  const toggleOffline = (id: number) => {
    const next = !offline[id];
    setOffline({ ...offline, [id]: next });
    showToast?.(next ? "Saved for offline access ✓ 📱" : "Removed from offline pack");
  };

  const toggleSave = (id: number) => {
    const next = !saved[id];
    setSaved({ ...saved, [id]: next });
    showToast?.(next ? "Bookmarked! 🔖" : "Bookmark removed");
  };

  const handlePlay = (id: number) => {
    if (playing === id) {
      setPlaying(null);
      audioRef.current?.pause();
    } else {
      setPlaying(id);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    }
  };

  return (
    <div className="px-4 pt-4 pb-2 space-y-4">
      <audio ref={audioRef} src="/calm.ogg" loop />
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[24px] mango-ink text-white p-5 card-shadow">
        <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-[#ffde59]/25" />
        <div className="absolute right-16 bottom-[-40px] w-24 h-24 rounded-full bg-[#ffde59]/15" />
        <div className="absolute left-4 bottom-3 text-[30px] opacity-25 animate-floaty">🥭</div>
        {/* Floating particles */}
        <div className="absolute left-20 top-4 w-2 h-2 rounded-full bg-[#ffde59]/40 animate-float-particle" />
        <div className="absolute right-12 top-16 w-3 h-3 rounded-full bg-[#ff914d]/30 animate-float-particle" style={{ animationDelay: "2s" }} />
        <div className="relative">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#FFD97A]">Wellness library • Clinically reviewed</p>
          <h2 className="font-display text-[22px] font-semibold leading-snug mt-1">Tools that fit between<br />lectures & hostel life</h2>
          <div className="flex items-center gap-1.5 mt-2.5 text-[11px] font-semibold text-white/80"><Languages className="w-3.5 h-3.5" /> Hindi • English • Tamil • Bengali + more</div>
        </div>
      </motion.div>

      <div className="flex gap-1.5 overflow-x-auto sahay-scroll">
        {cats.map((c) => (
          <motion.button whileTap={{ scale: 0.93 }} key={c} onClick={() => setFilter(c)} className={`shrink-0 text-[11px] font-bold px-3 py-2 rounded-full border transition-all ${filter === c ? "mango-hero text-[#5C2D00] border-transparent" : "bg-white text-[#6B4520] border-[#ff914d]/25 hover:border-[#ff914d]"}`}>{c}</motion.button>
        ))}
      </div>

      {visible.map((r, idx) => (
        <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }} className="bg-white rounded-[20px] card-shadow-sm border border-[#ff914d]/15 overflow-hidden card-hover">
          <button onClick={() => setOpen(open === r.id ? null : r.id)} className="w-full flex items-center gap-3 p-4 text-left">
            <span className="w-11 h-11 rounded-2xl bg-[#FFE8A0] text-[#9A5500] flex items-center justify-center shrink-0">{ICONS[r.icon]}</span>
            <span className="flex-1 min-w-0">
              <span className="block text-[13.5px] font-bold text-[#5C2D00] leading-tight">{r.title}</span>
              <span className="block text-[11px] text-[#8A6B40] mt-0.5">{r.cat} • {r.dur} • {r.lang}</span>
            </span>
            {/* FIX: Bookmark now gives toast feedback */}
            <motion.button whileTap={{ scale: 0.8 }} onClick={(e) => { e.stopPropagation(); toggleSave(r.id); }} aria-label="Save resource" className={`text-[16px] shrink-0 transition-all ${saved[r.id] ? "" : "grayscale opacity-40"}`}>🔖</motion.button>
            <ChevronDown className={`w-4 h-4 text-[#ff914d] shrink-0 transition ${open === r.id ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {open === r.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: "easeInOut" }} className="overflow-hidden">
                <div className="px-4 pb-4">
                  <p className="text-[12.5px] text-[#6B4520] leading-relaxed bg-[#FFFBEE] rounded-2xl p-3 border border-[#ff914d]/10">{r.desc}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2.5">
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => handlePlay(r.id)} className="py-2.5 rounded-xl mango-hero text-[#5C2D00] text-[12px] font-bold">{playing === r.id ? "⏸ Pause preview" : "▶ Start now"}</motion.button>
                    {/* FIX: Offline toggle now shows toast feedback */}
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => toggleOffline(r.id)} className="py-2.5 rounded-xl border border-[#ff914d]/30 text-[12px] font-bold text-[#9A5500]">{offline[r.id] ? "✓ Saved offline" : "⬇ Offline pack"}</motion.button>
                  </div>
                  {playing === r.id && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-2.5 bg-[#FFE8A0] rounded-xl px-3 py-2.5 flex items-center gap-2.5">
                      <span className="flex gap-1 items-center">{[0, 1, 2, 3].map((b) => <motion.span key={b} animate={{ scaleY: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: b * 0.15 }} className="w-1 h-4 rounded-full bg-[#ff914d]" />)}</span>
                      <p className="text-[11px] font-bold text-[#9A5500]">Playing {r.dur} preview • {r.lang}</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
      {visible.length === 0 && (
        <div className="bg-white rounded-[20px] p-6 text-center card-shadow-sm border border-[#ff914d]/15">
          <p className="text-[13px] font-bold text-[#5C2D00]">Nothing in "{filter}" yet</p>
          <p className="text-[12px] text-[#8A6B40] mt-1">Try another shelf of the library.</p>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setFilter("All")} className="mt-3 text-[12px] font-bold mango-hero text-[#5C2D00] px-4 py-2 rounded-full">Show everything</motion.button>
        </div>
      )}

      <div className="rounded-[22px] bg-[#FFF7E6] border border-[#E9B44C]/40 p-4">
        <p className="text-[13px] font-bold text-[#6B4E12]">Need a human right now?</p>
        <p className="text-[12px] text-[#7A5A1E] mt-0.5">Free • Confidential • 24×7 • No name needed on call.</p>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <motion.a whileTap={{ scale: 0.95 }} href="tel:14416" className="bg-[#5C2D00] text-white text-center text-[12.5px] font-bold py-3 rounded-2xl block">Call 14416</motion.a>
          <motion.button whileTap={{ scale: 0.95 }} onClick={onSOS} className="bg-white border border-[#D48A20]/40 text-[#6B4E12] text-[12.5px] font-bold py-3 rounded-2xl">All helplines</motion.button>
        </div>
      </div>
    </div>
  );
}
