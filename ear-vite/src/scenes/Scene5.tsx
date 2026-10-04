// Scene 5 — ESTRATEGIA
// 21st.dev pattern: 2x2 bento grid + mono terminal block below.
// Motion: Quad tiles enter with staggered rotateX (flip from top), terminal
//   types in letter by letter using a CSS animation.

import { motion } from "framer-motion"
import { WordReveal, LabelChip, EASE, SPRING, fadeUp } from "../components/motion-primitives"

const STRATS = [
  { num: "01", title: "OKRs", metric: "94%" },
  { num: "02", title: "Feedback", metric: "4.9" },
  { num: "03", title: "Upskilling", metric: "100%" },
  { num: "04", title: "Bienestar", metric: "98%" },
]

export function Scene5() {
  return (
    <div className="scene" style={{ padding: "6% 10%", flexDirection: "column", gap: 40, alignItems: "center" }}>
      {/* Header */}
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <LabelChip variant="white">05 / Estrategia</LabelChip>
        </motion.div>
        <div>
          <WordReveal
            text="Cuatro palancas clave."
            className="scene-heading scene-heading-gradient"
            staggerDelay={0.07}
            delayBase={0.1}
          />
        </div>
      </div>

      {/* 2x2 Bento + image asymmetric layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, width: "100%", maxWidth: 900 }}>
        {/* Left side: 2x2 bento */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {STRATS.map((strat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, rotateX: 25, y: 20 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07, duration: 0.65, ease: EASE }}
              style={{
                borderRadius: 18,
                padding: "20px 18px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 14,
                minHeight: 110,
                transformOrigin: "top center",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.2)",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "1px",
                }}>
                  {strat.num}
                </span>
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.07, ...SPRING }}
                  style={{
                    padding: "3px 8px",
                    borderRadius: 100,
                    background: "rgba(99,102,241,0.12)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    fontSize: 10,
                    fontWeight: 800,
                    color: "#818cf8",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {strat.metric}
                </motion.span>
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: "white" }}>{strat.title}</span>
            </motion.div>
          ))}
        </div>

        {/* Right: image card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: EASE }}
          style={{
            borderRadius: 22,
            overflow: "hidden",
            border: "1px solid rgba(99,102,241,0.2)",
            boxShadow: "0 0 50px rgba(99,102,241,0.1)",
            position: "relative",
          }}
        >
          <img src="/assets/scene5_strategy.jpg" alt="Estrategia" className="scene-img" />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(99,102,241,0.2) 0%, transparent 60%)",
          }} />
        </motion.div>
      </div>

      {/* Terminal block */}
      <motion.div
        custom={10}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mono-terminal"
        style={{
          width: "100%",
          maxWidth: 900,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* macOS dots */}
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          {["#FF5F56", "#FFBD2E", "#27C93F"].map((c, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.8 }} />
          ))}
        </div>
        <span style={{ color: "rgba(255,255,255,0.2)", marginRight: 4 }}>$</span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          npx team init --high-performance --culture=confidence
        </motion.span>
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.9, repeat: Infinity }}
          style={{ width: 8, height: 14, background: "#22d3ee", borderRadius: 2, flexShrink: 0 }}
        />
      </motion.div>
    </div>
  )
}
