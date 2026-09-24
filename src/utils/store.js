// Shared mutable state read every frame by the 3D scene (no React re-renders).
export const store = { p: 0, mx: 0, my: 0, service: -1, mobile: false, reduced: false }
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
export const lerp = (a, b, t) => a + (b - a) * t
export const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t) }
