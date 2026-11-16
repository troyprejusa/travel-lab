import { useTripAdmin } from '@/hooks/useTripAdmin'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { ResourceState } from '@/components/layout/ResourceState'
import { useTripResource } from '@/hooks/useTripResource'
type Stop = { id: number; title: string; description: string | null; start_time: string; end_time: string }
export default function ItineraryPage() {
  const admin = useTripAdmin()
  const { data, loading, error, mutate } = useTripResource<Stop>('itinerary')
  const [adding, setAdding] = useState(false)
  async function add(e: FormEvent<HTMLFormElement>) { e.preventDefault(); const form = e.currentTarget; const body = new FormData(form); if (String(body.get('end_time')) <= String(body.get('start_time'))) { alert('The end must be after the start.'); return } if (await mutate('', { method: 'POST', body })) { form.reset(); setAdding(false) } }
  const sorted = [...data].sort((a,b) => a.start_time.localeCompare(b.start_time))
  return <main className="workspace"><div className="page-heading"><div><span className="section-kicker">THE PLAN</span><h1>Itinerary</h1><p>All your plans, in one place.</p></div><Button className="primary-button" onClick={() => setAdding(!adding)}>{adding ? 'Cancel' : '+ Add event'}</Button></div>
  {adding && <form className="form-card" onSubmit={add}><label>Event<input name="title" required /></label><label>Starts<input type="datetime-local" name="start_time" required /></label><label>Ends<input type="datetime-local" name="end_time" required /></label><label>Notes (optional)<input name="description" /></label><Button type="submit">Add event</Button></form>}
  <ResourceState loading={loading} error={error}/>{!loading && !data.length && <p className="empty-state">No plans yet. Add your first event.</p>}
  <div className="card-list">{sorted.map(stop => <article className="resource-card item-row" key={stop.id}><div><span className="section-kicker">{new Date(stop.start_time).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}</span><h2>{stop.title}</h2><p>Until {new Date(stop.end_time).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</p>{stop.description && <p>{stop.description}</p>}</div>{admin && <Button variant="ghost" onClick={() => { if (window.confirm('Delete this event?')) void mutate(`/${stop.id}`, { method: 'DELETE' }) }}>Delete</Button>}</article>)}</div></main>
}
