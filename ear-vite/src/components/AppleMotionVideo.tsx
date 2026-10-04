import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { sfx } from "../lib/sfx"

// Apple Palette Constants
const LIGHT_CANVAS = "#F5F5F7"
const DARK_CANVAS = "#1C1C1E"
const APPLE_BLUE = "#0071E3"
const APPLE_CYAN = "#00C7BE"
const APPLE_PINK = "#FF2D55"
const APPLE_YELLOW = "#FFCC00"

export interface AppleMotionVideoProps {
  isPlaying?: boolean
  onComplete?: () => void
}

export function AppleMotionVideo({ isPlaying = true, onComplete }: AppleMotionVideoProps) {
  const [time, setTime] = useState(0) // 0 to 15 seconds
  const [beat, setBeat] = useState(1) // 1 to 7 beats
  const rafRef = useRef<number>(0)
  const startTimeRef = useRef<number | null>(null)

  // 15-Second Master Clock
  useEffect(() => {
    if (!isPlaying) {
      startTimeRef.current = null
      cancelAnimationFrame(rafRef.current)
      return
    }

    const loop = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = (timestamp - startTimeRef.current) / 1000
      const clamped = Math.min(elapsed, 15)
      setTime(clamped)

      // Determine current Beat
      if (clamped < 2.0) {
        setBeat(1)
      } else if (clamped < 3.8) {
        setBeat(2)
      } else if (clamped < 5.5) {
        setBeat(3)
      } else if (clamped < 7.5) {
        setBeat(4)
      } else if (clamped < 9.5) {
        setBeat(5)
      } else if (clamped < 12.0) {
        setBeat(6)
      } else {
        setBeat(7)
      }

      if (clamped >= 15) {
        if (onComplete) onComplete()
      } else {
        rafRef.current = requestAnimationFrame(loop)
      }
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isPlaying, onComplete])

  // Play sound FX on beat switches
  const prevBeatRef = useRef<number>(1)
  useEffect(() => {
    if (beat !== prevBeatRef.current) {
      if (beat === 3 || beat === 5 || beat === 6) {
        sfx.playSwitch()
      } else if (beat === 2 || beat === 4) {
        sfx.playPop()
      } else if (beat === 7) {
        sfx.playSubImpact()
      } else {
        sfx.playScribble()
      }
      prevBeatRef.current = beat
    }
  }, [beat])

  // Determine current canvas background color (Hard Light/Dark switches)
  const isDark = beat === 3 || beat === 4 || beat === 6 || beat === 7
  const canvasBg = isDark ? DARK_CANVAS : LIGHT_CANVAS
  const textColor = isDark ? "#FFFFFF" : "#1D1D1F"

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: canvasBg,
        color: textColor,
        transition: "background-color 0.05s step-end", // Brusque abrupt switch
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        fontFamily: "'Inter', -apple-system, sans-serif",
        userSelect: "none",
      }}
    >
      {/* ── 15S TIME PROGRESS HAIRLINE ── */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: "rgba(0,0,0,0.06)", zIndex: 100 }}>
        <div
          style={{
            height: "100%",
            width: `${(time / 15) * 100}%`,
            background: isDark ? APPLE_CYAN : APPLE_BLUE,
            transition: "width 0.05s linear",
          }}
        />
      </div>

      {/* ── TIMER COUNTER BADGE ── */}
      <div style={{
        position: "absolute",
        top: 20,
        right: 24,
        fontSize: 11,
        fontWeight: 800,
        fontFamily: "var(--font-mono)",
        color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
        zIndex: 90,
      }}>
        00:{time.toFixed(1).padStart(4, "0")} / 00:15.0
      </div>

      {/* ── BEAT CONTENT DISPLAY ── */}
      <AnimatePresence mode="wait">
        {/* BEAT 1: (0.0s - 2.0s) Kinetic Text + Hand-Drawn Marker Underline */}
        {beat === 1 && (
          <motion.div
            key="beat1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
          >
            <motion.span
              initial={{ scale: 0.3, opacity: 0, y: 50 }}
              animate={{ scale: [0.3, 1.15, 1], opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 350, damping: 20 }}
              style={{
                fontSize: "clamp(4rem, 12vw, 9rem)",
                fontWeight: 900,
                letterSpacing: "-0.05em",
                lineHeight: 0.9,
                color: "#1D1D1F",
                textTransform: "uppercase",
              }}
            >
              EQUIPOS
            </motion.span>

            <div style={{ position: "relative", display: "inline-block" }}>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 3rem)",
                  fontWeight: 800,
                  color: APPLE_BLUE,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                }}
              >
                DE ALTO RENDIMIENTO
              </motion.span>

              {/* Hand-drawn marker stroke underline SVG */}
              <svg
                width="100%"
                height="24"
                viewBox="0 0 300 24"
                fill="none"
                style={{ position: "absolute", bottom: -14, left: 0 }}
              >
                <motion.path
                  d="M 5,12 Q 75,2 150,14 T 295,10"
                  stroke={APPLE_PINK}
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
                />
              </svg>
            </div>
          </motion.div>
        )}

        {/* BEAT 2: (2.0s - 3.8s) Physics Bouncing Ball Squash & Stretch + Node Split */}
        {beat === 2 && (
          <motion.div
            key="beat2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 32 }}
          >
            {/* Squash & Stretch Bouncing Sphere */}
            <motion.div
              animate={{
                y: [ -120, 0, -60, 0 ],
                scaleY: [ 1, 0.6, 1, 0.75 ],
                scaleX: [ 1, 1.4, 1, 1.3 ],
              }}
              transition={{
                duration: 1.2,
                times: [ 0, 0.4, 0.7, 1 ],
                ease: "easeInOut",
              }}
              style={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${APPLE_BLUE}, ${APPLE_CYAN})`,
                boxShadow: "0 20px 40px rgba(0,113,227,0.3)",
              }}
            />

            {/* Split Sinergia formula */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
              style={{ display: "flex", alignItems: "center", gap: 16 }}
            >
              <span style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 900, color: "#1D1D1F" }}>
                SINERGIA
              </span>
              <span style={{
                padding: "6px 16px",
                borderRadius: 100,
                background: APPLE_CYAN,
                color: "#FFFFFF",
                fontSize: "clamp(1.2rem, 3vw, 2rem)",
                fontWeight: 900,
              }}>
                1 + 1 = 3+
              </span>
            </motion.div>
          </motion.div>
        )}

        {/* BEAT 3: (3.8s - 5.5s) HARD DARK SWITCH! Kinetic Text + Neon Doodle Arrow */}
        {beat === 3 && (
          <motion.div
            key="beat3"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.25 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, textAlign: "center" }}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
              style={{
                fontSize: "clamp(3rem, 9vw, 7rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
                color: "#FFFFFF",
                textTransform: "uppercase",
              }}
            >
              PROPÓSITO<br />COMPARTIDO
            </motion.div>

            {/* Hand-drawn Marker Arrow Doodle */}
            <svg width="240" height="60" viewBox="0 0 240 60" fill="none">
              <motion.path
                d="M 10,30 Q 100,5 200,30 L 180,15 M 200,30 L 185,45"
                stroke={APPLE_YELLOW}
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
              />
            </svg>
          </motion.div>
        )}

        {/* BEAT 4: (5.5s - 7.5s) 6-Pillars Grid with Marker Doodle Box */}
        {beat === 4 && (
          <motion.div
            key="beat4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: "100%", maxWidth: 1000, padding: "0 20px" }}
          >
            <span style={{ fontSize: 13, fontWeight: 800, color: APPLE_CYAN, letterSpacing: "3px", textTransform: "uppercase" }}>
              LOS 6 PILARES
            </span>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, width: "100%" }}>
              {[
                "Visión Compartida",
                "Diversidad Táctica",
                "Seguridad Psicológica",
                "Transparencia Radical",
                "Autonomía Distribuida",
                "Agilidad Adaptativa",
              ].map((pillar, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30, scale: 0.85 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.08, type: "spring", stiffness: 300, damping: 22 }}
                  style={{
                    position: "relative",
                    padding: "20px 16px",
                    borderRadius: 16,
                    background: i === 2 ? "rgba(0,199,190,0.15)" : "rgba(255,255,255,0.06)",
                    border: i === 2 ? `2px solid ${APPLE_CYAN}` : "1px solid rgba(255,255,255,0.1)",
                    fontSize: 16,
                    fontWeight: 800,
                    color: i === 2 ? APPLE_CYAN : "#FFFFFF",
                    textAlign: "center",
                  }}
                >
                  {pillar}
                  {/* Handwritten SVG Marker Doodle Box on Segurança Psicológica */}
                  {i === 2 && (
                    <svg width="100%" height="100%" viewBox="0 0 200 60" fill="none" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                      <motion.rect
                        x="4"
                        y="4"
                        width="192"
                        height="52"
                        rx="12"
                        stroke={APPLE_YELLOW}
                        strokeWidth="3"
                        strokeDasharray="6 4"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                      />
                    </svg>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* BEAT 5: (7.5s - 9.5s) HARD LIGHT SWITCH! Tuckman Pipeline Node Physics */}
        {beat === 5 && (
          <motion.div
            key="beat5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.2 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36, width: "100%", maxWidth: 900 }}
          >
            <span style={{ fontSize: 13, fontWeight: 800, color: APPLE_BLUE, letterSpacing: "3px", textTransform: "uppercase" }}>
              MODELO DE MADURACIÓN
            </span>

            {/* Horizontal Nodes */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", position: "relative" }}>
              {/* Line */}
              <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 3, background: "rgba(0,0,0,0.1)", zIndex: 0 }} />

              {["Formación", "Conflicto", "Normas", "Desempeño", "Evolución"].map((node, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: (i % 2 === 0 ? -40 : 40) }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 350, damping: 18 }}
                  style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div style={{
                    width: i === 3 ? 56 : 40,
                    height: i === 3 ? 56 : 40,
                    borderRadius: "50%",
                    background: i === 3 ? APPLE_BLUE : "#FFFFFF",
                    border: i === 3 ? `4px solid ${APPLE_BLUE}` : "2px solid rgba(0,0,0,0.15)",
                    color: i === 3 ? "#FFFFFF" : "#1D1D1F",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: i === 3 ? 18 : 14,
                    boxShadow: i === 3 ? "0 10px 30px rgba(0,113,227,0.4)" : "none",
                  }}>
                    0{i + 1}
                  </div>
                  <span style={{
                    fontSize: i === 3 ? 16 : 12,
                    fontWeight: i === 3 ? 900 : 600,
                    color: i === 3 ? APPLE_BLUE : "#1D1D1F",
                    textTransform: "uppercase",
                  }}>
                    {node}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* BEAT 6: (9.5s - 12.0s) Code Terminal Typing + Marker Doodle Highlight */}
        {beat === 6 && (
          <motion.div
            key="beat6"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, width: "100%", maxWidth: 800 }}
          >
            <div style={{
              width: "100%",
              padding: "24px 32px",
              borderRadius: 20,
              background: "#111113",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              fontFamily: "var(--font-mono)",
              fontSize: 18,
              color: "#22d3ee",
              position: "relative",
            }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F56" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#27C93F" }} />
              </div>
              <div>
                <span style={{ color: APPLE_PINK }}>const</span> team = <span style={{ color: APPLE_YELLOW }}>new</span> HighPerformanceTeam()
              </div>
              <div style={{ marginTop: 8 }}>
                team.<span style={{ color: APPLE_BLUE }}>executeStrategy</span>(&#123;
              </div>
              <div style={{ paddingLeft: 24, margin: "6px 0", color: "#FFFFFF" }}>
                culture: <span style={{ position: "relative", color: APPLE_YELLOW, fontWeight: 800 }}>
                  "CONFIANZA"
                  {/* Handwritten yellow marker underline */}
                  <svg width="100%" height="12" viewBox="0 0 120 12" fill="none" style={{ position: "absolute", bottom: -4, left: 0 }}>
                    <motion.path
                      d="M 2,6 Q 60,1 118,6"
                      stroke={APPLE_YELLOW}
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.6, duration: 0.4 }}
                    />
                  </svg>
                </span>
              </div>
              <div>&#125;)</div>
            </div>
          </motion.div>
        )}

        {/* BEAT 7: (12.0s - 15.0s) APPLE FINALE LOGO MARK & KINETIC LOCK */}
        {beat === 7 && (
          <motion.div
            key="beat7"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, textAlign: "center" }}
          >
            {/* Apple Style Monogram Vector Logo */}
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
              <motion.circle
                cx="50"
                cy="50"
                r="44"
                stroke={APPLE_CYAN}
                strokeWidth="6"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <motion.path
                d="M 30,50 L 45,65 L 70,35"
                stroke={APPLE_BLUE}
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
              />
            </svg>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              style={{
                fontSize: "clamp(2.5rem, 7vw, 5rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                color: "#FFFFFF",
                textTransform: "uppercase",
              }}
            >
              EQUIPOS DE ALTO RENDIMIENTO
            </motion.div>

            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: APPLE_CYAN,
                letterSpacing: "4px",
                fontFamily: "var(--font-mono)",
                textTransform: "uppercase",
              }}
            >
              2026 EDITION
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
