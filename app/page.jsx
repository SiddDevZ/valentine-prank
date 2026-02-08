"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const NO_TEXTS = [
  "please 🥺", "pretty please", "but i love u", "don't do this", "my heart 💔", 
  "why??", "give me a chance", "i'm begging", "i'll cry", "don't leave", 
  "look at me", "i have snacks", "i'm rich (jk)", "free hugs?", 
  "i cook!!", "netflix & chill?", "don't break my heart", "just one date", 
  "please say yes", "i promise i'm fun", "nooOOOOooo", "wait!", "hear me out", 
  "are you sure?", "really sure?", "mistake!!", "reconsider", "think about it", 
  "last chance!", "but i love youuu", 
  "soulmates?", "click yes pls", "don't touch me", "ouch",
  "rude", "srsly?", "crying rn"
];

const getRandomPos = (currentPos, padding = 40, minDist = 250) => {
  if (typeof window === "undefined") return { x: 0, y: 0 };
  const w = window.innerWidth - padding * 2;
  const h = window.innerHeight - padding * 2;
  const matchW = 150; 
  const matchH = 48; 

  let x, y, attempts = 0;
  do {
    x = Math.max(padding, Math.floor(Math.random() * (w - matchW)));
    y = Math.max(padding, Math.floor(Math.random() * (h - matchH)));
    attempts++;
  } while (
    currentPos &&
    attempts < 20 &&
    Math.hypot(x - currentPos.x, y - currentPos.y) < minDist
  );
  
  return { x, y };
};

