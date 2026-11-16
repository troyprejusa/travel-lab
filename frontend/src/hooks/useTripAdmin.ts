import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiFetch } from '@/lib/api'
export function useTripAdmin() {
  const { tripId = '' } = useParams()
  const [admin, setAdmin] = useState(false)
  useEffect(() => { let active = true; apiFetch(`/trip/${encodeURIComponent(tripId)}/permissions`).then(r => r.ok ? r.json() : null).then(data => { if (active) setAdmin(data?.admin === true) }).catch(() => {}); return () => { active = false } }, [tripId])
  return admin
}
