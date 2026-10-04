// Scene 1 — SINERGIA
// 21st.dev pattern: Split-hero with large metric reveal + shared layoutId image card.
// Motion: Word-by-word title, scale-in metric "1+1=3+", shared card transitions to Scene 2.

import { motion } from "framer-motion"
import { WordReveal, LabelChip, EASE, SPRING, scaleIn, fadeUp } from "../components/motion-primitives"

export function Scene1() {
  return (
    <div className="scene" style={{ padding: "6% 8%" }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "6%",
        alignItems: "center",
        width: "100%",
        maxWidth: 1400,
      }}>
        {/* LEFT — Text side */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            <LabelChip variant="cyan">01 / Sinergia</LabelChip>
          </motion.div>

          <div className="scene-heading">
            <WordReveal
              text="Cuando el todo supera a las partes."
              className="scene-heading scene-heading-gradient"
              staggerDelay={0.04}
              delayBase={0.1}
            />
          </div>

          <motion.div
            custom={6}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 16,
              marginTop: 8,
            }}
          >
            <span className="metric-display metric-display-cyan">1+1=3+</span>
          </motion.div>

          <motion.div
            custom={8}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.07)",
              paddingTop: 20,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {[
              { label: "Rendimiento", val: "350%" },
              { label: "Sinergia", val: "Alto" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.4)", letterSpacing: "1px", textTransform: "uppercase" }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#22d3ee", fontFamily: "var(--font-mono)" }}>{item.val}</span>
              </div>
            ))}
            <div className="sep-h" style={{ marginTop: 4 }} />
            <motion.div
              className="stat-bar-track"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <motion.div
                className="stat-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: "87%" }}
                transition={{ duration: 1.4, delay: 0.8, ease: EASE }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT — Shared photo card (layoutId for morph into Scene 2) */}
        <motion.div
          layoutId="main-hero-card"
          style={{
            borderRadius: 24,
            overflow: "hidden",
            aspectRatio: "4/3",
            border: "1px solid rgba(6,182,212,0.2)",
            boxShadow: "0 0 80px rgba(6,182,212,0.12)",
            position: "relative",
          }}
          variants={scaleIn}
          custom={2}
          initial="hidden"
          animate="show"
        >
          <img
            src="/assets/scene1_synergy.jpg"
            alt="Sinergia"
            className="scene-img"
          />
          {/* Overlay gradient bottom */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40%",
            background: "linear-gradient(to top, rgba(5,5,9,0.8) 0%, transparent 100%)",
          }} />
          {/* Corner badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, ...SPRING }}
            style={{
              position: "absolute",
              bottom: 16,
              left: 16,
              padding: "6px 14px",
              background: "rgba(5,5,9,0.7)",
              border: "1px solid rgba(6,182,212,0.3)",
              borderRadius: 100,
              fontSize: 11,
              fontWeight: 700,
              color: "#22d3ee",
              letterSpacing: "1.5px",
              backdropFilter: "blur(12px)",
              fontFamily: "var(--font-mono)",
            }}
          >
            TEAM · SYNERGY
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
