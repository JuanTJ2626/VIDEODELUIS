// Scene 2 — EVOLUCIÓN: Tradicional vs. Alto Rendimiento
// 21st.dev pattern: Compare dual card layout.
// Motion: Left card grayed/dim enters from left, RIGHT card receives the
//   shared layoutId="main-hero-card" morphed from Scene1 (collaborative photo).
//   Right card has cyan glow border, left has muted dimmed state.

import { motion } from "framer-motion"
import { WordReveal, LabelChip, fadeUp, scaleIn } from "../components/motion-primitives"

export function Scene2() {
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
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show">
            <LabelChip variant="indigo">02 / Evolución</LabelChip>
          </motion.div>

          <div>
            <WordReveal
              text="Tradicional contra Alto Rendimiento."
              className="scene-heading scene-heading-gradient"
              staggerDelay={0.045}
              delayBase={0.05}
            />
          </div>

          {/* Compare rows */}
          <motion.div
            custom={7}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginTop: 8,
            }}
          >
            {[
              { dim: "Suma aditiva", bright: "Sinergia positiva" },
              { dim: "Objetivos divididos", bright: "Propósito compartido" },
              { dim: "1 + 1 = 2", bright: "1 + 1 = 3+" },
            ].map((row, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                <div style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.3)",
                }}>
                  {row.dim}
                </div>
                <div style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  background: "rgba(6,182,212,0.06)",
                  border: "1px solid rgba(6,182,212,0.2)",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#22d3ee",
                }}>
                  {row.bright}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — Dual card comparing images */}
        <div style={{ display: "flex", gap: 12, alignItems: "stretch", height: "100%" }}>
          {/* ISOLATED card — dim */}
          <motion.div
            variants={scaleIn}
            custom={1}
            initial="hidden"
            animate="show"
            style={{
              flex: "0 0 38%",
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.06)",
              opacity: 0.55,
              filter: "grayscale(60%)",
              position: "relative",
              aspectRatio: "3/4",
            }}
          >
            <img src="/assets/scene2_isolated.jpg" alt="Aislado" className="scene-img" />
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "12px",
              background: "linear-gradient(to top, rgba(5,5,9,0.9) 0%, transparent 100%)",
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "1.5px", textTransform: "uppercase" }}>Tradicional</span>
            </div>
          </motion.div>

          {/* COLLABORATIVE — receives morphed layoutId from Scene 1 */}
          <motion.div
            layoutId="main-hero-card"
            style={{
              flex: 1,
              borderRadius: 24,
              overflow: "hidden",
              border: "1px solid rgba(6,182,212,0.25)",
              boxShadow: "0 0 60px rgba(6,182,212,0.15)",
              position: "relative",
              aspectRatio: "3/4",
            }}
          >
            <img src="/assets/scene2_collaborative.jpg" alt="Colaborativo" className="scene-img" />
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, transparent 60%)",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "16px",
              background: "linear-gradient(to top, rgba(5,5,9,0.85) 0%, transparent 100%)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#22d3ee", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "var(--font-mono)" }}>Alto Rendimiento</span>
                <span style={{
                  padding: "4px 10px",
                  background: "rgba(6,182,212,0.15)",
                  border: "1px solid rgba(6,182,212,0.4)",
                  borderRadius: 100,
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#22d3ee",
                }}>ACTIVO</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
