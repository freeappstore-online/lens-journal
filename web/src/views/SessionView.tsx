import { useState, type CSSProperties } from 'react'
import { Card, Badge, ConfirmDialog } from '@freeappstore/sdk/ui'
import type { JournalStore } from '../store'
import type { Session, Shot } from '../types'
import { TAG_LABELS } from '../types'
import { SessionForm } from '../components/SessionForm'
import { ShotForm } from '../components/ShotForm'

interface Props {
  session: Session
  store: JournalStore
  onBack: () => void
}

export function SessionView({ session, store, onBack }: Props) {
  const [showEditSession, setShowEditSession] = useState(false)
  const [showDeleteSession, setShowDeleteSession] = useState(false)
  const [showAddShot, setShowAddShot] = useState(false)
  const [editingShot, setEditingShot] = useState<Shot | null>(null)
  const [deletingShotId, setDeletingShotId] = useState<string | null>(null)
  const [noteExpanded, setNoteExpanded] = useState(false)

  const shots = [...session.shots].reverse()

  const handleDeleteSession = () => {
    store.deleteSession(session.id)
    onBack()
  }

  return (
    <div style={{ minHeight: '100%' }}>
      {/* Back header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1rem',
          borderBottom: '1px solid var(--line)',
          position: 'sticky',
          top: 0,
          background: 'var(--glass-strong)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          zIndex: 10,
        }}
      >
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '0.25rem 0',
            fontFamily: 'inherit',
          }}
        >
          <ChevronLeft /> Journal
        </button>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setShowEditSession(true)}
          style={iconBtn}
          title="Edit session"
        >
          <EditIcon />
        </button>
        <button
          onClick={() => setShowDeleteSession(true)}
          style={{ ...iconBtn, color: 'var(--error)' }}
          title="Delete session"
        >
          <TrashIcon />
        </button>
      </div>

      {/* Session info */}
      <div style={{ padding: '1rem 1rem 0' }}>
        <div style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>
            {formatDate(session.date)}
          </span>
          {session.location && (
            <>
              <span style={{ color: 'var(--muted)', fontSize: '0.78rem' }}>·</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{session.location}</span>
            </>
          )}
        </div>
        <h2
          className="display-font"
          style={{ fontSize: '1.5rem', color: 'var(--ink)', margin: '0 0 0.75rem' }}
        >
          {session.title}
        </h2>

        {session.learningNote && (
          <div
            style={{
              background: 'var(--accent-soft)',
              borderRadius: 'var(--radius)',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              cursor: 'pointer',
            }}
            onClick={() => setNoteExpanded(v => !v)}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem' }}>💡</span>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'var(--accent)',
                  margin: 0,
                  flex: 1,
                  lineHeight: 1.5,
                  overflow: noteExpanded ? 'visible' : 'hidden',
                  display: noteExpanded ? 'block' : '-webkit-box',
                  WebkitLineClamp: noteExpanded ? undefined : 2,
                  WebkitBoxOrient: 'vertical' as CSSProperties['WebkitBoxOrient'],
                }}
              >
                {session.learningNote}
              </p>
            </div>
          </div>
        )}

        {/* Shot count + add button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '0.75rem',
          }}
        >
          <span style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600 }}>
            {session.shots.length} {session.shots.length === 1 ? 'shot' : 'shots'}
          </span>
          <button
            onClick={() => setShowAddShot(true)}
            style={{
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius)',
              padding: '0.45rem 0.9rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <span style={{ fontSize: '1.1em' }}>+</span> Log Shot
          </button>
        </div>

        {shots.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '2.5rem 1rem',
              color: 'var(--muted)',
              fontSize: '0.9rem',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</div>
            <p style={{ margin: 0 }}>No shots logged yet.</p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem' }}>Tap "+ Log Shot" to add your first.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', paddingBottom: '1.5rem' }}>
            {shots.map((shot, i) => (
              <ShotCard
                key={shot.id}
                shot={shot}
                index={shots.length - i}
                onEdit={() => setEditingShot(shot)}
                onDelete={() => setDeletingShotId(shot.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating add button (visible when scrolled, extra convenience) */}
      <button
        onClick={() => setShowAddShot(true)}
        style={{
          position: 'fixed',
          bottom: 'calc(1.5rem + env(safe-area-inset-bottom))',
          right: '1.25rem',
          width: '3.25rem',
          height: '3.25rem',
          borderRadius: '50%',
          background: 'var(--accent)',
          color: 'white',
          border: 'none',
          fontSize: '1.6rem',
          lineHeight: 1,
          cursor: 'pointer',
          boxShadow: '0 4px 16px var(--glow-warm)',
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Log shot"
      >
        +
      </button>

      {/* Modals */}
      <SessionForm
        open={showEditSession}
        onClose={() => setShowEditSession(false)}
        initial={{
          title: session.title,
          date: session.date,
          location: session.location,
          learningNote: session.learningNote,
        }}
        onSave={data => store.updateSession(session.id, data)}
      />

      <ConfirmDialog
        open={showDeleteSession}
        title="Delete Session"
        message={`Delete "${session.title}"? All ${session.shots.length} shots will be lost.`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleDeleteSession}
        onCancel={() => setShowDeleteSession(false)}
      />

      <ShotForm
        open={showAddShot}
        onClose={() => setShowAddShot(false)}
        onSave={data => store.addShot(session.id, data)}
      />

      {editingShot && (
        <ShotForm
          open={!!editingShot}
          onClose={() => setEditingShot(null)}
          initial={{
            aperture: editingShot.aperture,
            shutter: editingShot.shutter,
            iso: editingShot.iso,
            focalLength: editingShot.focalLength,
            lens: editingShot.lens,
            tags: editingShot.tags,
            note: editingShot.note,
          }}
          onSave={data => {
            store.updateShot(session.id, editingShot.id, data)
            setEditingShot(null)
          }}
        />
      )}

      <ConfirmDialog
        open={deletingShotId !== null}
        title="Delete Shot"
        message="Remove this shot from the session?"
        confirmLabel="Delete"
        variant="danger"
        onConfirm={() => {
          if (deletingShotId) store.deleteShot(session.id, deletingShotId)
          setDeletingShotId(null)
        }}
        onCancel={() => setDeletingShotId(null)}
      />
    </div>
  )
}

