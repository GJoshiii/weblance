import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { store } from '../utils/store'
gsap.registerPlugin(ScrollTrigger)
// Lenis smooth scroll + ScrollTrigger; writes whole-page progress (0..1) to the store.
export default function useScroll() {
  useEffect(() => {
    store.reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    store.mobile = matchMedia('(max-width: 800px)').matches
    let lenis, tick
    if (!store.reduced) {
      lenis = new Lenis({ lerp: 0.09 })
      lenis.on('scroll', ScrollTrigger.update)
      tick = (t) => lenis.raf(t * 1000)
      gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0)
    }
    const st = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => (store.p = s.progress) })
    return () => { st.kill(); if (tick) gsap.ticker.remove(tick); lenis && lenis.destroy() }
  }, [])
}
