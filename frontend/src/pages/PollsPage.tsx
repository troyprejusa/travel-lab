import { useTripAdmin } from '@/hooks/useTripAdmin'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { ResourceState } from '@/components/layout/ResourceState'
import { useTripResource } from '@/hooks/useTripResource'
import { auth } from '@/auth/auth'
type Poll = { poll_id: number; title: string; description: string | null; options: { option_id: number; option: string; votes: string[] }[] }
export default function PollsPage() {
  const admin = useTripAdmin()
  const { data, loading, error, mutate, tripId, socket, connected } = useTripResource<Poll>('poll', 'poll')
  const [adding, setAdding] = useState(false)
  async function add(e: FormEvent<HTMLFormElement>) { e.preventDefault(); const form = e.currentTarget; const fields = new FormData(form); const options = String(fields.get('options')).split('\n').map(x => x.trim()).filter(Boolean); if (options.length < 2) { alert('Add at least two options.'); return } if (await mutate('', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ trip_id: tripId, created_by: auth.getToken(), title: fields.get('title'), description: fields.get('description') || null, options }) })) { form.reset(); setAdding(false) } }
  return <main className="workspace"><div className="page-heading"><div><span className="section-kicker">DECIDE TOGETHER</span><h1>Polls</h1><p>Ask the group and see what everyone thinks.</p></div><Button className="primary-button" onClick={() => setAdding(!adding)}>{adding ? 'Cancel' : '+ New poll'}</Button></div>
  {adding && <form className="form-card" onSubmit={add}><label>Question<input name="title" required /></label><label>Details (optional)<input name="description" /></label><label>Options, one per line<textarea name="options" rows={4} required placeholder={'Beach day\nMountain hike'} /></label><Button>Post poll</Button></form>}
  <ResourceState loading={loading} error={error} />{!loading && !data.length && <p className="empty-state">No polls yet. Ask your group a question.</p>}
  <div className="card-list">{data.map(poll => { const total = poll.options.reduce((n,o) => n + o.votes.length,0); return <article className="resource-card" key={poll.poll_id}><div className="item-row"><div><h2>{poll.title}</h2>{poll.description && <p>{poll.description}</p>}</div>{admin && <Button variant="ghost" onClick={() => { if (window.confirm('Delete this poll?')) void mutate(`/${poll.poll_id}`,{ method:'DELETE' }) }}>Delete</Button>}</div><div className="poll-options">{poll.options.map(option => <button key={option.option_id} className="poll-option" disabled={!connected} onClick={() => socket?.emit('frontend_vote', { trip_id:tripId, poll_id:poll.poll_id, option_id:option.option_id, voted_by:auth.getToken() })}><span>{option.option}</span><strong>{option.votes.length} {option.votes.length === 1 ? 'vote' : 'votes'}</strong></button>)}</div><p className="muted">{total} total votes{!connected && ' · Connecting to live voting…'}</p></article> })}</div></main>
}
