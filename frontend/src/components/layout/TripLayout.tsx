import { NavLink, Outlet, useParams } from 'react-router-dom'

const sections = [['', 'Overview'], ['itinerary', 'Itinerary'], ['packing', 'Packing'], ['polls', 'Polls'], ['messages', 'Messages'], ['travellers', 'Travellers'], ['settings', 'Settings']] as const
export default function TripLayout() {
  const { tripId } = useParams()
  const root = `/trips/${encodeURIComponent(tripId ?? '')}`
  return <><nav className="trip-nav" aria-label="Trip navigation">{sections.map(([path, label]) => <NavLink key={label} end={path === ''} to={path ? `${root}/${path}` : root}>{label}</NavLink>)}</nav><Outlet /></>
}
