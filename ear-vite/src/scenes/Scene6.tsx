// Scene 6 — CONCLUSIÓN
// 21st.dev pattern: GlowShowcaseCard centered with radial spotlight.
// Motion: Receives layoutId="main-hero-card" — the photo card morphs from Scene 2
//   into a background element. Title reveals large with spring.
//   Radial glow pulses around the central card.

import { motion } from "framer-motion"
import { WordReveal, LabelChip, EASE, SPRING } from "../components/motion-primitives"

export function Scene6() {
  return (
    <div className="scene" style={{ padding: "6% 8%", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      {/* Ambient background image */}
      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
      }}>
        <img
          src="/assets/scene6_success.jpg"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.08,
            filter: "blur(50px) saturate(0.4)",
          }}
        />
        {/* Vignette */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at center, transparent 20%, rgba(5,5,9,0.92) 75%)",
        }} />
      </div>

      {/* Central showcase card */}
      <motion.div
        layoutId="main-hero-card"
        style={{
          position: "relative",
          zIndex: 1,
          borderRadius: 32,
          padding: "56px 64px",
          background: "rgba(5,5,9,0.75)",
          border: "1px solid rgba(99,102,241,0.3)",
          backdropFilter: "blur(40px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          textAlign: "center",
          boxShadow: "0 0 100px rgba(99,102,241,0.2), 0 0 40px rgba(6,182,212,0.1)",
          maxWidth: 720,
          width: "100%",
        }}
      >
        {/* Pulsing radial spotlight behind card */}
        <motion.div
          style={{
            position: "absolute",
            inset: -80,
            background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 65%)",
            borderRadius: 80,
            zIndex: -1,
          }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
        >
          <LabelChip variant="indigo">06 / Conclusión</LabelChip>
        </motion.div>

        {/* Status dot row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <motion.div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22d3ee",
              boxShadow: "0 0 12px rgba(6,182,212,0.8)",
            }}
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2.5px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>
            STATUS: OPTIMAL
          </span>
        </motion.div>

        {/* Large title */}
        <div style={{ lineHeight: 0.95 }}>
          <WordReveal
            text="Confianza"
            className="scene-heading"
            staggerDelay={0.08}
            delayBase={0.3}
          />
          <br />
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.65, ...SPRING }}
            className="metric-display metric-display-cyan"
            style={{ display: "block", marginTop: 4 }}
          >
            = Éxito
          </motion.span>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6, ease: EASE }}
          style={{ fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.4)", lineHeight: 1.6, maxWidth: 420 }}
        >
          Liderazgo. Cultura. Resultado.
        </motion.p>

        {/* Bottom mono tag */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            paddingTop: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <span style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            fontWeight: 700,
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "2px",
          }}>
            EQUIPOS · ALTO RENDIMIENTO · 2024
          </span>
        </motion.div>
      </motion.div>
    </div>
  )
}
