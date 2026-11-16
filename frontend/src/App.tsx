import { useEffect, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, CalendarDays, Check, Compass, Mail, Map, MapPin, Menu, Plane, Sparkles, Users, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLocation, useNavigate } from 'react-router-dom'
import { auth } from '@/auth/auth'
import { apiFetch } from '@/lib/api'

type Page = 'home' | 'login' | 'trips'
type Trip = { id: string; destination: string; start_date: string; end_date: string }

function App() {
  const location = useLocation()
  const routerNavigate = useNavigate()
  const page: Page = location.pathname === '/login' || location.pathname === '/sign-in' ? 'login' : location.pathname === '/trips' ? 'trips' : 'home'
  const [menuOpen, setMenuOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [trips, setTrips] = useState<Trip[]>([])
  const [signedIn, setSignedIn] = useState(() => !!auth.getToken())

  useEffect(() => {
    if (page !== 'trips' || !signedIn) return
    const controller = new AbortController()
    apiFetch('/user/trips', { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error(`Unable to load trips (HTTP ${response.status}).`)
      setTrips(await response.json())
    }).catch(error => { if (error.name !== 'AbortError') setError(error.message) })
    return () => controller.abort()
  }, [page, signedIn])

  function navigate(next: Page) {
    routerNavigate(next === 'home' ? '/' : `/${next}`)
    setMenuOpen(false)
    setError('')
    window.scrollTo(0, 0)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (auth.kind === 'development') {
        await auth.signInDevelopment()
        setSignedIn(true)
        navigate('trips')
      } else {
        await auth.requestMagicLink(email)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unable to sign in.')
    } finally { setBusy(false) }
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="/" onClick={(event) => { event.preventDefault(); navigate('home') }} aria-label="Travel Lab home">
          <img src="/logo.png" alt="" /><span>Travel Lab</span>
        </a>
        {page === 'home' ? <>
          <nav className={`navigation ${menuOpen ? 'navigation-open' : ''}`} aria-label="Main navigation">
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#features" onClick={() => setMenuOpen(false)}>The essentials</a>
            <Button className="nav-button" onClick={() => navigate('login')}>Sign in <ArrowRight size={16} /></Button>
          </nav>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
        </> : page === 'trips' && signedIn ? <button className="back-link" onClick={() => { auth.signOut(); setSignedIn(false); navigate('home') }}>Sign out</button> : <button className="back-link" onClick={() => navigate('home')}><ArrowLeft size={16} /> Back to home</button>}
      </header>

      {page === 'home' ? <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> MADE FOR THE JOURNEY TOGETHER</div>
            <h1>Good trips start <em>together.</em></h1>
            <p>From the first “where to?” to the final itinerary, bring everyone and everything together in one happy place.</p>
            <div className="hero-actions"><Button className="primary-button" onClick={() => navigate('login')}>Start planning <ArrowRight size={18} /></Button><a className="text-link" href="#how-it-works">See how it works <span>↗</span></a></div>
            <div className="hero-note"><span className="mini-icon"><Sparkles size={15} /></span> Less planning chaos. More “remember when?”</div>
          </div>
          <div className="hero-visual" aria-label="A preview of a trip to the coast">
            <div className="photo-overlay" />
            <div className="image-top"><span><MapPin size={14} /> SOMEWHERE BEAUTIFUL</span><Compass size={22} /></div>
            <div className="image-bottom"><span>THE NEXT CHAPTER</span><strong>Out there<br /><i>together.</i></strong></div>
            <div className="floating-card"><div className="floating-icon"><CalendarDays size={20} /></div><div><span>YOUR NEXT ADVENTURE</span><strong>All coming together</strong></div><span className="check"><Check size={15} /></span></div>
            <div className="photo-index">01 / 03 <span>—</span> THE JOURNEY</div>
          </div>
        </section>
        <div className="marquee"><span>PLANS MADE SIMPLE</span><span className="marquee-star">✳</span><span>PEOPLE BROUGHT TOGETHER</span><span className="marquee-star">✳</span><span>MORE ROOM FOR ADVENTURE</span></div>
        <section className="intro-section" id="how-it-works"><div><span className="section-kicker">A LITTLE LESS LOGISTICS</span><h2>More time for the<br /><em>good stuff.</em></h2></div><p>Big adventure or long weekend, the best trips are the ones you get to enjoy. Travel Lab keeps the details in one place, so you can focus on making memories.</p></section>
        <section className="features" id="features" aria-label="Planning essentials">
          <article><div className="feature-icon lavender"><Map size={22} /></div><span>01 / THE BIG PICTURE</span><h3>Every trip, in one place</h3><p>Give your plans a home, from the first idea to the day you head out.</p></article>
          <article><div className="feature-icon blush"><CalendarDays size={22} /></div><span>02 / THE DETAILS</span><h3>A plan that comes together</h3><p>Keep the itinerary and all those little details easy to find.</p></article>
          <article><div className="feature-icon peach"><Users size={22} /></div><span>03 / THE PEOPLE</span><h3>Better with your people</h3><p>Bring your fellow travelers along for every step of the planning.</p></article>
        </section>
        <section className="closing"><div><span className="section-kicker">WHERE TO NEXT?</span><h2>Let’s make a little<br /><em>more happen.</em></h2></div><Button className="primary-button" onClick={() => navigate('login')}>Start planning <ArrowRight size={18} /></Button></section>
      </main> : page === 'trips' ? <main className="auth-panel"><div className="auth-content">
        <span className="section-kicker">YOUR TRIPS</span><h1 style={{ fontSize: '3rem', margin: '20px 0' }}>Your next adventure.</h1>
        {!signedIn ? <><p>Sign in to see your trips.</p><Button className="primary-button" onClick={() => navigate('login')}>Sign in</Button></> : <>
          {error && <p role="alert">{error}</p>}
          {!error && trips.length === 0 && <p>Your trips will appear here.</p>}
          {trips.map(trip => <article key={trip.id}><h2>{trip.destination}</h2><p>{trip.start_date} – {trip.end_date}</p></article>)}
        </>}
      </div></main> : <main className="auth-layout">
        <div className="auth-panel"><div className="auth-content">
          <span className="section-kicker">YOUR NEXT ADVENTURE AWAITS</span>
          {auth.kind === 'development' ? <><h1>Developer <em>sign in.</em></h1><p>Connect to the local backend as the seeded development user.</p>
            <form onSubmit={submit}><p><strong>troy@test.com</strong></p><Button className="primary-button submit-button" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Continue as Troy'} <ArrowRight size={18} /></Button></form>
            <div className="demo-notice">Development mode · Uses the local test identity</div>
          </> : <><h1>Welcome <em>back.</em></h1><p>Sign in or get started with a little help from your inbox. No password to remember.</p>
            <form onSubmit={submit}><label htmlFor="email">Email address</label><div className="input-wrap"><Mail size={19} /><input id="email" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></div><Button className="primary-button submit-button" type="submit" disabled={busy}>Send me a magic link <ArrowRight size={18} /></Button></form>
            <div className="demo-notice">Magic link authentication is not connected yet.</div>
          </>}
          {error && <p role="alert">{error}</p>}
        </div></div>
        <div className="auth-art"><div className="auth-art-overlay" /><div className="auth-art-content"><span>THE WORLD IS WAITING</span><h2>There’s more out there<br /><em>to discover.</em></h2><p>Make a plan. Bring your people. Go somewhere wonderful.</p></div><div className="auth-art-bottom"><Plane size={17} /> THE JOURNEY STARTS HERE</div></div>
      </main>}
      <footer className="footer"><div className="footer-brand"><img src="/logo.png" alt="" /> Travel Lab <span>·</span> Made for going places.</div><span>GOOD PLANS. GREAT STORIES.</span></footer>
    </div>
  )
}

export default App
