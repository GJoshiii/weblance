import { useRef } from 'react'
import gsap from 'gsap'
// Wraps a button/link; it leans toward the cursor when near.
export default function Magnetic({ as: Tag = 'a', children, ...props }) {
  const ref = useRef()
  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    gsap.to(ref.current, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.4 })
  }
  const leave = () => gsap.to(ref.current, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' })
  return <Tag ref={ref} onMouseMove={move} onMouseLeave={leave} {...props}>{children}</Tag>
}
