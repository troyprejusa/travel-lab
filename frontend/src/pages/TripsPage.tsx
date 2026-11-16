import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '@/lib/api'

type Trip = { id: string; destination: string; start_date: string; end_date: string }
export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    apiFetch('/user/trips', { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error(`Unable to load trips (HTTP ${response.status}).`)
      setTrips(await response.json())
    }).catch(err => { if (err.name !== 'AbortError') setError(err.message) }).finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [])
  return <main className="page-content"><span className="section-kicker">YOUR TRIPS</span><h1>Your next adventure.</h1>
    {loading ? <p>Loading trips…</p> : error ? <p role="alert">{error}</p> : trips.length === 0 ? <p>Your trips will appear here.</p> : trips.map(trip => <article key={trip.id}><h2><Link to={`/trips/${encodeURIComponent(trip.id)}`}>{trip.destination}</Link></h2><p>{trip.start_date} – {trip.end_date}</p></article>)}
  </main>
}
