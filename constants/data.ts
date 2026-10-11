import type { Course, Exam, Faculty, Testimonial, BlogPost, Stat } from "@/types";

export const COURSES: Course[] = [
  {
    slug: "nda-foundation",
    title: "NDA Foundation Program",
    duration: "12 Months",
    mode: "Hybrid",
    level: "Foundation",
    description:
      "Complete preparation for National Defence Academy written exam, SSB interview and physical standards for class 11/12 aspirants.",
    features: ["Maths + GAT mastery", "Daily current affairs", "Weekly mocks", "Personalised SSB mentoring"],
    popular: true,
  },
  {
    slug: "cds-intensive",
    title: "CDS Intensive Batch",
    duration: "6 Months",
    mode: "Offline",
    level: "Advanced",
    description: "Targeted batch for graduates aiming at IMA, INA, AFA and OTA via the Combined Defence Services examination.",
    features: ["English + GK + Maths/Elementary Maths", "Sectional tests", "Essay & comprehension labs", "Interview module"],
  },
  {
    slug: "afcat-pro",
    title: "AFCAT Pro",
    duration: "4 Months",
    mode: "Online",
    level: "Intermediate",
    description: "Specialised crash course for the Air Force Common Admission Test with focus on speed, accuracy and AFSB.",
    features: ["Live doubt sessions", "EKT add-on", "Pilot aptitude drills", "AFSB ground series"],
    popular: true,
  },
  {
    slug: "ssb-interview",
    title: "SSB Interview Mastery",
    duration: "21 Days",
    mode: "Offline",
    level: "Advanced",
    description: "Full Services Selection Board simulation with psychologists, GTOs and interviewing officers — ex-defence panel.",
    features: ["Psych battery", "GTO ground tasks", "Personal interview drills", "Conference simulation"],
  },
  {
    slug: "agniveer-prep",
    title: "Agniveer Prep Track",
    duration: "3 Months",
    mode: "Hybrid",
    level: "Foundation",
    description: "Structured preparation for Agniveer Army, Navy and Air Force recruitment — written test, physical and medical guidance.",
    features: ["Subject-wise drills", "Physical training plan", "Mock medical briefings", "Trade-specific prep"],
  },
  {
    slug: "capf-officers",
    title: "CAPF AC (UPSC) Officers",
    duration: "8 Months",
    mode: "Hybrid",
    level: "Advanced",
    description: "Comprehensive program for UPSC's Central Armed Police Forces Assistant Commandant examination.",
    features: ["Paper I + Paper II", "Essay & precis", "Interview prep", "Physical efficiency module"],
  },
];

export const EXAMS: Exam[] = [
  { slug: "nda", name: "NDA & NA", full: "National Defence Academy & Naval Academy", branch: "Army · Navy · Air Force", description: "Entry-level exam for class 12 students aspiring to be officers in the Indian Armed Forces.", eligibility: "12th passed / appearing, unmarried, 16.5–19.5 yrs" },
  { slug: "cds", name: "CDS", full: "Combined Defence Services", branch: "IMA · INA · AFA · OTA", description: "UPSC examination for graduates seeking commission as officers across services.", eligibility: "Graduate, 19–25 yrs" },
  { slug: "afcat", name: "AFCAT", full: "Air Force Common Admission Test", branch: "Indian Air Force", description: "IAF's twice-yearly officer entry test for flying and ground duty branches.", eligibility: "Graduate, 20–24 yrs (Flying: ≤24)" },
  { slug: "ssb", name: "SSB Interview", full: "Services Selection Board", branch: "All Forces", description: "Five-day personality and intelligence assessment — the gateway to a commissioned career.", eligibility: "Cleared written stage of any defence exam" },
  { slug: "capf", name: "CAPF AC", full: "Central Armed Police Forces (Assistant Commandant)", branch: "BSF · CRPF · CISF · ITBP · SSB", description: "UPSC examination for direct entry as Assistant Commandant in CAPFs.", eligibility: "Graduate, 20–25 yrs" },
  { slug: "agniveer", name: "Agniveer", full: "Agnipath Scheme – Army / Navy / Air Force", branch: "All Forces (Other Ranks)", description: "Four-year tour-of-duty recruitment for soldiers, sailors and airmen.", eligibility: "10th / 12th depending on trade, 17.5–21 yrs" },
];