export default function Home() {
  const [step, setStep] = useState("ask"); 
  const [moved, setMoved] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState(null);
  const [text, setText] = useState("No thanks");
  const [availableTexts, setAvailableTexts] = useState(NO_TEXTS);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef(null);
  
  const [userInfo, setUserInfo] = useState({
    ip: "Fetching...",
    location: "Triangulating...",
    isp: "Tracing...",
    device: "Scanning...",
    battery: "Checking power...",
  });

  useEffect(() => {
    if (step === "reveal") {
      fetch("https://ipapi.co/json/")
        .then((res) => res.json())
        .then((data) => {
          if (data.error) throw new Error(data.reason);
          setUserInfo((prev) => ({
            ...prev,
            ip: data.ip,
            location: `${data.city}, ${data.region}, ${data.country_name}`,
            isp: data.org,
          }));
          // console.log("User Info:", data);
        })
        .catch(() => {
          setUserInfo((prev) => ({
            ...prev,
            ip: "127.0.0.1",
            location: "Secret Bunker",
            isp: "The FBI",
          }));
        });

      // Browser/Device Logic
      const ua = navigator.userAgent;
      let os = "Unknown OS";
      if (ua.indexOf("Win") !== -1) os = "Windows";
      else if (ua.indexOf("Mac") !== -1) os = "MacOS";
      else if (ua.indexOf("Linux") !== -1) os = "Linux";
      else if (ua.indexOf("Android") !== -1) os = "Android";
      else if (ua.indexOf("like Mac") !== -1) os = "iOS";

      let browser = "Unknown Browser";
      if (ua.indexOf("Firefox") !== -1) browser = "Firefox";
      else if (ua.indexOf("Chrome") !== -1) browser = "Chrome";
      else if (ua.indexOf("Safari") !== -1) browser = "Safari";
      else if (ua.indexOf("Edge") !== -1) browser = "Edge";

      setUserInfo((prev) => ({
        ...prev,
        device: `${browser} on ${os}`,
      }));

      if (navigator.getBattery) {
        navigator.getBattery().then((battery) => {
          const level = Math.round(battery.level * 100);
          const charging = battery.charging ? "⚡" : "";
          setUserInfo((prev) => ({
            ...prev,
            battery: `${level}% ${charging}`,
          }));
        }).catch(() => {
          setUserInfo((prev) => ({ ...prev, battery: "Unknown" }));
        });
      } else {
         setUserInfo((prev) => ({ ...prev, battery: "Unknown" }));
      }
    }
  }, [step]);
  
  const btnNoRef = useRef(null);
  const justDodgedRef = useRef(false);

  useEffect(() => {
    if (moved || !btnNoRef.current) return;
    const sync = () => {
      if (btnNoRef.current) {
        const rect = btnNoRef.current.getBoundingClientRect();
        setPosition({ x: rect.left, y: rect.top });
      }
    };
    sync();
    window.addEventListener('resize', sync);
    window.addEventListener('scroll', sync);
    return () => {
      window.removeEventListener('resize', sync);
      window.removeEventListener('scroll', sync);
    };
  }, [moved]);

  const onNoBtnHover = () => {
    if (!moved) {
      setMoved(true);
    }
    dodge();
  };

  const onFloatingHover = () => {
    dodge();
  };

  const dodge = () => {
    const newPos = getRandomPos(position);
    setPosition(newPos);
    
    let options = availableTexts;
    if (options.length === 0) {
      options = NO_TEXTS;
    }
    const randomIndex = Math.floor(Math.random() * options.length);
    const nextText = options[randomIndex];
    
    setText(nextText);
    setAvailableTexts(options.filter((_, i) => i !== randomIndex));
  };

  const handleYes = () => {
    setStep("reveal");
  };

  const resetGame = () => {
    setStep("ask");
    setMoved(false);
    setPosition({ x: 0, y: 0 });
    setStartPosition(null);
    setText("No thanks");
    setAvailableTexts(NO_TEXTS);
    setMuted(false);
    justDodgedRef.current = false;
  };

  return (
    <div className="flex items-center justify-center relative min-h-screen overflow-hidden bg-pink-50 selection:bg-pink-200 selection:text-pink-900">
      <video src="/prank_vid.mp4" preload="auto" className="hidden" muted />
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(at_0%_0%,rgba(249,168,212,0.3)_0px,transparent_50%),radial-gradient(at_100%_0%,rgba(244,114,182,0.3)_0px,transparent_50%),radial-gradient(at_100%_100%,rgba(236,72,153,0.3)_0px,transparent_50%),radial-gradient(at_0%_100%,rgba(219,39,119,0.3)_0px,transparent_50%)]" />
      </div>

      <HeartRain />

      <FloatingIcon
        icon="solar:heart-linear"
        className="top-10 left-10 text-pink-300"
        delay={0}
      />
      <FloatingIcon
        icon="solar:heart-angle-linear"
        className="bottom-20 right-20 text-pink-400"
        delay={1.5}
        size={64}
      />
      <FloatingIcon
        icon="solar:cupid-linear"
        className="top-1/4 right-10 text-pink-200"
        delay={2.5}
        size={56}
      />

      <AnimatePresence mode="wait">
        {step === "ask" ? (
          <motion.main
            key="ask"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="glass-panel w-full max-w-md rounded-2xl px-8 py-4 md:px-12 md:py-8 mx-4 relative z-10"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-pink-200 to-transparent rounded-full blur-2xl opacity-60 pointer-events-none" />

            <div className="flex flex-col items-center text-center space-y-8 relative z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-pink-400 rounded-full animate-ping opacity-20 duration-1000" />
                <div className="relative bg-white/50 rounded-full p-4 backdrop-blur-sm border border-white/60">
                  <Icon
                    icon="solar:heart-bold"
                    className="text-pink-500 drop-shadow-sm"
                    width={56}
                    height={56}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <motion.h1 
                  className="text-3xl md:text-[2.3rem] font-medium text-slate-900 tracking-tight"
                  style={{ fontFamily: 'var(--font-heading), sans-serif' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  Will you be my Valentine?
                </motion.h1>
                <motion.p 
                  className="text-slate-500 text-sm md:text-base mt-5 font-normal"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Please say yes... 🥺👉👈
                </motion.p>
              </div>

              <div className="flex flex-col justify-center md:flex-row items-center gap-4 w-full pt-1 min-h-[3rem]">
                <motion.button
                  onClick={handleYes}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative px-8 cursor-pointer bg-pink-500 hover:bg-pink-500 text-white h-11 rounded-xl font-medium text-sm transition-colors duration-150 flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20"
                >
                  <span>YESSSS!</span>
                  <Icon
                    icon="solar:heart-shine-linear"
                    className="group-hover:scale-110 transition-transform"
                    width={16}
                    height={16}
                  />
                </motion.button>

                <div className="relative h-11">
                   <motion.button
                      ref={btnNoRef}
                      onMouseEnter={onNoBtnHover}
                      onTouchStart={(e) => { 
                         e.preventDefault(); 
                         onNoBtnHover(e); 
                      }}
                      className={cn(
                        "px-8 h-11 rounded-xl cursor-pointer font-medium text-sm flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 transition-colors",
                        moved && "invisible"
                      )}
                   >
                      <span>No thanks</span>
                   </motion.button>
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className=" pt-1 border-t border-slate-100 w-full flex justify-center items-center text-xs text-slate-400 font-medium tracking-wide uppercase"
              >
                Made with{" "}
                <Icon
                  icon="solar:heart-bold"
                  className="mx-1 text-pink-400"
                  width={14}
                  height={14}
                />{" "}
                for you
              </motion.div>
            </div>
          </motion.main>
        ) : (
          <motion.main
            key="reveal"
            initial={{ opacity: 0, scale: 0.95, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="glass-panel w-full max-w-md rounded-2xl p-6 md:p-8 mx-4 relative z-10 border border-red-200 shadow-xl shadow-red-500/10"
          >
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => {
                setMuted((m) => !m);
                if (videoRef.current) videoRef.current.muted = !videoRef.current.muted;
              }}
              className="absolute top-3 right-3 z-20 p-1.5 rounded-lg bg-white/80 hover:bg-white border border-slate-200 text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <Icon icon={muted ? "solar:volume-cross-linear" : "solar:volume-loud-linear"} width={16} height={16} />
            </motion.button>
            <div className="flex flex-col items-center text-center space-y-4 relative z-10">
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 14 }}
                className="w-32 h-22 rounded-md overflow-hidden shadow-lg "
              >
                <video 
                  ref={videoRef}
                  src="/prank_vid.mp4" 
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted={muted}
                  playsInline
                />
              </motion.div>

              <div className="space-y-1">
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-semibold text-slate-900 tracking-tight"
                  style={{ fontFamily: 'var(--font-playfair), serif' }}
                >
                  oil up lil bro 😈
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-slate-500 text-sm"
                >
                  we&apos;re coming for you.
                </motion.p>
              </div>

              <div className="w-full bg-slate-50 rounded-xl border border-slate-200 p-4 text-left shadow-inner space-y-3">
                <DataRow 
                  icon="solar:monitor-smartphone-linear" 
                  label="IP Address" 
                  value="69.67.69.67"
                  delay={0.4}
                />
                <DataRow 
                  icon="solar:map-point-linear" 
                  label="Location" 
                  value={userInfo.location}
                  delay={0.5}
                />
                <DataRow 
                  icon="solar:server-linear" 
                  label="Internet Provider" 
                  value={userInfo.isp}
                  delay={0.6}
                />
                <div className="pt-2 border-t border-slate-200/60 mt-2 space-y-3">
                  <DataRow 
                    icon="solar:laptop-minimalistic-linear" 
                    label="Device" 
                    value={userInfo.device}
                    delay={0.7}
                  />
                </div>
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={resetGame}
                className="text-xs text-slate-400 cursor-pointer hover:text-slate-600 transition-colors"
              >
                (its a joke, everything happens on client side)
                <br />nothing is saved or tracked
              </motion.button>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {step === "ask" && (
        <motion.button
          animate={{ x: position.x, y: position.y }}
          transition={moved ? { 
             type: "spring",
             stiffness: 400,
             damping: 25,
             mass: 0.5
          } : { duration: 0 }}
          onMouseEnter={onFloatingHover}
          onClick={dodge}
          onTouchStart={(e) => { e.preventDefault(); dodge(); }}
          style={{ position: 'fixed', left: 0, top: 0, visibility: moved ? 'visible' : 'hidden', pointerEvents: moved ? 'auto' : 'none' }}
          className="z-50 bg-white text-slate-500 px-6 h-11 cursor-pointer rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-sm border border-slate-200 whitespace-nowrap"
        >
           <span>{text}</span>
           <Icon icon="solar:close-circle-linear" width={18} height={18} />
        </motion.button>
      )}
    </div>
  );
}

function FloatingIcon({ icon, className, delay, size = 48 }) {
  return (
    <motion.div
      animate={{ 
        y: [-10, 10, -10],
        rotate: [-5, 5, -5] 
      }}
      transition={{ 
        duration: 5, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay: delay
      }}
      className={cn("absolute opacity-50", className)}
    >
      <Icon icon={icon} width={size} height={size} />
    </motion.div>
  );
}

function DataRow({ icon, label, value, sub, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-start gap-3"
    >
      <div className="mt-1 text-slate-400">
        <Icon icon={icon} width={18} />
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className="text-sm font-medium text-slate-700">
          {value} {sub && <span className="text-slate-300 ml-1 font-normal">{sub}</span>}
        </p>
      </div>
    </motion.div>
  );
}

const HEART_EMOJIS = ["💕", "❤️", "💖", "💗", "💓", "💘", "💝", "♥️", "💞"];

function HeartRain() {
  const hearts = useMemo(() => 
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
      left: Math.random() * 100,
      size: Math.random() * 14 + 10,
      duration: Math.random() * 6 + 6,
      delay: Math.random() * 8,
      opacity: Math.random() * 0.4 + 0.15,
      swayAmount: Math.random() * 40 - 20,
    })),
  []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          initial={{ y: "-5%", x: 0, opacity: 0 }}
          animate={{ 
            y: "105vh", 
            x: [0, h.swayAmount, -h.swayAmount, 0],
            opacity: [0, h.opacity, h.opacity, 0] 
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: "linear",
            x: { duration: h.duration, repeat: Infinity, ease: "easeInOut" },
          }}
          style={{
            position: "absolute",
            left: `${h.left}%`,
            fontSize: `${h.size}px`,
          }}
        >
          {h.emoji}
        </motion.div>
      ))}
    </div>
  );
}
