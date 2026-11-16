import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Send, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ResourceState } from '@/components/layout/ResourceState'
import { useTripResource } from '@/hooks/useTripResource'
import { useTripAdmin } from '@/hooks/useTripAdmin'
import { auth } from '@/auth/auth'
type Message = { id: number; content: string; created_at: string; created_by: string }
export default function MessagesPage() {
  const admin = useTripAdmin()
  const { data, loading, error, mutate, tripId, socket, connected } = useTripResource<Message>('message', 'message')
  const [message, setMessage] = useState('')
  const feedRef = useRef<HTMLDivElement>(null)
  const shouldScroll = useRef(true)
  useEffect(() => { const feed = feedRef.current; if (feed && shouldScroll.current) feed.scrollTop = feed.scrollHeight }, [data])
  function send(e: FormEvent) { e.preventDefault(); if (!message.trim() || !connected) return; socket?.emit('frontend_msg', { trip_id:tripId, content:message.trim(), created_by:auth.getToken() }); setMessage(''); shouldScroll.current = true }
  const messages = [...data].sort((a,b)=>a.created_at.localeCompare(b.created_at))
  return <main className="conversation-page"><header className="conversation-header"><div className="conversation-icon"><MessageCircle size={20}/></div><div><h1>Trip conversation</h1><p><span className={`connection-dot ${connected ? 'online' : ''}`}/>{connected ? 'Connected' : 'Connecting…'} · Your trip group</p></div>{admin && <Button className="conversation-clear" variant="ghost" onClick={() => { if (window.confirm('Clear all messages for everyone?')) void mutate('', { method:'DELETE' }) }}>Clear messages</Button>}</header>
    <ResourceState loading={loading} error={error}/><div className="conversation-feed" ref={feedRef} aria-label="Trip messages" onScroll={e=>{const el=e.currentTarget; shouldScroll.current = el.scrollHeight - el.scrollTop - el.clientHeight < 100}}>
      {!loading && !messages.length && <div className="conversation-empty"><div className="conversation-icon"><MessageCircle size={24}/></div><h2>Start the conversation</h2><p>Share a thought, ask a question, or get everyone excited for the trip.</p></div>}
      {messages.map((msg,i)=>{const own=msg.created_by===auth.getToken();const date=new Date(msg.created_at);const previous=i>0?new Date(messages[i-1].created_at):null;const newDay=!previous || previous.toDateString()!==date.toDateString();return <div key={msg.id}>{newDay && <div className="conversation-date">{date.toLocaleDateString(undefined,{dateStyle:'full'})}</div>}<article className={`chat-message ${own?'chat-own':''}`}><div className="chat-avatar" aria-hidden="true">{msg.created_by.charAt(0).toUpperCase()}</div><div className="chat-content"><div className="chat-meta">{own?'You':msg.created_by} <span>{date.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'})}</span></div><p>{msg.content}</p></div></article></div>})}
    </div><form className="conversation-composer" onSubmit={send}><label className="sr-only" htmlFor="message">Message</label><input id="message" value={message} onChange={e=>setMessage(e.target.value)} placeholder="Write a message to the group…" autoComplete="off"/><Button className="send-button" disabled={!connected || !message.trim()} aria-label="Send message"><Send size={18}/><span>Send</span></Button></form>
  </main>
}