export const FACULTY: Faculty[] = [
  { id: "f1", name: "Col. Arvind Mehra (Retd.)", role: "Director & SSB Mentor", rank: "Indian Army", experience: "32+ yrs", specialization: "SSB Interview · Officer Like Qualities", initials: "AM" },
  { id: "f2", name: "Wg. Cdr. Priya Sharma (Retd.)", role: "AFCAT & EKT Lead", rank: "Indian Air Force", experience: "24 yrs", specialization: "Aviation Aptitude · Reasoning", initials: "PS" },
  { id: "f3", name: "Dr. Rakesh Iyer", role: "Mathematics Faculty", experience: "18 yrs", specialization: "NDA Maths · CDS Elementary Maths", initials: "RI" },
  { id: "f4", name: "Cdr. Suresh Nair (Retd.)", role: "Naval Strategy & GS", rank: "Indian Navy", experience: "27 yrs", specialization: "Defence Affairs · General Studies", initials: "SN" },
  { id: "f5", name: "Ms. Neha Kapoor", role: "English & Comprehension", experience: "12 yrs", specialization: "English Language · Essay Writing", initials: "NK" },
  { id: "f6", name: "Maj. Vikram Singh (Retd.)", role: "GTO & Ground Tasks", rank: "Indian Army", experience: "21 yrs", specialization: "GTO Tasks · Lecturette · Group Discussion", initials: "VS" },
];

export const TESTIMONIALS: Testimonial[] = [
  { id: "t1", name: "Lt. Aman Verma", achievement: "Recommended — IMA Dehradun", batch: "NDA-148", quote: "The SSB simulations at Afrin Defence Academy were so close to the real board that the actual interview felt familiar. The mentorship is in another league.", initials: "AV" },
  { id: "t2", name: "Flt. Cdt. Riya Sen", achievement: "AFCAT AIR 27", batch: "AFCAT 02/2024", quote: "Live doubt clearing till 11 PM, weekly mocks and brutally honest feedback — that's what cracked AFCAT for me on my first attempt.", initials: "RS" },
  { id: "t3", name: "Cadet Karan Joshi", achievement: "NDA 152 — AIR 84", batch: "NDA Foundation 2023", quote: "Two years of structure, discipline and the right peer group. I walked into the NDA written exam genuinely confident.", initials: "KJ" },
  { id: "t4", name: "SLt. Meera Pillai", achievement: "Commissioned — INA Ezhimala", batch: "CDS 1/2023", quote: "The faculty don't just teach — they've lived the life. Every class connected the syllabus to real service.", initials: "MP" },
  { id: "t5", name: "Asst. Cdt. Rohan Das", achievement: "CAPF AC 2023", batch: "CAPF Batch-7", quote: "The essay and interview labs gave me an edge I didn't expect. Highly recommended for serious aspirants.", initials: "RD" },
];

