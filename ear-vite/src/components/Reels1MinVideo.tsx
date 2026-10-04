import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { sfx } from "../lib/sfx"

// ─── Carátula Color Palette ─────────────────────────────────────────────────
const CREAM    = "#FAF6F0"   // Warm refined cream
const DARK     = "#141316"   // Deep rich charcoal
const DARK2    = "#1E1C22"   // Elevated dark card background
const GOLD     = "#C59B27"   // Carátula primary Gold accent
const GOLD2    = "#E5BE53"   // Light gold highlight
const GOLD3    = "#A37B14"   // Deep gold
const BURGUNDY = "#8C2B2E"   // Burgundy detail

// ─── Curated Unsplash Photos (Vertical / Portrait Team Photos) ─────────────
const REEL_IMAGES = [
  "/img/CARATULA TECTI.png", // 0: Portada
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=85", // 1: Grupo vs Equipo
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85", // 2: Factores
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=85", // 3: Metas SMART
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=85", // 4: Autocorrección
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=85", // 5: Comunicación
  "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=800&q=85", // 6: Confianza
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=85", // 7: Conclusión
]

// ─── 1-Min Fast Narrations & Titles (5-7 seconds each = ~55s total) ────────
const REEL_SEGMENTS = [
  {
    title: "DIRECCIÓN DE EQUIPOS",
    subtitle: "TECH TI 903M · ITIC UTN",
    narration: "Bienvenidos a este Reel sobre Dirección de Equipos de Alto Rendimiento, presentado por el Equipo cuatro del grupo ITIC novecientos tres M.",
    keywords: ["#AltoRendimiento", "#TechTI903M", "#UTN", "#Equipo4"],
    isDark: false,
  },
  {
    title: "¿GRUPO O EQUIPO?",
    subtitle: "LA SINERGIA HACE LA DIFERENCIA",
    narration: "Reunir personas no garantiza un equipo. La diferencia es la sinergia: metas claras, compromiso mutuo y crecimiento compartido.",
    keywords: ["#Sinergia", "#EquipoVSGrupo", "#Compromiso"],
    isDark: true,
  },
  {
    title: "PROPÓSITO Y ROLES",
    subtitle: "ALINEACIÓN ESTRATÉGICA",
    narration: "Los equipos extraordinarios tienen tres pilares: propósito claro, roles según fortalezas individuales y reglas explícitas.",
    keywords: ["#Alineación", "#RolesClaros", "#Liderazgo"],
    isDark: false,
  },
  {
    title: "METAS S.M.A.R.T.",
    subtitle: "PLANEACIÓN Y EJECUCIÓN ÁGIL",
    narration: "El plan de trabajo utiliza metas SMART: Específicas, Medibles, Alcanzables, Relevantes y a Tiempo definido.",
    keywords: ["#SMART", "#Kanban", "#Estrategia"],
    isDark: true,
  },
  {
    title: "AUTOCORRECCIÓN",
    subtitle: "APRENDIZAJE CONTINUO",
    narration: "La autocorrección permite ajustar rumbo con retrospectivas sin esperar órdenes externas. Interdependencia en lugar de aislamiento.",
    keywords: ["#Retrospectivas", "#Interdependencia", "#Agile"],
    isDark: false,
  },
  {
    title: "COMUNICACIÓN & DIVERSIDAD",
    subtitle: "INCLUSIÓN QUE GENERA VALOR",
    narration: "Comunicación abierta y escucha activa. La diversidad combinada con inclusión genera máxima creatividad y mejores decisiones.",
    keywords: ["#EscuchaActiva", "#Inclusión", "#Diversidad"],
    isDark: true,
  },
  {
    title: "SEGURIDAD PSICOLÓGICA",
    subtitle: "CONFIANZA TOTAL",
    narration: "Según Edmondson, la seguridad psicológica permite a los integrantes aportar e innovar sin miedo al fracaso o ser juzgados.",
    keywords: ["#Confianza", "#SeguridadPsicológica", "#Cultura"],
    isDark: false,
  },
  {
    title: "¡CONSTRUYE TU EQUIPO!",
    subtitle: "GRACIAS POR VER · REELS TECH TI",
    narration: "Un equipo de alto rendimiento se construye día a día. Muchas gracias por su atención y no te pierdas nuestros próximos reels.",
    keywords: ["#ReelsTech", "#EquipoGanador", "#Síguenos"],
    isDark: true,
  },
]

