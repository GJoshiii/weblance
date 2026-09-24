import { useEffect } from 'react'
import { store } from '../utils/store'
// Tracks normalized cursor (-1..1) into the store. On touch, uses touchmove.
export default function useCursor() {
  useEffect(() => {
    const move = (x, y) => { store.mx = (x / innerWidth) * 2 - 1; store.my = -((y / innerHeight) * 2 - 1) }
    const m = (e) => move(e.clientX, e.clientY)
    const t = (e) => move(e.touches[0].clientX, e.touches[0].clientY)
    addEventListener('pointermove', m); addEventListener('touchmove', t, { passive: true })
    return () => { removeEventListener('pointermove', m); removeEventListener('touchmove', t) }
  }, [])
}
