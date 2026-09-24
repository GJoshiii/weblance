import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { store } from '../utils/store'
const P = [
  ['Discover', 'Understand the business, audience and ambition.'],
  ['Design', 'Shape the identity, experience and visual language.'],
  ['Build', 'Engineer a fast, responsive and memorable digital product.'],
  ['Grow', 'Measure, optimize and keep improving the experience.'],
]
// Stages sit on a diagonal and drift sideways against scroll, like orbiting the structure.
export default function Process() {
  const ref = useRef()
  useEffect(() => {
    if (store.reduced || store.mobile) return
    const c = gsap.context(() => {
      gsap.utils.toArray('.stage').forEach((el, i) => gsap.fromTo(el, { xPercent: i % 2 ? 12 : -12 }, { xPercent: i % 2 ? -8 : 8, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } }))
    }, ref)
    return () => c.revert()
  }, [])
  return (
    <section className="process" ref={ref} aria-labelledby="pr-title">
      <h2 id="pr-title" className="sr">Process</h2>
      {P.map(([t, d], i) => (
        <article key={t} className={`stage s${i}`}>
          <span className="num">{String(i + 1).padStart(2, '0')}</span>
          <h3>{t}</h3><p>{d}</p>
        </article>
      ))}
    </section>
  )
}
