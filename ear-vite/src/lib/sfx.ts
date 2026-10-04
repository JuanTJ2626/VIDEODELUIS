// Web Audio API Synthesizer for Apple Motion Graphics SFX
// Provides real-time pops, marker scribbles, light-switch clicks, swooshes and sub-impacts

class SoundSynthesizer {
  private ctx: AudioContext | null = null

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      this.ctx = new AudioCtx()
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {})
    }
  }

  // 1. Pop / Bubble Sound
  playPop() {
    try {
      this.initCtx()
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = "sine"
      osc.frequency.setValueAtTime(400, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.08)

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + 0.08)
    } catch {
      // Audio context fallbacks
    }
  }

  // 2. Light Switch Click
  playSwitch() {
    try {
      this.initCtx()
      if (!this.ctx) return
      const bufferSize = this.ctx.sampleRate * 0.03
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2))
      }

      const noise = this.ctx.createBufferSource()
      noise.buffer = buffer

      const filter = this.ctx.createBiquadFilter()
      filter.type = "bandpass"
      filter.frequency.value = 1800

      const gain = this.ctx.createGain()
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.03)

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)
      noise.start()
    } catch {
      // Audio context fallbacks
    }
  }

  // 3. Marker Pen Doodle Scribble
  playScribble() {
    try {
      this.initCtx()
      if (!this.ctx) return
      const bufferSize = this.ctx.sampleRate * 0.15
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.1
      }

      const noise = this.ctx.createBufferSource()
      noise.buffer = buffer

      const filter = this.ctx.createBiquadFilter()
      filter.type = "bandpass"
      filter.frequency.setValueAtTime(800, this.ctx.currentTime)
      filter.frequency.linearRampToValueAtTime(1400, this.ctx.currentTime + 0.15)

      const gain = this.ctx.createGain()
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15)

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx.destination)
      noise.start()
    } catch {
      // Audio context fallbacks
    }
  }

  // 4. Sub-Bass Logo Impact
  playSubImpact() {
    try {
      this.initCtx()
      if (!this.ctx) return
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = "sine"
      osc.frequency.setValueAtTime(140, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(32, this.ctx.currentTime + 0.6)

      gain.gain.setValueAtTime(0.4, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start()
      osc.stop(this.ctx.currentTime + 0.6)
    } catch {
      // Audio context fallbacks
    }
  }
}

export const sfx = new SoundSynthesizer()
