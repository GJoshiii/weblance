import { useState } from 'react'
import Magnetic from './Magnetic'

// =====================================================
// GOOGLE SHEETS / APPS SCRIPT URL
// Paste your Google Apps Script Web App URL here.
// =====================================================
const SHEETS_WEB_APP_URL =
  "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

const OPTIONS = ['Website Design & Development', 'UI / UX Design', 'Brand Identity & Logo', 'Digital Marketing', 'SEO & Performance Optimization', 'Maintenance & Growth', 'Everything']

export default function ContactForm() {
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [error, setError] = useState('')
  async function submit(e) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const data = { name: f.get('name'), brand: f.get('brand'), need: f.get('need'), message: f.get('message'), submittedAt: new Date().toISOString() }
    if (SHEETS_WEB_APP_URL.startsWith('PASTE_')) { setStatus('error'); setError('The form is not connected yet. Add the Google Apps Script URL in ContactForm.jsx.'); return }
    setStatus('sending')
    try {
      // Apps Script does not send CORS headers, so use no-cors + text/plain (the request still reaches doPost).
      await fetch(SHEETS_WEB_APP_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(data) })
      setStatus('done')
    } catch { setStatus('error'); setError('Something went wrong sending your message. Check your connection and try again.') }
  }
  return (
    <section id="contact" className="contact" aria-labelledby="ct-title">
      <h2 id="ct-title">Let's build<br />your next move.</h2>
      {status === 'done' ? (
        <div className="success" role="status"><h3>You're on the list.</h3><p>We'll get back to you soon.</p></div>
      ) : (
        <form onSubmit={submit} noValidate={false}>
          <label>Name<input name="name" placeholder="Your name" required autoComplete="name" /></label>
          <label>Business / Brand<input name="brand" placeholder="Your brand" required /></label>
          <label>What do you need?
            <select name="need" defaultValue="" required>
              <option value="" disabled>Choose one</option>
              {OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
          </label>
          <label>Tell us about the project<textarea name="message" rows="4" placeholder="A few words about what you want to build" required /></label>
          <Magnetic as="button" className="pill big" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : "LET'S BUILD →"}</Magnetic>
          {status === 'error' && <p className="err" role="alert">{error}</p>}
        </form>
      )}
    </section>
  )
}
