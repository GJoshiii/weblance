import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { store } from '../utils/store'
const TEXT = 'Not another agency site. A digital universe for your brand.'
// Words light up one by one as you scroll through the statement.
export default function Statement() {
  const ref = useRef()
  useEffect(() => {
    const words = ref.current.querySelectorAll('.w')
    if (store.reduced) { gsap.set(words, { opacity: 1 }); return }
    const c = gsap.context(() => {
      gsap.fromTo(words, { opacity: 0.12 }, { opacity: 1, stagger: 0.1, ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top 70%', end: 'bottom 55%', scrub: true } })
    }, ref)
    return () => c.revert()
  }, [])
  return (
    <section id="statement" className="statement" ref={ref}>
      <p className="big">{TEXT.split(' ').map((w, i) => <span key={i} className="w">{w} </span>)}</p>
    </section>
  )
}
