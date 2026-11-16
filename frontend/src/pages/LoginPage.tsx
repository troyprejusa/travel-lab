import { useState, type FormEvent } from 'react'
import { ArrowRight, Mail, Plane } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { auth } from '@/auth/auth'

export default function LoginPage({ onSignIn }: { onSignIn: () => void }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setBusy(true)
    try {
      if (auth.kind === 'development') {
        await auth.signInDevelopment(); onSignIn()
        const from = (location.state as { from?: string } | null)?.from
        navigate(from?.startsWith('/') && !from.startsWith('//') ? from : '/trips', { replace: true })
      } else await auth.requestMagicLink(email)
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to sign in.') }
    finally { setBusy(false) }
  }
  return <main className="auth-layout"><div className="auth-panel"><div className="auth-content">
    <span className="section-kicker">YOUR NEXT ADVENTURE AWAITS</span>
    {auth.kind === 'development' ? <><h1>Developer <em>sign in.</em></h1><p>Connect to the local backend as the seeded development user.</p><form onSubmit={submit}><p><strong>troy@test.com</strong></p><Button className="primary-button submit-button" disabled={busy}>{busy ? 'Signing in…' : 'Continue as Troy'} <ArrowRight size={18} /></Button></form><div className="demo-notice">Development mode · Uses the local test identity</div></> : <><h1>Welcome <em>back.</em></h1><p>Sign in or get started with a little help from your inbox. No password to remember.</p><form onSubmit={submit}><label htmlFor="email">Email address</label><div className="input-wrap"><Mail size={19} /><input id="email" type="email" placeholder="you@example.com" value={email} onChange={event => setEmail(event.target.value)} required autoComplete="email" /></div><Button className="primary-button submit-button" disabled={busy}>Send me a magic link <ArrowRight size={18} /></Button></form><div className="demo-notice">Magic link authentication is not connected yet.</div></>}
    {error && <p role="alert">{error}</p>}
  </div></div><div className="auth-art"><div className="auth-art-overlay" /><div className="auth-art-content"><span>THE WORLD IS WAITING</span><h2>There’s more out there<br /><em>to discover.</em></h2><p>Make a plan. Bring your people. Go somewhere wonderful.</p></div><div className="auth-art-bottom"><Plane size={17} /> THE JOURNEY STARTS HERE</div></div></main>
}
