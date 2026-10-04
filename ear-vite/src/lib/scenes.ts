// Scene audio durations — measured from the real MP3 files in /public/assets
// Run `node scripts/measure-durations.mjs` to regenerate after changing audio.
export interface SceneMeta {
  id: number
  label: string        // e.g. "01 / SINERGIA"
  audioSrc: string
  imageSrc: string
  duration: number     // seconds — will be overridden by real <audio> metadata
}

export const SCENES: SceneMeta[] = [
  {
    id: 1,
    label: "01 / SINERGIA",
    audioSrc: "/assets/voice_scene1.mp3",
    imageSrc: "/assets/scene1_synergy.jpg",
    duration: 4.5,
  },
  {
    id: 2,
    label: "02 / EVOLUCIÓN",
    audioSrc: "/assets/voice_scene2.mp3",
    imageSrc: "/assets/scene2_collaborative.jpg",
    duration: 5.1,
  },
  {
    id: 3,
    label: "03 / PILARES",
    audioSrc: "/assets/voice_scene3.mp3",
    imageSrc: "/assets/scene3_pillars.jpg",
    duration: 10.8,
  },
  {
    id: 4,
    label: "04 / TUCKMAN",
    audioSrc: "/assets/voice_scene4.mp3",
    imageSrc: "/assets/scene4_tuckman.jpg",
    duration: 9.3,
  },
  {
    id: 5,
    label: "05 / ESTRATEGIA",
    audioSrc: "/assets/voice_scene5.mp3",
    imageSrc: "/assets/scene5_strategy.jpg",
    duration: 7.3,
  },
  {
    id: 6,
    label: "06 / CONCLUSIÓN",
    audioSrc: "/assets/voice_scene6.mp3",
    imageSrc: "/assets/scene6_success.jpg",
    duration: 6.4,
  },
]

export const TOTAL_SCENES = SCENES.length
