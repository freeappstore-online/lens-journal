import { useState, useCallback } from 'react'
import type { Session, Shot } from './types'

const STORAGE_KEY = 'lens-journal-v1'

function load(): Session[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Session[]) : []
  } catch {
    return []
  }
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

export interface JournalStore {
  sessions: Session[]
  addSession: (data: Omit<Session, 'id' | 'shots' | 'createdAt'>) => Session
  updateSession: (id: string, updates: Partial<Pick<Session, 'title' | 'date' | 'location' | 'learningNote'>>) => void
  deleteSession: (id: string) => void
  addShot: (sessionId: string, data: Omit<Shot, 'id' | 'createdAt'>) => Shot
  updateShot: (sessionId: string, shotId: string, updates: Partial<Omit<Shot, 'id' | 'createdAt'>>) => void
  deleteShot: (sessionId: string, shotId: string) => void
  exportJson: () => string
  importJson: (json: string) => { count: number }
  clearAll: () => void
}

export function useJournalStore(): JournalStore {
  const [sessions, setSessions] = useState<Session[]>(load)

  const persist = useCallback((next: Session[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setSessions(next)
  }, [])

  const addSession = useCallback(
    (data: Omit<Session, 'id' | 'shots' | 'createdAt'>) => {
      const session: Session = {
        id: uid(),
        shots: [],
        createdAt: new Date().toISOString(),
        ...data,
      }
      persist([session, ...sessions])
      return session
    },
    [sessions, persist],
  )

  const updateSession = useCallback(
    (id: string, updates: Partial<Pick<Session, 'title' | 'date' | 'location' | 'learningNote'>>) => {
      persist(sessions.map(s => (s.id === id ? { ...s, ...updates } : s)))
    },
    [sessions, persist],
  )

  const deleteSession = useCallback(
    (id: string) => {
      persist(sessions.filter(s => s.id !== id))
    },
    [sessions, persist],
  )

  const addShot = useCallback(
    (sessionId: string, data: Omit<Shot, 'id' | 'createdAt'>) => {
      const shot: Shot = {
        id: uid(),
        createdAt: new Date().toISOString(),
        ...data,
      }
      persist(
        sessions.map(s =>
          s.id === sessionId ? { ...s, shots: [...s.shots, shot] } : s,
        ),
      )
      return shot
    },
    [sessions, persist],
  )

  const updateShot = useCallback(
    (sessionId: string, shotId: string, updates: Partial<Omit<Shot, 'id' | 'createdAt'>>) => {
      persist(
        sessions.map(s =>
          s.id !== sessionId
            ? s
            : { ...s, shots: s.shots.map(sh => (sh.id === shotId ? { ...sh, ...updates } : sh)) },
        ),
      )
    },
    [sessions, persist],
  )

  const deleteShot = useCallback(
    (sessionId: string, shotId: string) => {
      persist(
        sessions.map(s =>
          s.id !== sessionId ? s : { ...s, shots: s.shots.filter(sh => sh.id !== shotId) },
        ),
      )
    },
    [sessions, persist],
  )

  const exportJson = useCallback(
    () =>
      JSON.stringify(
        { version: 1, exportedAt: new Date().toISOString(), sessions },
        null,
        2,
      ),
    [sessions],
  )

  const importJson = useCallback(
    (json: string) => {
      const data = JSON.parse(json) as { sessions?: Session[] } | Session[]
      const imported: Session[] = Array.isArray(data) ? data : (data.sessions ?? [])
      persist(imported)
      return { count: imported.length }
    },
    [persist],
  )

  const clearAll = useCallback(() => persist([]), [persist])

  return {
    sessions,
    addSession,
    updateSession,
    deleteSession,
    addShot,
    updateShot,
    deleteShot,
    exportJson,
    importJson,
    clearAll,
  }
}
