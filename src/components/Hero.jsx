import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { store } from '../utils/store'
// The one orchestrated page-load moment: headline lines rise from a mask.
export default function Hero() {
  const ref = useRef()
  useEffect(() => {
    if (store.reduced) return
    const c = gsap.context(() => {
      gsap.from('.hl > span', { yPercent: 110, duration: 1.3, ease: 'expo.out', stagger: 0.12, delay: 0.3 })
      gsap.from('.hero-sub, .hero-cta', { opacity: 0, y: 20, duration: 1, delay: 1.1, stagger: 0.15 })
    }, ref)
    return () => c.revert()
  }, [])
  return (
    <section id="top" className="hero" ref={ref}>
      <h1>
        <span className="hl"><span>Make your</span></span>
        <span className="hl"><span>brand move.</span></span>
      </h1>
      <p className="hero-sub">Identity, interfaces, fast websites and growth. One studio builds the whole digital system your brand needs.</p>
      <a className="hero-cta" href="#statement">Explore the system <span aria-hidden="true">↓</span></a>
    </section>
  )
}
