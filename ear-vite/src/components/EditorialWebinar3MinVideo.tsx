import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { sfx } from "../lib/sfx"
import { WordReveal } from "./motion-primitives"

// ─── Carátula Color Palette & Hierarchy ─────────────────────────────────────
const CREAM = "#FAF6F0"   // Warm refined cream background
const CREAM2 = "#F0E5D8"   // Warm beige tone for ambient gradient
const DARK = "#141316"   // Deep rich charcoal black
const DARK2 = "#1E1C22"   // Elevated dark card background
const GOLD = "#C59B27"   // Carátula primary Gold accent
const GOLD2 = "#E5BE53"   // Warm bright gold highlight
const GOLD3 = "#A37B14"   // Deep gold for subtle borders & captions
const BURGUNDY = "#8C2B2E"   // Rich carátula burgundy detail

// Universal aliases for backwards compatibility & scene components
const BK = DARK
const WH = "#FFFFFF"
const G1 = "#1F1C1B"   // Primary text on light mode
const G2 = "#6C655F"   // Secondary text on light mode
const G3 = CREAM
const G4 = "#B8B0A6"   // Secondary text on dark mode
const AC = GOLD

const TXT_D = "#1F1C1B"
const TXT_D_MUTED = "#6C655F"
const TXT_L = "#FAF6F0"
const TXT_L_MUTED = "#B8B0A6"

// ─── Editorial Unsplash images (Personas reales en equipos) ────────────────
const IMG = {
  cover: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1400&q=85",
  intro: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85",
  team: "https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=1200&q=85",
  definition: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=85",
  purpose: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85",
  plan: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=85",
  auto: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=85",
  comms: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=85",
  trust: "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=1200&q=85",
  conclusion: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85",
}

// Imagen con tono cálido sutil
const bwImg: React.CSSProperties = {
  width: "100%", height: "100%", objectFit: "cover",
  filter: "brightness(0.96) saturate(1.05) contrast(1.02)",
}

// ─── SVG icon components ────────────────────────────────────────────────────
const IconTarget = ({ color = G1 }: { color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
  </svg>
)
const IconClipboard = ({ color = G1 }: { color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
)
const IconSettings = ({ color = G1 }: { color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" />
  </svg>
)
const IconRefresh = ({ color = G1 }: { color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
    <path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
  </svg>
)
const IconLink = ({ color = G1 }: { color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
)
const IconMessage = ({ color = G1 }: { color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)
const IconGlobe = ({ color = G1 }: { color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)
const IconShield = ({ color = G1 }: { color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)
const IconCheck = ({ color = G1, size = 22 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)
const IconStar = ({ color = G1 }: { color?: string }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

// ─── SVG Decorative & Diagram Components ─────────────────────────────────────
const SVGGridOverlay = ({ isDark }: { isDark: boolean }) => (
  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0, opacity: isDark ? 0.14 : 0.22 }}>
    <defs>
      <pattern id="grid-dots" width="48" height="48" patternUnits="userSpaceOnUse">
        <circle cx="24" cy="24" r="1.2" fill={isDark ? GOLD : GOLD3} opacity="0.7" />
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke={isDark ? "rgba(225,190,83,0.10)" : "rgba(163,123,20,0.10)"} strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid-dots)" />
  </svg>
)

const SVGCornerAccents = ({ isDark }: { isDark: boolean }) => {
  const c = isDark ? `${GOLD}66` : `${GOLD3}77`
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 60 }}>
      {/* Top Left */}
      <path d="M 32 64 L 32 32 L 64 32" fill="none" stroke={c} strokeWidth="1.5" />
      <circle cx="32" cy="32" r="2.5" fill={GOLD} />
      {/* Top Right */}
      <path d="M calc(100% - 64px) 32 L calc(100% - 32px) 32 L calc(100% - 32px) 64" fill="none" stroke={c} strokeWidth="1.5" />
      <circle cx="calc(100% - 32px)" cy="32" r="2.5" fill={GOLD} />
      {/* Bottom Left */}
      <path d="M 32 calc(100% - 64px) L 32 calc(100% - 32px) L 64 calc(100% - 32px)" fill="none" stroke={c} strokeWidth="1.5" />
      <circle cx="32" cy="calc(100% - 32px)" r="2.5" fill={GOLD} />
      {/* Bottom Right */}
      <path d="M calc(100% - 64px) calc(100% - 32px) L calc(100% - 32px) calc(100% - 32px) L calc(100% - 32px) calc(100% - 64px)" fill="none" stroke={c} strokeWidth="1.5" />
      <circle cx="calc(100% - 32px)" cy="calc(100% - 32px)" r="2.5" fill={GOLD} />
    </svg>
  )
}

const SVGSynergyDiagram = ({ color = GOLD }: { color?: string }) => (
  <svg width="100%" height="60" viewBox="0 0 400 60" fill="none" style={{ margin: "6px 0" }}>
    <motion.path
      d="M 60 30 Q 130 5 200 30" stroke={color} strokeWidth="2" strokeDasharray="4 4" fill="none"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeOut" }}
    />
    <motion.path
      d="M 340 30 Q 270 5 200 30" stroke={color} strokeWidth="2" strokeDasharray="4 4" fill="none"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: "easeOut" }}
    />
    <circle cx="200" cy="30" r="14" fill="rgba(197,155,39,0.15)" stroke={color} strokeWidth="2" />
    <circle cx="200" cy="30" r="5" fill={color} />
    <circle cx="60" cy="30" r="7" fill={color} />
    <circle cx="340" cy="30" r="7" fill={color} />
  </svg>
)

const SVGFeedbackLoop = ({ color = GOLD }: { color?: string }) => (
  <svg width="140" height="140" viewBox="0 0 140 140" fill="none" style={{ position: "absolute", right: 20, top: 20, opacity: 0.25, pointerEvents: "none" }}>
    <motion.circle cx="70" cy="70" r="55" stroke={color} strokeWidth="2" strokeDasharray="10 6" fill="none"
      animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "70px 70px" }}
    />
    <polygon points="125,70 115,62 115,78" fill={color} />
  </svg>
)

