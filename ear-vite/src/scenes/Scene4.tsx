// Scene 4 — MODELO TUCKMAN
// 21st.dev pattern: Pipeline / timeline node bar centered.
// Motion: Nodes enter one by one from left with spring. Active node (Desempeño)
//   has layoutId="tuckman-active" and a pulsing cyan glow ring.
//   Background shows pillars image blurred behind the pipeline card.

import { motion } from "framer-motion"
import { WordReveal, LabelChip, EASE, SPRING } from "../components/motion-primitives"

const NODES = [
  { num: 1, label: "Formación", active: false },
  { num: 2, label: "Conflicto", active: false },
  { num: 3, label: "Normas", active: false },
  { num: 4, label: "Desempeño", active: true },
  { num: 5, label: "Evolución", active: false },
]

export function Scene4() {
  return (
    <div className="scene" style={{ padding: "6% 7%", flexDirection: "column", gap: 48 }}>
      {/* Image blurred behind as ambient background */}
      <div style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}>
        <img
          src="/assets/scene4_tuckman.jpg"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.06,
            filter: "blur(40px) saturate(0.3)",
          }}
        />
      </div>

      {/* Content */}
      <div style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 48,
        width: "100%",
        maxWidth: 1100,
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <LabelChip variant="indigo">04 / Maduración</LabelChip>
          </motion.div>
          <div>
            <WordReveal
              text="El modelo Tuckman."
              className="scene-heading scene-heading-gradient"
              staggerDelay={0.07}
              delayBase={0.1}
            />
          </div>
        </div>

        {/* Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: EASE }}
          style={{
            width: "100%",
            padding: "36px 48px",
            borderRadius: 28,
            background: "rgba(10,10,20,0.7)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(32px)",
            display: "flex",
            flexDirection: "column",
            gap: 32,
          }}
        >
          {/* Node row */}
          <div className="pipeline-track">
            {NODES.map((node, i) => (
              <div key={i} className="pipeline-node">
                <motion.div
                  layoutId={node.active ? "tuckman-active" : undefined}
                  className={`pipeline-dot ${node.active ? "active" : ""}`}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.12, ...SPRING }}
                >
                  {node.num}
                </motion.div>

                {/* Pulsing ring on active */}
                {node.active && (
                  <motion.div
                    style={{
                      position: "absolute",
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      border: "2px solid rgba(6,182,212,0.5)",
                      top: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                    animate={{ scale: [1, 1.8, 1], opacity: [0.6, 0, 0.6] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}

                <motion.span
                  className={`pipeline-label ${node.active ? "active" : ""}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 + i * 0.12, duration: 0.5 }}
                >
                  {node.label}
                </motion.span>
              </div>
            ))}
          </div>

          {/* Sub stats row */}
          <div style={{ display: "flex", gap: 16, borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20 }}>
            {[
              { key: "Etapa actual", val: "Desempeño" },
              { key: "Cohesión", val: "Alta" },
              { key: "Estado", val: "PERFORMING" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.08, duration: 0.5, ease: EASE }}
                style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}
              >
                <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "1.5px", textTransform: "uppercase" }}>{stat.key}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: i === 2 ? "#22d3ee" : "white", fontFamily: i === 2 ? "var(--font-mono)" : "inherit" }}>{stat.val}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
