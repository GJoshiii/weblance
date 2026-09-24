import Logo from './Logo'
import Magnetic from './Magnetic'
export default function Navbar() {
  return (
    <header className="nav">
      <a href="#top" className="brand" aria-label="Weblance home"><Logo /><span>Weblance</span></a>
      <Magnetic className="pill" href="#contact">Let's build</Magnetic>
    </header>
  )
}
