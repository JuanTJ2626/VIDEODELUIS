import { motion, type Variants } from "framer-motion"
import type { ReactNode } from "react"

// Easing apple-spring shared across all animations
export const EASE = [0.22, 1, 0.36, 1] as const
export const SPRING = { type: "spring" as const, stiffness: 280, damping: 32, mass: 0.9 }

// Word-by-word reveal using clip mask
interface WordRevealProps {
  text: string
  className?: string
  staggerDelay?: number
  delayBase?: number
}

export function WordReveal({ text, className = "", staggerDelay = 0.05, delayBase = 0 }: WordRevealProps) {
  const words = text.split(" ")
  return (
    <span className={className} style={{ display: "inline-block" }}>
      {words.map((word, i) => (
        <span key={i} className="word-mask" style={{ marginRight: "0.25em" }}>
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 0.7,
              delay: delayBase + i * staggerDelay,
              ease: EASE,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

// Fade + slide in from below
export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: custom * 0.05, ease: EASE },
  }),
}

// Staggered container
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
}

// Scale in
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.88 },
  show: (custom: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { ...SPRING, delay: custom * 0.06 },
  }),
}

// Shared aurora background — rendered once, behind everything
export function AuroraBackground() {
  return (
    <div className="aurora-bg">
      <motion.div
        className="aurora-orb aurora-orb-1"
        animate={{
          x: [0, 40, 0],
          y: [0, 30, 0],
          scale: [1, 1.12, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="aurora-orb aurora-orb-2"
        animate={{
          x: [0, -30, 0],
          y: [0, -20, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="aurora-orb aurora-orb-3"
        animate={{
          x: [0, 20, -20, 0],
          y: [0, -15, 15, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      />
      <div className="grain-overlay" />
    </div>
  )
}

// Horizontal scan line that sweeps top to bottom during transitions
export function ScanLine() {
  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(180deg, transparent 0%, rgba(6,182,212,0.06) 50%, transparent 100%)",
        height: "100%",
        pointerEvents: "none",
        zIndex: 60,
      }}
      initial={{ y: "-100%" }}
      animate={{ y: "200%" }}
      transition={{ duration: 1.4, ease: EASE }}
    />
  )
}

// LabelChip
interface LabelChipProps {
  children: ReactNode
  variant?: "cyan" | "indigo" | "white"
}

export function LabelChip({ children, variant = "cyan" }: LabelChipProps) {
  return (
    <span className={`label-chip label-chip-${variant}`}>
      {children}
    </span>
  )
}

// Glass card
interface GlassCardProps {
  children: ReactNode
  glow?: "cyan" | "indigo" | "none"
  className?: string
  layoutId?: string
}

export function GlassCard({ children, glow = "none", className = "", layoutId }: GlassCardProps) {
  const glowClass = glow === "none" ? "glass-card" : `glass-card glass-card-${glow}`
  if (layoutId) {
    return (
      <motion.div layoutId={layoutId} className={`${glowClass} ${className}`}>
        {children}
      </motion.div>
    )
  }
  return <div className={`${glowClass} ${className}`}>{children}</div>
}
