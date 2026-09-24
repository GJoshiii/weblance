import Logo from './Logo'
export default function Footer() {
  return (
    <footer className="footer">
      <div className="brand"><Logo size={28} /><span>WEBLANCE</span></div>
      <p>We don't just make brands look digital. We build the digital world around them.</p>
      <a href="tel:+918826585798">+91 88265 85798</a>
    </footer>
  )
}
