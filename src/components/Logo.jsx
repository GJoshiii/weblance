// The Weblance W mark: one continuous rounded stroke. Reused in nav, footer and favicon.
export default function Logo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs><linearGradient id="wl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#8B6CFF" /><stop offset="1" stopColor="#FF5C8A" /></linearGradient></defs>
      <path d="M8 16 22 48 32 24 42 48 56 16" fill="none" stroke="url(#wl)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
