import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { sfx } from "../lib/sfx"

// ─── Palette ──────────────────────────────────────────────────────────────────
const LIGHT_BG     = "#F2F2F7"
const DARK_BG      = "#080810"
const APPLE_BLUE   = "#0071E3"
const APPLE_CYAN   = "#00C7BE"
const APPLE_PINK   = "#FF2D55"
const APPLE_YELLOW = "#FFCC00"
const APPLE_GREEN  = "#30D158"
const APPLE_PURPLE = "#BF5AF2"

// ─── Images ───────────────────────────────────────────────────────────────────
const IMG = {
  synergy:       "/img/CARATULA TECTI.png",
  collaborative: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1400&q=90",
  isolated:      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=90",
  purpose:       "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=90",
  pillars:       "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1400&q=90",
  tuckman:       "https://images.unsplash.com/photo-1542744801-30d00928e1d7?auto=format&fit=crop&w=1400&q=90",
  strategy:      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=90",
  success:       "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=90",
}

const AUDIO_TRACKS = [
  "/assets/voice_scene1.mp3",
  "/assets/voice_scene2.mp3",
  "/assets/voice_scene3.mp3",
  "/assets/voice_scene4.mp3",
  "/assets/voice_scene5.mp3",
  "/assets/voice_scene6.mp3",
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function Tag({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      padding: "4px 12px", borderRadius: 100,
      background: color + "18", border: `1px solid ${color}45`,
      color, fontSize: 10, fontWeight: 800,
      letterSpacing: "1.5px", textTransform: "uppercase" as const,
      fontFamily: "var(--font-mono)",
    }}>
      {label}
    </span>
  )
}

function Label({ text, color = APPLE_BLUE }: { text: string; color?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35 }}
      style={{ display: "flex", alignItems: "center", gap: 9 }}
    >
      <div style={{ width: 22, height: 3, borderRadius: 2, background: color }} />
      <span style={{
        fontSize: 10, fontWeight: 800, color,
        letterSpacing: "2.5px", textTransform: "uppercase" as const,
        fontFamily: "var(--font-mono)",
      }}>
        {text}
      </span>
    </motion.div>
  )
}

function WaveUnder({ color, width = 260, delay = 0.4 }: { color: string; width?: number; delay?: number }) {
  return (
    <svg width={width} height={14} viewBox={`0 0 ${width} 14`} fill="none" style={{ display: "block" }}>
      <motion.path
        d={`M 3,8 Q ${width / 2},2 ${width - 3},8`}
        stroke={color} strokeWidth="4" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay, duration: 0.55, ease: "easeOut" }}
      />
    </svg>
  )
}

