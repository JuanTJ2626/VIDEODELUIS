import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { sfx } from "../lib/sfx"

// ─── Color Palette ────────────────────────────────────────────────────────────
const CREAM = "#FAF6F0"
const DARK = "#141316"
const DARK2 = "#1E1C22"
const GOLD = "#C59B27"
const GOLD2 = "#E5BE53"
const GOLD3 = "#A37B14"
const BURGUNDY = "#8C2B2E"

// ─── Vertical Portrait Images ─────────────────────────────────────────────────
const REEL_IMAGES = [
  "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=85",
]

// ─── Segments ─────────────────────────────────────────────────────────────────
const REEL_SEGMENTS = [
  {
    title: "DIRECCIÓN DE EQUIPOS",
    subtitle: "UTN",
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
    narration: "Un equipo de alto rendimiento se construye día a día. Muchas gracias por su atención y ¡no te pierdas nuestro Webinar!",
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
  const voiceRunRef = useRef(0)
  const voiceActiveRef = useRef(false)
  const audioTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const speakAIVoice = useCallback((text: string, onEnd: () => void) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "es-ES"
      utterance.rate = 1.1
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

  useEffect(() => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel()
    if (audioTimerRef.current) clearInterval(audioTimerRef.current)
    setSegmentIdx(0)
    setAudioTime(0)
    sfx.playPop()
    playVoiceForMode(0)

    return () => {
      voiceRunRef.current += 1
      voiceActiveRef.current = false
      if ("speechSynthesis" in window) window.speechSynthesis.cancel()
      if (audioTimerRef.current) clearInterval(audioTimerRef.current)
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
      {/* ── Background Image with Fade + Zoom ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`img-${segmentIdx}`}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.65, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.75, ease: "easeOut" }}
          style={{ position: "absolute", inset: 0, zIndex: 0 }}
        >
          <img
            src={REEL_IMAGES[segmentIdx]}
            alt="Reel segment"
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.08) brightness(0.92)" }}
          />
          {/* Subtle gradient so text stays readable */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: isDark
                ? `linear-gradient(180deg, ${DARK}CC 0%, ${DARK}44 45%, ${DARK}DD 100%)`
                : `linear-gradient(180deg, ${CREAM}CC 0%, ${CREAM}44 45%, ${CREAM}DD 100%)`,
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Story Progress Bars ── */}
      <div style={{ position: "absolute", top: 14, left: 16, right: 16, display: "flex", gap: 5, zIndex: 90 }}>
        {REEL_SEGMENTS.map((_, i) => (
          <div
            key={i}
            style={{ flex: 1, height: 3, borderRadius: 2, background: "rgba(128,128,128,0.22)", overflow: "hidden" }}
          >
            <motion.div
              style={{ height: "100%", background: GOLD, boxShadow: `0 0 6px ${GOLD}` }}
              initial={{ scaleX: i < segmentIdx ? 1 : 0 }}
              animate={{ scaleX: i < segmentIdx ? 1 : i === segmentIdx ? Math.min(1, audioTime / 6) : 0 }}
              transition={{ duration: 0.2 }}
            />
          </div>
        ))}
      </div>

      {/* ── Top Bar: Channel Identity + Audio Bars ── */}
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
        {/* Channel label — no icon */}
        <div>
          <span style={{ fontSize: 13, fontWeight: 900, letterSpacing: "0.5px", display: "block", color: isDark ? "#FFFFFF" : DARK }}>
            Equipos de Alto Rendimiento
          </span>
          <span style={{ fontSize: 10, color: isDark ? GOLD2 : GOLD3, fontFamily: "var(--font-mono)" }}>
            UTN · REEL
          </span>
        </div>

        {/* Audio wave bars only — no timer text */}
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          {[10, 18, 12, 22, 14, 20, 11].map((h, i) => (
            <motion.div
              key={i}
              style={{ width: 3, borderRadius: 2, background: GOLD }}
              animate={{ height: isPlaying ? [5, h, 6] : 4 }}
              transition={{ duration: 0.45, repeat: Infinity, delay: i * 0.07, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>

      {/* ── Main Content Card ── */}
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
            initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -18, filter: "blur(6px)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            {/* Subtitle badge */}
            <span
              style={{
                alignSelf: "flex-start",
                fontSize: 10.5,
                fontWeight: 900,
                letterSpacing: "2px",
                textTransform: "uppercase",
                padding: "4px 12px",
                borderRadius: 999,
                background: isDark ? "rgba(225,190,83,0.16)" : "rgba(163,123,20,0.12)",
                color: isDark ? GOLD2 : GOLD3,
                border: `1px solid ${GOLD}44`,
                fontFamily: "var(--font-mono)",
              }}
            >
              {currentSegment.subtitle}
            </span>

            {/* Main title */}
            <h2
              style={{
                fontSize: "clamp(1.75rem, 6vw, 2.4rem)",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                lineHeight: 1.02,
                margin: 0,
                color: isDark ? "#FFFFFF" : DARK,
              }}
            >
              {currentSegment.title}
            </h2>

            {/* Narration card */}
            <div
              style={{
                padding: "15px 17px",
                borderRadius: 18,
                background: isDark ? DARK2 : "#FFFFFF",
                border: `1px solid ${GOLD}44`,
                boxShadow: isDark ? "0 10px 28px rgba(0,0,0,0.45)" : "0 8px 22px rgba(31,28,27,0.08)",
              }}
            >
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.65,
                  fontWeight: 500,
                  margin: 0,
                  color: isDark ? "rgba(255,255,255,0.9)" : "rgba(31,28,27,0.9)",
                }}
              >
                {currentSegment.narration}
              </p>
            </div>

            {/* Keyword chips */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {currentSegment.keywords.map((kw, i) => (
                <motion.span
                  key={kw}
                  initial={{ opacity: 0, scale: 0.82 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.18 + i * 0.07 }}
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

            {/* Slide 0: integrantes en portada */}
            {segmentIdx === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  padding: "11px 14px",
                  borderRadius: 12,
                  background: isDark ? DARK2 : "rgba(255,255,255,0.85)",
                  border: `1px solid ${GOLD}44`,
                  marginTop: 2,
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: "1.5px", display: "block", marginBottom: 5, color: isDark ? GOLD2 : GOLD3, textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
                  Integrantes Equipo 4
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {MEMBERS.map((m, i) => (
                    <span key={i} style={{ fontSize: 11, fontWeight: 600, color: isDark ? "rgba(255,255,255,0.88)" : "rgba(20,19,22,0.88)", lineHeight: 1.4 }}>
                      {i + 1}. {m}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Slide 7: integrantes + webinar CTA */}
            {segmentIdx === 7 && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 12,
                    background: `linear-gradient(135deg, ${GOLD3}, ${GOLD})`,
                    color: "#FFF",
                    marginTop: 4,
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: "1px", display: "block", marginBottom: 4 }}>
                    INTEGRANTES EQUIPO 4:
                  </span>
                  <p style={{ fontSize: 11, lineHeight: 1.45, margin: 0, opacity: 0.95 }}>
                    {MEMBERS.join(" · ")}
                  </p>
                </motion.div>

                {/* Webinar CTA banner */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  style={{
                    padding: "13px 16px",
                    borderRadius: 14,
                    background: DARK2,
                    border: `1.5px solid ${GOLD}66`,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 20 }}>🎬</span>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 900, color: GOLD2, display: "block", letterSpacing: "0.5px" }}>
                      ¡NO TE PIERDAS NUESTRO WEBINAR!
                    </span>
                    <span style={{ fontSize: 10.5, color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-mono)" }}>
                      Versión completa · TECH TI 903M
                    </span>
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Bottom Navigation (Prev / Counter / Next) ── */}
      <div
        style={{
          position: "relative",
          zIndex: 80,
          padding: "14px 20px 22px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: isDark ? "rgba(20,19,22,0.88)" : "rgba(250,246,240,0.88)",
          backdropFilter: "blur(14px)",
          borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}`,
        }}
      >
        <button
          onClick={handlePrev}
          disabled={segmentIdx === 0}
          style={{
            padding: "8px 18px",
            borderRadius: 999,
            border: `1px solid ${GOLD}55`,
            background: "transparent",
            color: segmentIdx === 0 ? (isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)") : GOLD,
            fontWeight: 800,
            fontSize: 12,
            cursor: segmentIdx === 0 ? "not-allowed" : "pointer",
            transition: "opacity 0.2s",
          }}
        >
          ← Ant.
        </button>

        {/* Dot indicators */}
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {REEL_SEGMENTS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === segmentIdx ? 16 : 6,
                height: 6,
                borderRadius: 999,
                background: i === segmentIdx ? GOLD : (isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)"),
                transition: "width 0.3s ease, background 0.3s ease",
              }}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={segmentIdx === total - 1}
          style={{
            padding: "8px 18px",
            borderRadius: 999,
            border: "none",
            background: segmentIdx === total - 1 ? "rgba(197,155,39,0.3)" : GOLD,
            color: "#FFF",
            fontWeight: 800,
            fontSize: 12,
            cursor: segmentIdx === total - 1 ? "not-allowed" : "pointer",
            boxShadow: segmentIdx === total - 1 ? "none" : `0 4px 14px ${GOLD}66`,
            transition: "background 0.2s, box-shadow 0.2s",
          }}
        >
          Sig. →
        </button>
      </div>
    </div>
  )
}
