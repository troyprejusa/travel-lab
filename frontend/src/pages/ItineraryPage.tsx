import { useState, type FormEvent } from 'react'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ResourceState } from '@/components/layout/ResourceState'
import { useTripResource } from '@/hooks/useTripResource'
import { useTripAdmin } from '@/hooks/useTripAdmin'
type Stop = { id: number; title: string; description: string | null; start_time: string; end_time: string }
function dateKey(d: Date) { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}` }
export default function ItineraryPage() {
  const admin = useTripAdmin()
  const { data, loading, error, mutate } = useTripResource<Stop>('itinerary')
  const [chosenMonth, setMonth] = useState<Date | null>(null)
  const firstEvent = data.length ? new Date([...data].sort((a,b) => a.start_time.localeCompare(b.start_time))[0].start_time) : new Date()
  const month = chosenMonth ?? new Date(firstEvent.getFullYear(), firstEvent.getMonth(), 1)
  const [selected, setSelected] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [formError, setFormError] = useState('')
  async function add(e: FormEvent<HTMLFormElement>) { e.preventDefault(); const form = e.currentTarget; const body = new FormData(form); if (String(body.get('end_time')) <= String(body.get('start_time'))) { setFormError('The end must be after the start.'); return } setFormError(''); if (await mutate('', { method:'POST', body })) { const start = new Date(String(body.get('start_time'))); setMonth(new Date(start.getFullYear(),start.getMonth(),1)); setSelected(dateKey(start)); form.reset(); setAdding(false) } }
  const days = new Date(month.getFullYear(), month.getMonth()+1, 0).getDate()
  const counts = new Map<string, number>()
  for (const stop of data) { const key = dateKey(new Date(stop.start_time)); counts.set(key, (counts.get(key) || 0) + 1) }
  const sorted = [...data].sort((a,b) => a.start_time.localeCompare(b.start_time)).filter(stop => !selected || dateKey(new Date(stop.start_time)) === selected)
  const shift = (amount: number) => { setMonth(new Date(month.getFullYear(), month.getMonth()+amount, 1)); setSelected(null) }
  return <main className="workspace"><div className="page-heading"><div><span className="section-kicker">THE PLAN</span><h1>Itinerary</h1><p>Make room for the moments that matter.</p></div><Button className="primary-button" onClick={() => setAdding(!adding)}>{adding ? 'Cancel' : '+ Add event'}</Button></div>
    {adding && <form className="form-card" onSubmit={add}><label>Event<input name="title" required /></label><label>Starts<input type="datetime-local" name="start_time" required /></label><label>Ends<input type="datetime-local" name="end_time" required /></label><label>Notes (optional)<input name="description" /></label>{formError && <p role="alert" className="form-error">{formError}</p>}<Button type="submit">Add event</Button></form>}
    <ResourceState loading={loading} error={error}/><div className="itinerary-layout"><section className="calendar-card" aria-label="Calendar"><div className="calendar-heading"><h2>{month.toLocaleDateString(undefined,{month:'long',year:'numeric'})}</h2><div><button type="button" onClick={() => shift(-1)} aria-label="Previous month"><ChevronLeft size={18}/></button><button type="button" onClick={() => shift(1)} aria-label="Next month"><ChevronRight size={18}/></button></div></div><div className="calendar-grid">{['S','M','T','W','T','F','S'].map((day,i)=><span className="calendar-weekday" key={i}>{day}</span>)}{Array.from({length:month.getDay()},(_,i)=><span key={`empty-${i}`} />)}{Array.from({length:days},(_,i)=>{const date=new Date(month.getFullYear(),month.getMonth(),i+1);const key=dateKey(date);return <button key={key} type="button" className={`calendar-day ${selected===key?'selected':''}`} aria-label={`${date.toLocaleDateString(undefined,{dateStyle:'full'})}, ${counts.get(key)||0} events`} aria-pressed={selected===key} onClick={()=>setSelected(selected===key?null:key)}>{i+1}{counts.has(key)&&<span className="calendar-dot"/>}</button>})}</div><p className="calendar-hint">Select a day to filter your plans.</p></section>
    <section className="agenda"><div className="agenda-heading"><div><span className="section-kicker">YOUR SCHEDULE</span><h2>{selected ? new Date(`${selected}T12:00:00`).toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'}) : 'All events'}</h2></div>{selected && <button className="text-link" onClick={()=>setSelected(null)}>Show all</button>}</div>{!loading && !sorted.length && <p className="empty-state">{selected ? 'Nothing planned for this day.' : 'No plans yet. Add your first event.'}</p>}<div className="timeline">{sorted.map(stop=><article className="timeline-event" key={stop.id}><span className="timeline-dot"/><div className="timeline-date">{new Date(stop.start_time).toLocaleDateString(undefined,{month:'short',day:'numeric'})}</div><div className="timeline-content"><div className="item-row"><div><h3>{stop.title}</h3><p><Clock size={14}/> {new Date(stop.start_time).toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'})} – {new Date(stop.end_time).toLocaleString(undefined,{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'})}</p>{stop.description && <p>{stop.description}</p>}</div>{admin && <Button variant="ghost" onClick={()=>{if(window.confirm('Delete this event?')) void mutate(`/${stop.id}`,{method:'DELETE'})}}>Delete</Button>}</div></div></article>)}</div></section></div></main>
}