function Photo({
  src, alt, accent, delay = 0.3, style: extra = {},
}: {
  src: string; alt: string; accent: string;
  delay?: number; style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, type: "spring", stiffness: 240, damping: 22 }}
      style={{
        borderRadius: 26, overflow: "hidden", aspectRatio: "4 / 3",
        border: `2px solid ${accent}35`,
        boxShadow: `0 28px 70px rgba(0,0,0,.28), 0 0 0 1px ${accent}18`,
        position: "relative", ...extra,
      }}
    >
      <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="eager" />
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(150deg, ${accent}18 0%, transparent 55%)`,
        pointerEvents: "none",
      }} />
    </motion.div>
  )
}

function Orbs({ dark }: { dark: boolean }) {
  const list = [
    { s: 420, top: "-8%",  left: "-8%",  c: dark ? "rgba(0,113,227,.13)"  : "rgba(0,113,227,.07)",  d: 14 },
    { s: 320, top: "55%",  left: "68%",  c: dark ? "rgba(0,199,190,.11)"  : "rgba(0,199,190,.06)",  d: 18 },
    { s: 260, top: "65%",  left: "8%",   c: dark ? "rgba(255,45,85,.08)"  : "rgba(255,45,85,.04)",  d: 22 },
    { s: 200, top: "18%",  left: "82%",  c: dark ? "rgba(191,90,242,.10)" : "rgba(191,90,242,.05)", d: 16 },
  ]
  return (
    <>
      {list.map((o, i) => (
        <motion.div key={i}
          animate={{ y: [0, -26, 0], x: [0, 12, 0] }}
          transition={{ duration: o.d, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: o.top, left: o.left,
            width: o.s, height: o.s, borderRadius: "50%",
            background: o.c, filter: "blur(58px)", pointerEvents: "none",
          }}
        />
      ))}
    </>
  )
}

function MetricBar({ label, value, color, delay }: {
  label: string; value: number; color: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      style={{ display: "flex", alignItems: "center", gap: 12 }}
    >
      <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.45)", width: 86, fontFamily: "var(--font-mono)" }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 5, borderRadius: 3, background: "rgba(255,255,255,.08)", overflow: "hidden" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay: delay + 0.2, duration: 0.85, ease: "easeOut" }}
          style={{ height: "100%", borderRadius: 3, background: color }}
        />
      </div>
      <span style={{ fontSize: 10, fontWeight: 800, color, width: 34, textAlign: "right", fontFamily: "var(--font-mono)" }}>
        {value}%
      </span>
    </motion.div>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────
export interface AppleMotion3MinVideoProps {
  isPlaying?: boolean
  onComplete?: () => void
}

// ═════════════════════════════════════════════════════════════════════════════
export function AppleMotion3MinVideo({ isPlaying = true, onComplete }: AppleMotion3MinVideoProps) {
  const [time, setTime] = useState(0)
  const [beat, setBeat] = useState(1)
  const rafRef   = useRef<number>(0)
  const startRef = useRef<number | null>(null)
  const voiceRef = useRef<HTMLAudioElement | null>(null)

  const playVoice = useCallback((idx: number) => {
    if (voiceRef.current) { voiceRef.current.pause(); voiceRef.current.onended = null }
    if (idx >= 0 && idx < AUDIO_TRACKS.length) {
      const v = new Audio(AUDIO_TRACKS[idx])
      v.volume = 1.0
      voiceRef.current = v
      v.play().catch(() => {})
    }
  }, [])

  useEffect(() => {
    if (!isPlaying) {
      startRef.current = null
      cancelAnimationFrame(rafRef.current)
      voiceRef.current?.pause()
      return
    }
    const loop = (ts: number) => {
      if (!startRef.current) startRef.current = ts
      const t = Math.min((ts - startRef.current) / 1000, 180)
      setTime(t)
      setBeat(Math.min(Math.floor(t / 15) + 1, 12))
      if (t >= 180) { onComplete?.() } else { rafRef.current = requestAnimationFrame(loop) }
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => { cancelAnimationFrame(rafRef.current); voiceRef.current?.pause() }
  }, [isPlaying, onComplete])

  const prevBeat = useRef(1)
  useEffect(() => {
    if (beat === prevBeat.current) return
    if (beat === 12) sfx.playSubImpact()
    else if ([2, 4, 6, 8, 10].includes(beat)) sfx.playSwitch()
    else sfx.playPop()
    if (beat === 1)  playVoice(0)
    if (beat === 3)  playVoice(1)
    if (beat === 5)  playVoice(2)
    if (beat === 7)  playVoice(3)
    if (beat === 9)  playVoice(4)
    if (beat === 11) playVoice(5)
    prevBeat.current = beat
  }, [beat, playVoice])

  useEffect(() => { if (isPlaying) playVoice(0) }, [isPlaying]) // eslint-disable-line

  const isDark = [2, 4, 6, 8, 10, 12].includes(beat)
  const bg     = isDark ? DARK_BG  : LIGHT_BG
  const ink    = isDark ? "#FFFFFF" : "#1D1D1F"
  const inkSub = isDark ? "rgba(255,255,255,.45)" : "rgba(0,0,0,.42)"

  const m  = Math.floor(time / 60)
  const s  = (time % 60).toFixed(1).padStart(4, "0")
  const ts = `0${m}:${s}`

  return (
    <div style={{
      position: "absolute", inset: 0,
      background: bg, color: ink,
      transition: "background-color .1s ease",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      overflow: "hidden",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      userSelect: "none",
    }}>

      <Orbs dark={isDark} />

      {/* Progress bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "rgba(128,128,128,.14)", zIndex: 100 }}>
        <motion.div
          animate={{ width: `${(time / 180) * 100}%` }}
          transition={{ duration: 0.05, ease: "linear" }}
          style={{
            height: "100%",
            background: isDark
              ? `linear-gradient(90deg, ${APPLE_CYAN}, ${APPLE_BLUE})`
              : `linear-gradient(90deg, ${APPLE_BLUE}, ${APPLE_PURPLE})`,
          }}
        />
      </div>

      {/* Beat dots */}
      <div style={{
        position: "absolute", top: 13, left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: 5, zIndex: 90,
      }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} style={{
            width: i + 1 === beat ? 18 : 5, height: 5, borderRadius: 3,
            background: i + 1 <= beat
              ? (isDark ? APPLE_CYAN : APPLE_BLUE)
              : (isDark ? "rgba(255,255,255,.14)" : "rgba(0,0,0,.1)"),
            transition: "width .3s ease, background .3s ease",
          }} />
        ))}
      </div>

      {/* Timer badge */}
      <div style={{
        position: "absolute", top: 20, right: 26,
        fontSize: 10, fontWeight: 700, fontFamily: "var(--font-mono)",
        color: inkSub, letterSpacing: ".4px", zIndex: 90,
      }}>
        {ts} / 03:00 · {beat}/12
      </div>

      {/* ════════ BEATS ════════ */}
      <AnimatePresence mode="wait">

        {/* ── B01 · 0-15s · INTRO LIGHT ─────────────────────────────────────── */}
        {beat === 1 && (
          <motion.div key="b1"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: .97, y: -18 }}
            transition={{ duration: .45, ease: [.16, 1, .3, 1] }}
            style={{ display: "grid", gridTemplateColumns: "1.15fr .85fr", gap: 52, alignItems: "center", maxWidth: 1100, padding: "0 48px", width: "100%" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <Label text="Masterclass · 2026" />
              <motion.div
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: .1, type: "spring", stiffness: 280, damping: 22 }}
              >
                <div style={{ fontSize: "clamp(4rem,9.5vw,8rem)", fontWeight: 900, letterSpacing: "-.055em", lineHeight: .88, color: "#1D1D1F" }}>
                  EQUIPOS
                </div>
                <div style={{ position: "relative", display: "inline-block", marginTop: 8 }}>
                  <span style={{ fontSize: "clamp(1.6rem,4vw,3.2rem)", fontWeight: 800, color: APPLE_BLUE, letterSpacing: "-.02em" }}>
                    DE ALTO RENDIMIENTO
                  </span>
                  <WaveUnder color={APPLE_PINK} width={360} delay={.55} />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: .5, type: "spring", stiffness: 320 }}
                style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 4 }}
              >
                <span style={{
                  fontSize: "clamp(1.8rem,3.8vw,3rem)", fontWeight: 900,
                  background: `linear-gradient(135deg, ${APPLE_CYAN}, ${APPLE_BLUE})`,
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  1 + 1 = 3+
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <Tag label="Sinergia"      color={APPLE_CYAN}   />
                  <Tag label="Multiplicador" color={APPLE_PURPLE} />
                </div>
              </motion.div>
            </div>
            <div style={{ position: "relative" }}>
              <Photo src={IMG.synergy} alt="Synergy" delay={.25} accent={APPLE_BLUE} />
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: -5 }}
                transition={{ delay: .75, type: "spring", stiffness: 380 }}
                style={{
                  position: "absolute", bottom: -14, left: -18,
                  background: "#FFFFFF", borderRadius: 14, padding: "9px 15px",
                  boxShadow: "0 10px 36px rgba(0,0,0,.14)",
                  display: "flex", alignItems: "center", gap: 8,
                }}
              >
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: APPLE_GREEN }} />
                <span style={{ fontSize: 12, fontWeight: 800, color: "#1D1D1F" }}>Equipo activado</span>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ── B02 · 15-30s · SUMA MULTIPLICADORA DARK ───────────────────────── */}
        {beat === 2 && (
          <motion.div key="b2"
            initial={{ opacity: 0, scale: 1.07 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -28 }}
            transition={{ duration: .4, ease: [.16, 1, .3, 1] }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28, textAlign: "center", maxWidth: 900, padding: "0 48px", width: "100%", position: "relative" }}
          >
            <motion.div
              animate={{ scale: [1, 1.18, 1], opacity: [.5, .15, .5] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute", width: 130, height: 130, borderRadius: "50%",
                border: `2px solid ${APPLE_CYAN}`, top: "50%", left: "50%",
                transform: "translate(-50%,-50%)", pointerEvents: "none",
              }}
            />
            <motion.div
              animate={{ y: [-55, 0, -28, 0, -10, 0], scaleY: [1, .58, 1, .78, 1, .94], scaleX: [1, 1.42, 1, 1.22, 1, 1.04] }}
              transition={{ duration: 1.4, times: [0, .3, .55, .72, .88, 1], ease: "easeOut" }}
              style={{
                width: 72, height: 72, borderRadius: "50%", zIndex: 1,
                background: `radial-gradient(circle at 35% 35%, ${APPLE_CYAN}, ${APPLE_BLUE})`,
                boxShadow: `0 0 56px ${APPLE_CYAN}55, 0 0 110px ${APPLE_BLUE}28`,
              }}
            />
            <motion.div
              initial={{ y: 38, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: .22, type: "spring", stiffness: 280 }}
              style={{
                fontSize: "clamp(2.8rem,7.5vw,5.8rem)", fontWeight: 900,
                letterSpacing: "-.04em", lineHeight: .9,
                background: `linear-gradient(135deg, #FFFFFF 30%, ${APPLE_CYAN})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}
            >
              SUMA<br />MULTIPLICADORA
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: .44 }}
              style={{ display: "flex", gap: 32, alignItems: "center" }}
            >
              {([["2", "Velocidad"], ["3", "Innovación"], ["5", "Impacto"]] as [string, string][]).map(([n, lab], i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: APPLE_YELLOW }}>{n}×</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,.5)", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>{lab}</div>
                </div>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: .6 }}
              style={{ width: "100%", maxWidth: 520, borderRadius: 22, overflow: "hidden", border: "1px solid rgba(255,255,255,.1)", boxShadow: "0 24px 60px rgba(0,0,0,.5)" }}
            >
              <img src={IMG.collaborative} alt="Collaborative" style={{ width: "100%", height: 190, objectFit: "cover" }} />
            </motion.div>
          </motion.div>
        )}

        {/* ── B03 · 30-45s · COMPARATIVA LIGHT ──────────────────────────────── */}
        {beat === 3 && (
          <motion.div key="b3"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: .97 }}
            transition={{ duration: .4, ease: [.16, 1, .3, 1] }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26, width: "100%", maxWidth: 1050, padding: "0 40px" }}
          >
            <Label text="Comparativa Estructural" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, width: "100%" }}>
              {/* Tradicional */}
              <motion.div
                initial={{ x: -48, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 24 }}
                style={{
                  padding: "26px 24px", borderRadius: 24,
                  background: "rgba(255,255,255,.75)", backdropFilter: "blur(20px)",
                  border: "1px solid rgba(0,0,0,.07)", boxShadow: "0 10px 36px rgba(0,0,0,.06)",
                  display: "flex", flexDirection: "column", gap: 12,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "rgba(0,0,0,.35)", letterSpacing: "2px", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>TRADICIONAL</span>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(255,45,85,.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>✕</div>
                </div>
                <p style={{ fontSize: 13, color: "rgba(0,0,0,.55)", lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
                  Suma aditiva individual. Objetivos divididos sin alineación estratégica. Silos de conocimiento.
                </p>
                <div style={{ borderRadius: 12, overflow: "hidden", height: 120 }}>
                  <img src={IMG.isolated} alt="Isolated" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(70%) brightness(.9)" }} />
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["Silos", "Rivalidad", "Lentitud"].map(t => <Tag key={t} label={t} color={APPLE_PINK} />)}
                </div>
              </motion.div>

              {/* Alto Rendimiento */}
              <motion.div
                initial={{ x: 48, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: .12, type: "spring", stiffness: 280, damping: 24 }}
                style={{
                  padding: "26px 24px", borderRadius: 24,
                  background: "rgba(255,255,255,.75)", backdropFilter: "blur(20px)",
                  border: `1.5px solid ${APPLE_GREEN}55`,
                  boxShadow: `0 10px 36px rgba(48,209,88,.1), 0 0 0 1px ${APPLE_GREEN}18`,
                  display: "flex", flexDirection: "column", gap: 12,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: APPLE_GREEN, letterSpacing: "2px", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>ALTO RENDIMIENTO</span>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: APPLE_GREEN + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: APPLE_GREEN }}>✓</div>
                </div>
                <p style={{ fontSize: 13, color: "#1D1D1F", fontWeight: 600, lineHeight: 1.6, margin: 0 }}>
                  Sinergia multiplicadora. Propósito compartido y empoderamiento total. Flujo abierto.
                </p>
                <div style={{ borderRadius: 12, overflow: "hidden", height: 120 }}>
                  <img src={IMG.synergy} alt="Synergy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {["Sinergia", "Confianza", "Velocidad"].map(t => <Tag key={t} label={t} color={APPLE_GREEN} />)}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ── B04 · 45-60s · PROPÓSITO DARK ─────────────────────────────────── */}
        {beat === 4 && (
          <motion.div key="b4"
            initial={{ opacity: 0, scale: .93 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -28 }}
            transition={{ duration: .45, ease: [.16, 1, .3, 1] }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", maxWidth: 1080, padding: "0 48px", width: "100%" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <Label text="Pilar Fundamental" color={APPLE_CYAN} />
              <motion.div
                initial={{ y: 38, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: .1, type: "spring", stiffness: 260, damping: 20 }}
                style={{ fontSize: "clamp(3rem,7.5vw,6rem)", fontWeight: 900, letterSpacing: "-.05em", lineHeight: .9 }}
              >
                <span style={{ color: "#FFFFFF" }}>PROPÓSITO</span><br />
                <span style={{ background: `linear-gradient(135deg, ${APPLE_YELLOW}, ${APPLE_PINK})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  COMPARTIDO
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: .38 }}
                style={{ display: "flex", flexDirection: "column", gap: 9 }}
              >
                {["Visión única y alineada", "Misión clara para todos", "Valores que guían cada decisión"].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: .44 + i * .09 }}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: APPLE_CYAN, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,.7)" }}>{item}</span>
                  </motion.div>
                ))}
              </motion.div>
              <svg width="210" height="42" viewBox="0 0 210 42" fill="none">
                <motion.path
                  d="M 10,21 Q 85,5 185,21 L 168,10 M 185,21 L 170,33"
                  stroke={APPLE_YELLOW} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: .55, duration: 0.55, ease: "easeOut" }}
                />
              </svg>
            </div>
            <Photo src={IMG.purpose} alt="Purpose" delay={.2} accent={APPLE_CYAN} />
          </motion.div>
        )}

        {/* ── B05 · 60-75s · 6 PILARES LIGHT ────────────────────────────────── */}
        {beat === 5 && (
          <motion.div key="b5"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: .97 }}
            transition={{ duration: .4, ease: [.16, 1, .3, 1] }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, width: "100%", maxWidth: 1080, padding: "0 40px" }}
          >
            <Label text="Los 6 Pilares Fundamentales" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 13, width: "100%" }}>
              {[
                { title: "Visión & Propósito",     metric: "100%", color: APPLE_BLUE,   icon: "🎯" },
                { title: "Diversidad Táctica",     metric: "MAX",  color: APPLE_PURPLE, icon: "🔀" },
                { title: "Seguridad Psicológica",  metric: "PRO",  color: APPLE_GREEN,  icon: "🛡" },
                { title: "Transparencia Radical",  metric: "OPEN", color: APPLE_CYAN,   icon: "💡" },
                { title: "Autonomía Distribuida",  metric: "FULL", color: APPLE_YELLOW, icon: "⚡" },
                { title: "Agilidad Adaptativa",    metric: "FAST", color: APPLE_PINK,   icon: "🚀" },
              ].map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 26, scale: .92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * .07, type: "spring", stiffness: 300, damping: 22 }}
                  style={{
                    padding: "18px 18px", borderRadius: 20,
                    background: "rgba(255,255,255,.78)", backdropFilter: "blur(20px)",
                    border: `1px solid ${p.color}22`,
                    boxShadow: `0 8px 28px rgba(0,0,0,.05), 0 0 0 1px ${p.color}14`,
                    display: "flex", flexDirection: "column", gap: 9, minHeight: 115,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <span style={{ fontSize: 20 }}>{p.icon}</span>
                    <span style={{
                      padding: "3px 9px", borderRadius: 100,
                      background: p.color + "15", color: p.color,
                      fontSize: 9, fontWeight: 800, letterSpacing: "1px",
                      fontFamily: "var(--font-mono)",
                    }}>
                      {p.metric}
                    </span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#1D1D1F", lineHeight: 1.3 }}>{p.title}</span>
                  <div style={{ height: 2, borderRadius: 1, background: `linear-gradient(90deg, ${p.color}, ${p.color}38)` }} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── B06 · 75-90s · SEGURIDAD PSICOLÓGICA DARK ─────────────────────── */}
        {beat === 6 && (
          <motion.div key="b6"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -28 }}
            transition={{ duration: .45, ease: [.16, 1, .3, 1] }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", maxWidth: 1080, padding: "0 48px", width: "100%" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <Label text="Pilar Núcleo · 03/06" color={APPLE_GREEN} />
              <motion.div
                initial={{ y: 34, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 280 }}
                style={{ fontSize: "clamp(2.6rem,6.5vw,5rem)", fontWeight: 900, letterSpacing: "-.04em", lineHeight: .9 }}
              >
                <span style={{ color: "#FFFFFF" }}>SEGURIDAD</span><br />
                <span style={{ background: `linear-gradient(135deg, ${APPLE_GREEN}, ${APPLE_CYAN})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  PSICOLÓGICA
                </span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: .34 }}
                style={{
                  padding: "14px 18px", borderRadius: 14,
                  background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)",
                  fontSize: 13, color: "rgba(255,255,255,.68)", lineHeight: 1.6,
                }}
              >
                El entorno donde cada persona puede hablar, proponer, equivocarse y crecer sin miedo al juicio.
              </motion.div>
              <svg width="250" height="38" viewBox="0 0 250 38" fill="none">
                <motion.rect
                  x="3" y="3" width="244" height="32" rx="10"
                  stroke={APPLE_YELLOW} strokeWidth="3.5" strokeDasharray="10 5"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: .44, duration: 0.65 }}
                />
              </svg>
            </div>
            <div style={{ position: "relative" }}>
              <Photo src={IMG.pillars} alt="Pillars" delay={.2} accent={APPLE_YELLOW} />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: .72, type: "spring", stiffness: 400 }}
                style={{
                  position: "absolute", top: -14, right: -14,
                  width: 52, height: 52, borderRadius: "50%",
                  background: `radial-gradient(circle, ${APPLE_YELLOW}, ${APPLE_PINK})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, boxShadow: `0 0 28px ${APPLE_YELLOW}55`,
                }}
              >
                🛡
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ── B07 · 90-105s · TUCKMAN LIGHT ─────────────────────────────────── */}
        {beat === 7 && (
          <motion.div key="b7"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: .97 }}
            transition={{ duration: .4, ease: [.16, 1, .3, 1] }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34, width: "100%", maxWidth: 980, padding: "0 48px" }}
          >
            <Label text="Modelo de Evolución Tuckman" />
            <div style={{ display: "flex", alignItems: "center", width: "100%", position: "relative" }}>
              {/* Static track */}
              <div style={{ position: "absolute", top: 27, left: "7%", right: "7%", height: 2, background: "rgba(0,0,0,.08)", zIndex: 0 }} />
              {/* Animated fill */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: .28, duration: .7, ease: "easeOut" }}
                style={{
                  position: "absolute", top: 27, left: "7%", right: "7%",
                  height: 2, background: `linear-gradient(90deg, ${APPLE_BLUE}, ${APPLE_GREEN})`,
                  transformOrigin: "left center", zIndex: 0,
                }}
              />
              {[
                { label: "Formación", color: "rgba(0,0,0,.28)", active: false },
                { label: "Conflicto", color: APPLE_PINK,        active: false },
                { label: "Normas",    color: APPLE_YELLOW,      active: false },
                { label: "Desempeño", color: APPLE_BLUE,        active: true  },
                { label: "Evolución", color: APPLE_GREEN,       active: false },
              ].map((n, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: i % 2 === 0 ? -32 : 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * .09, type: "spring", stiffness: 320, damping: 20 }}
                  style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, position: "relative", zIndex: 1 }}
                >
                  <div style={{
                    width: 54, height: 54, borderRadius: "50%",
                    background: n.active ? `linear-gradient(135deg, ${APPLE_BLUE}, ${APPLE_PURPLE})` : "#FFFFFF",
                    border: n.active ? "none" : `2px solid ${n.color}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 900, fontSize: 13,
                    color: n.active ? "#FFFFFF" : n.color,
                    boxShadow: n.active ? `0 8px 30px ${APPLE_BLUE}45` : "0 4px 14px rgba(0,0,0,.07)",
                  }}>
                    0{i + 1}
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 12, fontWeight: n.active ? 900 : 600, color: n.active ? APPLE_BLUE : "#1D1D1F" }}>{n.label}</div>
                    {n.active && (
                      <motion.div initial={{ opacity: 0, scale: .7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .6 }}>
                        <span style={{ fontSize: 9, fontWeight: 800, color: APPLE_BLUE, fontFamily: "var(--font-mono)", letterSpacing: "1px" }}>▲ OBJETIVO</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: .64 }}
              style={{
                padding: "13px 26px", borderRadius: 13,
                background: APPLE_BLUE + "0D", border: `1px solid ${APPLE_BLUE}22`,
                fontSize: 13, fontWeight: 600, color: APPLE_BLUE, textAlign: "center",
              }}
            >
              Todo equipo pasa por las 5 etapas. La clave: llegar al <strong>Desempeño</strong> y sostenerlo.
            </motion.div>
          </motion.div>
        )}

        {/* ── B08 · 105-120s · DESEMPEÑO DARK ───────────────────────────────── */}
        {beat === 8 && (
          <motion.div key="b8"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -28 }}
            transition={{ duration: .45, ease: [.16, 1, .3, 1] }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", maxWidth: 1080, padding: "0 48px", width: "100%" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <Label text="Estado Máximo" color={APPLE_CYAN} />
              <motion.div
                initial={{ y: 38, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                style={{ fontSize: "clamp(2.8rem,7vw,5.5rem)", fontWeight: 900, letterSpacing: "-.05em", lineHeight: .9 }}
              >
                <span style={{ color: "#FFFFFF" }}>DESEMPEÑO</span><br />
                <span style={{ background: `linear-gradient(135deg, ${APPLE_CYAN}, ${APPLE_BLUE})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  PERFORMING
                </span>
              </motion.div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 4 }}>
                <MetricBar label="Cohesión"    value={96} color={APPLE_CYAN}   delay={.32} />
                <MetricBar label="Confianza"   value={98} color={APPLE_GREEN}  delay={.42} />
                <MetricBar label="Rendimiento" value={94} color={APPLE_YELLOW} delay={.52} />
              </div>
            </div>
            <Photo src={IMG.tuckman} alt="Performing" delay={.2} accent={APPLE_CYAN} />
          </motion.div>
        )}

        {/* ── B09 · 120-135s · OKRs LIGHT ───────────────────────────────────── */}
        {beat === 9 && (
          <motion.div key="b9"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: .97 }}
            transition={{ duration: .4, ease: [.16, 1, .3, 1] }}
            style={{ display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 44, alignItems: "center", maxWidth: 1080, padding: "0 48px", width: "100%" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <Label text="Ejecución Estratégica" />
              <motion.div
                initial={{ y: 34, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: .1, type: "spring", stiffness: 280 }}
                style={{ fontSize: "clamp(2.5rem,6.5vw,5rem)", fontWeight: 900, letterSpacing: "-.05em", color: "#1D1D1F", lineHeight: .9 }}
              >
                OKRs &<br />
                <span style={{ color: APPLE_BLUE }}>FEEDBACK</span><br />
                CONTINUO
              </motion.div>
              <div style={{ position: "relative", display: "inline-block" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(0,0,0,.58)" }}>Alineación y métricas claras</span>
                <WaveUnder color={APPLE_PINK} width={210} delay={.5} />
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
                {["Objetivos", "Resultados Clave", "Iteraciones", "Revisiones"].map((t, i) => (
                  <motion.div key={t} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .54 + i * .08 }}>
                    <Tag label={t} color={i % 2 === 0 ? APPLE_BLUE : APPLE_PURPLE} />
                  </motion.div>
                ))}
              </div>
            </div>
            <Photo src={IMG.strategy} alt="Strategy" delay={.3} accent={APPLE_BLUE} />
          </motion.div>
        )}

        {/* ── B10 · 135-150s · CULTURA DARK ─────────────────────────────────── */}
        {beat === 10 && (
          <motion.div key="b10"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: .97 }}
            transition={{ duration: .4, ease: [.16, 1, .3, 1] }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26, maxWidth: 860, padding: "0 48px", width: "100%" }}
          >
            <Label text="Cultura de Alto Rendimiento" color={APPLE_CYAN} />
            {/* Terminal */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: .14 }}
              style={{ width: "100%", borderRadius: 20, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.08)" }}
            >
              <div style={{ padding: "11px 16px", background: "#2A2A2E", display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FF5F56" }} />
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#FFBD2E" }} />
                <div style={{ width: 11, height: 11, borderRadius: "50%", background: "#27C93F" }} />
                <span style={{ marginLeft: 10, fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,.38)", fontFamily: "var(--font-mono)" }}>
                  culture.ts — high-performance-team
                </span>
              </div>
              <div style={{
                padding: "24px 32px", background: "#111116",
                fontFamily: "var(--font-mono)", fontSize: 17, lineHeight: 1.7,
              }}>
                <div><span style={{ color: APPLE_PINK }}>const</span> <span style={{ color: "#E5C07B" }}>team</span> <span style={{ color: "rgba(255,255,255,.5)" }}>=</span> <span style={{ color: APPLE_YELLOW }}>new</span> <span style={{ color: APPLE_CYAN }}>HighPerformanceTeam</span>()</div>
                <div style={{ marginTop: 6 }}>team.<span style={{ color: APPLE_BLUE }}>buildCulture</span>(&#123;</div>
                {[
                  ["trust",       `"MAXIMUM"`,  APPLE_YELLOW],
                  ["feedback",    `"RADICAL"`,  APPLE_GREEN ],
                  ["autonomy",    `"FULL"`,      APPLE_CYAN  ],
                  ["safety",      `"ABSOLUTE"`, APPLE_PURPLE],
                ].map(([key, val, col], i) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: .28 + i * .1 }}
                    style={{ paddingLeft: 28 }}
                  >
                    <span style={{ color: "rgba(255,255,255,.55)" }}>{key}: </span>
                    <span style={{ color: col, fontWeight: 800, position: "relative" }}>
                      {val}
                      {i === 0 && (
                        <svg width="80" height="10" viewBox="0 0 80 10" fill="none" style={{ position: "absolute", bottom: -3, left: 0 }}>
                          <motion.path d="M 2,6 Q 40,1 78,6" stroke={col} strokeWidth="3" strokeLinecap="round"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: .6, duration: .4 }} />
                        </svg>
                      )}
                    </span>
                  </motion.div>
                ))}
                <div>&#125;)</div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ── B11 · 150-165s · LIDERAZGO LIGHT ──────────────────────────────── */}
        {beat === 11 && (
          <motion.div key="b11"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: .97 }}
            transition={{ duration: .4, ease: [.16, 1, .3, 1] }}
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", maxWidth: 1080, padding: "0 48px", width: "100%" }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
              <Label text="Liderazgo y Cultura" />
              <motion.div
                initial={{ y: 34, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: .1, type: "spring", stiffness: 280 }}
                style={{ fontSize: "clamp(2.8rem,6.5vw,5rem)", fontWeight: 900, letterSpacing: "-.05em", color: "#1D1D1F", lineHeight: .92 }}
              >
                LIDERAZGO.<br />
                <span style={{ color: APPLE_BLUE }}>CULTURA.</span><br />
                RESULTADO.
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: .4 }}
                style={{ display: "flex", flexDirection: "column", gap: 9 }}
              >
                {[
                  { txt: "Líder que inspira, no que controla", color: APPLE_BLUE },
                  { txt: "Cultura como ventaja competitiva",   color: APPLE_PURPLE },
                  { txt: "Resultados sostenibles en el tiempo", color: APPLE_GREEN },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: .44 + i * .09 }}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: item.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,.65)" }}>{item.txt}</span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            <Photo src={IMG.success} alt="Success" delay={.3} accent={APPLE_BLUE} />
          </motion.div>
        )}

        {/* ── B12 · 165-180s · FINALE DARK ───────────────────────────────────── */}
        {beat === 12 && (
          <motion.div key="b12"
            initial={{ opacity: 0, scale: .72 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 1 }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 26, textAlign: "center", position: "relative" }}
          >
            {/* Glow rings */}
            {[1, 1.6, 2.2].map((scale, i) => (
              <motion.div
                key={i}
                animate={{ scale: [scale, scale * 1.08, scale], opacity: [.2, .06, .2] }}
                transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * .4 }}
                style={{
                  position: "absolute", width: 110, height: 110, borderRadius: "50%",
                  border: `1.5px solid ${APPLE_CYAN}`,
                  top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                  pointerEvents: "none",
                }}
              />
            ))}

            {/* Checkmark circle */}
            <svg width="110" height="110" viewBox="0 0 100 100" fill="none" style={{ zIndex: 1 }}>
              <motion.circle cx="50" cy="50" r="44"
                stroke={APPLE_CYAN} strokeWidth="5"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: .75, ease: "easeOut" }}
              />
              <motion.path d="M 28,50 L 44,67 L 72,33"
                stroke={APPLE_BLUE} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: .4, duration: .5, ease: "easeOut" }}
              />
            </svg>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: .5 }}
              style={{
                fontSize: "clamp(3rem,8vw,6.2rem)",
                fontWeight: 900, letterSpacing: "-.04em",
                background: `linear-gradient(135deg, #FFFFFF 30%, ${APPLE_CYAN})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                textTransform: "uppercase",
              }}
            >
              CONFIANZA = ÉXITO
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: .8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: .82 }}
              style={{ display: "flex", gap: 10, alignItems: "center" }}
            >
              <Tag label="Equipos de Alto Rendimiento" color={APPLE_CYAN}   />
              <Tag label="2026 Edition"                color={APPLE_PURPLE} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              style={{
                marginTop: 8, fontSize: 11, fontWeight: 700,
                color: "rgba(255,255,255,.28)", letterSpacing: "2px",
                fontFamily: "var(--font-mono)", textTransform: "uppercase",
              }}
            >
              FIN · THE BRAG METHOD
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
