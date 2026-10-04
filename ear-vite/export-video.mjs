/**
 * export-video.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Exporta el video de la animación a MP4 con UN SOLO COMANDO.
 * No necesitas grabar la pantalla manualmente.
 *
 * Cómo funciona:
 *   1. Inicia el servidor Vite automáticamente
 *   2. Abre Chrome headless con Puppeteer
 *   3. Graba la animación usando Chrome DevTools screencast (sin ventana visible)
 *   4. Ensambla los frames en MP4 H.264 con ffmpeg-static
 *   5. Guarda el archivo en esta carpeta
 *
 * Uso:
 *   npm run export
 *   (o directamente: node export-video.mjs)
 *
 * Resultado: video-alto-rendimiento-FECHA.mp4 en la carpeta ear-vite/
 * ─────────────────────────────────────────────────────────────────────────────
 */

import puppeteer       from "puppeteer"
import { execFileSync, spawn } from "child_process"
import { createRequire }       from "module"
import { mkdirSync, rmSync, existsSync, writeFileSync } from "fs"
import { join, resolve }       from "path"

const require    = createRequire(import.meta.url)
const ffmpegPath = require("ffmpeg-static")

// ─── Configuración ────────────────────────────────────────────────────────────
const WIDTH      = 1280
const HEIGHT     = 720
const FPS        = 24
const DURATION   = 182          // segundos (un poco más que 3 min para capturar el final)
const FRAMES_DIR = resolve("./export-frames")
const DATE_STR   = new Date().toISOString().slice(0, 10)
const OUTPUT     = resolve(`./video-alto-rendimiento-${DATE_STR}.mp4`)
const DEV_PORT   = 5174

// ─── Helpers ──────────────────────────────────────────────────────────────────
const log   = (msg) => process.stdout.write(`\r\x1b[K  ${msg}`)
const logLn = (msg) => console.log(msg)
const sleep = (ms) => new Promise(r => setTimeout(r, ms))

