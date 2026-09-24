import { lazy, Suspense } from 'react'
import useScroll from './hooks/useScroll'
import useCursor from './hooks/useCursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Statement from './components/Statement'
import WeblanceW from './components/WeblanceW'
import Services from './components/Services'
import Process from './components/Process'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'
const WorldScene = lazy(() => import('./scenes/WorldScene'))

export default function App() {
  useScroll(); useCursor()
  return (
    <>
      <Suspense fallback={null}><WorldScene /></Suspense>
      <Navbar />
      <main>
        <Hero /><Statement /><WeblanceW /><Services /><Process /><ContactForm />
      </main>
      <Footer />
    </>
  )
}
