import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io, type Socket } from 'socket.io-client'
import { auth } from '@/auth/auth'
import { apiFetch } from '@/lib/api'

export function useTripResource<T>(resource: string, namespace?: string) {
  const { tripId = '' } = useParams()
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)
  const path = `/trip/${encodeURIComponent(tripId)}/${resource}`
  const reload = useCallback(async () => {
    try {
      const response = await apiFetch(path)
      if (!response.ok) throw new Error(`Could not load ${resource} (HTTP ${response.status}).`)
      setData(await response.json()); setError('')
    } catch (err) { setError(err instanceof Error ? err.message : 'Unable to load data.') }
    finally { setLoading(false) }
  }, [path, resource])
  useEffect(() => { void reload() }, [reload])
  useEffect(() => {
    if (!namespace) return
    const connection = io(`/${namespace}`, { path: '/sio/socket.io', transports: ['websocket'], auth: { token: auth.getToken() }, query: { trip_id: tripId } })
    setSocket(connection)
    connection.on('connect', () => { setConnected(true); void reload() })
    connection.on('disconnect', () => setConnected(false))
    connection.on('connect_error', () => setError('Live connection unavailable. Please try again.'))
    connection.onAny((event: string, payload: { message?: string }) => {
      if (event.endsWith('_error') || event === 'rate_limit_exceeded') setError(payload?.message || 'The action could not be completed.')
      else if (event.startsWith('backend_')) void reload()
    })
    return () => { connection.disconnect(); setSocket(null); setConnected(false) }
  }, [namespace, tripId, reload])
  async function mutate(suffix: string, options: RequestInit) {
    setError('')
    try {
      const response = await apiFetch(path + suffix, options)
      if (!response.ok) throw new Error(`Request failed (HTTP ${response.status}).`)
      await reload(); return true
    } catch (err) { setError(err instanceof Error ? err.message : 'Request failed.'); return false }
  }
  return { tripId, data, loading, error, setError, reload, mutate, socket, connected }
}
