import { useTripAdmin } from '@/hooks/useTripAdmin'
import { Button } from '@/components/ui/button'
import { ResourceState } from '@/components/layout/ResourceState'
import { useTripResource } from '@/hooks/useTripResource'
import { apiFetch } from '@/lib/api'
type Traveller = { id: string; first_name: string | null; last_name: string | null; email: string; phone: string | null; confirmed: boolean; admin: boolean }
export default function TravellersSection() {
  const admin = useTripAdmin()
  const { tripId, data, loading, error, reload, setError } = useTripResource<Traveller>('travellers')
  async function manage(id:string, method:string) { try { const response = await apiFetch(`/user/trips/${encodeURIComponent(tripId)}/${encodeURIComponent(id)}`, {method}); if (!response.ok) throw new Error(`Request failed (HTTP ${response.status}).`); await reload() } catch (e) { setError(e instanceof Error ? e.message : 'Request failed.') } }
  return <section className="travellers-section"><div className="section-heading"><div><span className="section-kicker">YOUR PEOPLE</span><h2>Travellers</h2><p>Share the trip ID above to invite someone to request access.</p></div></div><ResourceState loading={loading} error={error}/><div className="card-list">{data.map(person => <article className="resource-card item-row" key={person.id}><div><h2>{[person.first_name, person.last_name].filter(Boolean).join(' ') || person.email}</h2><p>{person.email}{person.phone && <> · {person.phone}</>}</p><span className="muted">{person.confirmed ? person.admin ? 'Trip admin' : 'Traveller' : 'Request pending'}</span></div><div className="actions">{admin && !person.confirmed && <Button onClick={() => void manage(person.id,'PATCH')}>Accept</Button>}{admin && <Button variant="ghost" onClick={() => { if (window.confirm(`Remove ${person.email} from this trip?`)) void manage(person.id,'DELETE') }}>Remove</Button>}</div></article>)}</div>{!loading && !data.length && <p className="empty-state">No travellers found.</p>}</section>
}
