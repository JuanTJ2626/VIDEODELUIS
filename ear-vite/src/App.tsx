import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { EditorialWebinar3MinVideo } from "./components/EditorialWebinar3MinVideo"
import "./index.css"

export default function App() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [key, setKey] = useState(0)
  const [showIntro, setShowIntro] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const recordingStreamRef = useRef<MediaStream | null>(null)
  const recordingChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    const introTimer = window.setTimeout(() => setShowIntro(false), 2400)
    return () => window.clearTimeout(introTimer)
  }, [key])

  const handleReplay = () => {
    setKey(prev => prev + 1)
    setIsPlaying(true)
    setShowIntro(true)
  }

  const handleTogglePlay = () => {
    setIsPlaying(prev => !prev)
  }

  const handleRecording = async () => {
    // ── DETENER manualmente si ya graba ──────────────────────────────────────
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop()
      return
    }

    if (!navigator.mediaDevices?.getDisplayMedia || !window.MediaRecorder) {
      window.alert("Tu navegador no permite grabar. Usa Chrome o Edge.")
      return
    }

    try {
      // ── INICIAR grabación ─────────────────────────────────────────────────
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 30, max: 60 } },
        audio: true,
      })

      const mimeType = [
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm",
      ].find((t) => MediaRecorder.isTypeSupported(t)) ?? ""

      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)

      recordingStreamRef.current = stream
      recordingChunksRef.current = []
      recorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordingChunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(recordingChunksRef.current, { type: mimeType || "video/webm" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `equipos-alto-rendimiento-TECH TI-${new Date().toISOString().slice(0, 10)}.webm`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setTimeout(() => URL.revokeObjectURL(url), 15_000)

        recordingStreamRef.current?.getTracks().forEach((t) => t.stop())
        recordingStreamRef.current = null
        recorderRef.current = null
        setIsRecording(false)
      }

      stream.getVideoTracks()[0].addEventListener("ended", () => {
        if (recorder.state === "recording") recorder.stop()
      })

      recorder.start(1000)
      setIsRecording(true)

      // ── Reiniciar el video desde el inicio automáticamente ────────────────
      setKey(prev => prev + 1)
      setIsPlaying(true)
      setShowIntro(true)

    } catch {
      setIsRecording(false)
    }
  }

  return (
    <div style={{ minHeight: "100vh", overflowY: "auto", background: "#050509" }}>
      <div className="stage-root">
        <div className="stage-frame">

          {/* ── Intro splash ─────────────────────────────────────────────────── */}
          <AnimatePresence>
            {showIntro && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 1.08, filter: "blur(18px)" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: "absolute", inset: 0, zIndex: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, background: "radial-gradient(ellipse at 15% 15%, rgba(0,255,214,0.28), transparent 30%), radial-gradient(ellipse at 85% 75%, rgba(255,47,134,0.22), transparent 34%), radial-gradient(ellipse at 50% 45%, rgba(77,110,255,0.22), transparent 52%), conic-gradient(from 210deg at 50% 50%, #080b10, #101a30, #080b10 70%)", color: "#F4F7F7", overflow: "hidden" }}
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1.1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: "absolute", top: "50%", left: "8%", right: "8%", height: 1, background: "rgba(57,230,210,0.75)", transformOrigin: "center", boxShadow: "0 0 24px rgba(57,230,210,0.5)" }}
                />
                <motion.div
                  animate={{ rotate: [0, 360], scale: [1, 1.08, 1] }}
                  transition={{ rotate: { duration: 32, repeat: Infinity, ease: "linear" }, scale: { duration: 8, repeat: Infinity, ease: "easeInOut" } }}
                  style={{ position: "absolute", width: "62vw", height: "62vw", maxWidth: 900, maxHeight: 900, borderRadius: "50%", border: "1px solid rgba(57,230,210,0.12)", boxShadow: "0 0 90px rgba(0,199,190,0.1), inset 0 0 90px rgba(99,102,241,0.08)", pointerEvents: "none" }}
                />
                <motion.span
                  initial={{ opacity: 0, y: 28, letterSpacing: "0.5em" }}
                  animate={{ opacity: 0.65, y: 0, letterSpacing: "0.24em" }}
                  transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(0.65rem, 1.2vw, 0.9rem)", textTransform: "uppercase" }}
                >
                  PRESENTA
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, scale: 0.72, y: 18 }}
                  animate={{ opacity: 1, scale: [0.72, 1.04, 1], y: 0 }}
                  transition={{ duration: 1.05, delay: 0.5, type: "spring", stiffness: 220, damping: 18 }}
                  style={{ margin: 0, fontSize: "clamp(4rem, 14vw, 12rem)", lineHeight: 0.82, fontWeight: 900, letterSpacing: "0.02em", color: "#F4F7F7", textAlign: "center" }}
                >
                  TECH TI
                </motion.h1>
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 0.55, y: 0 }}
                  transition={{ duration: 0.7, delay: 1.15 }}
                  style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(0.65rem, 1vw, 0.8rem)", letterSpacing: "0.2em", textTransform: "uppercase" }}
                >
                  EQUIPOS DE ALTO RENDIMIENTO · ITIC-903M
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Control pill ─────────────────────────────────────────────────── */}
          <div style={{
            position: "absolute", bottom: 16, right: 18,
            zIndex: 100, display: "flex", justifyContent: "flex-end",
            alignItems: "center", pointerEvents: "auto",
          }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "rgba(8,11,16,0.72)", padding: "5px 7px",
              borderRadius: 100, border: "1px solid rgba(141,255,244,0.28)",
              backdropFilter: "blur(20px)", boxShadow: "0 8px 30px rgba(0,0,0,0.24)",
            }}>

              {/* Play / Pause */}
              <button
                onClick={handleTogglePlay}
                title={isPlaying ? "Pausar" : "Reproducir"}
                aria-label={isPlaying ? "Pausar" : "Reproducir"}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, gap: 0, fontSize: 0, color: "#1D1D1F", fontFamily: "var(--font-mono)" }}
              >
                {isPlaying ? (
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="#F4F7F7">
                    <rect x="2" y="1" width="4" height="12" rx="1" />
                    <rect x="8" y="1" width="4" height="12" rx="1" />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="#F4F7F7">
                    <path d="M3 1.5l10 5.5-10 5.5V1.5z" />
                  </svg>
                )}
              </button>

              <div style={{ width: 1, height: 14, background: "rgba(0,0,0,0.15)" }} />

              {/* Grabar / Detener */}
              <button
                onClick={handleRecording}
                title={isRecording ? "Detener y descargar video" : "Grabar video"}
                aria-label={isRecording ? "Detener y descargar video" : "Grabar video"}
                style={{ background: "none", border: "none", cursor: "pointer", display: "grid", placeItems: "center", width: 28, height: 28, padding: 0, fontSize: 0 }}
              >
                <span style={{
                  width: 8, height: 8, borderRadius: isRecording ? "2px" : "50%",
                  background: isRecording ? "#FF2D55" : "#30D158",
                  boxShadow: isRecording ? "0 0 10px rgba(255,45,85,0.8)" : "none",
                  transition: "all .2s",
                }} />
              </button>

              <div style={{ width: 1, height: 14, background: "rgba(0,0,0,0.15)" }} />

              {/* Reiniciar */}
              <button
                onClick={handleReplay}
                title="Reiniciar"
                aria-label="Reiniciar"
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, gap: 0, fontSize: 0, color: "#0071E3" }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
              </button>

            </div>
          </div>

          {/* ── Video principal ───────────────────────────────────────────────── */}
          <EditorialWebinar3MinVideo
            key={key}
            isPlaying={isPlaying}
            onComplete={() => {
              // Detener grabación automáticamente al terminar el video
              if (recorderRef.current?.state === "recording") {
                recorderRef.current.stop()
              }
            }}
          />

        </div>
      </div>
    </div>
  )
}
