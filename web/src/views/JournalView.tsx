import { useState } from 'react'
import { Card, EmptyState, Badge } from '@freeappstore/sdk/ui'
import type { JournalStore } from '../store'
import type { Session } from '../types'
import { SessionForm } from '../components/SessionForm'

interface Props {
  store: JournalStore
  onOpenSession: (id: string) => void
}

export function JournalView({ store, onOpenSession }: Props) {
  const [showForm, setShowForm] = useState(false)

  const sorted = [...store.sessions].sort((a, b) =>
    b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt),
  )

  return (
    <div style={{ padding: '1rem 1rem 0' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.25rem',
        }}
      >
        <h1
          className="display-font"
          style={{ fontSize: '1.6rem', color: 'var(--ink)', margin: 0 }}
        >
          Journal
        </h1>
        <button
          onClick={() => setShowForm(true)}
          style={{
            background: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius)',
            padding: '0.5rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          <span style={{ fontSize: '1.1em' }}>+</span> Session
        </button>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          title="No sessions yet"
          message="Start a new session to log your shots and track your settings over time."
          action={
            <button
              onClick={() => setShowForm(true)}
              style={{
                background: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius)',
                padding: '0.6rem 1.25rem',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              + New Session
            </button>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingBottom: '1rem' }}>
          {sorted.map(s => (
            <SessionCard key={s.id} session={s} onClick={() => onOpenSession(s.id)} />
          ))}
        </div>
      )}

      <SessionForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSave={data => store.addSession(data)}
      />
    </div>
  )
}

function SessionCard({ session, onClick }: { session: Session; onClick: () => void }) {
  const allTags = [...new Set(session.shots.flatMap(s => s.tags))]
  const totalShots = session.shots.length

  return (
    <Card onClick={onClick}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              marginBottom: '0.3rem',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
              {formatDate(session.date)}
            </span>
            {session.location && (
              <>
                <span style={{ color: 'var(--line-strong)', fontSize: '0.78rem' }}>·</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
                  {session.location}
                </span>
              </>
            )}
          </div>
          <p
            style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--ink)',
              margin: '0 0 0.5rem',
              lineHeight: 1.3,
            }}
          >
            {session.title}
          </p>
          {allTags.length > 0 && (
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
              {allTags.slice(0, 4).map(tag => (
                <Badge key={tag}>{tag}</Badge>
              ))}
              {allTags.length > 4 && (
                <Badge variant="default">+{allTags.length - 4}</Badge>
              )}
            </div>
          )}
          {session.learningNote && (
            <p
              style={{
                marginTop: '0.5rem',
                fontSize: '0.8rem',
                color: 'var(--muted)',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.4,
              }}
            >
              {session.learningNote}
            </p>
          )}
        </div>
        <div
          style={{
            textAlign: 'center',
            flexShrink: 0,
            background: 'var(--accent-soft)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.4rem 0.6rem',
            minWidth: '3rem',
          }}
        >
          <span
            style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              color: 'var(--accent)',
              display: 'block',
              lineHeight: 1,
            }}
          >
            {totalShots}
          </span>
          <span style={{ fontSize: '0.65rem', color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.05em' }}>
            SHOTS
          </span>
        </div>
      </div>
    </Card>
  )
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
