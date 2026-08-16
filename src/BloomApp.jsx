
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  MessageCircle,
  X,
  Send,
  Leaf,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Baby,
  Droplet,
} from "lucide-react";
import * as THREE from "three";

/* ------------------------------------------------------------------ */
/*  CONTENT — 9 month nutrition data                                   */
/* ------------------------------------------------------------------ */

const MONTHS = [
  {
    month: 1,
    weeks: "Weeks 1–4",
    title: "Foundations",
    focus: "Folate and balanced meals — the neural tube forms very early.",
    foods: [
      "Spinach, kale, broccoli",
      "Lentils, beans, chickpeas",
      "Avocado",
      "Oranges and other fruits",
      "Eggs",
      "Pasteurized milk & yogurt",
      "Whole grains like oats",
    ],
    tip: "Folic acid / folate is especially important now — the baby's neural tube develops in these first weeks.",
  },
  {
    month: 2,
    weeks: "Weeks 5–8",
    title: "Building Blocks",
    focus: "Keep up folate, and start adding plenty of protein.",
    foods: [
      "Eggs",
      "Chicken, well-cooked meat",
      "Lentils and beans",
      "Fish low in mercury",
      "Milk, yogurt, cheese",
      "Fruits and vegetables",
      "Whole grains",
    ],
    tip: "If nausea shows up, smaller, more frequent meals are often easier to manage.",
  },
  {
    month: 3,
    weeks: "Weeks 9–13",
    title: "Absorption",
    focus: "Protein, iron, and vitamin C work together this month.",
    foods: [
      "Lean beef or well-cooked meat",
      "Lentils / beans",
      "Eggs",
      "Spinach and leafy greens",
      "Oranges, mangoes, tomatoes",
      "Whole grains",
      "Nuts and seeds",
    ],
    tip: "Pairing iron-rich foods with vitamin C helps the body absorb the iron more effectively.",
  },
  {
    month: 4,
    weeks: "Weeks 14–17",
    title: "Acceleration",
    focus: "The baby's growth speeds up — steady nutrition matters.",
    foods: [
      "Eggs",
      "Low-mercury fish",
      "Beans and lentils",
      "Chicken",
      "Milk / yogurt",
      "Vegetables",
      "Bananas and other fruits",
      "Oats, whole-grain bread",
    ],
    tip: "Consistency across meals supports this faster growth phase.",
  },
  {
    month: 5,
    weeks: "Weeks 18–22",
    title: "Structure",
    focus: "Protein, calcium, iron, and omega-3 fats.",
    foods: [
      "Low-mercury fish like salmon",
      "Eggs",
      "Milk / yogurt",
      "Beans and lentils",
      "Leafy vegetables",
      "Nuts and seeds",
      "Whole grains",
      "Fruits",
    ],
    tip: "Calcium is particularly important now for the baby's developing bones and teeth.",
  },
  {
    month: 6,
    weeks: "Weeks 23–27",
    title: "Steady State",
    focus: "Stay the course with a balanced, varied diet.",
    foods: [
      "Fish low in mercury",
      "Eggs",
      "Chicken / meat",
      "Lentils and beans",
      "Milk / yogurt",
      "Leafy vegetables",
      "Fruits",
      "Whole grains",
      "Nuts",
    ],
    tip: "Keep drinking enough safe, clean water throughout the day.",
  },
  {
    month: 7,
    weeks: "Weeks 28–31",
    title: "Third Trimester",
    focus: "Nutrient-dense foods matter more as the third trimester begins.",
    foods: [
      "Lean meat",
      "Eggs",
      "Low-mercury fish",
      "Lentils / beans",
      "Dairy or calcium-fortified alternatives",
      "Vegetables",
      "Fruits",
      "Whole grains",
      "Nuts / seeds",
    ],
    tip: "Iron becomes especially important as blood volume keeps increasing.",
  },
  {
    month: 8,
    weeks: "Weeks 32–35",
    title: "Sustaining",
    focus: "Same solid pattern — protein and iron at the center.",
    foods: [
      "Protein at every meal",
      "Iron-rich foods",
      "Calcium-rich foods",
      "Fruits and vegetables",
      "Whole grains",
      "Low-mercury fish",
      "Plenty of fluids",
    ],
    tip: "If constipation shows up, fiber-rich foods — oats, vegetables, fruit, beans, whole grains — can help.",
  },
  {
    month: 9,
    weeks: "Weeks 36–40",
    title: "Almost There",
    focus: "Keep meals balanced. Nothing in food safely 'starts' labor.",
    foods: [
      "Eggs and other protein",
      "Well-cooked meat / chicken",
      "Low-mercury fish",
      "Beans / lentils",
      "Vegetables",
      "Fruits",
      "Whole grains",
      "Milk / yogurt",
      "Nuts and seeds",
    ],
    tip: "There's no special food that guarantees or safely triggers labor — steady, balanced eating still matters most.",
  },
];

