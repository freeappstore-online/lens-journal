import { useState, useEffect, type CSSProperties } from 'react'
import { Modal } from '@freeappstore/sdk/ui'
import type { Session } from '../types'

type SessionDraft = Omit<Session, 'id' | 'shots' | 'createdAt'>

interface Props {
  open: boolean
  onClose: () => void
  initial?: SessionDraft
  onSave: (data: SessionDraft) => void
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

const input: CSSProperties = {
  width: '100%',
  padding: '0.55rem 0.75rem',
  background: 'var(--paper-deep)',
  border: '1px solid var(--line-strong)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--ink)',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
}

const label: CSSProperties = {
  display: 'block',
  fontSize: '0.72rem',
  fontWeight: 700,
  color: 'var(--muted)',
  marginBottom: '0.35rem',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

export function SessionForm({ open, onClose, initial, onSave }: Props) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState(todayStr())
  const [location, setLocation] = useState('')
  const [learningNote, setLearningNote] = useState('')

  useEffect(() => {
    if (!open) return
    setTitle(initial?.title ?? '')
    setDate(initial?.date ?? todayStr())
    setLocation(initial?.location ?? '')
    setLearningNote(initial?.learningNote ?? '')
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const canSave = title.trim().length > 0

  const handleSave = () => {
    if (!canSave) return
    onSave({
      title: title.trim(),
      date,
      location: location.trim(),
      learningNote: learningNote.trim(),
    })
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Edit Session' : 'New Session'}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }}>
        <div>
          <label style={label}>Title *</label>
          <input
            style={input}
            placeholder="e.g. Golden hour at the park"
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={label}>Date</label>
            <input
              type="date"
              style={input}
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
          <div>
            <label style={label}>Location</label>
            <input
              style={input}
              placeholder="e.g. Central Park"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label style={label}>Learning Note</label>
          <textarea
            style={{ ...input, resize: 'vertical', minHeight: '4.5rem' }}
            placeholder="e.g. Next time try f/8 for sharper backgrounds"
            value={learningNote}
            onChange={e => setLearningNote(e.target.value)}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!canSave}
          style={{
            background: canSave ? 'var(--accent)' : 'var(--line-strong)',
            color: canSave ? 'white' : 'var(--muted)',
            border: 'none',
            borderRadius: 'var(--radius)',
            padding: '0.7rem',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: canSave ? 'pointer' : 'default',
            width: '100%',
            fontFamily: 'inherit',
          }}
        >
          {initial ? 'Save Changes' : 'Create Session'}
        </button>
      </div>
    </Modal>
  )
}
