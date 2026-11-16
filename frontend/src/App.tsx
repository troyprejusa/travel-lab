import { useEffect, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, CalendarDays, Check, Compass, Mail, Map, MapPin, Menu, Plane, Sparkles, Users, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Page = 'home' | 'sign-in'

function App() {
  const [page, setPage] = useState<Page>(window.location.pathname === '/sign-in' ? 'sign-in' : 'home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    const syncPage = () => { setPage(window.location.pathname === '/sign-in' ? 'sign-in' : 'home'); setSubmitted(false) }
    window.addEventListener('popstate', syncPage)
    return () => window.removeEventListener('popstate', syncPage)
  }, [])

  function navigate(next: Page) {
    window.history.pushState({}, '', next === 'home' ? '/' : '/sign-in')
    setPage(next)
    setMenuOpen(false)
    setSubmitted(false)
    window.scrollTo(0, 0)
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
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
            <Button className="nav-button" onClick={() => navigate('sign-in')}>Sign in <ArrowRight size={16} /></Button>
          </nav>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
        </> : <button className="back-link" onClick={() => navigate('home')}><ArrowLeft size={16} /> Back to home</button>}
      </header>

      {page === 'home' ? <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> MADE FOR THE JOURNEY TOGETHER</div>
            <h1>Good trips start <em>together.</em></h1>
            <p>From the first “where to?” to the final itinerary, bring everyone and everything together in one happy place.</p>
            <div className="hero-actions"><Button className="primary-button" onClick={() => navigate('sign-in')}>Start planning <ArrowRight size={18} /></Button><a className="text-link" href="#how-it-works">See how it works <span>↗</span></a></div>
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
        <section className="closing"><div><span className="section-kicker">WHERE TO NEXT?</span><h2>Let’s make a little<br /><em>more happen.</em></h2></div><Button className="primary-button" onClick={() => navigate('sign-in')}>Start planning <ArrowRight size={18} /></Button></section>
      </main> : <main className="auth-layout">
        <div className="auth-panel"><div className="auth-content">
          <span className="section-kicker">YOUR NEXT ADVENTURE AWAITS</span>
          {!submitted ? <><h1>Welcome <em>back.</em></h1><p>Sign in or get started with a little help from your inbox. No password to remember.</p>
            <form onSubmit={submit}><label htmlFor="email">Email address</label><div className="input-wrap"><Mail size={19} /><input id="email" type="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></div><Button className="primary-button submit-button" type="submit">Send me a magic link <ArrowRight size={18} /></Button></form>
            <div className="auth-footnote"><span className="small-lock">✳</span><span>One link, right to your inbox. Simple as that.</span></div>
          </> : <div role="status"><div className="success-icon"><Mail size={25} /></div><h1>Check your <em>inbox.</em></h1><p>This is a preview: a magic link would be sent to <strong>{email}</strong> once authentication is connected.</p><button className="try-again" onClick={() => setSubmitted(false)}><ArrowLeft size={16} /> Use another email</button></div>}
          <div className="demo-notice">Design preview · Email delivery is not connected yet</div>
        </div></div>
        <div className="auth-art"><div className="auth-art-overlay" /><div className="auth-art-content"><span>THE WORLD IS WAITING</span><h2>There’s more out there<br /><em>to discover.</em></h2><p>Make a plan. Bring your people. Go somewhere wonderful.</p></div><div className="auth-art-bottom"><Plane size={17} /> THE JOURNEY STARTS HERE</div></div>
      </main>}
      <footer className="footer"><div className="footer-brand"><img src="/logo.png" alt="" /> Travel Lab <span>·</span> Made for going places.</div><span>GOOD PLANS. GREAT STORIES.</span></footer>
    </div>
  )
}

export default App