export const STATS: Stat[] = [
  { value: 12500, suffix: "+", label: "Aspirants trained" },
  { value: 3200, suffix: "+", label: "Officers commissioned" },
  { value: 97, suffix: "%", label: "SSB recommendation rate" },
  { value: 18, suffix: "+", label: "Years of excellence" },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "nda-2025-strategy",
    title: "NDA 2025: A month-by-month preparation strategy that actually works",
    excerpt: "From class 11 fundamentals to mock-test mastery, here's the timeline our top rankers actually followed.",
    content:
      "Cracking NDA is less about hours and more about a calibrated calendar. We break the year into four 90-day blocks: foundation, depth, integration and simulation. In the foundation block, focus exclusively on NCERT mathematics (Class 11 + 12) and build a daily 30-minute current affairs habit using a single newspaper plus a monthly compendium. The depth block introduces sectional drills: trigonometry, vectors, 3D geometry, statistics. By the integration block (months 7–9), you should be attempting full GAT papers weekly. The final block is pure simulation — timed full-length papers under exam conditions, with detailed analytics after each. Pair the academic work with a non-negotiable physical regimen: 5 km run, push-ups, pull-ups, and a 30-minute swim weekly.",
    category: "Strategy",
    author: "Col. Arvind Mehra (Retd.)",
    date: "2025-04-12",
    readingTime: "6 min read",
  },
  {
    slug: "ssb-officer-like-qualities",
    title: "The 15 Officer Like Qualities the SSB really tests",
    excerpt: "Beyond the buzzwords — how assessors actually evaluate effective intelligence, social adaptability and group influence.",
    content:
      "Officer Like Qualities (OLQs) are grouped into four factors: planning & organising, social adjustment, social effectiveness, and dynamic qualities. Most candidates parrot the 15 OLQs without understanding the underlying behaviour. Take 'Effective Intelligence' — it isn't IQ, it's the ability to find practical solutions under pressure. Or 'Liveliness' — it isn't being loud, it's bringing positive energy that lifts a group. The SSB is a 5-day continuous observation; every interaction with the wash-area orderly to your conduct in the dining hall is data. Train for OLQs the way you train for the written paper: deliberate, daily, measurable.",
    category: "SSB",
    author: "Maj. Vikram Singh (Retd.)",
    date: "2025-03-28",
    readingTime: "8 min read",
  },
  {
    slug: "afcat-pilot-aptitude",
    title: "Pilot Aptitude Battery Test (PABT): What to expect at AFSB",
    excerpt: "The dreaded PABT, decoded. Instrument battery, sensory motor apparatus and control velocity test explained.",
    content:
      "PABT is a one-shot test for flying branch aspirants. The Instrument Battery Test (IBT) checks your ability to read aircraft instruments and interpret aircraft position. The Sensory Motor Apparatus Test (SMAT) measures hand-eye-foot coordination under increasing complexity. The Control Velocity Test (CVT) tests anticipation and quick reactions. Practice with simulator apps is helpful but cannot replicate the cockpit-like setup at AFSB. Sleep well, eat light, and remember — PABT is pass/fail and only one attempt per lifetime.",
    category: "Air Force",
    author: "Wg. Cdr. Priya Sharma (Retd.)",
    date: "2025-03-10",
    readingTime: "5 min read",
  },
  {
    slug: "physical-fitness-defence",
    title: "Physical fitness for defence aspirants: the 12-week ground-up plan",
    excerpt: "A progressive programme designed for written-stage candidates with little prior training.",
    content:
      "Most aspirants underestimate the physical component. A structured 12-week plan: weeks 1–4 build aerobic base (3 km easy runs, 4x/week), weeks 5–8 introduce intervals and bodyweight strength (push-ups, pull-ups, planks), weeks 9–12 stack runs to 5 km at target pace and add obstacle simulation. Track everything. Sleep 7+ hours. Skip the supplements.",
    category: "Fitness",
    author: "Maj. Vikram Singh (Retd.)",
    date: "2025-02-20",
    readingTime: "5 min read",
  },
];

export const WHY_US = [
  { title: "Ex-Defence faculty", desc: "Officers from Army, Navy and Air Force — not theory, lived experience." },
  { title: "Proven results", desc: "3,200+ officers commissioned across NDA, CDS, AFCAT and CAPF." },
  { title: "SSB-grade infrastructure", desc: "Real GTO ground, psychology labs and conference rooms on campus." },
  { title: "Small batch sizes", desc: "Capped at 30 — every cadet gets personal mentorship." },
  { title: "Integrated school program", desc: "Class 11–12 academics + defence prep, single roof, single timetable." },
  { title: "Until-you-clear support", desc: "Repeat any module free until your final selection." },
];