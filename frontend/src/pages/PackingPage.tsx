import { useTripAdmin } from '@/hooks/useTripAdmin'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { ResourceState } from '@/components/layout/ResourceState'
import { useTripResource } from '@/hooks/useTripResource'
type Item = { id: number; item: string; quantity: number; description: string | null; packed_by: string | null }
export default function PackingPage() {
  const admin = useTripAdmin()
  const { data, loading, error, mutate } = useTripResource<Item>('packing')
  const [adding, setAdding] = useState(false)
  async function add(e: FormEvent<HTMLFormElement>) { e.preventDefault(); const form = e.currentTarget; if (await mutate('', { method: 'POST', body: new FormData(form) })) { form.reset(); setAdding(false) } }
  return <main className="workspace"><div className="page-heading"><div><span className="section-kicker">PLAN TOGETHER</span><h1>Packing list</h1><p>Share the essentials and claim what you’ll bring.</p></div><Button className="primary-button" onClick={() => setAdding(!adding)}>{adding ? 'Cancel' : '+ Add item'}</Button></div>
    {adding && <form className="form-card" onSubmit={add}><label>Item<input name="item" required maxLength={200} placeholder="e.g. Beach umbrella" /></label><label>Quantity<input name="quantity" type="number" min="1" defaultValue="1" required /></label><label>Notes (optional)<input name="description" /></label><Button type="submit">Add to list</Button></form>}
    <ResourceState loading={loading} error={error} />{!loading && data.length === 0 && <p className="empty-state">Nothing on the list yet. Add the first item.</p>}
    <div className="card-list">{data.map(item => <article className="resource-card item-row" key={item.id}><div><h2>{item.item} <span className="muted">× {item.quantity}</span></h2>{item.description && <p>{item.description}</p>}<p className="muted">{item.packed_by ? `Bringing: ${item.packed_by}` : 'Available to claim'}</p></div><div className="actions"><Button variant="outline" onClick={() => void mutate(`/${item.packed_by ? 'unclaim' : 'claim'}/${item.id}`, { method: 'PATCH' })}>{item.packed_by ? 'Unclaim' : 'I’ll bring it'}</Button>{admin && <Button variant="ghost" onClick={() => { if (window.confirm('Delete this item?')) void mutate(`/${item.id}`, { method: 'DELETE' }) }}>Delete</Button>}</div></article>)}</div>
  </main>
}
