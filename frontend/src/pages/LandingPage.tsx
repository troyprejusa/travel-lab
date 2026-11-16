import { ArrowRight, CalendarDays, Check, Compass, Map, MapPin, Sparkles, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function LandingPage() { return (
<main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> MADE FOR THE JOURNEY TOGETHER</div>
            <h1>Good trips start <em>together.</em></h1>
            <p>From the first “where to?” to the final itinerary, bring everyone and everything together in one happy place.</p>
            <div className="hero-actions"><Button className="primary-button" asChild><Link to="/login">Start planning <ArrowRight size={18} /></Link></Button><a className="text-link" href="#how-it-works">See how it works <span>↗</span></a></div>
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
        <section className="closing"><div><span className="section-kicker">WHERE TO NEXT?</span><h2>Let’s make a little<br /><em>more happen.</em></h2></div><Button className="primary-button" asChild><Link to="/login">Start planning <ArrowRight size={18} /></Link></Button></section>
      </main>
) }
