import { useMemo } from 'react'
import { Card, EmptyState, ProgressBar } from '@freeappstore/sdk/ui'
import type { Session } from '../types'
import { TAG_LABELS } from '../types'

interface Props {
  sessions: Session[]
}

interface TopItem {
  label: string
  count: number
}

function countTop<T extends string>(items: T[]): TopItem[] {
  const m = new Map<string, number>()
  for (const item of items) m.set(item, (m.get(item) ?? 0) + 1)
  return [...m.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([label, count]) => ({ label, count }))
}

function computeStats(sessions: Session[]) {
  const allShots = sessions.flatMap(s => s.shots)
  if (allShots.length === 0) return null

  const apertures = countTop(allShots.map(s => s.aperture))
  const shutters = countTop(allShots.map(s => s.shutter))
  const isos = countTop(allShots.map(s => `ISO ${s.iso}`))
  const lenses = countTop(
    allShots.filter(s => s.lens.trim()).map(s => s.lens.trim()),
  )
  const tags = countTop(allShots.flatMap(s => s.tags).map(t => TAG_LABELS[t]))

  const sweetSpot = {
    aperture: apertures[0]?.label ?? '—',
    shutter: shutters[0]?.label ?? '—',
    iso: isos[0]?.label ?? '—',
    lens: lenses[0]?.label ?? '—',
  }

  return {
    totalSessions: sessions.length,
    totalShots: allShots.length,
    apertures,
    shutters,
    isos,
    lenses,
    tags,
    sweetSpot,
  }
}

export function StatsView({ sessions }: Props) {
  const stats = useMemo(() => computeStats(sessions), [sessions])

  if (!stats) {
    return (
      <div style={{ padding: '1rem' }}>
        <h1 className="display-font" style={{ fontSize: '1.6rem', color: 'var(--ink)', marginBottom: '1.25rem' }}>
          Stats
        </h1>
        <EmptyState
          title="No data yet"
          message="Log shots in your journal sessions and your statistics will appear here."
        />
      </div>
    )
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h1 className="display-font" style={{ fontSize: '1.6rem', color: 'var(--ink)', margin: '0 0 1.25rem' }}>
        Stats
      </h1>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '1rem' }}>
        <StatTile label="Sessions" value={String(stats.totalSessions)} />
        <StatTile label="Total Shots" value={String(stats.totalShots)} />
      </div>

      {/* Sweet spot card */}
      <Card style={{ marginBottom: '1rem' }}>
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Your Sweet Spot
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem 1rem' }}>
          {[
            ['Aperture', stats.sweetSpot.aperture],
            ['Shutter', stats.sweetSpot.shutter],
            ['ISO', stats.sweetSpot.iso],
            ['Lens', stats.sweetSpot.lens],
          ].map(([label, value]) => (
            <div key={label}>
              <span style={{ fontSize: '0.72rem', color: 'var(--muted)', fontWeight: 600, display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {label}
              </span>
              <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent)' }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <StatSection title="Aperture Usage" items={stats.apertures} color="var(--accent)" />
        <StatSection title="Shutter Speed" items={stats.shutters} color="var(--sky)" />
        <StatSection title="ISO" items={stats.isos} color="var(--mint)" />
        {stats.lenses.length > 0 && (
          <StatSection title="Lenses" items={stats.lenses} color="var(--accent)" />
        )}
        {stats.tags.length > 0 && (
          <StatSection title="Scene Tags" items={stats.tags} color="var(--sky)" />
        )}
      </div>
    </div>
  )
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <p style={{ margin: '0 0 0.2rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </p>
      <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--ink)', lineHeight: 1 }}>
        {value}
      </span>
    </Card>
  )
}

function StatSection({ title, items, color }: { title: string; items: TopItem[]; color: string }) {
  const max = items[0]?.count ?? 1
  return (
    <Card>
      <p style={{ margin: '0 0 0.75rem', fontSize: '0.72rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {title}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
        {items.map(({ label, count }) => (
          <div key={label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--ink)' }}>{label}</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{count} shot{count !== 1 ? 's' : ''}</span>
            </div>
            <ProgressBar value={count} max={max} color={color} height={6} />
          </div>
        ))}
      </div>
    </Card>
  )
}
