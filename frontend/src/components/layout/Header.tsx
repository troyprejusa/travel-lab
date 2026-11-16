import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

export default function Header({ signedIn, onSignOut }: { signedIn: boolean; onSignOut: () => void }) {
  const [open, setOpen] = useState(false)
  return <header className="site-header">
    <Link className="brand" to="/" onClick={() => setOpen(false)}><img src="/logo.png" alt="" /><span>Travel Lab</span></Link>
    <nav className={`navigation ${open ? 'navigation-open' : ''}`} aria-label="Main navigation" onClick={() => setOpen(false)}>
      <NavLink to="/" end>Home</NavLink>
      {signedIn ? <><NavLink to="/trips">My trips</NavLink><NavLink to="/settings">Account</NavLink><button className="back-link" onClick={onSignOut}>Sign out</button></> : <NavLink to="/login">Sign in</NavLink>}
    </nav>
    <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>{open ? <X /> : <Menu />}</button>
  </header>
}