const MEMBERS = [
  "Castillo Alonso Javier",
  "Cerón Díaz Brayan",
  "García Pérez Marco Antonio",
  "Mello Corona Ángel Uriel",
  "Pérez Sandoval Israel Adán",
  "Torales Jiménez Juan Antonio de Jesús",
]

export interface Reels1MinVideoProps {
  isPlaying?: boolean
  onComplete?: () => void
}

export function Reels1MinVideo({ isPlaying = true, onComplete }: Reels1MinVideoProps) {
  const [segmentIdx, setSegmentIdx] = useState(0)
  const [audioTime, setAudioTime] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const voiceRunRef = useRef(0)
  const voiceActiveRef = useRef(false)
  const audioTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const speakAIVoice = useCallback((text: string, onEnd: () => void) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "es-ES"
      utterance.rate = 1.15 // Fast energetic pace for Reels
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

    if (idx >= REEL_SEGMENTS.length) {
      if (onComplete) onComplete()
      return
    }

    setSegmentIdx(idx)
    setAudioTime(0)
    sfx.playSwitch()

    let t = 0
    audioTimerRef.current = setInterval(() => {
      t += 0.3
      setAudioTime(t)
    }, 300)

    speakAIVoice(REEL_SEGMENTS[idx].narration, () => {
      if (runId !== voiceRunRef.current) return
      voiceActiveRef.current = false
      if (audioTimerRef.current) clearInterval(audioTimerRef.current)
      setTimeout(() => playVoiceForMode(idx + 1), 400)
    })
  }, [speakAIVoice, onComplete])

  const fmtTime = (s: number) => {
    const sec = (s % 60).toString().padStart(2, "0")
    const ms  = Math.floor((s * 10) % 10)
    return `${sec}.${ms}s`
  }

  useEffect(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel()
    if (audioTimerRef.current) clearInterval(audioTimerRef.current)
    if (elapsedRef.current) clearInterval(elapsedRef.current)
    setSegmentIdx(0)
    setAudioTime(0)
    setElapsed(0)
    sfx.playPop()
    playVoiceForMode(0)

    elapsedRef.current = setInterval(() => setElapsed(prev => prev + 1), 1000)
    return () => {
      voiceRunRef.current += 1
      voiceActiveRef.current = false
      if ("speechSynthesis" in window) window.speechSynthesis.cancel()
      if (audioTimerRef.current) clearInterval(audioTimerRef.current)
      if (elapsedRef.current) clearInterval(elapsedRef.current)
    }
  }, []) // eslint-disable-line

  useEffect(() => {
    if (!isPlaying) {
      voiceActiveRef.current = false
      voiceRunRef.current += 1
      if ("speechSynthesis" in window) window.speechSynthesis.cancel()
      if (audioTimerRef.current) clearInterval(audioTimerRef.current)
    } else {
      if (!voiceActiveRef.current) playVoiceForMode(segmentIdx)
    }
  }, [isPlaying, segmentIdx, playVoiceForMode])

  const currentSegment = REEL_SEGMENTS[segmentIdx]
  const isDark = currentSegment.isDark
  const total = REEL_SEGMENTS.length

  const handleNext = () => {
    if (segmentIdx < total - 1) playVoiceForMode(segmentIdx + 1)
  }
  const handlePrev = () => {
    if (segmentIdx > 0) playVoiceForMode(segmentIdx - 1)
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 420,
        height: 760,
        margin: "0 auto",
        borderRadius: 36,
        overflow: "hidden",
        border: `3px solid ${isDark ? GOLD : GOLD3}`,
        boxShadow: `0 0 50px rgba(197,155,39,0.30), 0 30px 90px rgba(0,0,0,0.85)`,
        background: isDark ? DARK : CREAM,
        color: isDark ? CREAM : DARK,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        userSelect: "none",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        transition: "background 0.4s ease, color 0.4s ease",
      }}
    >
      {/* ── Background Image Layer with Zoom Animation ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`img-${segmentIdx}`}
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 0.38, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ position: "absolute", inset: 0, zIndex: 0 }}
        >
          <img
            src={REEL_IMAGES[segmentIdx]}
            alt="Reel segment"
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.05) brightness(0.9)" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: isDark
                ? `linear-gradient(180deg, ${DARK}EE 0%, ${DARK}88 40%, ${DARK}FE 100%)`
                : `linear-gradient(180deg, ${CREAM}EE 0%, ${CREAM}88 40%, ${CREAM}FE 100%)`,
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Top Reels Story Progress Bars ── */}
      <div style={{ position: "absolute", top: 14, left: 16, right: 16, display: "flex", gap: 5, zIndex: 90 }}>
        {REEL_SEGMENTS.map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: "rgba(128,128,128,0.25)",
              overflow: "hidden",
            }}
          >
            <motion.div
              style={{
                height: "100%",
                background: GOLD,
                boxShadow: `0 0 8px ${GOLD}`,
              }}
              initial={{ scaleX: i < segmentIdx ? 1 : 0 }}
              animate={{ scaleX: i < segmentIdx ? 1 : i === segmentIdx ? Math.min(1, audioTime / 6) : 0 }}
              transition={{ duration: 0.2 }}
            />
          </div>
        ))}
      </div>

      {/* ── Reel Top Bar (Channel / Title + Live audio visualizer) ── */}
      <div
        style={{
          position: "relative",
          zIndex: 80,
          padding: "28px 20px 0 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${GOLD}, ${BURGUNDY})`,
              display: "grid",
              placeItems: "center",
              color: "#FFF",
              fontWeight: 900,
              fontSize: 12,
              boxShadow: `0 0 12px ${GOLD}88`,
            }}
          >
            TI
          </div>
          <div>
            <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: "0.5px", display: "block" }}>
              TECH TI 903M
            </span>
            <span style={{ fontSize: 10, color: isDark ? GOLD2 : GOLD3, fontFamily: "var(--font-mono)" }}>
              REEL ESPONÁNEO · 1 MIN
            </span>
          </div>
        </div>

        {/* Floating Audio Wave Visualizer */}
        <div style={{ display: "flex", alignItems: "center", gap: 3, padding: "4px 10px", borderRadius: 20, background: "rgba(197,155,39,0.15)", border: `1px solid ${GOLD}44` }}>
          {[12, 20, 14, 24, 16].map((h, i) => (
            <motion.div
              key={i}
              style={{ width: 3, borderRadius: 2, background: GOLD }}
              animate={{ height: isPlaying ? [6, h, 8] : 6 }}
              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
          <span style={{ fontSize: 10, fontWeight: 800, color: GOLD, fontFamily: "var(--font-mono)", marginLeft: 4 }}>
            {fmtTime(elapsed)}
          </span>
        </div>
      </div>

      {/* ── Main Vertical Story Card Content ── */}
      <div
        style={{
          position: "relative",
          zIndex: 70,
          padding: "0 22px",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          margin: "auto 0",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${segmentIdx}`}
            initial={{ opacity: 0, y: 25, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            {/* Reel Badge */}
            <span
              style={{
                alignSelf: "flex-start",
                fontSize: 10.5,
                fontWeight: 900,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                padding: "4px 12px",
                borderRadius: 999,
                background: isDark ? "rgba(225,190,83,0.18)" : "rgba(163,123,20,0.14)",
                color: isDark ? GOLD2 : GOLD3,
                border: `1px solid ${GOLD}55`,
                fontFamily: "var(--font-mono)",
              }}
            >
              {currentSegment.subtitle}
            </span>

            {/* Reel Main Title */}
            <h2
              style={{
                fontSize: "clamp(1.8rem, 6vw, 2.5rem)",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                lineHeight: 1.02,
                margin: 0,
                color: isDark ? "#FFFFFF" : DARK,
              }}
            >
              {currentSegment.title}
            </h2>

            {/* Reel Narration Extract Card */}
            <div
              style={{
                padding: "16px 18px",
                borderRadius: 18,
                background: isDark ? DARK2 : "#FFFFFF",
                border: `1px solid ${GOLD}44`,
                boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.4)" : "0 8px 24px rgba(31,28,27,0.08)",
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  fontWeight: 500,
                  margin: 0,
                  color: isDark ? "rgba(255,255,255,0.9)" : "rgba(31,28,27,0.9)",
                }}
              >
                {currentSegment.narration}
              </p>
            </div>

            {/* Dynamic Hashtag Chips */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {currentSegment.keywords.map((kw, i) => (
                <motion.span
                  key={kw}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.08 }}
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: GOLD,
                    background: "rgba(197,155,39,0.12)",
                    padding: "3px 10px",
                    borderRadius: 999,
                    border: `1px solid ${GOLD}33`,
                  }}
                >
                  {kw}
                </motion.span>
              ))}
            </div>

            {/* Final Segment: Team Members Callout */}
            {segmentIdx === 7 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: `linear-gradient(135deg, ${GOLD3}, ${GOLD})`,
                  color: "#FFF",
                  marginTop: 6,
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: "1px", display: "block", marginBottom: 4 }}>
                  INTEGRANTES EQUIPO 4:
                </span>
                <p style={{ fontSize: 11, lineHeight: 1.4, margin: 0, opacity: 0.95 }}>
                  {MEMBERS.join(" · ")}
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Reel Right Action Bar (Instagram Reels Floating Icons) ── */}
      <div
        style={{
          position: "absolute",
          right: 14,
          bottom: 100,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          alignItems: "center",
          zIndex: 85,
        }}
      >
        {[
          { icon: "❤️", count: "903k" },
          { icon: "💬", count: "404" },
          { icon: "⚡", count: "Share" },
        ].map(({ icon, count }) => (
          <div key={icon} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.35)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                display: "grid",
                placeItems: "center",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              {icon}
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#FFF", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
              {count}
            </span>
          </div>
        ))}
      </div>

      {/* ── Reel Bottom Controls (Prev / Next Tap Navigation) ── */}
      <div
        style={{
          position: "relative",
          zIndex: 80,
          padding: "16px 20px 24px 20px",
          display: "flex",
          justify: "space-between",
          alignItems: "center",
          background: isDark ? "rgba(20,19,22,0.85)" : "rgba(250,246,240,0.85)",
          backdropFilter: "blur(12px)",
          borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
        }}
      >
        <button
          onClick={handlePrev}
          disabled={segmentIdx === 0}
          style={{
            padding: "8px 16px",
            borderRadius: 999,
            border: `1px solid ${GOLD}55`,
            background: "transparent",
            color: segmentIdx === 0 ? "gray" : GOLD,
            fontWeight: 800,
            fontSize: 12,
            cursor: segmentIdx === 0 ? "not-allowed" : "pointer",
          }}
        >
          ← Ant.
        </button>

        <span style={{ fontSize: 11, fontWeight: 800, color: GOLD, fontFamily: "var(--font-mono)" }}>
          {segmentIdx + 1} / {total} REEL
        </span>

        <button
          onClick={handleNext}
          disabled={segmentIdx === total - 1}
          style={{
            padding: "8px 16px",
            borderRadius: 999,
            border: "none",
            background: GOLD,
            color: "#FFF",
            fontWeight: 800,
            fontSize: 12,
            cursor: segmentIdx === total - 1 ? "not-allowed" : "pointer",
            boxShadow: `0 4px 14px ${GOLD}66`,
          }}
        >
          Sig. →
        </button>
      </div>
    </div>
  )
}