const SVGSmartTimeline = ({ color = GOLD }: { color?: string }) => (
  <svg width="100%" height="32" viewBox="0 0 500 32" fill="none" style={{ margin: "4px 0" }}>
    <line x1="20" y1="16" x2="480" y2="16" stroke={color} strokeWidth="1.8" strokeDasharray="3 3" opacity="0.6" />
    {[50, 150, 250, 350, 450].map((x, idx) => (
      <g key={idx}>
        <circle cx={x} cy="16" r="5" fill={color} />
        <circle cx={x} cy="16" r="9" stroke={color} strokeWidth="1.2" fill="none" opacity="0.5" />
      </g>
    ))}
  </svg>
)

// ─── Scenes & narrations ─────────────────────────────────────────────────────
const VOICE_TRACKS = [
  { id: 0, title: "00 / PORTADA", isDark: false },
  { id: 1, title: "01 / INTRODUCCIÓN", isDark: true },
  { id: 2, title: "02 / DEFINICIÓN Y CONCEPTOS CLAVE", isDark: false },
  { id: 3, title: "03 / FACTORES: PROPÓSITO Y ROLES", isDark: true },
  { id: 4, title: "04 / PLAN DE TRABAJO Y MECANISMOS", isDark: false },
  { id: 5, title: "05 / AUTOCORRECCIÓN E INTERDEPENDENCIA", isDark: true },
  { id: 6, title: "06 / COMUNICACIÓN Y DIVERSIDAD", isDark: false },
  { id: 7, title: "07 / VALORES Y CONFIANZA", isDark: true },
  { id: 8, title: "08 / CONCLUSIÓN", isDark: false },
  { id: 9, title: "09 / REFERENCIAS", isDark: true },
]

const NARRATIONS = [
  "Bienvenidos a esta presentación sobre Dirección de Equipos de Alto Rendimiento, elaborada por el Equipo cuatro del grupo ITIC novecientos tres M de la Universidad Tecnológica de Nezahualcóyotl. Los integrantes somos: Castillo Alonso Javier, Cerón Díaz Brayan, García Pérez Marco Antonio, Mello Corona Ángel Uriel, Pérez Sandoval Israel Adán, y Torales Jiménez Juan Antonio de Jesús. A lo largo de esta exposición exploraremos los conceptos, factores y estrategias que convierten a un grupo ordinario en un equipo extraordinario.",
  "El trabajo en equipo es hoy la forma dominante de organizar el trabajo: proyectos, áreas, células, comités. Sin embargo, reunir personas no garantiza un buen equipo. Muchos equipos fracasan por falta de claridad, confianza o comunicación, y no precisamente por falta de talento. La pregunta clave es: ¿qué hace que un equipo realmente funcione?",
  "Según Katzenbach y Smith en mil novecientos noventa y tres, un equipo es un número reducido de personas con habilidades complementarias, comprometidas con un propósito común, metas de desempeño claras y un enfoque compartido del que todos se hacen mutuamente responsables. Un equipo de alto rendimiento va más allá: sus integrantes se comprometen también con el crecimiento y éxito de los demás. La diferencia entre grupo y equipo es la sinergia.",
  "Los primeros factores de un equipo de alto rendimiento son el propósito claro y compartido, y las responsabilidades bien definidas. La alineación estratégica significa que todos comprenden perfectamente la misión, la visión y los objetivos. El sentido de pertenencia convierte ese propósito en una causa asumida con convicción. A esto se suman reglas de funcionamiento: acuerdos explícitos sobre tiempos, canales y ética de trabajo.",
  "Un elemento esencial es la comprensión del plan de trabajo. El plan incluye metas, tareas, responsables, plazos y recursos. Las metas deben ser SMART: específicas, medibles, alcanzables, relevantes y con tiempo definido. Los mecanismos efectivos incluyen reuniones con orden del día claro, toma de decisiones estratégica y solución de problemas que busca soluciones, no culpables.",
  "La habilidad para autocorregirse es diferenciadora: el equipo detecta desviaciones y ajusta por sí mismo, sin esperar instrucciones externas. Usa retrospectivas y revisiones posteriores a la acción. La interdependencia refuerza esto: el éxito de cada uno depende del éxito de los demás. Los integrantes se necesitan, lo reconocen y se apoyan.",
  "La comunicación abierta es el tejido que une al equipo: se dice lo que se piensa con respeto y honestidad. La información fluye libremente y no se usa como poder. La diversidad, bien gestionada, aporta más creatividad y mejores decisiones. Sin embargo, no basta con tener diversidad: hace falta inclusión, que todas las voces cuenten.",
  "Los valores que sostienen todo son: proactividad, respeto, responsabilidad, puntualidad, pensamiento crítico y espíritu de superación. La base de todo es la confianza: creer que los demás cumplirán y serán honestos. La seguridad psicológica, acuñada por Edmondson en mil novecientos noventa y nueve, significa poder opinar o equivocarse sin miedo.",
  "Un equipo de alto rendimiento se construye; no surge por casualidad. Combina claridad en propósito, roles y reglas; procesos efectivos de reuniones, toma de decisiones y autocorrección; y relaciones de confianza basadas en comunicación, diversidad e interdependencia. La confianza y la conciencia son la base que sostiene las demás características. Invertir en el equipo mejora resultados, clima laboral y satisfacción personal.",
  "Las fuentes que fundamentan esta presentación incluyen a Katzenbach y Smith con La sabiduría de los equipos; Edmondson con seguridad psicológica y aprendizaje; Hackman con Liderando equipos; Belbin con Equipos de gestión; Ancona y Caldwell sobre actividad externa y rendimiento; Page sobre la diferencia que aporta la diversidad; y la Guía de efectividad de equipos de Google re Work. ¡Muchas gracias por su atención y no te pierdas nuestros reels!",
]

