import { useState } from 'react'
import { store } from '../utils/store'
const S = [
  ['Website Design & Development', 'Custom, fast, responsive sites in React and Next.js. No templates. Built to convert.'],
  ['UI / UX Design', 'Figma to final product. Clean, modern interfaces that feel premium and easy to use.'],
  ['Brand Identity & Logo', 'Logo, typography, color system and brand guidelines, anchored by a distinctive W system.'],
  ['Digital Marketing', 'Strategies and campaigns to boost your online presence and drive conversions.'],
  ['SEO & Performance Optimization', 'Lighthouse 95+, Core Web Vitals and on-page SEO. Sites that perform and rank.'],
  ['Maintenance & Growth', 'Hosting, updates, analytics and A/B testing. We stay. Your site keeps getting better.'],
]
// Hovering / focusing / tapping a service lights up the matching fragment in the 3D ecosystem.
export default function Services() {
  const [open, setOpen] = useState(-1)
  const set = (i) => { setOpen(i); store.service = i }
  return (
    <section className="services" aria-labelledby="sv-title" onMouseLeave={() => set(-1)}>
      <h2 id="sv-title" className="sr">Services</h2>
      <ol>
        {S.map(([t, d], i) => (
          <li key={t} className={open === i ? 'on' : ''}>
            <button onMouseEnter={() => set(i)} onFocus={() => set(i)} onClick={() => set(open === i ? -1 : i)} aria-expanded={open === i}>
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <span className="title">{t}</span>
            </button>
            <div className="desc"><p>{d}</p></div>
          </li>
        ))}
      </ol>
    </section>
  )
}