const AVOID = [
  "Raw or undercooked meat, eggs, and fish",
  "Unpasteurized milk or cheese",
  "High-mercury fish",
  "Raw shellfish",
  "Alcohol",
  "Excessive caffeine",
  "Unwashed fruits and vegetables",
  "Improperly stored foods",
];

/* ------------------------------------------------------------------ */
/*  3D — Growth Orb, built with plain three.js (no @react-three/*)     */
/* ------------------------------------------------------------------ */

function monthColorObj(month) {
  const c1 = new THREE.Color("#8D7FC0"); // violet — early
  const c2 = new THREE.Color("#F0A585"); // peach — late
  const t = (month - 1) / 8;
  return c1.clone().lerp(c2, t);
}

function ThreeBackground({ month }) {
  const mountRef = useRef(null);
  const monthRef = useRef(month);

  useEffect(() => {
    monthRef.current = month;
  }, [month]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth || window.innerWidth;
    let height = mount.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // lights
    scene.add(new THREE.AmbientLight(0xb9a0d4, 0.6));
    const spot = new THREE.SpotLight(0xf0a585, 3.2, 0, 0.5, 1, 1);
    spot.position.set(4, 5, 5);
    scene.add(spot);
    const point = new THREE.PointLight(0x8d7fc0, 1.1);
    point.position.set(-4, -3, -4);
    scene.add(point);

    // core organic blob
    const geometry = new THREE.IcosahedronGeometry(1, 3);
    const basePositions = geometry.attributes.position.array.slice();
    const initialColor = monthColorObj(monthRef.current);
    const material = new THREE.MeshStandardMaterial({
      color: initialColor.clone(),
      emissive: initialColor.clone(),
      emissiveIntensity: 0.28,
      roughness: 0.3,
      metalness: 0.15,
    });
    const coreMesh = new THREE.Mesh(geometry, material);
    scene.add(coreMesh);

    // particle field, rebuilt whenever the month changes
    let particles = null;
    function buildParticles(m) {
      if (particles) {
        scene.remove(particles);
        particles.geometry.dispose();
        particles.material.dispose();
      }
      const count = 260 + m * 90;
      const positions = new Float32Array(count * 3);
      const radius = 1.9 + m * 0.06;
      for (let i = 0; i < count; i++) {
        const phi = Math.acos(2 * Math.random() - 1);
        const theta = Math.random() * Math.PI * 2;
        const r = radius * (0.85 + Math.random() * 0.3);
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        size: 0.035,
        color: monthColorObj(m),
        transparent: true,
        opacity: 0.75,
        sizeAttenuation: true,
      });
      particles = new THREE.Points(geo, mat);
      scene.add(particles);
    }
    buildParticles(monthRef.current);

    const mouse = { x: 0, y: 0 };
    function handlePointerMove(e) {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    }
    window.addEventListener("pointermove", handlePointerMove);

    function handleResize() {
      if (!mount) return;
      width = mount.clientWidth || window.innerWidth;
      height = mount.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener("resize", handleResize);

    let lastMonth = monthRef.current;
    let frameId;
    const clock = new THREE.Clock();
    const tmpScale = new THREE.Vector3();
    const posAttr = geometry.attributes.position;

    function animate() {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const m = monthRef.current;

      if (m !== lastMonth) {
        buildParticles(m);
        lastMonth = m;
      }

      const targetColor = monthColorObj(m);
      material.color.lerp(targetColor, 0.05);
      material.emissive.lerp(targetColor, 0.05);
      if (particles) particles.material.color.lerp(targetColor, 0.05);

      const targetScale = 0.85 + m * 0.045;
      tmpScale.set(targetScale, targetScale, targetScale);
      coreMesh.scale.lerp(tmpScale, 0.04);

      // organic wobble, derived from each vertex's original position
      for (let i = 0; i < posAttr.count; i++) {
        const ix = i * 3;
        const bx = basePositions[ix];
        const by = basePositions[ix + 1];
        const bz = basePositions[ix + 2];
        const noise =
          Math.sin(bx * 1.5 + t * 0.6) *
          Math.cos(by * 1.3 + t * 0.4) *
          Math.sin(bz * 1.7 + t * 0.5);
        const len = Math.sqrt(bx * bx + by * by + bz * bz) || 1;
        const amp = 0.12 * noise;
        posAttr.array[ix] = bx + (bx / len) * amp;
        posAttr.array[ix + 1] = by + (by / len) * amp;
        posAttr.array[ix + 2] = bz + (bz / len) * amp;
      }
      posAttr.needsUpdate = true;
      geometry.computeVertexNormals();

      coreMesh.rotation.y += (mouse.x * 0.6 - coreMesh.rotation.y) * 0.03;
      coreMesh.rotation.x += (mouse.y * 0.3 - coreMesh.rotation.x) * 0.03;
      if (particles) {
        particles.rotation.y += 0.0009;
        particles.rotation.x += 0.0003;
      }

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      if (particles) {
        particles.geometry.dispose();
        particles.material.dispose();
      }
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
}

/* ------------------------------------------------------------------ */
/*  AI CHAT PANEL                                                       */
/* ------------------------------------------------------------------ */

const SYSTEM_PROMPT = `You are the in-app companion for "Bloom", a pregnancy nutrition guide.
You answer general questions about pregnancy nutrition and food safety, grounded in mainstream,
widely-accepted guidance (folate, protein, iron, calcium, avoiding raw/undercooked foods, high-mercury
fish, unpasteurized dairy, alcohol, excess caffeine). Keep answers short, warm, and practical.
You are not a doctor. For anything symptom-specific, medication-related, or that sounds urgent,
clearly tell the person to contact their midwife, OB, or doctor. Never diagnose. Never give dosages
for supplements or medication beyond noting to check with their provider.`;

function ChatPanel({ open, onClose, activeMonth }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi — I can help with general pregnancy nutrition questions. I'm not a substitute for your midwife or doctor, so for anything urgent or symptom-specific, please reach out to them directly. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const nextMessages = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      // Calls our own serverless proxy (api/chat.js) — never call
      // api.anthropic.com directly from the browser, since that would
      // require exposing a real API key in frontend code.
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: `${SYSTEM_PROMPT}\nThe user is currently viewing month ${activeMonth} of the guide.`,
          messages: nextMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }
      const textBlock = (data.content || [])
        .map((b) => (b.type === "text" ? b.text : ""))
        .filter(Boolean)
        .join("\n");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            textBlock ||
            "Sorry, I couldn't put together an answer just now — could you try rephrasing?",
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Something went wrong reaching the assistant. Please try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-24 right-4 sm:right-8 z-30 w-[92vw] max-w-sm h-[70vh] max-h-[560px] rounded-2xl border border-white/10 bg-[#15121F]/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-[#F0A585]" />
              <span className="font-medium text-sm text-[#F3EDE7] tracking-wide">
                Bloom Companion
              </span>
            </div>
            <button
              onClick={onClose}
              aria-label="Close chat"
              className="text-[#9B93AA] hover:text-[#F3EDE7] transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#F0A585] text-[#1a1420]"
                      : "bg-white/5 text-[#F3EDE7] border border-white/10"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-[#9B93AA]">
                  Thinking…
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-white/10 flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about this month's foods…"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#F3EDE7] placeholder-[#6f6884] outline-none focus:border-[#F0A585]/60 focus:ring-1 focus:ring-[#F0A585]/40"
            />
            <button
              onClick={send}
              disabled={loading}
              aria-label="Send message"
              className="rounded-lg bg-[#F0A585] text-[#1a1420] p-2 disabled:opacity-50 hover:brightness-110 transition"
            >
              <Send size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN APP                                                            */
/* ------------------------------------------------------------------ */

export default function BloomApp() {
  const [activeMonth, setActiveMonth] = useState(1);
  const [chatOpen, setChatOpen] = useState(false);
  const data = MONTHS[activeMonth - 1];

  return (
    <div className="relative min-h-screen w-full bg-[#0B0A12] text-[#F3EDE7] overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300..700;1,300..700&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'Space Mono', monospace; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: rgba(240,165,133,0.3); border-radius: 8px; }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }
        }
      `}</style>

      {/* Fixed WebGL background */}
      <div className="fixed inset-0 z-0">
        <ThreeBackground month={activeMonth} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0A12]/20 via-transparent to-[#0B0A12] pointer-events-none" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-6">
        <div className="flex items-center gap-2 font-body">
          <Baby size={20} className="text-[#F0A585]" />
          <span className="font-display text-xl tracking-wide">Bloom</span>
        </div>
        <span className="font-mono text-xs text-[#9B93AA] hidden sm:block">
          a nutrition companion for nine months
        </span>
      </header>

      {/* Hero */}
      <section className="relative z-10 px-6 sm:px-10 pt-6 pb-16 flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-[#F0A585] mb-4"
        >
          {data.weeks}
        </motion.span>
        <motion.h1
          key={activeMonth}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display text-5xl sm:text-7xl font-light leading-none"
        >
          Month {activeMonth}
        </motion.h1>
        <motion.p
          key={data.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-body text-[#C9BFD6] mt-3 max-w-md"
        >
          {data.focus}
        </motion.p>
      </section>

      {/* Month timeline */}
      <section className="relative z-10 px-4 sm:px-10 mb-10">
        <div className="flex items-center gap-2 max-w-3xl mx-auto overflow-x-auto pb-2 justify-center">
          {MONTHS.map((m) => (
            <button
              key={m.month}
              onClick={() => setActiveMonth(m.month)}
              className={`relative shrink-0 w-11 h-11 rounded-full font-mono text-sm transition-all duration-300 border ${
                activeMonth === m.month
                  ? "bg-[#F0A585] text-[#1a1420] border-[#F0A585] scale-110"
                  : "border-white/15 text-[#9B93AA] hover:border-[#F0A585]/50 hover:text-[#F3EDE7]"
              }`}
              aria-label={`Month ${m.month}`}
              aria-current={activeMonth === m.month}
            >
              {m.month}
            </button>
          ))}
        </div>
        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={() => setActiveMonth((m) => Math.max(1, m - 1))}
            className="flex items-center gap-1 text-xs font-mono text-[#9B93AA] hover:text-[#F3EDE7] transition disabled:opacity-30"
            disabled={activeMonth === 1}
          >
            <ChevronLeft size={14} /> prev
          </button>
          <button
            onClick={() => setActiveMonth((m) => Math.min(9, m + 1))}
            className="flex items-center gap-1 text-xs font-mono text-[#9B93AA] hover:text-[#F3EDE7] transition disabled:opacity-30"
            disabled={activeMonth === 9}
          >
            next <ChevronRight size={14} />
          </button>
        </div>
      </section>

      {/* Content: foods + tip */}
      <main className="relative z-10 px-6 sm:px-10 pb-24 max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMonth}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="grid sm:grid-cols-2 gap-6"
          >
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Leaf size={16} className="text-[#8FBC94]" />
                <h2 className="font-display text-lg">{data.title}</h2>
              </div>
              <ul className="space-y-2">
                {data.foods.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 font-body text-sm text-[#C9BFD6]"
                  >
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-[#F0A585] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-2xl border border-[#F0A585]/25 bg-[#F0A585]/[0.06] p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Droplet size={16} className="text-[#F0A585]" />
                  <h3 className="font-display text-base">Key note</h3>
                </div>
                <p className="font-body text-sm text-[#E8DFEC] leading-relaxed">
                  {data.tip}
                </p>
              </div>

              <div className="rounded-2xl border border-[#D98079]/25 bg-[#D98079]/[0.06] p-6">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldAlert size={16} className="text-[#D98079]" />
                  <h3 className="font-display text-base">
                    Avoid throughout pregnancy
                  </h3>
                </div>
                <ul className="space-y-1.5">
                  {AVOID.map((a, i) => (
                    <li
                      key={i}
                      className="font-body text-xs text-[#D9B7B4] flex items-start gap-2"
                    >
                      <span className="mt-1 w-1 h-1 rounded-full bg-[#D98079] shrink-0" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer disclaimer */}
      <footer className="relative z-10 px-6 sm:px-10 pb-10 text-center">
        <p className="font-body text-xs text-[#6f6884] max-w-lg mx-auto">
          Bloom offers general nutrition information and isn't a substitute
          for medical advice. Always check any specific concerns with your
          midwife, OB, or doctor.
        </p>
      </footer>

      {/* Chat FAB */}
      <button
        onClick={() => setChatOpen((v) => !v)}
        aria-label="Toggle chat assistant"
        className="fixed bottom-6 right-4 sm:right-8 z-30 w-14 h-14 rounded-full bg-[#F0A585] text-[#1a1420] flex items-center justify-center shadow-lg hover:brightness-110 transition"
      >
        {chatOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      <ChatPanel
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        activeMonth={activeMonth}
      />
    </div>
  );
}
