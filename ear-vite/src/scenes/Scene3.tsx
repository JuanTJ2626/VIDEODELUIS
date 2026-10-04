// Scene 3 — SEIS PILARES
// 21st.dev pattern: Bento grid 6 columns with staggered reveal.
// Motion: Each pillar card enters with scale+fade stagger at 50ms intervals.
//   Active card (Seguridad Psicológica) has cyan glow and larger scale.
//   Top row enters first, then metrics animate into each column.

import { motion } from "framer-motion"
import { WordReveal, LabelChip, EASE, SPRING } from "../components/motion-primitives"

const PILLARS = [
  { num: "01", title: "Visión", sub: "Propósito", metric: "100%", highlight: false },
  { num: "02", title: "Diversidad", sub: "Habilidades", metric: "MAX", highlight: false },
  { num: "03", title: "Seguridad", sub: "Psicológica", metric: "PRO", highlight: true },
  { num: "04", title: "Transparencia", sub: "Radical", metric: "OPEN", highlight: false },
  { num: "05", title: "Autonomía", sub: "Distribuida", metric: "FULL", highlight: false },
  { num: "06", title: "Agilidad", sub: "Adaptativa", metric: "FAST", highlight: false },
]

export function Scene3() {
  return (
    <div className="scene" style={{ padding: "6% 7%", flexDirection: "column", gap: 40 }}>
      {/* Header */}
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <LabelChip variant="cyan">03 / Pilares</LabelChip>
        </motion.div>

        <div>
          <WordReveal
            text="Los seis fundamentos."
            className="scene-heading scene-heading-gradient"
            staggerDelay={0.06}
            delayBase={0.1}
          />
        </div>
      </div>

      {/* Bento grid */}
      <motion.div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: 12,
          width: "100%",
          maxWidth: 1280,
        }}
      >
        {PILLARS.map((pillar, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.82, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              delay: 0.2 + i * 0.05,
              duration: 0.65,
              ease: EASE,
            }}
            style={{
              borderRadius: 20,
              padding: "24px 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              background: pillar.highlight ? "rgba(6,182,212,0.06)" : "rgba(255,255,255,0.03)",
              border: pillar.highlight ? "1px solid rgba(6,182,212,0.28)" : "1px solid rgba(255,255,255,0.07)",
              boxShadow: pillar.highlight ? "0 0 40px rgba(6,182,212,0.1)" : "none",
              position: "relative",
              overflow: "hidden",
              cursor: "default",
            }}
          >
            {/* Background glow for active */}
            {pillar.highlight && (
              <div style={{
                position: "absolute",
                top: "-40%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "120%",
                height: "120%",
                background: "radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />
            )}

            <span style={{
              fontSize: 10,
              fontWeight: 700,
              color: pillar.highlight ? "#22d3ee" : "rgba(255,255,255,0.25)",
              letterSpacing: "2px",
              fontFamily: "var(--font-mono)",
            }}>
              {pillar.num}
            </span>

            <span style={{
              fontSize: 16,
              fontWeight: 800,
              color: pillar.highlight ? "#ffffff" : "rgba(255,255,255,0.7)",
              textAlign: "center",
              lineHeight: 1.2,
            }}>
              {pillar.title}
            </span>

            <span style={{
              fontSize: 11,
              fontWeight: 500,
              color: pillar.highlight ? "rgba(34,211,238,0.7)" : "rgba(255,255,255,0.25)",
              textAlign: "center",
            }}>
              {pillar.sub}
            </span>

            {/* Animated metric appear */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.07, ...SPRING }}
              style={{
                marginTop: 4,
                padding: "4px 10px",
                borderRadius: 100,
                background: pillar.highlight ? "rgba(6,182,212,0.18)" : "rgba(255,255,255,0.06)",
                fontSize: 10,
                fontWeight: 800,
                color: pillar.highlight ? "#22d3ee" : "rgba(255,255,255,0.4)",
                fontFamily: "var(--font-mono)",
                letterSpacing: "1px",
              }}
            >
              {pillar.metric}
            </motion.div>

            {/* Bottom stat bar */}
            <div className="stat-bar-track" style={{ width: "100%", marginTop: 4 }}>
              <motion.div
                className="stat-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${55 + i * 8}%` }}
                transition={{ duration: 1.0, delay: 0.5 + i * 0.06, ease: EASE }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
