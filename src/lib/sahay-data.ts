export const COLLEGES = [
  "IIT Bombay",
  "IIT Delhi",
  "IIT Madras",
  "NIT Trichy",
  "NIT Surathkal",
  "BITS Pilani",
  "IIIT Hyderabad",
  "Delhi University — Miranda House",
  "St. Stephen's College, Delhi",
  "Christ University, Bengaluru",
  "Symbiosis, Pune",
  "Jadavpur University, Kolkata",
  "Banaras Hindu University",
  "Ashoka University",
  "Manipal Institute of Technology",
  "VIT Vellore",
  "Prefer not to say",
];

export const NICKNAME_IDEAS = [
  "Quiet Banyan",
  "Monsoon Fox",
  "Gentle Peacock",
  "Calm Diya",
  "Mist Sparrow",
  "Soft Lotus",
  "Kind River",
  "Brave Chai",
  "Sleepy Mango",
  "Hopeful Kite",
];

export interface TriageQ {
  id: string;
  tag: string;
  text: string;
  followup: string;
}

export const TRIAGE_QUESTIONS: TriageQ[] = [
  { id: "phq1", tag: "Mood", text: "Over the last 2 weeks, how often have you felt down, low, or hopeless — like the light went a little dim?", followup: "Thank you for trusting me with that. I'm listening." },
  { id: "phq2", tag: "Interest", text: "How often have you lost interest or pleasure in things you usually enjoy — friends, studies, music, food?", followup: "That makes sense, and it matters that you noticed it." },
  { id: "gad1", tag: "Worry", text: "How often have you felt nervous, anxious, or on edge — mind racing before exams or at night?", followup: "Worry can be exhausting. You're doing well by naming it." },
  { id: "gad2", tag: "Control", text: "How often have you found it hard to stop or control worrying, even when you try to rest?", followup: "Noted with care. Two more gentle checks." },
  { id: "phq3", tag: "Energy", text: "How often have sleep, energy, or appetite felt off — too much, too little, or restless?", followup: "Body signals are important clues. Thank you." },
  { id: "risk", tag: "Safety", text: "Last one, and asked with great care: have you had thoughts of harming yourself or feeling you'd be better off not here?", followup: "Thank you for answering honestly. Your safety comes first, always." },
];

export const ANSWER_OPTIONS = [
  { label: "Not at all", score: 0, hint: "0 days" },
  { label: "Several days", score: 1, hint: "1–6 days" },
  { label: "More than half", score: 2, hint: "7–11 days" },
  { label: "Nearly every day", score: 3, hint: "12–14 days" },
];

export const MOODS = [
  { value: 1, emoji: "\uD83D\uDE1E", label: "Very low", desc: "Heavy, drained, struggling", color: "#C0564B" },
  { value: 2, emoji: "\uD83D\uDE1F", label: "Low", desc: "A bit flat, uneasy", color: "#D08A3E" },
  { value: 3, emoji: "\uD83D\uDE10", label: "Okay", desc: "Steady, getting by", color: "#C99A2E" },
  { value: 4, emoji: "\uD83D\uDE42", label: "Good", desc: "Lighter, hopeful", color: "#E8930C" },
  { value: 5, emoji: "\uD83D\uDE0A", label: "Bright", desc: "Energised, at ease", color: "#7A4A00" },
];

export interface CommunityPost {
  id: number;
  alias: string;
  tag: string;
  time: string;
  text: string;
  supports: number;
  replies: number;
  color: string;
  pinned?: boolean;
}

export const COMMUNITY_POSTS: CommunityPost[] = [
  { id: 1, alias: "Soft Lotus", tag: "Exam stress", time: "12 min ago", text: "Semester exams in 2 weeks and my sleep cycle is upside down. What small thing helped you reset? Trying a 10-min walk today.", supports: 42, replies: 9, color: "#E8930C", pinned: true },
  { id: 2, alias: "Mist Sparrow", tag: "Homesickness", time: "48 min ago", text: "First year, hostel room feels quiet at night. Called home yesterday and felt better. Anyone else navigating this?", supports: 35, replies: 14, color: "#C98A1B" },
  { id: 3, alias: "Kind River", tag: "Small win", time: "2 hrs ago", text: "Did the 4-7-8 breathing before my viva and it genuinely helped. Sharing in case someone needs it today. You\u2019ve got this.", supports: 58, replies: 6, color: "#8A5A00" },
  { id: 4, alias: "Hopeful Kite", tag: "Placements", time: "5 hrs ago", text: "Rejected after 3rd round. Feeling low but reminding myself it\u2019s data, not destiny. How do you bounce back?", supports: 27, replies: 11, color: "#96705B" },
];

export const RESOURCES = [
  { id: 1, title: "4-7-8 Calm Breathing", cat: "Anxiety tool", dur: "2 min", icon: "breath", desc: "A guided reset used before exams and viva. Slows heart rate in under two minutes.", lang: "EN • HI" },
  { id: 2, title: "Grounding: 5-4-3-2-1", cat: "Anxiety tool", dur: "4 min", icon: "ground", desc: "Name what you see, hear and feel. Pulls a racing mind back to this room." , lang: "EN • HI • TA"},
  { id: 3, title: "Sleep reset for hostels", cat: "Sleep", dur: "6 min", icon: "sleep", desc: "Light, sound and screen habits that work in shared rooms and late-night blocks.", lang: "EN • HI" },
  { id: 4, title: "Exam pressure toolkit", cat: "Study stress", dur: "8 min", icon: "study", desc: "Pomodoro-with-kindness plan + what to do the night before a paper.", lang: "EN" },
  { id: 5, title: "Talking to family about stress", cat: "Relationships", dur: "5 min", icon: "family", desc: "Scripts in Hindi & English to explain pressure without alarming parents.", lang: "HI • EN" },
  { id: 6, title: "Understanding Tele-MANAS", cat: "Crisis info", dur: "3 min", icon: "phone", desc: "What happens when you call 14416. Free, confidential, 24x7, 20+ languages.", lang: "20+ languages" },
];