const MEMBERS = [
  "Castillo Alonso Javier",
  "Cerón Díaz Brayan",
  "García Pérez Marco Antonio",
  "Mello Corona Ángel Uriel",
  "Pérez Sandoval Israel Adán",
  "Torales Jiménez Juan Antonio de Jesús",
]

// ─── Shared card style (light) ───────────────────────────────────────────────
const cardLight = (accent = false): React.CSSProperties => ({
  padding: "24px 22px",
  borderRadius: 16,
  background: "#FFFFFF",
  border: `1px solid ${accent ? GOLD : "rgba(197,155,39,0.25)"}`,
  boxShadow: accent
    ? `0 0 0 1px ${GOLD}, 0 16px 40px rgba(197,155,39,0.18)`
    : "0 6px 24px rgba(31,28,27,0.06)",
  display: "flex",
  flexDirection: "column" as const,
  gap: 12,
})

// Shared card style (dark)
const cardDark = (accent = false): React.CSSProperties => ({
  padding: "24px 22px",
  borderRadius: 16,
  background: accent ? "rgba(197,155,39,0.10)" : DARK2,
  border: `1px solid ${accent ? GOLD : "rgba(225,190,83,0.22)"}`,
  boxShadow: accent ? `0 0 24px rgba(197,155,39,0.15)` : "0 8px 32px rgba(0,0,0,0.35)",
  display: "flex",
  flexDirection: "column" as const,
  gap: 12,
})

// ─── Component ───────────────────────────────────────────────────────────────
export interface EditorialWebinar3MinVideoProps {
  isPlaying?: boolean
  onComplete?: () => void
}

