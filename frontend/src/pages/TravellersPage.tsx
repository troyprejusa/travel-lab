import { useTripAdmin } from '@/hooks/useTripAdmin'
import { Button } from '@/components/ui/button'
import { ResourceState } from '@/components/layout/ResourceState'
import { useTripResource } from '@/hooks/useTripResource'
import { apiFetch } from '@/lib/api'
type Traveller = { id: string; first_name: string | null; last_name: string | null; email: string; phone: string | null; confirmed: boolean; admin: boolean }
export default function TravellersPage() {
  const admin = useTripAdmin()
  const { tripId, data, loading, error, reload, setError } = useTripResource<Traveller>('travellers')
  async function manage(id:string, method:string) { try { const response = await apiFetch(`/user/trips/${encodeURIComponent(tripId)}/${encodeURIComponent(id)}`, {method}); if (!response.ok) throw new Error(`Request failed (HTTP ${response.status}).`); await reload() } catch (e) { setError(e instanceof Error ? e.message : 'Request failed.') } }
  return <main className="workspace"><div className="page-heading"><div><span className="section-kicker">YOUR PEOPLE</span><h1>Travellers</h1><p>Contact details and requests to join this trip.</p></div></div><div className="resource-card"><strong>Invite your group</strong><p>Share this trip ID so they can request to join:</p><code className="trip-id">{tripId}</code></div><ResourceState loading={loading} error={error}/><div className="card-list">{data.map(person => <article className="resource-card item-row" key={person.id}><div><h2>{[person.first_name, person.last_name].filter(Boolean).join(' ') || person.email}</h2><p>{person.email}{person.phone && <> · {person.phone}</>}</p><span className="muted">{person.confirmed ? person.admin ? 'Trip admin' : 'Traveller' : 'Request pending'}</span></div><div className="actions">{admin && !person.confirmed && <Button onClick={() => void manage(person.id,'PATCH')}>Accept</Button>}{admin && <Button variant="ghost" onClick={() => { if (window.confirm(`Remove ${person.email} from this trip?`)) void manage(person.id,'DELETE') }}>Remove</Button>}</div></article>)}</div>{!loading && !data.length && <p className="empty-state">No travellers found.</p>}</main>
}
