import { useRef, useState } from 'react'
import { Card, ConfirmDialog, Spinner } from '@freeappstore/sdk/ui'
import { useAuth, useTheme } from '@freeappstore/sdk/hooks'
import { Avatar } from '@freeappstore/sdk/ui'
import type { FreeAppStore } from '@freeappstore/sdk'
import type { JournalStore } from '../store'

interface Props {
  fas: FreeAppStore
  store: JournalStore
}

export function SettingsView({ fas, store }: Props) {
  const { user, loading, signOut } = useAuth(fas)
  const { preference, setPreference } = useTheme()
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const json = store.exportJson()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `lens-journal-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const { count } = store.importJson(ev.target!.result as string)
        setImportError(null)
        alert(`Imported ${count} sessions successfully.`)
      } catch {
        setImportError('Invalid file. Please use a Lens Journal JSON export.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const totalShots = store.sessions.reduce((n, s) => n + s.shots.length, 0)

  return (
    <div style={{ padding: '1rem' }}>
      <h1 className="display-font" style={{ fontSize: '1.6rem', color: 'var(--ink)', margin: '0 0 1.25rem' }}>
        Settings
      </h1>

      {/* Auth section */}
      <Card style={{ marginBottom: '0.75rem' }}>
        <p style={sectionLabel}>Account</p>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem' }}>
            <Spinner size={24} />
          </div>
        ) : user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Avatar user={user} size={40} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 700, color: 'var(--ink)', fontSize: '0.95rem' }}>
                {user.login}
              </p>
            </div>
            <button
              onClick={signOut}
              style={{
                background: 'none',
                border: '1.5px solid var(--line-strong)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.4rem 0.75rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--muted)',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Sign out
            </button>
          </div>
        ) : (
          <div>
            <p style={{ margin: '0 0 0.75rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
              Sign in to back up your journal across devices.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
              <button onClick={() => fas.auth.signIn('github')} style={signInBtn('#24292e', '#ffffff')}>
                <GithubIcon /> Sign in with GitHub
              </button>
              <button onClick={() => fas.auth.signIn('google')} style={signInBtn('#4285f4', '#ffffff')}>
                <GoogleIcon /> Sign in with Google
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Appearance */}
      <Card style={{ marginBottom: '0.75rem' }}>
        <p style={sectionLabel}>Appearance</p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {(['light', 'dark', 'system'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPreference(p)}
              style={{
                flex: 1,
                padding: '0.45rem',
                borderRadius: 'var(--radius-sm)',
                border: preference === p ? '2px solid var(--accent)' : '2px solid var(--line)',
                background: preference === p ? 'var(--accent-soft)' : 'var(--paper-deep)',
                color: preference === p ? 'var(--accent)' : 'var(--muted)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                textTransform: 'capitalize',
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </Card>

      {/* Data summary */}
      <Card style={{ marginBottom: '0.75rem' }}>
        <p style={sectionLabel}>Your Data</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ink)', display: 'block' }}>
              {store.sessions.length}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Sessions</span>
          </div>
          <div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--ink)', display: 'block' }}>
              {totalShots}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>Shots logged</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button onClick={handleExport} style={actionBtn}>
            Export JSON backup
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            style={{ ...actionBtn, background: 'var(--paper-deep)', color: 'var(--ink)', border: '1.5px solid var(--line-strong)' }}
          >
            Import JSON
          </button>
          {importError && (
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--error)' }}>
              {importError}
            </p>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            style={{ display: 'none' }}
            onChange={handleImport}
          />
          <button
            onClick={() => setShowClearConfirm(true)}
            style={{ ...actionBtn, background: 'transparent', color: 'var(--error)', border: '1.5px solid var(--error)' }}
          >
            Clear all data
          </button>
        </div>
      </Card>

      {/* About */}
      <Card>
        <p style={sectionLabel}>About</p>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6 }}>
          Lens Journal is a free, offline-first photography session log.
          All data is stored locally on your device. No ads, no tracking.
        </p>
        <a
          href="https://freeappstore.online"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: '0.8rem', color: 'var(--accent)', display: 'block', marginTop: '0.5rem' }}
        >
          Part of FreeAppStore
        </a>
      </Card>

      <ConfirmDialog
        open={showClearConfirm}
        title="Clear All Data"
        message={`This will permanently delete ${store.sessions.length} sessions and ${totalShots} shots. This cannot be undone.`}
        confirmLabel="Delete Everything"
        variant="danger"
        onConfirm={() => {
          store.clearAll()
          setShowClearConfirm(false)
        }}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  )
}

const sectionLabel: React.CSSProperties = {
  margin: '0 0 0.75rem',
  fontSize: '0.72rem',
  fontWeight: 700,
  color: 'var(--muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
}

const actionBtn: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem',
  background: 'var(--accent)',
  color: 'white',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  fontSize: '0.88rem',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
}

function signInBtn(bg: string, color: string): React.CSSProperties {
  return {
    width: '100%',
    padding: '0.6rem 1rem',
    background: bg,
    color,
    border: 'none',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.88rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  }
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}
