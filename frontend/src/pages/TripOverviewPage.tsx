import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiFetch } from '@/lib/api'
type Trip={id:string; destination:string; start_date:string; end_date:string; description:string|null; vacation_type:string}
export default function TripOverviewPage() {
 const {tripId}=useParams(); const [trip,setTrip]=useState<Trip|null>(null); const [error,setError]=useState(''); const [loading,setLoading]=useState(true)
 useEffect(()=>{let active=true; apiFetch('/user/trips').then(async r=>{if(!r.ok) throw new Error('Unable to load trip.'); return r.json()}).then((trips:Trip[])=>{if(active) setTrip(trips.find(t=>t.id===tripId)||null)}).catch(e=>{if(active)setError(e.message)}).finally(()=>{if(active)setLoading(false)});return()=>{active=false}},[tripId])
 return <main className="workspace">{loading?<p>Loading trip…</p>:error?<p role="alert">{error}</p>:!trip?<p>Trip not found or unavailable.</p>:<><span className="section-kicker">YOUR TRIP</span><div className="page-heading"><div><h1>{trip.destination}</h1><p>{trip.start_date} – {trip.end_date} · {trip.vacation_type.replace('_',' ')}</p></div></div><div className="resource-card"><h2>About this trip</h2><p>{trip.description || 'No description yet.'}</p><p>Trip ID: <code className="trip-id">{trip.id}</code></p></div><div className="overview-links">{[['itinerary','Itinerary'],['packing','Packing list'],['polls','Polls'],['messages','Messages'],['travellers','Travellers']].map(([path,label])=><Link className="resource-card" key={path} to={path}>{label} →</Link>)}</div></>}</main>
}
