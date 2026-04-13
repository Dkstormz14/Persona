import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import menuVideo from './assets/Mainn.mp4'
import main1 from './assets/main1.mp4'
import main2 from './assets/main2.mp4'
import main3 from './assets/main3.mp4'
import musicFile from './assets/music.mp3'
import P3Menu from './P3Menu'
import PageTransition from './PageTransition'
import './App.css'

// Lazy load main pages for better performance
const AboutMe = lazy(() => import('./AboutMe'))
const ResumePage = lazy(() => import('./ResumePage'))
const Socials = lazy(() => import('./Socials'))
const VideoPage = lazy(() => import('./VideoPage'))

// Music persistence key
const MUSIC_STORAGE_KEY = 'p3-music-enabled'
let sharedMusicAudio = null

// Shared background music setup
function getSharedMusicAudio() {
  if (typeof window === 'undefined') return null
  if (!sharedMusicAudio) {
    sharedMusicAudio = new window.Audio(musicFile)
    sharedMusicAudio.volume = 0.3
    sharedMusicAudio.loop = true
    sharedMusicAudio.preload = 'auto'
  }
  return sharedMusicAudio
}

// Music toggle component
function MusicToggle() {
  const location = useLocation()
  const audioRef = useRef(null)
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem(MUSIC_STORAGE_KEY) === '1'
  })

  useEffect(() => {
    audioRef.current = getSharedMusicAudio()
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(MUSIC_STORAGE_KEY, enabled ? '1' : '0')
    }
  }, [enabled])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (!enabled) {
      audio.pause()
      return
    }
    const playPromise = audio.play()
    if (playPromise?.catch) playPromise.catch(() => setEnabled(false))
  }, [enabled])

  function toggleMusic() {
    const audio = audioRef.current ?? getSharedMusicAudio()
    if (!audio) return setEnabled(v => !v)
    if (enabled) {
      audio.pause()
      setEnabled(false)
    } else {
      audio.play().then(() => setEnabled(true)).catch(() => setEnabled(false))
    }
  }

  return (
    <button
      type="button"
      className="music-switch"
      onClick={toggleMusic}
      aria-pressed={enabled}
      aria-label={enabled ? 'Disable music' : 'Enable music'}
    >
      <span className="music-switch-icon">♫</span>
      <span className={`music-switch-chip ${enabled ? 'active' : ''}`}>
        {enabled ? 'ON' : 'OFF'}
      </span>
    </button>
  )
}

// Main menu screen
function MenuScreen() {
  const navigate = useNavigate()
  return (
    <div id="menu-screen">
      <video src={menuVideo} autoPlay loop muted playsInline />
      <P3Menu onNavigate={(page) => navigate(`/${page}`)} />
    </div>
  )
}

// Animated routes with transitions and lazy loading
function AnimatedRoutes() {
  const location = useLocation()
  const withSuspense = (node) => (
    <Suspense fallback={<div className="route-loader" aria-hidden="true" />}>{node}</Suspense>
  )

  return (
    <>
      <MusicToggle />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition>{withSuspense(<MenuScreen />)}</PageTransition>} />
          <Route path="/about" element={<PageTransition variant="about">{withSuspense(<AboutMe />)}</PageTransition>} />
          <Route path="/resume" element={<PageTransition variant="resume">{withSuspense(<ResumePage src={main2} />)}</PageTransition>} />
          <Route path="/socials" element={<PageTransition variant="socials">{withSuspense(<Socials />)}</PageTransition>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return <AnimatedRoutes />
}