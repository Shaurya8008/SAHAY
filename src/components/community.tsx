import { useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Fingerprint, Flag, Heart, Plus, Search, ShieldCheck } from "lucide-react";
import { COMMUNITY_POSTS } from "../lib/sahay-data";

export default function Community({ nickname, showToast }: { nickname: string; showToast?: (t: string) => void }) {
  const [posts, setPosts] = useState(COMMUNITY_POSTS);
  const [supported, setSupported] = useState<Record<number, boolean>>({});
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [composer, setComposer] = useState(false);
  const [reported, setReported] = useState<Record<number, boolean>>({});

  const filters = ["All", "Exam stress", "Homesickness", "Small win", "Placements"];
  const byTag = filter === "All" ? posts : posts.filter((p) => p.tag === filter);
  const q = query.trim().toLowerCase();
  const visible = q ? byTag.filter((p) => `${p.text} ${p.alias} ${p.tag}`.toLowerCase().includes(q)) : byTag;

  const toggleSupport = (id: number) => {
    const on = !supported[id];
    setSupported((s) => ({ ...s, [id]: on }));
    setPosts((list) => list.map((p) => (p.id === id ? { ...p, supports: p.supports + (on ? 1 : -1) } : p)));
  };

  const publish = () => {
    if (!draft.trim()) return;
    setPosts((list) => [{ id: Date.now(), alias: nickname || "You (anon)", tag: "Just shared", time: "Just now", text: draft.trim(), supports: 0, replies: 0, color: "#ff914d" }, ...list]);
    setDraft("");
    setComposer(false);
    setFilter("All");
    setQuery("");
    showToast?.("Posted anonymously! 🥭");
  };

  return (
    <div className="px-4 pt-4 pb-2 space-y-4">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[22px] p-4 card-shadow-sm border border-[#ff914d]/20">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#ff914d]" />
          <p className="text-[13px] font-bold text-[#5C2D00]">Moderated anonymous feed</p>
        </div>
        <p className="text-[12px] text-[#8A6B40] mt-1">Posting as <span className="font-bold text-[#9A5500]">{nickname || "Anonymous"}</span> • No real names • AI + human mods • Be kind.</p>
        <div className="flex gap-2 mt-3">
          <div className="flex-1 flex items-center gap-2 bg-[#FFFDF5] border border-[#ff914d]/20 rounded-2xl px-3 py-2.5">
            <Search className="w-4 h-4 text-[#B09A70]" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search kindness: sleep, exams…" className="bg-transparent outline-none text-[12.5px] w-full placeholder:text-[#B09A70]" />
          </div>
          <motion.button whileTap={{ scale: 0.9, rotate: 90 }} onClick={() => setComposer(!composer)} aria-label="New post" className="mango-hero text-[#5C2D00] rounded-2xl w-11 flex items-center justify-center shrink-0"><Plus className="w-5 h-5" /></motion.button>
        </div>
        {composer && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
            <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} placeholder="Share what's on your mind… kindness only 🥭" className="mt-3 w-full bg-[#FFFBEE] border border-[#ff914d]/25 rounded-2xl p-3 text-[13px] outline-none focus:border-[#ff914d] focus:ring-2 focus:ring-[#ff914d]/20 resize-none transition-all" />
            <div className="flex gap-2 mt-2">
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => setComposer(false)} className="flex-1 py-2.5 rounded-xl border border-[#ff914d]/30 text-[12px] font-bold text-[#9A5500]">Cancel</motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={publish} disabled={!draft.trim()} className={`flex-1 py-2.5 rounded-xl text-[12px] font-bold ${draft.trim() ? "mango-hero text-[#5C2D00]" : "bg-[#F7E8C0] text-[#B09A70]"}`}>Post anonymously</motion.button>
            </div>
          </motion.div>
        )}
        <div className="flex gap-1.5 mt-3 overflow-x-auto sahay-scroll">
          {filters.map((f) => (
            <motion.button whileTap={{ scale: 0.93 }} key={f} onClick={() => setFilter(f)} className={`shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all ${filter === f ? "bg-[#5C2D00] text-white border-[#5C2D00]" : "bg-white text-[#6B4520] border-[#ff914d]/25 hover:border-[#ff914d]"}`}>{f}</motion.button>
          ))}
        </div>
      </motion.div>

      {visible.map((p, idx) => (
        <motion.div key={p.id} initial={{ opacity: 0, y: 10, filter: "blur(3px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ delay: idx * 0.06, duration: 0.4 }} className="bg-white rounded-[20px] p-4 card-shadow-sm border border-[#ff914d]/15 card-hover">
          {p.pinned && <span className="text-[10px] font-bold uppercase tracking-wider text-[#D48A20] bg-[#FFF4DE] px-2 py-1 rounded-full">📌 Pinned by moderators</span>}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold" style={{ background: p.color }}>{p.alias[0]}</span>
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-bold text-[#5C2D00] flex items-center gap-1">{p.alias} <BadgeCheck className="w-3.5 h-3.5 text-[#ff914d]" /></p>
              <p className="text-[10.5px] text-[#B09A70]">{p.time} • {p.tag}</p>
            </div>
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => { setReported((r) => ({ ...r, [p.id]: true })); showToast?.("Reported — moderators will review 🙏"); }} className={`${reported[p.id] ? "text-[#ff914d]" : "text-[#E3CE8F]"} transition-colors`} aria-label="Report">
              <Flag className="w-4 h-4" />
            </motion.button>
          </div>
          <p className="text-[13px] text-[#3B1A00] leading-relaxed mt-2.5">{p.text}</p>
          {reported[p.id] && <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] font-semibold text-[#9A5500] bg-[#FFE8A0] rounded-xl px-3 py-2 mt-2">Thanks — moderators will review this within the hour. 🙏</motion.p>}
          <div className="flex items-center gap-2 mt-3">
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => toggleSupport(p.id)} className={`flex items-center gap-1.5 text-[11.5px] font-bold px-3.5 py-2 rounded-full border transition-all ${supported[p.id] ? "bg-[#ff914d] text-white border-[#ff914d]" : "bg-[#FFFDF5] text-[#9A5500] border-[#ff914d]/25"}`}>
              <motion.span animate={supported[p.id] ? { scale: [1, 1.4, 1] } : {}} transition={{ duration: 0.3 }}><Heart className={`w-3.5 h-3.5 ${supported[p.id] ? "fill-current" : ""}`} /></motion.span> {p.supports} supports
            </motion.button>
            <span className="text-[11.5px] font-semibold text-[#8A6B40]">💬 {p.replies}</span>
            <span className="ml-auto text-[10px] text-[#B09A70] flex items-center gap-1"><Fingerprint className="w-3 h-3" /> anonymous</span>
          </div>
        </motion.div>
      ))}
      {visible.length === 0 && (
        <div className="bg-white rounded-[20px] p-6 text-center card-shadow-sm border border-[#ff914d]/15">
          <p className="text-[26px]">🔍</p>
          <p className="text-[13px] font-bold text-[#5C2D00] mt-2">No posts match "{query}"</p>
          <p className="text-[12px] text-[#8A6B40] mt-1">Try another word — or be the first to share about it.</p>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setQuery(""); setFilter("All"); }} className="mt-3 text-[12px] font-bold text-[#9A5500] bg-[#FFFDF5] border border-[#ff914d]/25 px-4 py-2 rounded-full">Clear search</motion.button>
        </div>
      )}
      {visible.length > 0 && (
        <div className="bg-[#FFE8A0] rounded-[20px] p-4 flex gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#ff914d] shrink-0" />
          <p className="text-[12px] text-[#9A5500] leading-relaxed"><span className="font-bold">Safety net on every post:</span> AI pre-screens for self-harm language and instantly offers SOS + counsellor routing — no shaming, no bans for reaching out.</p>
        </div>
      )}
    </div>
  );
}
