import { useTripAdmin } from '@/hooks/useTripAdmin'
import { useState, type FormEvent } from 'react'
import { Check, Luggage, PackageOpen, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ResourceState } from '@/components/layout/ResourceState'
import { useTripResource } from '@/hooks/useTripResource'

type Item = { id: number; item: string; quantity: number; description: string | null; packed_by: string | null }
export default function PackingPage() {
  const admin = useTripAdmin()
  const { data, loading, error, mutate } = useTripResource<Item>('packing')
  const [adding, setAdding] = useState(false)
  const [filter, setFilter] = useState<'all'|'available'|'claimed'>('all')
  async function add(e: FormEvent<HTMLFormElement>) { e.preventDefault(); const form = e.currentTarget; if (await mutate('', { method: 'POST', body: new FormData(form) })) { form.reset(); setAdding(false) } }
  const claimed = data.filter(item => item.packed_by).length
  const visible = data.filter(item => filter === 'all' || (filter === 'claimed' ? !!item.packed_by : !item.packed_by))
  return <main className="workspace packing-page"><div className="page-heading"><div><span className="section-kicker">THE LITTLE THINGS</span><h1>Pack together</h1><p>Share the essentials, so everyone brings a little something.</p></div><Button className="primary-button" onClick={() => setAdding(!adding)}>{adding ? 'Cancel' : <><Plus size={17}/> Add item</>}</Button></div>
    {adding && <form className="form-card" onSubmit={add}><label>Item<input name="item" required maxLength={200} placeholder="e.g. Beach umbrella" /></label><label>Quantity<input name="quantity" type="number" min="1" defaultValue="1" required /></label><label>Notes (optional)<input name="description" /></label><Button type="submit">Add to list</Button></form>}
    <ResourceState loading={loading} error={error} />
    {!loading && !error && <><div className="packing-summary"><div className="packing-summary-icon"><Luggage size={25}/></div><div className="packing-summary-copy"><span className="summary-kicker">THE SHARED LIST</span><h2>{data.length ? `${claimed} of ${data.length} items claimed` : 'Let’s get packing'}</h2><p>{data.length ? `${data.length - claimed} ${data.length - claimed === 1 ? 'item is' : 'items are'} still up for grabs.` : 'Add the things your group can bring along.'}</p></div><div className="packing-progress"><span>{data.length ? Math.round(claimed / data.length * 100) : 0}% <small>claimed</small></span><div className="progress-track" role="progressbar" aria-label="Items claimed" aria-valuemin={0} aria-valuemax={Math.max(data.length, 1)} aria-valuenow={claimed}><i style={{width:`${data.length ? claimed / data.length * 100 : 0}%`}}/></div></div></div>
    <div className="list-toolbar"><div><span className="section-kicker">YOUR ESSENTIALS</span><h2>The packing list</h2></div><div className="filter-tabs" aria-label="Filter packing items">{([['all','All',data.length],['available','Available',data.length-claimed],['claimed','Claimed',claimed]] as const).map(([value,label,count])=><button key={value} type="button" className={filter===value?'active':''} aria-pressed={filter===value} onClick={()=>setFilter(value)}>{label} <span>{count}</span></button>)}</div></div>
    {!data.length ? <div className="packing-empty"><PackageOpen size={25}/><h3>Nothing on the list yet</h3><p>Add the first essential for your trip.</p></div> : !visible.length ? <p className="packing-empty">No {filter} items right now.</p> : <div className="packing-list">{visible.map(item => <article className="packing-item" key={item.id}><div className={`packing-check ${item.packed_by?'is-claimed':''}`} aria-hidden="true">{item.packed_by && <Check size={16}/>}</div><div className="packing-item-main"><div className="packing-item-title"><h3>{item.item}</h3><span className="quantity-pill">× {item.quantity}</span></div>{item.description && <p>{item.description}</p>}<span className={`packing-status ${item.packed_by?'claimed':''}`}>{item.packed_by ? `Claimed by ${item.packed_by}` : 'Available to claim'}</span></div><div className="packing-actions"><Button variant="outline" onClick={() => void mutate(`/${item.packed_by ? 'unclaim' : 'claim'}/${item.id}`, { method: 'PATCH' })}>{item.packed_by ? 'Unclaim' : 'I’ll bring it'}</Button>{admin && <Button variant="ghost" size="icon" aria-label={`Delete ${item.item}`} onClick={() => { if (window.confirm('Delete this item?')) void mutate(`/${item.id}`, { method: 'DELETE' }) }}><Trash2 size={16}/></Button>}</div></article>)}</div>}</>}
  </main>
}
