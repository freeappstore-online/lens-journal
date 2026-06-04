import { initApp } from '@freeappstore/sdk'
import { Shell, BuildInfo } from '@freeappstore/sdk/ui'
import { useState } from 'react'
import { useJournalStore } from './store'
import { JournalView } from './views/JournalView'
import { SessionView } from './views/SessionView'
import { StatsView } from './views/StatsView'
import { SettingsView } from './views/SettingsView'
import { BottomNav } from './components/BottomNav'

const fas = initApp({ appId: 'lens-journal' })

type Tab = 'journal' | 'stats' | 'settings'

export default function App() {
  const store = useJournalStore()
  const [tab, setTab] = useState<Tab>('journal')
  const [sessionId, setSessionId] = useState<string | null>(null)

  const inSession = tab === 'journal' && sessionId !== null
  const session = sessionId ? (store.sessions.find(s => s.id === sessionId) ?? null) : null

  const handleTabChange = (t: Tab) => {
    setTab(t)
    setSessionId(null)
  }

  return (
    <Shell app={fas} appName="Lens Journal" showThemeToggle>
      <div
        style={{
          flex: 1,
          paddingBottom: inSession ? 'env(safe-area-inset-bottom)' : 'calc(3.75rem + env(safe-area-inset-bottom))',
        }}
      >
        {tab === 'journal' && !inSession && (
          <JournalView store={store} onOpenSession={id => setSessionId(id)} />
        )}
        {inSession && session && (
          <SessionView session={session} store={store} onBack={() => setSessionId(null)} />
        )}
        {inSession && !session && (
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--muted)', marginBottom: '1rem' }}>Session not found.</p>
            <button
              onClick={() => setSessionId(null)}
              style={{
                background: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius)',
                padding: '0.6rem 1.25rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 600,
              }}
            >
              Back to Journal
            </button>
          </div>
        )}
        {tab === 'stats' && <StatsView sessions={store.sessions} />}
        {tab === 'settings' && <SettingsView fas={fas} store={store} />}
      </div>

      {!inSession && <BottomNav active={tab} onChange={handleTabChange} />}

      <BuildInfo />
    </Shell>
  )
}
