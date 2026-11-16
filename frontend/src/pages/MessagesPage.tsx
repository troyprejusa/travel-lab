import { useTripAdmin } from '@/hooks/useTripAdmin'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { ResourceState } from '@/components/layout/ResourceState'
import { useTripResource } from '@/hooks/useTripResource'
import { auth } from '@/auth/auth'
type Message = { id: number; content: string; created_at: string; created_by: string }
export default function MessagesPage() {
  const admin = useTripAdmin()
  const { data, loading, error, mutate, tripId, socket, connected } = useTripResource<Message>('message', 'message')
  const [message, setMessage] = useState('')
  function send(e: FormEvent) { e.preventDefault(); if (!message.trim() || !connected) return; socket?.emit('frontend_msg', { trip_id:tripId, content:message.trim(), created_by:auth.getToken() }); setMessage('') }
  return <main className="workspace"><div className="page-heading"><div><span className="section-kicker">KEEP IN TOUCH</span><h1>Messages</h1><p>A place for the conversation around your trip.</p></div>{admin && <Button variant="outline" onClick={() => { if (window.confirm('Clear all messages for everyone?')) void mutate('', { method:'DELETE' }) }}>Clear messages</Button>}</div><ResourceState loading={loading} error={error}/><div className="message-feed" aria-label="Messages">{!loading && !data.length && <p className="empty-state">No messages yet. Say hello!</p>}{data.map(msg => <article className={`message ${msg.created_by === auth.getToken() ? 'message-own' : ''}`} key={msg.id}><div className="message-meta">{msg.created_by} · {new Date(msg.created_at).toLocaleString(undefined, {dateStyle:'medium',timeStyle:'short'})}</div><p>{msg.content}</p></article>)}</div><form className="composer" onSubmit={send}><label className="sr-only" htmlFor="message">Message</label><input id="message" value={message} onChange={e => setMessage(e.target.value)} placeholder="Write a message…" /><Button disabled={!connected || !message.trim()}>Send</Button></form>{!connected && <p className="muted">Connecting to messages…</p>}</main>
}