export function EditorialWebinar3MinVideo({ isPlaying = true, onComplete }: EditorialWebinar3MinVideoProps) {
  const [sceneIdx, setSceneIdx] = useState(0)
  const [progress] = useState(0)
  const [audioTime, setAudioTime] = useState(0)
  const [elapsed, setElapsed] = useState(0)          // seconds since start
  const rafRef = useRef<number>(0)
  const voiceRunRef = useRef(0)
  const voiceActiveRef = useRef(false)
  const audioTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const speakAIVoice = useCallback((text: string, onEnd: () => void) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "es-ES"
      utterance.rate = 1.05
      utterance.onend = onEnd
      utterance.onerror = onEnd
      window.speechSynthesis.speak(utterance)
    } else {
      onEnd()
    }
  }, [])

  const playVoiceForMode = useCallback((idx: number) => {
    const runId = voiceRunRef.current + 1
    voiceRunRef.current = runId
    voiceActiveRef.current = true

    if ("speechSynthesis" in window) window.speechSynthesis.cancel()
    if (audioTimerRef.current) clearInterval(audioTimerRef.current)

    if (idx >= VOICE_TRACKS.length) {
      if (onComplete) onComplete()
      return
    }

    setSceneIdx(idx)
    setAudioTime(0)
    sfx.playSwitch()

    let t = 0
    audioTimerRef.current = setInterval(() => {
      t += 0.4
      setAudioTime(t)
    }, 400)

    speakAIVoice(NARRATIONS[idx] ?? NARRATIONS[0], () => {
      if (runId !== voiceRunRef.current) return
      voiceActiveRef.current = false
      if (audioTimerRef.current) clearInterval(audioTimerRef.current)
      setTimeout(() => playVoiceForMode(idx + 1), 600)
    })
  }, [speakAIVoice, onComplete])

  // Format elapsed seconds as MM:SS
  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0")
    const sec = (s % 60).toString().padStart(2, "0")
    return `${m}:${sec}`
  }

  useEffect(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel()
    if (audioTimerRef.current) clearInterval(audioTimerRef.current)
    if (elapsedRef.current) clearInterval(elapsedRef.current)
    setSceneIdx(0)
    setAudioTime(0)
    setElapsed(0)
    sfx.playPop()
    playVoiceForMode(0)
    // Start global stopwatch
    elapsedRef.current = setInterval(() => setElapsed(prev => prev + 1), 1000)
    return () => {
      voiceRunRef.current += 1
      voiceActiveRef.current = false
      if ("speechSynthesis" in window) window.speechSynthesis.cancel()
      if (audioTimerRef.current) clearInterval(audioTimerRef.current)
      if (elapsedRef.current) clearInterval(elapsedRef.current)
      cancelAnimationFrame(rafRef.current)
    }
  }, []) // eslint-disable-line

  const handleSceneStep = (step: number) => {
    const next = Math.max(0, Math.min(VOICE_TRACKS.length - 1, sceneIdx + step))
    if (next !== sceneIdx) playVoiceForMode(next)
  }

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handleSceneStep(-1)
      if (e.key === "ArrowRight") handleSceneStep(1)
    }
    window.addEventListener("keydown", fn)
    return () => window.removeEventListener("keydown", fn)
  }, [sceneIdx, playVoiceForMode])

  useEffect(() => {
    if (!isPlaying) {
      voiceActiveRef.current = false
      voiceRunRef.current += 1
      if ("speechSynthesis" in window) window.speechSynthesis.cancel()
      if (audioTimerRef.current) clearInterval(audioTimerRef.current)
      cancelAnimationFrame(rafRef.current)
    } else {
      if (!voiceActiveRef.current) playVoiceForMode(sceneIdx)
    }
  }, [isPlaying, sceneIdx, playVoiceForMode])

  const isDark = VOICE_TRACKS[sceneIdx].isDark
  const total = VOICE_TRACKS.length

  // ── Shared bg styles ──────────────────────────────────────────────────────
  const bgDark: React.CSSProperties = { background: BK }
  const bgLight: React.CSSProperties = { background: G3 }

  // ── Shared layout wrapper ─────────────────────────────────────────────────
  const sceneWrap = (extra?: React.CSSProperties): React.CSSProperties => ({
    position: "relative",
    width: "100%",
    maxWidth: 1250,
    padding: "0 18px",
    ...extra,
  })

  return (
    <div
      style={{
        position: "absolute", inset: 0,
        background: isDark
          ? `radial-gradient(ellipse at 20% 20%, ${DARK2} 0%, ${DARK} 100%)`
          : `radial-gradient(ellipse at 80% 10%, ${CREAM2} 0%, ${CREAM} 100%)`,
        color: isDark ? TXT_L : TXT_D,
        transition: "background 0.5s ease, color 0.4s ease",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        overflow: "hidden",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        userSelect: "none",
        padding: "70px 48px 48px 48px",
      }}
    >
      {/* ── Vector SVG Overlays ── */}
      <SVGGridOverlay isDark={isDark} />
      <SVGCornerAccents isDark={isDark} />
      {/* ── Progress bar ── */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: isDark ? "rgba(201,160,32,0.15)" : "rgba(139,104,16,0.12)", zIndex: 100 }}>
        <motion.div
          style={{ height: "100%", background: `linear-gradient(90deg, ${GOLD3}, ${GOLD}, ${GOLD2})`, transformOrigin: "left", boxShadow: `0 0 12px ${GOLD}88` }}
          animate={{ scaleX: (sceneIdx + progress) / total }}
          transition={{ duration: 0.3, ease: "linear" }}
        />
      </div>

      {/* ── Top rule ── */}
      <motion.div
        key={`rule-${isDark}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "absolute", top: 56, left: 48, right: 48, height: 1, background: isDark ? `${GOLD}55` : `${GOLD3}88`, transformOrigin: "left", zIndex: 80, pointerEvents: "none" }}
      />

      {/* ── Scene marker ── */}
      <div style={{ position: "absolute", top: 20, left: 48, right: 48, display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 90 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "3.5px", color: isDark ? `${GOLD}99` : GOLD3, fontFamily: "var(--font-mono)", textTransform: "uppercase" }}>
          Dirección de Equipos TECH TI 903
        </span>

        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", color: isDark ? `${GOLD}99` : GOLD3, fontFamily: "var(--font-mono)" }}>
          {String(sceneIdx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      {/* ═══════════════════════════ SCENES ════════════════════════════════ */}
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <AnimatePresence mode="wait">

          {/* ── 0: PORTADA ────────────────────────────────────────────────── */}
          {sceneIdx === 0 && (
            <motion.div key="s0"
              initial={{ opacity: 0, scale: 0.96, filter: "blur(12px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.03, filter: "blur(8px)" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={sceneWrap({ display: "flex", flexDirection: "column", gap: 20, alignItems: "center" })}
            >
              {/* Cover image */}
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: "100%", borderRadius: 20, overflow: "hidden", boxShadow: "0 0 0 1px rgba(0,0,0,0.10), 0 40px 100px rgba(0,0,0,0.18)", position: "relative" }}
              >
                <img src="/img/CARATULA TECTI.png" alt="Carátula" style={{ width: "100%", display: "block" }}
                  onError={(e) => { (e.target as HTMLImageElement).src = "img/CARATULA TECTI.png" }}
                />
                {/* Shimmer */}
                <motion.div
                  initial={{ x: "-110%" }} animate={{ x: "110%" }}
                  transition={{ duration: 1.8, delay: 0.5, ease: "easeInOut" }}
                  style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.18) 50%, transparent 62%)", pointerEvents: "none" }}
                />
              </motion.div>
            </motion.div>
          )}

          {/* ── 1: INTRODUCCIÓN ───────────────────────────────────────────── */}
          {sceneIdx === 1 && (
            <motion.div key="s1"
              initial={{ opacity: 0, y: 44, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -28, filter: "blur(8px)" }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              style={sceneWrap({ display: "grid", gridTemplateColumns: "1.15fr 0.85fr", gap: 64 })}
            >
              {/* Ghost number */}
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 0.06 }} transition={{ duration: 0.8 }}
                style={{ position: "absolute", top: -60, left: 0, fontSize: "clamp(9rem, 18vw, 18rem)", fontWeight: 900, lineHeight: 0.8, color: WH, pointerEvents: "none", zIndex: 0 }}>01</motion.span>

              <div style={{ display: "flex", flexDirection: "column", gap: 24, zIndex: 1 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: G4, letterSpacing: "3.5px", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
                  01 / Introducción
                </span>
                <motion.h1 initial={{ y: 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.15, type: "spring", stiffness: 240, damping: 18 }}
                  style={{ fontSize: "clamp(2.4rem, 5vw, 5rem)", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 0.92, color: WH, margin: 0 }}
                >
                  <WordReveal text="¿QUÉ HACE QUE UN EQUIPO FUNCIONE?" staggerDelay={0.05} delayBase={0.18} />
                </motion.h1>

                {audioTime > 1 && (
                  <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
                    style={{ fontSize: "clamp(1.1rem, 1.4vw, 1.3rem)", color: "rgba(255,255,255,0.70)", lineHeight: 1.65, fontWeight: 400, margin: 0 }}
                  >
                    Reunir personas <em>no garantiza</em> un buen equipo. La claridad, la confianza y la comunicación son los verdaderos diferenciadores.
                  </motion.p>
                )}

                {audioTime > 3.5 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
                    style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
                  >
                    {["Proyectos", "Áreas", "Células", "Comités"].map((t, i) => (
                      <motion.span key={t} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        style={{ padding: "8px 18px", borderRadius: 10, background: "rgba(255,255,255,0.09)", border: "1px solid rgba(255,255,255,0.18)", fontSize: 14, fontWeight: 600, color: WH }}
                      >{t}</motion.span>
                    ))}
                  </motion.div>
                )}
              </div>

              <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 24px 60px rgba(0,0,0,0.4)", aspectRatio: "3/4" }}
              >
                <img src={IMG.intro} alt="Introducción" style={bwImg} />
              </motion.div>
            </motion.div>
          )}

          {/* ── 2: DEFINICIÓN ─────────────────────────────────────────────── */}
          {sceneIdx === 2 && (
            <motion.div key="s2"
              initial={{ opacity: 0, x: 60, filter: "blur(12px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -60, filter: "blur(8px)" }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              style={sceneWrap({ display: "flex", flexDirection: "column", gap: 28 })}
            >
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 0.07 }}
                style={{ position: "absolute", top: -60, right: 0, fontSize: "clamp(9rem, 18vw, 18rem)", fontWeight: 900, lineHeight: 0.8, color: G1, pointerEvents: "none" }}>02</motion.span>

              <span style={{ fontSize: 11, fontWeight: 800, color: G2, letterSpacing: "3.5px", textTransform: "uppercase", fontFamily: "var(--font-mono)", zIndex: 1 }}>
                02 / Definición y Conceptos Clave
              </span>

              <motion.h1 initial={{ y: 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, type: "spring", stiffness: 240, damping: 20 }}
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 4.8rem)", fontWeight: 900, letterSpacing: "-0.02em", color: G1, lineHeight: 0.92, zIndex: 1, margin: 0 }}
              >
                <WordReveal text="GRUPO VS. EQUIPO: LA SINERGIA MARCA LA DIFERENCIA." staggerDelay={0.05} delayBase={0.12} />
              </motion.h1>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, zIndex: 1 }}>
                {[
                  { Icon: IconLink, label: "EQUIPO", desc: "Pocas personas con habilidades complementarias, propósito común y responsabilidad mutua.", accent: false },
                  { Icon: IconStar, label: "ALTO RENDIMIENTO", desc: "Comprometidos además con el crecimiento y éxito de los demás. Autodirigidos y altamente productivos.", accent: true },
                  { Icon: IconTarget, label: "SINERGIA", desc: "El resultado colectivo supera la suma de aportes individuales. Interdependencia real.", accent: false },
                ].map(({ Icon, label, desc, accent }, i) => (
                  <motion.div key={label}
                    initial={{ opacity: 0, y: 24, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    style={cardLight(accent)}
                  >
                    <Icon color={accent ? G1 : G2} />
                    <span style={{ fontSize: 14.5, fontWeight: 800, color: G1, letterSpacing: "1.2px" }}>{label}</span>
                    <p style={{ fontSize: 13.5, color: G2, lineHeight: 1.6, margin: 0 }}>{desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Diagrama SVG de Sinergia y Nodos */}
              <SVGSynergyDiagram color={GOLD} />

              {audioTime > 4.5 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={{ padding: "16px 22px", borderRadius: 14, background: G1, zIndex: 1 }}
                >
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.88)", margin: 0, lineHeight: 1.55 }}>
                    <strong style={{ color: WH }}>Katzenbach & Smith (1993):</strong> "Un equipo de alto rendimiento cuyos miembros se comprometen con el crecimiento y éxito mutuos."
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── 3: FACTORES ───────────────────────────────────────────────── */}
          {sceneIdx === 3 && (
            <motion.div key="s3"
              initial={{ opacity: 0, y: 52, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -36, filter: "blur(8px)" }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              style={sceneWrap({ display: "flex", flexDirection: "column", gap: 28 })}
            >
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 0.06 }}
                style={{ position: "absolute", top: -60, right: 0, fontSize: "clamp(9rem, 18vw, 18rem)", fontWeight: 900, lineHeight: 0.8, color: WH, pointerEvents: "none" }}>03</motion.span>

              <span style={{ fontSize: 11, fontWeight: 800, color: G4, letterSpacing: "3.5px", textTransform: "uppercase", fontFamily: "var(--font-mono)", zIndex: 1 }}>
                03 / Factores: Propósito y Roles
              </span>

              <motion.h1 initial={{ y: 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, type: "spring", stiffness: 240, damping: 20 }}
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 4.6rem)", fontWeight: 900, letterSpacing: "-0.02em", color: WH, lineHeight: 0.92, zIndex: 1, margin: 0 }}
              >
                <WordReveal text="CLARIDAD MÁS ROLES IGUAL A SINERGIA MÁXIMA." staggerDelay={0.06} delayBase={0.14} />
              </motion.h1>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, zIndex: 1 }}>
                {[
                  { Icon: IconTarget, label: "Propósito Claro y Compartido", desc: "Alineación estratégica: todos comprenden la misión, visión y objetivos. El propósito se asume con convicción personal.", accent: true },
                  { Icon: IconClipboard, label: "Responsabilidades Definidas", desc: "Cada rol responde a las fortalezas del individuo, maximizando la sinergia colectiva y eliminando duplicidades.", accent: false },
                  { Icon: IconSettings, label: "Reglas de Funcionamiento", desc: "Acuerdos explícitos sobre tiempos, canales de comunicación, gestión de tareas y ética de trabajo.", accent: false },
                  { Icon: IconShield, label: "Sentido de Pertenencia", desc: "El propósito no es solo una meta corporativa: es una causa asumida con convicción por cada integrante.", accent: false },
                ].map(({ Icon, label, desc, accent }, i) => (
                  <motion.div key={label}
                    initial={{ opacity: 0, y: 20, scale: 0.92 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={cardDark(accent)}
                  >
                    <Icon color={WH} />
                    <span style={{ fontSize: 14, fontWeight: 800, color: WH, letterSpacing: "0.5px" }}>{label}</span>
                    <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, margin: 0 }}>{desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── 4: PLAN DE TRABAJO ────────────────────────────────────────── */}
          {sceneIdx === 4 && (
            <motion.div key="s4"
              initial={{ opacity: 0, x: -60, filter: "blur(12px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: 60, filter: "blur(8px)" }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              style={sceneWrap({ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 52 })}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: G2, letterSpacing: "3.5px", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
                  04 / Plan de Trabajo y Mecanismos
                </span>

                <motion.h1 initial={{ y: 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, type: "spring", stiffness: 240, damping: 20 }}
                  style={{ fontSize: "clamp(2.2rem, 4.5vw, 4.8rem)", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 0.92, color: G1, margin: 0 }}
                >
                  METAS SMART Y DECISIONES ÁGILES.
                </motion.h1>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { letter: "S", word: "Específica" },
                    { letter: "M", word: "Medible" },
                    { letter: "A", word: "Alcanzable" },
                    { letter: "R", word: "Relevante" },
                    { letter: "T", word: "Con Tiempo definido" },
                  ].map(({ letter, word }, i) => (
                    <motion.div key={letter}
                      initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.18 + i * 0.09, duration: 0.38 }}
                      style={{ display: "flex", alignItems: "center", gap: 16, padding: "11px 16px", borderRadius: 12, background: WH, border: "1px solid rgba(0,0,0,0.09)", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}
                    >
                      <span style={{ width: 28, height: 28, borderRadius: 8, background: G1, display: "grid", placeItems: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 13, fontWeight: 900, color: WH, fontFamily: "var(--font-mono)" }}>{letter}</span>
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: G1 }}>{word}</span>
                    </motion.div>
                  ))}
                  <SVGSmartTimeline color={GOLD} />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260 }}
                  style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(0,0,0,0.10)", boxShadow: "0 24px 60px rgba(0,0,0,0.12)", aspectRatio: "4/3" }}
                >
                  <img src={IMG.plan} alt="Plan de trabajo" style={bwImg} />
                </motion.div>

                {audioTime > 3 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ padding: "14px 16px", borderRadius: 12, background: G1 }}
                  >
                    <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.55 }}>
                      Seguimiento con tableros Kanban o reuniones periódicas de revisión de indicadores de desempeño.
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── 5: AUTOCORRECCIÓN E INTERDEPENDENCIA ─────────────────────── */}
          {sceneIdx === 5 && (
            <motion.div key="s5"
              initial={{ opacity: 0, y: 52, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -36, filter: "blur(8px)" }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              style={sceneWrap({ display: "flex", flexDirection: "column", gap: 28, position: "relative" })}
            >
              <SVGFeedbackLoop color={GOLD} />
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 0.06 }}
                style={{ position: "absolute", top: -60, left: 0, fontSize: "clamp(9rem, 18vw, 18rem)", fontWeight: 900, lineHeight: 0.8, color: WH, pointerEvents: "none" }}>05</motion.span>

              <span style={{ fontSize: 11, fontWeight: 800, color: G4, letterSpacing: "3.5px", textTransform: "uppercase", fontFamily: "var(--font-mono)", zIndex: 1 }}>
                05 / Autocorrección e Interdependencia
              </span>

              <motion.h1 initial={{ y: 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, type: "spring", stiffness: 240, damping: 20 }}
                style={{ fontSize: "clamp(2.2rem, 4.5vw, 4.6rem)", fontWeight: 900, letterSpacing: "-0.02em", color: WH, lineHeight: 0.92, zIndex: 1, margin: 0 }}
              >
                <WordReveal text="EL EQUIPO QUE APRENDE DE SÍ MISMO." staggerDelay={0.06} delayBase={0.14} />
              </motion.h1>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, zIndex: 1 }}>
                <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.18, duration: 0.55 }}
                  style={cardDark(true)}
                >
                  <IconRefresh color={WH} />
                  <span style={{ fontSize: 14, fontWeight: 800, color: WH, letterSpacing: "0.5px" }}>AUTOCORRECCIÓN</span>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: 0 }}>El equipo detecta desviaciones y ajusta sin esperar instrucciones externas. Usa retrospectivas y revisiones posteriores a la acción.</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 4 }}>
                    {["¿Qué hicimos bien?", "¿Qué haremos distinto?", "¿Qué aprendimos?"].map(q => (
                      <span key={q} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>
                        <IconCheck color={WH} size={14} /> {q}
                      </span>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.55 }}
                  style={cardDark(false)}
                >
                  <IconLink color={WH} />
                  <span style={{ fontSize: 14, fontWeight: 800, color: WH, letterSpacing: "0.5px" }}>INTERDEPENDENCIA</span>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, margin: 0 }}>El éxito de cada uno depende del éxito de los demás. Se comparte información, se ofrece y pide ayuda. Elimina el "yo ya terminé lo mío".</p>
                  <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)", marginTop: 4 }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", fontWeight: 600, fontStyle: "italic" }}>Independencia total = grupo · Interdependencia = equipo</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ── 6: COMUNICACIÓN Y DIVERSIDAD ──────────────────────────────── */}
          {sceneIdx === 6 && (
            <motion.div key="s6"
              initial={{ opacity: 0, x: 60, filter: "blur(12px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -60, filter: "blur(8px)" }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              style={sceneWrap({ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 52 })}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: G2, letterSpacing: "3.5px", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
                  06 / Comunicación y Diversidad
                </span>

                <motion.h1 initial={{ y: 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, type: "spring", stiffness: 240, damping: 20 }}
                  style={{ fontSize: "clamp(2.2rem, 4.5vw, 4.8rem)", fontWeight: 900, letterSpacing: "-0.02em", color: G1, lineHeight: 0.92, margin: 0 }}
                >
                  <WordReveal text="TODAS LAS VOCES FORTALECEN AL EQUIPO." staggerDelay={0.06} delayBase={0.14} />
                </motion.h1>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { Icon: IconMessage, label: "Comunicación abierta", desc: "Se dice lo que se piensa. Escucha activa: atender, preguntar, parafrasear." },
                    { Icon: IconGlobe, label: "Diversidad e inclusión", desc: "Bien gestionada genera creatividad. Hace falta que todas las voces cuenten." },
                    { Icon: IconLink, label: "Relaciones externas", desc: "El equipo gestiona expectativas con clientes, proveedores y otras áreas." },
                  ].map(({ Icon, label, desc }, i) => (
                    <motion.div key={label}
                      initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
                      style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 16px", borderRadius: 12, background: WH, border: "1px solid rgba(0,0,0,0.09)", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}
                    >
                      <div style={{ flexShrink: 0, marginTop: 2 }}><Icon color={G2} /></div>
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: G1, display: "block" }}>{label}</span>
                        <span style={{ fontSize: 12, color: G2, lineHeight: 1.5 }}>{desc}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(0,0,0,0.10)", boxShadow: "0 24px 60px rgba(0,0,0,0.12)", aspectRatio: "3/4" }}
              >
                <img src={IMG.comms} alt="Comunicación" style={bwImg} />
              </motion.div>
            </motion.div>
          )}

          {/* ── 7: VALORES Y CONFIANZA ────────────────────────────────────── */}
          {sceneIdx === 7 && (
            <motion.div key="s7"
              initial={{ opacity: 0, y: 44, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -28, filter: "blur(8px)" }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              style={sceneWrap({ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 52 })}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: G4, letterSpacing: "3.5px", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
                  07 / Valores, Actitudes y Confianza
                </span>

                <motion.h1 initial={{ y: 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, type: "spring", stiffness: 240, damping: 20 }}
                  style={{ fontSize: "clamp(2.2rem, 4.5vw, 4.6rem)", fontWeight: 900, letterSpacing: "-0.02em", color: WH, lineHeight: 0.92, margin: 0 }}
                >
                  <WordReveal text="EL CARÁCTER QUE SOSTIENE AL EQUIPO." staggerDelay={0.06} delayBase={0.14} />
                </motion.h1>

                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {[
                    "Proactividad e iniciativa",
                    "Respeto y responsabilidad",
                    "Puntualidad como señal de compromiso",
                    "Pensamiento crítico y analítico",
                    "Superación personal constante",
                  ].map((v, i) => (
                    <motion.div key={v}
                      initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.08, duration: 0.38 }}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      <IconCheck color={WH} size={15} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{v}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260 }}
                  style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 24px 60px rgba(0,0,0,0.4)", aspectRatio: "1/1" }}
                >
                  <img src={IMG.trust} alt="Confianza" style={bwImg} />
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  style={{ padding: "16px 18px", borderRadius: 14, background: WH }}
                >
                  <span style={{ fontSize: 12, fontWeight: 800, color: G1, display: "block", marginBottom: 5, letterSpacing: "0.5px" }}>SEGURIDAD PSICOLÓGICA</span>
                  <p style={{ fontSize: 12, color: G2, lineHeight: 1.55, margin: 0 }}>
                    Edmondson (1999): poder opinar o equivocarse <em>sin miedo a ser humillado</em>. La base del aprendizaje organizacional.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ── 8: CONCLUSIÓN ─────────────────────────────────────────────── */}
          {sceneIdx === 8 && (
            <motion.div key="s8"
              initial={{ opacity: 0, scale: 0.74, filter: "blur(14px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.06, filter: "blur(8px)" }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              style={sceneWrap({ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 52 })}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 26, justifyContent: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: G2, letterSpacing: "3.5px", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
                  08 / Conclusión
                </span>

                <motion.h1 initial={{ y: 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  style={{ fontSize: "clamp(2.4rem, 5vw, 5.2rem)", fontWeight: 900, letterSpacing: "-0.03em", color: G1, lineHeight: 0.9, margin: 0 }}
                >
                  UN EQUIPO SE CONSTRUYE, NO SURGE POR CASUALIDAD.
                </motion.h1>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { label: "CLARIDAD", desc: "Propósito · Roles · Reglas · Plan" },
                    { label: "PROCESOS", desc: "Reuniones · Decisiones · Autocorrección" },
                    { label: "CONFIANZA", desc: "Comunicación · Diversidad · Seguridad psicológica" },
                  ].map((item, i) => (
                    <motion.div key={item.label}
                      initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.12, duration: 0.45 }}
                      style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 18px", borderRadius: 12, background: WH, border: "1px solid rgba(0,0,0,0.09)", boxShadow: "0 3px 12px rgba(0,0,0,0.05)" }}
                    >
                      <span style={{ width: 4, height: 36, borderRadius: 2, background: G1, flexShrink: 0 }} />
                      <div>
                        <span style={{ fontSize: 12, fontWeight: 800, color: G1, display: "block", letterSpacing: "1.5px" }}>{item.label}</span>
                        <span style={{ fontSize: 12, color: G2 }}>{item.desc}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                style={{ borderRadius: 20, overflow: "hidden", border: "1px solid rgba(0,0,0,0.10)", boxShadow: "0 24px 60px rgba(0,0,0,0.12)", aspectRatio: "3/4" }}
              >
                <img src={IMG.conclusion} alt="Conclusión" style={bwImg} />
              </motion.div>
            </motion.div>
          )}

          {/* ── 9: REFERENCIAS ────────────────────────────────────────────── */}
          {sceneIdx === 9 && (
            <motion.div key="s9"
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -28, filter: "blur(8px)" }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              style={sceneWrap({ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 52 })}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 22, justifyContent: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: G4, letterSpacing: "3.5px", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
                  09 / Referencias
                </span>

                <motion.h1 initial={{ y: 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  style={{ fontSize: "clamp(3rem, 7vw, 6rem)", fontWeight: 900, letterSpacing: "-0.04em", color: WH, lineHeight: 0.88, margin: 0 }}
                >
                  GRACIAS POR SU ATENCIÓN.
                </motion.h1>

                {/* Team block */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  style={{ padding: "18px 20px", borderRadius: 14, background: WH }}
                >
                  <span style={{ fontSize: 12, fontWeight: 800, color: G1, display: "block", marginBottom: 10, letterSpacing: "1px" }}>
                    EQUIPO 4 · ITIC-903M · UTN
                  </span>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    {MEMBERS.map((nombre) => (
                      <span key={nombre} style={{ fontSize: 12, color: G2, display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: G2, flexShrink: 0 }} />{nombre}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Reels Callout Banner */}
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                  style={{ padding: "12px 18px", borderRadius: 12, background: `linear-gradient(135deg, ${GOLD3}, ${GOLD})`, color: WH, display: "flex", alignItems: "center", gap: 10, boxShadow: `0 6px 20px ${GOLD}44` }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                  <span style={{ fontSize: 12.5, fontWeight: 900, letterSpacing: "1.2px", textTransform: "uppercase" }}>
                    ¡NO TE PIERDAS NUESTROS REELS!
                  </span>
                </motion.div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, justifyContent: "center" }}>
                {[
                  { authors: "Katzenbach & Smith (1993)", work: "The wisdom of teams. Harvard Business School Press." },
                  { authors: "Edmondson, A. (1999)", work: "Psychological safety and learning behavior in work teams. ASQ, 44(2)." },
                  { authors: "Hackman, J. R. (2002)", work: "Leading teams: Setting the stage for great performances. HBSP." },
                  { authors: "Belbin, R. M. (1981)", work: "Management teams: Why they succeed or fail. Heinemann." },
                  { authors: "Ancona & Caldwell (1992)", work: "Bridging the boundary: External activity and performance. ASQ, 37(4)." },
                  { authors: "Page, S. E. (2007)", work: "The difference. Princeton University Press." },
                  { authors: "Google re:Work (s.f.)", work: "Guide: Understand team effectiveness." },
                ].map((ref, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.07, duration: 0.4 }}
                    style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <span style={{ fontSize: 12, fontWeight: 800, color: WH, display: "block" }}>{ref.authors}</span>
                    <span style={{ fontSize: 11.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>{ref.work}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── Keyboard nav hint ── */}
      <div style={{ position: "absolute", bottom: 52, left: "50%", transform: "translateX(-50%)", zIndex: 95, display: "none", alignItems: "center", gap: 14, padding: "8px 12px", borderRadius: 100, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.10)", backdropFilter: "blur(18px)" }}>
        <button onClick={() => handleSceneStep(-1)} disabled={sceneIdx === 0} aria-label="Anterior"
          style={{ width: 42, height: 42, borderRadius: "50%", border: "none", background: sceneIdx === 0 ? "rgba(128,128,128,0.16)" : G1, color: WH, display: "grid", placeItems: "center", cursor: sceneIdx === 0 ? "not-allowed" : "pointer", opacity: sceneIdx === 0 ? 0.4 : 1 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <span style={{ minWidth: 60, textAlign: "center", color: isDark ? WH : G1, fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 800 }}>
          {String(sceneIdx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <button onClick={() => handleSceneStep(1)} disabled={sceneIdx === total - 1} aria-label="Siguiente"
          style={{ width: 42, height: 42, borderRadius: "50%", border: "none", background: sceneIdx === total - 1 ? "rgba(128,128,128,0.16)" : G1, color: WH, display: "grid", placeItems: "center", cursor: sceneIdx === total - 1 ? "not-allowed" : "pointer", opacity: sceneIdx === total - 1 ? 0.4 : 1 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>
    </div>
  )
}