function startVite() {
  return new Promise((res) => {
    const proc = spawn(
      process.platform === "win32" ? "node" : "node",
      ["node_modules/vite/bin/vite.js", "--port", String(DEV_PORT), "--strictPort", "--logLevel", "silent"],
      { stdio: ["ignore", "pipe", "pipe"], shell: false }
    )
    const ready = (data) => {
      if (data.toString().includes(String(DEV_PORT)) || data.toString().includes("localhost")) {
        res(proc)
      }
    }
    proc.stdout.on("data", ready)
    proc.stderr.on("data", ready)
    // Fallback: resolver tras 10s aunque no detectemos la línea
    setTimeout(() => res(proc), 10_000)
  })
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  logLn("\n🎬  EXPORTADOR DE VIDEO")
  logLn("    Equipos de Alto Rendimiento\n")

  // Preparar carpeta de frames
  if (existsSync(FRAMES_DIR)) rmSync(FRAMES_DIR, { recursive: true })
  mkdirSync(FRAMES_DIR, { recursive: true })

  // ── 1. Iniciar Vite ────────────────────────────────────────────────────────
  logLn("⚙   Iniciando servidor Vite…")
  const viteProc = await startVite()
  await sleep(3000)
  logLn(`✓   Vite listo en http://localhost:${DEV_PORT}`)

  // ── 2. Lanzar Chrome headless ──────────────────────────────────────────────
  logLn("🌐  Abriendo Chrome headless…")
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-web-security",
      "--allow-file-access-from-files",
      "--disable-features=VizDisplayCompositor",
      `--window-size=${WIDTH},${HEIGHT}`,
    ],
    defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 },
  })

  const page = await browser.newPage()
  page.on("console", () => {})
  page.on("pageerror", () => {})

  // ── 3. Cargar la animación ─────────────────────────────────────────────────
  logLn("📄  Cargando la animación…")
  await page.goto(`http://localhost:${DEV_PORT}`, {
    waitUntil: "networkidle0",
    timeout: 30_000,
  })

  // Esperar que el intro splash desaparezca (2.4s) + margen
  await sleep(4000)

  // Ocultar la pill de controles para que no salga en el video
  await page.evaluate(() => {
    // Ocultar botones de control
    document.querySelectorAll('[style*="bottom: 16"]').forEach(el => {
      (el as HTMLElement).style.display = "none"
    })
  })

  // Reiniciar la animación para que empiece desde el principio
  await page.evaluate(() => {
    document.querySelectorAll("button").forEach(btn => {
      const t = btn.getAttribute("title") ?? btn.getAttribute("aria-label") ?? ""
      if (t.toLowerCase().includes("iniciar") || t.toLowerCase().includes("restart")) {
        btn.click()
      }
    })
  })
  await sleep(1000)

  // ── 4. Capturar frames via CDP screencast ───────────────────────────────────
  logLn(`📸  Grabando ${DURATION}s a ${FPS}fps (${WIDTH}×${HEIGHT})…`)
  logLn(`    Esto tardará unos ${Math.ceil(DURATION / 10)} minutos aprox.\n`)

  const client = await page.createCDPSession()
  const frames = []
  let frameIndex = 0

  client.on("Page.screencastFrame", async ({ data, sessionId }) => {
    frames.push(data)
    frameIndex++
    log(`Capturando… frame ${frameIndex} / ~${DURATION * FPS}`)
    // Acknowledge frame para que Chrome envíe el siguiente
    await client.send("Page.screencastFrameAck", { sessionId }).catch(() => {})
  })

  await client.send("Page.startScreencast", {
    format:        "jpeg",
    quality:       90,
    maxWidth:      WIDTH,
    maxHeight:     HEIGHT,
    everyNthFrame: Math.max(1, Math.round(60 / FPS)),
  })

  // Esperar la duración completa de la animación
  const startTime = Date.now()
  while (Date.now() - startTime < DURATION * 1000) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(0)
    const pct     = ((elapsed / DURATION) * 100).toFixed(0)
    log(`Grabando… ${elapsed}s / ${DURATION}s (${pct}%) — ${frames.length} frames capturados`)
    await sleep(1000)
  }

  await client.send("Page.stopScreencast")
  logLn(`\n✓   ${frames.length} frames capturados`)

  // ── 5. Guardar frames como JPEGs ───────────────────────────────────────────
  logLn("💾  Guardando frames en disco…")
  for (let i = 0; i < frames.length; i++) {
    const buf = Buffer.from(frames[i], "base64")
    writeFileSync(join(FRAMES_DIR, `frame-${String(i).padStart(6, "0")}.jpg`), buf)
    if (i % 100 === 0) log(`Guardando frames… ${i}/${frames.length}`)
  }
  logLn(`✓   Frames guardados en ${FRAMES_DIR}`)

  // ── 6. Cerrar Chrome y Vite ────────────────────────────────────────────────
  await browser.close()
  viteProc.kill()

  // ── 7. Ensamblar MP4 ────────────────────────────────────────────────────────
  logLn(`\n🎞   Ensamblando MP4…`)
  logLn(`    ${OUTPUT}`)

  // Calcular el FPS real basado en frames capturados / duración
  const realFps = Math.round(frames.length / DURATION) || FPS

  execFileSync(ffmpegPath, [
    "-y",
    "-framerate",  String(realFps),
    "-i",          join(FRAMES_DIR, "frame-%06d.jpg"),
    "-c:v",        "libx264",
    "-preset",     "fast",
    "-crf",        "20",
    "-pix_fmt",    "yuv420p",
    "-movflags",   "+faststart",
    OUTPUT,
  ], { stdio: "inherit" })

  // ── 8. Limpiar frames temporales ───────────────────────────────────────────
  logLn("🗑   Limpiando archivos temporales…")
  rmSync(FRAMES_DIR, { recursive: true })

  logLn(`\n✅  ¡Video exportado!`)
  logLn(`    📁 ${OUTPUT}\n`)
}

main().catch(err => {
  console.error("\n❌ Error:", err.message)
  console.error(err.stack)
  process.exit(1)
})
