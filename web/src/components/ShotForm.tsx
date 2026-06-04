import { useState, useEffect, type CSSProperties } from 'react'
import { Modal } from '@freeappstore/sdk/ui'
import { APERTURES, SHUTTERS, ISOS, SCENE_TAGS, TAG_LABELS, type Shot, type SceneTag } from '../types'

type ShotDraft = Omit<Shot, 'id' | 'createdAt'>

interface Props {
  open: boolean
  onClose: () => void
  initial?: ShotDraft
  onSave: (data: ShotDraft) => void
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

const DEFAULT_DRAFT: ShotDraft = {
  aperture: 'f/2.8',
  shutter: '1/125',
  iso: 400,
  focalLength: 50,
  lens: '',
  tags: [],
  note: '',
}

export function ShotForm({ open, onClose, initial, onSave }: Props) {
  const [aperture, setAperture] = useState(DEFAULT_DRAFT.aperture)
  const [shutter, setShutter] = useState(DEFAULT_DRAFT.shutter)
  const [iso, setIso] = useState(DEFAULT_DRAFT.iso)
  const [focalLength, setFocalLength] = useState(DEFAULT_DRAFT.focalLength)
  const [lens, setLens] = useState(DEFAULT_DRAFT.lens)
  const [tags, setTags] = useState<SceneTag[]>([])
  const [note, setNote] = useState('')

  useEffect(() => {
    if (!open) return
    const d = initial ?? DEFAULT_DRAFT
    setAperture(d.aperture)
    setShutter(d.shutter)
    setIso(d.iso)
    setFocalLength(d.focalLength)
    setLens(d.lens)
    setTags(d.tags)
    setNote(d.note)
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleTag = (tag: SceneTag) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const handleSave = () => {
    onSave({ aperture, shutter, iso, focalLength, lens: lens.trim(), tags, note: note.trim() })
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Edit Shot' : 'Log Shot'}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }}>

        {/* EXIF Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={label}>Aperture</label>
            <select style={input} value={aperture} onChange={e => setAperture(e.target.value)}>
              {APERTURES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Shutter</label>
            <select style={input} value={shutter} onChange={e => setShutter(e.target.value)}>
              {SHUTTERS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>ISO</label>
            <select style={input} value={iso} onChange={e => setIso(Number(e.target.value))}>
              {ISOS.map(v => <option key={v} value={v}>ISO {v}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Focal Length (mm)</label>
            <input
              type="number"
              style={input}
              min={1}
              max={2000}
              value={focalLength || ''}
              placeholder="50"
              onChange={e => setFocalLength(Number(e.target.value))}
            />
          </div>
        </div>

        <div>
          <label style={label}>Lens</label>
          <input
            style={input}
            placeholder="e.g. Canon 50mm f/1.8"
            value={lens}
            onChange={e => setLens(e.target.value)}
          />
        </div>

        <div>
          <label style={label}>Scene Tags</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {SCENE_TAGS.map(tag => {
              const active = tags.includes(tag)
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  style={{
                    padding: '0.3rem 0.65rem',
                    borderRadius: '999px',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: active ? '1.5px solid var(--accent)' : '1.5px solid var(--line-strong)',
                    background: active ? 'var(--accent-soft)' : 'var(--paper-deep)',
                    color: active ? 'var(--accent)' : 'var(--muted)',
                    fontFamily: 'inherit',
                  }}
                >
                  {TAG_LABELS[tag]}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label style={label}>Note</label>
          <textarea
            style={{ ...input, resize: 'vertical', minHeight: '3.5rem' }}
            placeholder="e.g. Slightly underexposed, try +0.7 EV next time"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
        </div>

        <button
          onClick={handleSave}
          style={{
            background: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius)',
            padding: '0.7rem',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            width: '100%',
            fontFamily: 'inherit',
          }}
        >
          {initial ? 'Save Changes' : 'Log Shot'}
        </button>
      </div>
    </Modal>
  )
}