interface ShotCardProps {
  shot: Shot
  index: number
  onEdit: () => void
  onDelete: () => void
}

function ShotCard({ shot, index, onEdit, onDelete }: ShotCardProps) {
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* EXIF row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.15rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
            <span style={exifChip}>{shot.aperture}</span>
            <span style={{ color: 'var(--line-strong)', fontSize: '0.7rem' }}>·</span>
            <span style={exifChip}>{shot.shutter}</span>
            <span style={{ color: 'var(--line-strong)', fontSize: '0.7rem' }}>·</span>
            <span style={exifChip}>ISO {shot.iso}</span>
            {shot.focalLength > 0 && (
              <>
                <span style={{ color: 'var(--line-strong)', fontSize: '0.7rem' }}>·</span>
                <span style={exifChip}>{shot.focalLength}mm</span>
              </>
            )}
          </div>

          {shot.lens && (
            <p style={{ margin: '0 0 0.4rem', fontSize: '0.8rem', color: 'var(--muted)', fontWeight: 600 }}>
              {shot.lens}
            </p>
          )}

          {shot.tags.length > 0 && (
            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.4rem' }}>
              {shot.tags.map(tag => (
                <Badge key={tag}>{TAG_LABELS[tag]}</Badge>
              ))}
            </div>
          )}

          {shot.note && (
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.4, fontStyle: 'italic' }}>
              {shot.note}
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0, marginLeft: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--muted)', alignSelf: 'flex-start', marginTop: '0.2rem' }}>
            #{index}
          </span>
          <button onClick={onEdit} style={iconBtn} title="Edit shot"><EditIcon /></button>
          <button onClick={onDelete} style={{ ...iconBtn, color: 'var(--error)' }} title="Delete shot"><TrashIcon /></button>
        </div>
      </div>
    </Card>
  )
}

const exifChip: CSSProperties = {
  fontSize: '0.82rem',
  fontWeight: 700,
  color: 'var(--ink)',
  fontVariantNumeric: 'tabular-nums',
}

const iconBtn: CSSProperties = {
  background: 'none',
  border: 'none',
  padding: '0.25rem',
  cursor: 'pointer',
  color: 'var(--muted)',
  display: 'flex',
  alignItems: 'center',
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}
