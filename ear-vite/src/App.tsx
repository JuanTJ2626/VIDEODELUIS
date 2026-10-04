import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { EditorialWebinar3MinVideo } from "./components/EditorialWebinar3MinVideo"
import { Reels1MinVideo } from "./components/Reels1MinVideo"
import "./index.css"

export default function App() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [key, setKey] = useState(0)
  const [showIntro, setShowIntro] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [mode, setMode] = useState<"webinar" | "reels">("webinar")
  const recorderRef = useRef<MediaRecorder | null>(null)
  const recordingStreamRef = useRef<MediaStream | null>(null)
  const recordingChunksRef = useRef<Blob[]>([])
  const reelsWrapperRef = useRef<HTMLDivElement | null>(null)
  const canvasAnimRef = useRef<number | null>(null)

  useEffect(() => {
    const introTimer = window.setTimeout(() => setShowIntro(false), 2400)
    return () => window.clearTimeout(introTimer)
  }, [key, mode])

  const handleReplay = () => {
    setKey(prev => prev + 1)
    setIsPlaying(true)
    setShowIntro(true)
  }

  const handleTogglePlay = () => {
    setIsPlaying(prev => !prev)
  }

  const handleModeSwitch = (newMode: "webinar" | "reels") => {
    if (newMode !== mode) {
      setMode(newMode)
      setKey(prev => prev + 1)
      setIsPlaying(true)
      setShowIntro(true)
    }
  }

  const handleRecording = async () => {
    // ── DETENER ───────────────────────────────────────────────────────────────
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop()
      return
    }

    if (!navigator.mediaDevices?.getDisplayMedia || !window.MediaRecorder) {
      window.alert("Tu navegador no permite grabar. Usa Chrome o Edge.")
      return
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 30, max: 60 } },
        audio: true,
      })

      const mimeType = [
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm",
      ].find((t) => MediaRecorder.isTypeSupported(t)) ?? ""

      let recordStream: MediaStream = stream

      // ── Modo Reels: recortar canvas al panel 9:16 ─────────────────────────
      if (mode === "reels" && reelsWrapperRef.current) {
        const panel = reelsWrapperRef.current

        // Video de preview para leer los frames capturados
        const preview = document.createElement("video")
        preview.srcObject = stream
        preview.muted = true
        await preview.play()

        // Esperar dimensiones reales del stream
        await new Promise<void>((res) => {
          if (preview.videoWidth > 0) res()
          else preview.onloadedmetadata = () => res()
        })

        const rect = panel.getBoundingClientRect()
        // Escala: px CSS → px reales capturados
        const sx = preview.videoWidth  / window.innerWidth
        const sy = preview.videoHeight / window.innerHeight

        const canvas = document.createElement("canvas")
        canvas.width  = Math.round(rect.width  * sx)
        canvas.height = Math.round(rect.height * sy)
        const ctx = canvas.getContext("2d")!

        // Loop de dibujo
        const draw = () => {
          const r = panel.getBoundingClientRect()
          ctx.drawImage(
            preview,
            r.left * sx, r.top * sy,
            r.width * sx, r.height * sy,
            0, 0, canvas.width, canvas.height
          )
          canvasAnimRef.current = requestAnimationFrame(draw)
        }
        draw()

        // Stream del canvas + audio del screen capture
        const canvasStream = canvas.captureStream(30)
        stream.getAudioTracks().forEach((t) => canvasStream.addTrack(t))
        recordStream = canvasStream
      }

      const recorder = new MediaRecorder(recordStream, mimeType ? { mimeType } : undefined)

      recordingStreamRef.current = stream
      recordingChunksRef.current = []
      recorderRef.current = recorder

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordingChunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        // Detener loop de canvas si existe
        if (canvasAnimRef.current) {
          cancelAnimationFrame(canvasAnimRef.current)
          canvasAnimRef.current = null
        }
        const blob = new Blob(recordingChunksRef.current, { type: mimeType || "video/webm" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${mode === "reels" ? "reel" : "webinar"}-equipos-alto-rendimiento-TECH-TI-${new Date().toISOString().slice(0, 10)}.webm`
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

      // Reiniciar desde el inicio
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
                style={{ position: "absolute", inset: 0, zIndex: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, background: "#080b10", color: "#F4F7F7", overflow: "hidden" }}
              >
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

          {/* ── Mode selector bar (Webinar vs Reel) ──────────────────────────── */}
          <div style={{ position: "absolute", top: 16, left: 18, zIndex: 200, display: "flex", gap: 8 }}>
            <button
              onClick={() => handleModeSwitch("webinar")}
              style={{
                padding: "8px 16px", borderRadius: 999,
                border: mode === "webinar" ? "1px solid #E5BE53" : "1px solid rgba(255,255,255,0.2)",
                background: mode === "webinar" ? "#C59B27" : "rgba(8,11,16,0.80)",
                color: "#FFFFFF", fontWeight: 800, fontSize: 12, cursor: "pointer",
                backdropFilter: "blur(12px)", boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                display: "flex", alignItems: "center", gap: 6,
                transition: "all 0.2s ease",
              }}
            >
              🎬 Webinar (3 Min)
            </button>
            <button
              onClick={() => handleModeSwitch("reels")}
              style={{
                padding: "8px 16px", borderRadius: 999,
                border: mode === "reels" ? "1px solid #E5BE53" : "1px solid rgba(255,255,255,0.2)",
                background: mode === "reels" ? "#C59B27" : "rgba(8,11,16,0.80)",
                color: "#FFFFFF", fontWeight: 800, fontSize: 12, cursor: "pointer",
                backdropFilter: "blur(12px)", boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                display: "flex", alignItems: "center", gap: 6,
                transition: "all 0.2s ease",
              }}
            >
              📱 Reel 9:16 (1 Min)
            </button>
          </div>

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

          {/* ── Video principal (Webinar u Horizontal o Reel Vertical 9:16) ──── */}
          {mode === "webinar" ? (
            <EditorialWebinar3MinVideo
              key={key}
              isPlaying={isPlaying}
              onComplete={() => {
                if (recorderRef.current?.state === "recording") {
                  recorderRef.current.stop()
                }
              }}
            />
          ) : (
            <div
              ref={reelsWrapperRef}
              style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 0", zIndex: 50 }}
            >
              <Reels1MinVideo
                key={key}
                isPlaying={isPlaying}
                onComplete={() => {
                  if (recorderRef.current?.state === "recording") {
                    recorderRef.current.stop()
                  }
                }}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
